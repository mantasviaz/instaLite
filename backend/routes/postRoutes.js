const express = require('express');
const { createPost, getPosts, deletePost } = require('../controller/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/user/:userId', getPosts);
router.delete('/:postId', deletePost);

module.exports = router;