const { Router } = require('express')
const CommentController = require('../controllers/CommentController')

const router = Router()
router
    .post("/api/comments", CommentController.register)
    .put("/api/comments/:id", CommentController.update)
    .delete("/api/comments/:id", CommentController.delete)

module.exports = router