const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.br",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ADDRESS_EMAIL,
        type: 'OAuth2',
        privateKey: process.env.API_KEY,
        accessToken: process.env.ID_CLIENT,
        expires: 'never'
    }
})

module.exports = transporter