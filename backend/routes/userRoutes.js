const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);

module.exports = router;

