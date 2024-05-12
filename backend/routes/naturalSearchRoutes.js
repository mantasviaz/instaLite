const express = require('express');
const router = express.Router();
const controller = require('../controller/naturalSearchController');

// User embedding routes
router.post('/users/:userId/embedding', controller.createUserEmbedding);
router.put('/users/:userId/embedding', controller.updateUserEmbedding);
router.delete('/users/:userId/embedding', controller.deleteUserEmbedding);

// Post embedding routes
router.post('/posts/:postId/embedding', controller.createPostEmbedding);
router.put('/posts/:postId/embedding', controller.updatePostEmbedding);
router.delete('/posts/:postId/embedding', controller.deletePostEmbedding);

// Combined search route
router.get('/search', controller.searchAll);

// Update all
router.post('/update-all-embeddings', controller.updateAllEmbeddings);


router.post('/test-embedding', controller.testEmbedding);


module.exports = router;
