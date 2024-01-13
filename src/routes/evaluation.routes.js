const { Router } = require('express')
const EvalutionController = require('../controllers/EvalutionController')
const { upload } = require('../middlewares/multer')
const multer = require('multer')

const uploadFiles = multer(upload('assets/evaluations'))
const router = Router()
router
    .post("/api/evaluations", uploadFiles.fields(["filename1", "filename2", "filename3"]), EvalutionController.register)
    .get("/api/evaluations", EvalutionController.getAll)
    .get("/api/evaluations/:id", EvalutionController.getById)
    .put("/api/evaluations/:id", EvalutionController.sendAnswer)
    .patch("/api/evaluations/:id", EvalutionController.changeStatus)
    .delete("/api/evaluations/:id", EvalutionController.delete)

module.exports = router