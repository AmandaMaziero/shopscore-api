const { Router } = require('express')
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')
const StoreController = require('../controllers/StoreController')

const router = Router()
router
    .post("/api/users", UserController.register)
    .post("/api/stores", StoreController.register)
    .post("/api/login", AuthController.login)

module.exports = router