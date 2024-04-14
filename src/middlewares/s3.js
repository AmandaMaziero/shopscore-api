const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    region: process.env.AWS_REGION_DEFAULT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS,
        secretAccessKey: process.env.AWS_SECRET
    }
})

module.exports = s3