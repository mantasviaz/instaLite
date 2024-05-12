const express = require('express');
const { getFriendships, createFriendship, updateFriendshipStatus, removeFriendship } = require('../controller/friendshipController');
const router = express.Router();

// Get all friendships for a user
router.get('/friends/:userId', getFriendships);

// Create a new friendship
router.post('/friends/:userId', createFriendship);

// Update a friendship status
router.patch('/friends/:userId', updateFriendshipStatus);

// Remove a friendship
router.delete('/friends/:userId1/:userId2', removeFriendship);

module.exports = router;
