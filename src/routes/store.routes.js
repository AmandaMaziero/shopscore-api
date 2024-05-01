const { Router } = require('express')
const StoreController = require('../controllers/StoreController')

const router = Router()
router
    .get("/api/stores", StoreController.getAll)
    .get("/api/stores/cnpj/info", StoreController.getCNPJ)
    .get("/api/stores/:id", StoreController.getById)
    .put("/api/stores/:id", StoreController.update)
    .patch("/api/stores/:id", StoreController.changeStatus)
    .delete("/api/stores/:id", StoreController.delete)

module.exports = router