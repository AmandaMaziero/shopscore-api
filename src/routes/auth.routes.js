const { Router } = require('express')
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')

const router = Router()
router
    .post("/api/users", UserController.register)
    .post("/api/login", AuthController.login)

module.exports = router