const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Load environment variables from .env file in development
require('dotenv').config();

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'images-upenn-nets2120-2024sp-leftovers',
        contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically sets the content type based on the file type
        key: function (req, file, cb) {
            // Construct the file name to be unique using the date and original file name
            console.log(file)
            cb(null, `uploads/${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
        }
    })
});

console.log("AWS S3 configured");
module.exports = upload;
