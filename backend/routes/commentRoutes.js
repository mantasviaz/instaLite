const express = require('express');
const { addCommentToPost, getCommentsForPost } = require('../controller/commentController');
const router = express.Router();

// Add a comment to a post
router.post('/posts/:postId/comments', addCommentToPost);

// Get all comments for a post
router.get('/posts/:postId/comments', getCommentsForPost);

module.exports = router;

