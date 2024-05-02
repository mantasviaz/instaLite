const express = require('express');
const userController = require('../controller/userController');
import { Router } from 'express';
const router = Router();

// Define your routes

export default router;


router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);

module.exports = router;

