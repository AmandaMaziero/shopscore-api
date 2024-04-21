const { Router } = require('express')
const EvaluationController = require('../controllers/EvaluationController')

const router = Router()
router
    .post("/api/evaluations", EvaluationController.register)
    .get("/api/evaluations", EvaluationController.getAll)
    .get("/api/evaluations/:id", EvaluationController.getById)
    .put("/api/evaluations/:id", EvaluationController.sendAnswer)
    .patch("/api/evaluations/:id", EvaluationController.changeStatus)
    .delete("/api/evaluations/:id", EvaluationController.delete)

module.exports = router