const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../config/s3Config')

const multer = require('multer');
const uploadLocal = multer({storage: multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        // Construct the file name to be unique using the date and original file name
        console.log(file)
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
    }
}
)})

router.get('/:userId', userController.getUser);
router.post('/signup', upload.single('profilePhoto'), userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);
router.post('/status', userController.updateUserStatus);
router.post('/actors', uploadLocal.single('profilePhoto'), userController.getActors);

module.exports = router;