const db = require("../models")
const bcrypt = require("bcrypt")
const fs = require("fs")

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
            const { name, email, password, telephone, removeImage } = request.body
            const image = request.file

            if (!name || !email || !telephone)
                return response.status(400).json({ success: false, message: "Fields is missing!" })

            const data = await db.User.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: "User not found!" })

            let base64

            if (image) {
                base64 = Buffer.from(fs.readFileSync(image.path)).toString('base64')

                fs.unlink(image.path, (error) => {
                    if (error) throw error
                    console.log(`${image.path} has been deleted!`)
                })
            }

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
                image: image ? base64 : removeImage ? null : data.image
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