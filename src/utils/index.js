const jwt = require('jsonwebtoken')

class Utils {
    generateToken(params = {}, expireTime = 604800) {
        const secret = process.env.SECRET
        return jwt.sign(params, secret, { expiresIn: expireTime })
    }

    pagination(request) {
        const pagination = {}

        const page = request.query.page ? parseInt(request.query.page) : 1
        const limit = request.query.limit ? pagination.limit = parseInt(request.query.limit) : 10
        pagination.offset = (page - 1) * limit
        pagination.limit = limit
        pagination.page = page

        return pagination
    }
}

module.exports = Utils