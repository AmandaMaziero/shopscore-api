const middlewareAuth = require("../middlewares/auth")
const auth = require("./auth.routes")
const user = require("./user.routes")

module.exports = app => {
    app.use(
        auth,
        middlewareAuth,
        user
    )
}