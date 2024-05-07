const s3 = require('../middlewares/s3')
const { DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const UPLOADS_URL = process.env.UPLOADS_URL

class FileController {
    static async register(request, response) {
        try {
            const files = request.files

            if (!files) {
                return response.status(400).json({ success: false, message: "Fields is missing!" })
            }

            const urls = []

            for (let i = 0; i < files.length; i++) {
                const url = `${UPLOADS_URL}/${files[i].key}`

                urls.push(url)
            }

            return response.status(201).json({ success: true, data: { urls }, message: "Files saved successfully!" })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }

    static async delete(request, response) {
        try {
            const { urls } = request.query

            if (!urls) return response.status(400).json({ success: false, message: 'Fields is missing!' })

            const objects = []

            for (const url of urls) {
                objects.push({ Key: url.replace(`${UPLOADS_URL}/`, '') })
            }

            const params = {
                Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
                Delete: {
                    Objects: objects
                }
            }

            await s3.send(new DeleteObjectsCommand(params))
                .then((_) => {
                    console.log('Files removed in Bucket! ❌')
                })
                .catch((error) => {
                    return response.status(400).json({ success: false, message: "Files were not removed", error })
                })

            return response.status(200).json({ success: true, message: "Files removed successfully!" })
        } catch (error) {
            return response.status(500).json({ success: false, message: error.message })
        }
    }
}

module.exports = FileController