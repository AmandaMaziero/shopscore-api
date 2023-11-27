const middlewareAuth = require("../middlewares/auth")
const auth = require("./auth.routes")
const user = require("./user.routes")
const store = require("./store.routes")

module.exports = app => {
    app.use(
        auth,
        middlewareAuth,
        user,
        store
    )
}