const db = require("../models")
const bcrypt = require('bcrypt')
const Utils = require('../utils/')
const utilsFunctions = new Utils()
const { Op } = require('sequelize')
const axios = require('axios')

class StoreController {
    static async register(request, response) {
        try {
            const { cnpj, fantasyName, corporateName, email, password, description, telephone, cell, image } = request.body

            if (!cnpj || !fantasyName || !corporateName || !email || !cell) {
                return response.status(400).json({ success: false, error: 'Fields is missing.' })
            }

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,}$/
            const regextTest = password ? regex.test(password) : true

            if (!regextTest) return response.status(400).json({ success: false, message: 'The password must be at least 8 characters long, one of which must be special!' })

            const hash = password ? await bcrypt.hash(password, 12) : null

            const formattedPhone = telephone ? telephone.replace(/\D+/g, '') : null
            const formattedCell = cell.replace(/\D+/g, '')
            const formattedCnpj = cnpj.replace(/\D+/g, '')

            const checkEmail = await db.Store.findOne({ where: { email } })
            if (checkEmail) return response.status(400).json({ success: false, message: "The already email is in use!" })

            const checkCnpj = await db.Store.findOne({ where: { cnpj: formattedCnpj } })
            if (checkCnpj) return response.status(400).json({ success: false, message: "The already cnpj is in use!" })

            const checkTelephone = await db.Store.findOne({ where: { telephone: formattedPhone } })
            if (checkTelephone) return response.status(400).json({ success: false, message: "The already telephone is in use!" })

            const checkCell = await db.Store.findOne({ where: { cell: formattedCell } })
            if (checkCell) return response.status(400).json({ success: false, message: "The already cell is in use!" })

            const data = await db.Store.create({
                cnpj: formattedCnpj, fantasyName, corporateName, email, password: hash, description, telephone: formattedPhone, cell: formattedCell, image
            })

            data.password = undefined

            return response.status(201).json({
                success: true,
                data
            })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getCNPJ(request, response) {
        try {
            const { cnpj } = request.query

            if (!cnpj) return response.status(400).json({ success: false, message: 'CNPJ is missing!' })

            const res = await axios.get(`https://api.cnpja.com/office/${cnpj}`, {
                headers: {
                    'Authorization': process.env.CNPJA_TOKEN
                }
            })

            const data = {
                fantasyName: res.data.alias ? res.data.alias : res.data.company.name,
                corporateName: res.data.company.name,
                cnpj: res.data.taxId,
                email: res.data.emails[0].address,
                cell: `${res.data.phones[0].area}${res.data.phones[0].number}`,
                description: res.data.mainActivity.text,
            }

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getAll(request, response) {
        try {
            const { search, quality, status } = request.query

            const where = search || quality || status ? { [Op.or]: [] } : {}

            search ? where[Op.or].push(
                { fantasyName: { [Op.like]: `%${search}%` } },
                { corporateName: { [Op.like]: `%${search}%` } },
                { cnpj: { [Op.like]: `%${search}%` } }
            ) : null

            status ? where[Op.or].push({ status: { [status && status.length > 0 ? Op.eq : Op.in]: status } }) : null

            quality ? where[Op.or].push({ quality: { [Op.gte]: 4.5 } }) : null

            const pagination = utilsFunctions.pagination(request)

            const count = await db.Store.count({ where: { ...where } })

            const data = await db.Store.findAll({
                ...pagination,
                where: {
                    ...where
                },
                attributes: { exclude: ['password'] }
            })

            return response.status(200).json({ success: true, data, count, page: pagination.offset == 0 ? 1 : pagination.offset, limit: pagination.limit })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getById(request, response) {
        try {
            const { id } = request.params

            const data = await db.Store.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: "Store not found!" })

            data.password = undefined

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async update(request, response) {
        try {
            const { id } = request.params

            const { fantasyName, corporateName, email, password, description, telephone, cell, image } = request.body

            if (!fantasyName || !corporateName || !email || !description || !cell) {
                return response.status(400).json({ success: false, error: 'Fields is missing.' })
            }

            const data = await db.Store.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Store not found!' })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,}$/
            const regextTest = password ? regex.test(password) : true

            if (!regextTest) return response.status(400).json({ success: false, message: 'The password must be at least 8 characters long, one of which must be special!' })

            const hash = password ? await bcrypt.hash(password, 12) : null

            const formattedPhone = telephone ? telephone.replace(/\D+/g, '') : null
            const formattedCell = cell.replace(/\D+/g, '')

            const checkEmail = await db.Store.findOne({ where: { email } })
            if (checkEmail && checkEmail.id != id) return response.status(400).json({ success: false, message: "The already email is in use!" })

            const checkTelephone = await db.Store.findOne({ where: { telephone: formattedPhone } })
            if (checkTelephone && checkTelephone.id != id) return response.status(400).json({ success: false, message: "The already telephone is in use!" })

            const checkCell = await db.Store.findOne({ where: { cell: formattedCell } })
            if (checkCell && checkCell.id != id) return response.status(400).json({ success: false, message: "The already cell is in use!" })

            await data.update({
                fantasyName, corporateName, email, description, telephone: formattedPhone, cell: formattedCell, password: hash ? hash : data.password, image: image ? image : data.image
            })

            data.password = undefined

            return response.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            response.status(500).json({ success: false, message: error.message })
        }
    }

    static async changeStatus(request, response) {
        try {
            const { id } = request.params

            const data = await db.Store.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Store not found!' })

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

            const data = await db.Store.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Store not found!' })

            await data.update({ status: -1 })
            await data.destroy()

            return response.status(200).json({ success: true, message: 'Successfully deleted store!' })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = StoreController