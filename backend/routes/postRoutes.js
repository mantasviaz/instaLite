const express = require('express');
const { createPost, getPosts, deletePost, likePost, getPost } = require('../controller/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/user/:userId', getPosts);
router.get('/:postId', getPost);
router.delete('/:postId', deletePost);
// Like a post
router.post('/posts/:postId/likes', likePost);

module.exports = router;
