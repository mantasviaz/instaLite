const express = require('express');
<<<<<<< HEAD
const userController = require('../controller/userController');
import { Router } from 'express';
const router = Router();

// Define your routes

export default router;


router.post('/signup', userController.registerUser);
=======
const router = express.Router();
const userController = require('../controller/userController');

router.post('/register', userController.registerUser);
>>>>>>> 3174762 (tables and route defs for user/post)
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);

module.exports = router;

