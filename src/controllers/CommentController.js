const db = require('../models')

class CommentController {
    static async register(request, response) {
        try {
            const { comment, idevaluation, iduser, idstore } = request.body

            if (!comment || !idevaluation || (!iduser && !idstore)) {
                return response.status(400).json({ success: false, message: 'Fields is missing!' })
            }

            const evaluation = await db.Evaluation.findOne({ where: { id: idevaluation } })
            if (!evaluation) return response.status(404).json({ success: false, message: 'Evaluation not found!' })

            const user = iduser ? await db.User.findOne({ where: { id: iduser } }) : true
            if (!user) return response.status(404).json({ success: false, message: 'User not found!' })

            const store = idstore ? await db.Store.findOne({ where: { id: idstore } }) : true
            if (!store) return response.status(404).json({ success: false, message: 'Store not found!' })

            const data = await db.Comment.create({
                comment,
                iduser,
                idstore,
                idevaluation
            })

            return response.status(200).json({ success: true, message: 'Comment sent successfully', data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async update(request, response) {
        try {
            const { id } = request.params
            const { comment } = request.body

            const data = await db.Comment.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Comment not found!' })

            await data.update({
                comment
            })

            return response.status(200).json({ success: true, message: 'Comment updated successfully', data })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async delete(request, response) {
        try {
            const { id } = request.params

            const data = await db.Comment.findOne({ where: { id } })
            if (!data) return response.status(404).json({ success: false, message: 'Comment not found!' })

            await data.destroy()

            return response.status(200).json({ success: true, message: 'Successfully deleted comment!' })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = CommentController