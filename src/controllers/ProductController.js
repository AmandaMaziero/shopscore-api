const fs = require('fs')
const db = require('../models')
const Utils = require('../utils')
const utilsFunctions = new Utils()

class ProductController {
    static async register(request, response) {
        try {
            const { name, description } = request.body
            const image = request.file

            if (!name || !description) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            let base64

            if (image) {
                base64 = Buffer.from(fs.readFileSync(image.path)).toString('base64')

                fs.unlink(image.path, (error) => {
                    if (error) throw error
                    console.log(`${image.path} has been deleted!`)
                })
            }

            const data = await db.Product.create({
                name, description, image: image ? base64 : null
            })

            return response.status(201).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getAll(request, response) {
        try {
            const { search, status } = request.query

            const where = search ? { [Op.or]: [] } : {}

            search ? where[Op.or].push(
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ) : null
            status ? where[Op.or].push({ status: { [status && status.length > 0 ? Op.eq : Op.in]: status } }) : null

            const pagination = utilsFunctions.pagination(request)

            const count = await db.Product.count({ where: { ...where } })

            const data = await db.Product.findAll({
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

            const data = await db.Product.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Product not found!' })

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getProductByStore(request, response) {
        try {
            const { idstore } = request.params

            const { search, status } = request.query

            const where = search ? { [Op.or]: [] } : {}

            search ? where[Op.or].push(
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ) : null
            status ? where[Op.or].push({ status: { [status && status.length > 0 ? Op.eq : Op.in]: status } }) : null

            const pagination = utilsFunctions.pagination(request)

            const count = await db.Product.count({
                where: { ...where },
                include: [
                    {
                        model: db.StoreProduct,
                        where: {
                            idstore: idstore
                        },
                        include: [
                            {
                                model: db.Store
                            }
                        ]
                    }
                ]
            })

            const data = await db.Product.findAll({
                ...pagination,
                where: {
                    ...where
                },
                include: [
                    {
                        model: db.StoreProduct,
                        where: {
                            idstore: idstore
                        },
                        include: [
                            {
                                model: db.Store
                            }
                        ]
                    }
                ]
            })

            return response.status(200).json({ success: true, data, count, page: pagination.offset == 0 ? 1 : pagination.offset, limit: pagination.limit })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async update(request, response) {
        try {
            const { id } = request.params

            const { name, description } = request.body
            const image = request.file

            if (!name || !description) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            const data = await db.Product.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Product not found!' })

            let base64

            if (image) {
                base64 = Buffer.from(fs.readFileSync(image.path)).toString('base64')

                fs.unlink(image.path, (error) => {
                    if (error) throw error
                    console.log(`${image.path} has been deleted!`)
                })
            }

            await data.update({
                name, description, image: image ? base64 : data.image
            })

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async createBond(request, response) {
        try {
            const { id } = request.params
            const { idstore, price } = request.body

            if (!idstore || !price) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            const store = await db.Store.findOne({ where: { id: idstore } })
            if (!store) return response.status(404).json({ success: false, message: 'Store not found!' })

            const product = await db.Product.findOne({ where: { id } })
            if (!product) return response.status(404).json({ success: false, message: 'Product not found!' })

            const data = await db.StoreProduct.create({
                price, idstore, idproduct
            })

            return response.status(201).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })

        }
    }

    static async changeStatus(request, response) {
        try {
            const { id } = request.params

            const data = await db.Product.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Product not found!' })

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

            const data = await db.Product.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Product not found!' })

            await data.update({ status: -1 })
            await data.destroy()

            return response.status(200).json({ success: true, message: 'Successfully deleted product!' })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = ProductController