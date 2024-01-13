const middlewareAuth = require("../middlewares/auth")
const auth = require("./auth.routes")
const user = require("./user.routes")
const store = require("./store.routes")
const product = require("./product.routes")
const evaluation = require("./evaluation.routes")
const comment = require("./comment.routes")

module.exports = app => {
    app.use(
        auth,
        middlewareAuth,
        user,
        store,
        product,
        evaluation,
        comment
    )
}