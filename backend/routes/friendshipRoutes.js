const express = require('express');
const { getFriendships, createFriendship, updateFriendshipStatus } = require('../controller/friendshipController');
const router = express.Router();

// Get all friendships for a user
router.get('/friends/:userId', getFriendships);

// Create a new friendship
router.post('/friends/:userId', createFriendship);

// Update a friendship status
router.patch('/friends/:userId', updateFriendshipStatus);

module.exports = router;
