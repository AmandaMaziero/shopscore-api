const db = require('../models')
const bcrypt = require('bcrypt')
const Utils = require('../utils/')
const utilsFunctions = new Utils()

class AuthController {
    static async login(request, response) {
        try {
            const { email, password } = request.body

            if (!email || !password) return response.status(400).json({ success: false, message: "Fields is missing!" })

            const data = await db.User.findOne({ where: { email } })

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