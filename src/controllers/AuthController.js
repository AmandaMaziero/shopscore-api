const db = require('../models')
const bcrypt = require('bcrypt')
const Utils = require('../utils/')
const utilsFunctions = new Utils()

class AuthController {
    static async login(request, response) {
        try {
            const { email, password, type } = request.body

            if (!email || !password || !type) return response.status(400).json({ success: false, message: "Fields is missing!" })

            let model
            if (type == 1) {
                model = db.User
            } else if (type == 2) {
                model = db.Store
            } else {
                return response.status(400).json({ success: false, message: "Type is invalid!" })
            }

            const data = await model.findOne({ where: { email } })

            if (!data || !await bcrypt.compare(password, data.password)) return response.status(400).json({ success: false, message: "Email or password is incorrect, please try again!" })

            data.password = undefined
            data.image = data.image ? Buffer.from(data.image).toString("ascii") : null

            return response.status(200).json({
                success: true,
                data,
                token: utilsFunctions.generateToken({
                    id: data.id,
                    email: data.email
                })
            })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = AuthController