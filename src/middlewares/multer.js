const multerS3 = require('multer-s3')
const multer = require('multer')
const { extname } = require('path');
const s3 = require('./s3')

module.exports = {
    upload() {
        return (request, response, next) => {
            const folder = request.params.folder

            if (folder != 'users' && folder != 'evaluations' && folder != 'products') {
                return response.status(400).json({ success: false, message: "The folder is invalid!" })
            }

            const uploadConfig = {
                storage: multerS3({
                    s3: s3,
                    bucket: process.env.AWS_STORAGE_BUCKET_NAME,
                    acl: 'public-read',
                    key: function (req, file, cb) {
                        const filename = `${Date.now() + extname(file.originalname)}`
                        const fullPath = `${folder}/${filename}`
                        cb(null, fullPath)
                    }
                }),
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
                fileFilter: (request, file, cb) => {
                    if (file.size > 5 * 1024 * 1024) {
                        request.errorFile = 'File is so long!';
                        return cb(null, false);
                    }
                    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
                        return cb(null, true);
                    else {
                        request.errorFile = 'Only files with the formats: .png, .jpg, .jpeg are accepted!';
                        return cb(null, false);
                    }
                }
            }

            const uploadMiddleware = multer(uploadConfig).array('file')
            uploadMiddleware(request, response, (err) => {
                if (err) {
                    return response.status(400).json({ success: false, message: 'Failed to upload the file.' });
                }
                next();
            })
        }
    }
}