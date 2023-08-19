const jwt = require('jsonwebtoken')

class Utils {
    generateToken(params = {}, expireTime = 36000) {
        const secret = process.env.SECRET
        return jwt.sign(params, secret, { expiresIn: expireTime })
    }
}

module.exports = Utils