const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/:userId', userController.getUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);
router.post('/status', userController.updateUserStatus);

module.exports = router;
