const db = require('../models')

class EvalutionController {
    static async register(request, response) {
        try {
            const { title, description, rating, iduser, idstore, idstoreproduct } = request.body
            const { filename1, filename2, filename3 } = request.files

            if (!title || !description || !rating || !iduser || (!idstore && !idstoreproduct)) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            const user = await db.User.findOne({ where: { id: iduser } })
            if (!user) return response.status(404).json({ success: false, message: 'User not found!' })

            const store = idstore ? await db.Store.findOne({ where: { id: idstore } }) : true
            if (!store) return response.status(404).json({ success: false, message: 'Store not found!' })

            const storeproduct = idstoreproduct ? await db.StoreProduct.findOne({ where: { id: idstoreproduct } }) : true
            if (!storeproduct) return response.status(404).json({ success: false, message: 'Product not found!' })

            let base64_file1, base64_file2, base64_file3

            if (filename1) {
                base64_file1 = Buffer.from(fs.readFileSync(filename1.path)).toString('base64')

                fs.unlink(filename1.path, (error) => {
                    if (error) throw error
                    console.log(`${filename1.path} has been deleted!`)
                })
            }

            if (filename2) {
                base64_file2 = Buffer.from(fs.readFileSync(filename2.path)).toString('base64')

                fs.unlink(filename2.path, (error) => {
                    if (error) throw error
                    console.log(`${filename2.path} has been deleted!`)
                })
            }

            if (filename3) {
                base64_file3 = Buffer.from(fs.readFileSync(filename3.path)).toString('base64')

                fs.unlink(filename3.path, (error) => {
                    if (error) throw error
                    console.log(`${filename3.path} has been deleted!`)
                })
            }

            const data = await db.sequelize.transaction(async (t) => {

                const evaluation = await db.Evalution.create({
                    title, description, rating, iduser, idstore, idstoreproduct
                }, { transaction: t })

                if (filename1 || filename2 || filename3) {
                    await db.Annex.create({
                        filename1: filename1 ? base64_file1 : null,
                        filename2: filename2 ? base64_file2 : null,
                        filename3: filename3 ? base64_file3 : null,
                        idevaluation: evaluation.id
                    }, { transaction: t })
                }

                if (store) {
                    const sumEvaluations = await db.Evaluation.sum('rating', { where: { idstore: idstore } })
                    await store.update({
                        numberReviews: store.numberReviews + 1,
                        rating: sumEvaluations / (store.numberReviews + 1)
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

            const where = search ? { [Op.or]: [] } : {}

            search ? where[Op.or].push(
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ) : null
            status ? where[Op.or].push({ status: { [status && status.length > 0 ? Op.eq : Op.in]: status } }) : null
            idstore ? where[Op.or].push({ idstore: { [Op.eq]: idstore } }) : null
            iduser ? where[Op.or].push({ iduser: { [Op.eq]: iduser } }) : null

            const pagination = utilsFunctions.pagination(request)

            const count = await db.Evalution.count({ where: { ...where } })

            const data = await db.Evalution.findAll({
                ...pagination,
                where: {
                    ...where
                }
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
                answer
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

module.exports = EvalutionController