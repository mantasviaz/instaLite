const express = require('express');
const { likePost, getLike, getLikes } = require('../controller/likeController');
const router = express.Router();

// Get Like
router.get('/:postId/:userId', getLike);

// Get Number of Likes
router.get('/:postId', getLikes);

// Like Post
router.post('/:postId', likePost);

module.exports = router;
