const multer = require('multer')
const { extname, resolve } = require('path')

module.exports = {
    upload(folder) {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, "..", folder),
                filename: (req, file, callback) => {
                    const fileName = `${Date.now() + extname(file.originalname)}`
                    return callback(null, fileName);
                }
            }),
            limits: {
                fileSize: 2 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                if (file.size > 2 * 1024 * 1024) {
                    req.errorFile = 'Arquivo too big: maximum value 2mb!';
                    return cb(null, false)
                }
                if (file.mimetype.includes("image"))
                    return cb(null, true)
                else {
                    req.errorFile = 'Only files with formats are accepted: .png, .jpg, .jpeg!';
                    return cb(null, false)
                }
            }
        }
    }
}