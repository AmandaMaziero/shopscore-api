const { Router } = require('express')
const FileController = require('../controllers/FileController')
const { upload } = require('../middlewares/multer')

const router = Router()
router
    .post('/api/files/:folder', upload(), FileController.register)
    .delete('/api/files/', FileController.delete)

module.exports = router