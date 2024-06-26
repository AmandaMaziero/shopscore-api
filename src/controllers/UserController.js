const db = require("../models")
const bcrypt = require("bcrypt")
const fs = require("fs")
const Utils = require("../utils/")
const sequelize = require("sequelize")
const utilsFunctions = new Utils()

class UserController {
    static async register(request, response) {
        try {
            const { name, email, password, birthDate, cpf, telephone, gender, type } = request.body

            if (!name || !email || !password || !birthDate || !cpf || !telephone || !gender || !type)
                return response.status(400).json({ success: false, message: "Fields is missing!" })

            const formattedPhone = telephone.replace(/\D+/g, '')
            const formattedCpf = cpf.replace(/\D+/g, '')

            const checkEmail = await db.User.findOne({ where: { email } })
            if (checkEmail) return response.status(400).json({ success: false, message: "The already email is in use!" })

            const checkTelephone = await db.User.findOne({ where: { telephone: formattedPhone } })
            if (checkTelephone) return response.status(400).json({ success: false, message: "The already telephone is in use!" })

            const checkCpf = await db.User.findOne({ where: { cpf: formattedCpf } })
            if (checkCpf) return response.status(400).json({ success: false, message: "The already cpf is in use!" })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,}$/

            if (!regex.test(password)) return response.status(400).json({ success: false, message: 'The password must be at least 8 characters long, one of which must be special!' })

            const hash = await bcrypt.hash(password, 12)

            const data = await db.User.create({
                name, email, password: hash, birthDate, cpf: formattedCpf, telephone: formattedPhone, gender, type
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

    static async getAll(request, response) {
        try {
            const pagination = utilsFunctions.pagination(request)

            const count = await db.User.count()

            const data = await db.User.findAll({
                ...pagination,
                where: { type: 1 }, 
                include: [
                    { model: db.Evaluation, limit: 1, required: true, order: [['createdAt', 'DESC']]}
                ],
                order: sequelize.literal('RAND()')
            })

            data.map(item => {
                item.password = undefined
            })

            return response.status(200).json({ success: true, data, count, page: pagination.offset == 0 ? 1 : pagination.offset, limit: pagination.limit })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async getById(request, response) {
        try {
            const { id } = request.params

            const data = await db.User.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: "User not found!" })

            data.password = undefined
            data.image = data.image ? Buffer.from(data.image).toString("ascii") : null

            return response.status(200).json({ success: true, data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })

        }
    }

    static async update(request, response) {
        try {
            const { id } = request.params
            const { name, email, password, telephone, image } = request.body

            if (!name || !email || !telephone)
                return response.status(400).json({ success: false, message: "Fields is missing!" })

            const data = await db.User.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: "User not found!" })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,}$/
            const regextTest = password ? regex.test(password) : true

            if (!regextTest) return response.status(400).json({ success: false, message: 'The password must be at least 8 characters long, one of which must be special!' })

            const hash = password ? await bcrypt.hash(password, 12) : null

            const formattedPhone = telephone.replace(/\D+/g, '')

            const checkEmail = await db.User.findOne({ where: { email } })
            if (checkEmail && checkEmail.id != id) return response.status(400).json({ success: false, message: "The already email is in use!" })

            const checkTelephone = await db.User.findOne({ where: { telephone: formattedPhone } })
            if (checkTelephone && checkTelephone.id != id) return response.status(400).json({ success: false, message: "The already telephone is in use!" })

            await data.update({
                name,
                email,
                password: password ? hash : data.password,
                telephone: formattedPhone,
                image: image ? image : data.image
            })

            data.password = undefined

            return response.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async changeStatus(request, response) {
        try {
            const { id } = request.params

            const data = await db.User.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'User not found!' })

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

            const data = await db.User.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'User not found!' })

            await data.update({ status: -1 })
            await data.destroy()

            return response.status(200).json({ success: true, message: 'Successfully deleted user!' })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = UserController