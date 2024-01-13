const { Router } = require('express')
const ProductController = require('../controllers/ProductController')
const { upload } = require('../middlewares/multer')
const multer = require('multer')

const uploadFiles = multer(upload('assets/products'))
const router = Router()
router
    .post("/api/products", uploadFiles.single("image"), ProductController.register)
    .get("/api/products", ProductController.getAll)
    .get("/api/products/:id", ProductController.getById)
    .get("/api/products/stores/:idstore", ProductController.getProductByStore)
    .post("/api/products/:id", ProductController.createBond)
    .put("/api/products/:id", uploadFiles.single("image"), ProductController.update)
    .patch("/api/products/:id", ProductController.changeStatus)
    .delete("/api/products/:id", ProductController.delete)

module.exports = router