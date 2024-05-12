const db = require('../models')
const { Op } = require('sequelize')
const Utils = require('../utils')
const utilsFunctions = new Utils()

class EvaluationController {
    static async register(request, response) {
        try {
            const { title, description, rating, iduser, idstore, idstoreproduct, images } = request.body

            if (!title || !description || !rating || !iduser || (!idstore && !idstoreproduct)) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            const user = await db.User.findOne({ where: { id: iduser } })
            if (!user) return response.status(404).json({ success: false, message: 'User not found!' })

            const store = await db.Store.findOne({ where: { id: idstore } })
            if (!store) return response.status(404).json({ success: false, message: 'Store not found!' })

            const storeproduct = idstoreproduct ? await db.StoreProduct.findOne({ where: { id: idstoreproduct } }) : true
            if (!storeproduct) return response.status(404).json({ success: false, message: 'Product not found!' })

            const data = await db.sequelize.transaction(async (t) => {
                const evaluation = await db.Evaluation.create({
                    title, description, rating, iduser, idstore, idstoreproduct, status: 0
                }, { transaction: t })

                if (images && images.length > 0) {
                    await db.Annex.bulkCreate(images.map(image => ({ image, idevaluation: evaluation.id })), { transaction: t })
                }

                if (idstore) {
                    let sumEvaluations = await db.Evaluation.sum('rating', { where: { idstore: idstore } }, { transaction: t })
                    const evaluations = await db.Evaluation.count({ where: { idstore: idstore } }, { transaction: t })

                    sumEvaluations = sumEvaluations == null ? rating : sumEvaluations + rating

                    const quality = parseFloat(((sumEvaluations + 1) / (evaluations + 1)).toFixed(2))
                    await store.update({
                        numberReview: evaluations + 1,
                        quality
                    }, { transaction: t })
                }

                if (idstoreproduct) {
                    let sumEvaluations = await db.Evaluation.sum('rating', { where: { idstoreproduct: idstoreproduct } }, { transaction: t })
                    const evaluations = await db.Evaluation.count({ where: { idstoreproduct: idstoreproduct } }, { transaction: t })

                    sumEvaluations = sumEvaluations == null ? rating : sumEvaluations + rating

                    const quality = parseFloat(((sumEvaluations + 1) / (evaluations + 1)).toFixed(2))
                    await storeproduct.update({
                        numberReview: evaluations + 1,
                        quality
                    }, { transaction: t })
                }

                return evaluation
            })

            return response.status(201).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getAll(request, response) {
        try {
            const { search, status, idstore, iduser } = request.query

            const where = search || status || idstore || iduser ? { [Op.or]: [] } : {}

            search ? where[Op.or].push(
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ) : null
            status ? where[Op.or].push({ status: { [status && status.length > 0 ? Op.eq : Op.in]: status } }) : null
            idstore ? where[Op.or].push({ idstore: { [Op.eq]: idstore } }) : null
            iduser ? where[Op.or].push({ iduser: { [Op.eq]: iduser } }) : null

            const pagination = utilsFunctions.pagination(request)

            const count = await db.Evaluation.count({ where: { ...where } })

            const data = await db.Evaluation.findAll({
                ...pagination,
                where: {
                    ...where
                },
                include: [
                    {
                        model: db.StoreProduct,
                        include: [
                            {
                                model: db.Product
                            }
                        ]
                    },
                    {
                        model: db.Store
                    },
                    {
                        model: db.User
                    }
                ]
            })

            return response.status(200).json({ success: true, data, count, page: pagination.offset == 0 ? 1 : pagination.offset, limit: pagination.limit })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getById(request, response) {
        try {
            const { id } = request.params

            const data = await db.Evaluation.findOne({
                where: { id },
                include: [
                    {
                        model: db.StoreProduct
                    },
                    {
                        model: db.Store
                    },
                    {
                        model: db.Annex
                    },
                    {
                        model: db.User
                    },
                    {
                        model: db.Comment,
                        include: [
                            {
                                model: db.User
                            },
                            {
                                model: db.Store
                            }
                        ]
                    }
                ]
            })
            if (!data) return response.status(404).json({ success: false, message: 'Evaluation not found!' })

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async sendAnswer(request, response) {
        try {
            const { id } = request.params
            const { answer } = request.body

            const data = await db.Evaluation.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Evaluation not found!' })

            await data.update({
                answer,
                status: 1
            })

            return response.status(200).json({ success: true, message: 'Answer sent successfully', data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async changeStatus(request, response) {
        try {
            const { id } = request.params

            const data = await db.Evaluation.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Evaluation not found!' })

            await data.update({
                status: !data.status
            })

            return response.status(200).json({ success: true, message: 'Status updated successfully', status: data.status })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async delete(request, response) {
        try {
            const { id } = request.params

            const data = await db.Evaluation.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Evaluation not found!' })

            const annex = await db.Annex.findOne({ where: { idevaluation: id } })
            if (annex) await annex.destroy()

            const comments = await db.Comment.findAll({ where: { idevaluation: id } })
            if (comments) comments.map(async (comment) => await comment.destroy())

            await data.destroy()

            return response.status(200).json({ success: true, message: 'Successfully deleted evaluation!' })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = EvaluationController