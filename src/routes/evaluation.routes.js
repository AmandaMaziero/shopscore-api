const { Router } = require('express')
const EvalutionController = require('../controllers/EvalutionController')

const router = Router()
router
    .post("/api/evaluations", EvalutionController.register)
    .get("/api/evaluations", EvalutionController.getAll)
    .get("/api/evaluations/:id", EvalutionController.getById)
    .put("/api/evaluations/:id", EvalutionController.sendAnswer)
    .patch("/api/evaluations/:id", EvalutionController.changeStatus)
    .delete("/api/evaluations/:id", EvalutionController.delete)

module.exports = router