const { Router } = require('express')
const UserController = require('../controllers/UserController')

const router = Router()
router
    .get("/api/users", UserController.getAll)
    .get("/api/users/:id", UserController.getById)
    .put("/api/users/:id", UserController.update)
    .patch("/api/users/:id", UserController.changeStatus)
    .delete("/api/users/:id", UserController.delete)

module.exports = router