const { Router } = require('express')
const UserController = require('../controllers/UserController')
const { upload } = require('../middlewares/multer')
const multer = require('multer')

const uploadFiles = multer(upload('assets/users'))

const router = Router()
router
    .get("/api/users/:id", UserController.getById)
    .put("/api/users/:id", uploadFiles.single("image"), UserController.update)
    .patch("/api/users/:id", UserController.changeStatus)
    .delete("/api/users/:id", UserController.delete)

module.exports = router