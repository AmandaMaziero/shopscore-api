const { Router } = require('express')
const ProductController = require('../controllers/ProductController')

const router = Router()
router
    .post("/api/products", ProductController.register)
    .get("/api/products", ProductController.getAll)
    .get("/api/products/:id", ProductController.getById)
    .get("/api/products/stores/:idstore", ProductController.getProductByStore)
    .post("/api/products/:id", ProductController.createBond)
    .put("/api/products/:id", ProductController.update)
    .patch("/api/products/:id", ProductController.changeStatus)
    .delete("/api/products/:id", ProductController.delete)

module.exports = router