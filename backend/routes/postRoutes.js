const express = require('express');
const { createPost, getPosts, deletePost, getPost } = require('../controller/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/user/:userId', getPosts);
router.get('/:postId', getPost);
router.delete('/:postId', deletePost);

module.exports = router;
