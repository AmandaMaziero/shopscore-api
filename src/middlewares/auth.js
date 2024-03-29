const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    const auth = request.headers.authorization

    if (!auth) return response.status(401).json({ success: false, message: "Token is missing!" })

    const parts = auth.split(' ')

    if (!parts === 2) return response.status(401).json({ success: false, message: 'Error in token!' })

    const [format, token] = parts

    if (!/^Bearer$/i.test(format)) return response.status(401).json({ success: false, message: 'Token is not formatted!' })

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) return response.status(401).json({ success: false, message: "Token incorrect!" })

        request.id = decoded.id

        return next()
    })
}