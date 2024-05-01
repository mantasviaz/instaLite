const express = require('express');
const { createPost, getPosts, deletePost } = require('../controllers/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.delete('/:postId', deletePost);

module.exports = router;


