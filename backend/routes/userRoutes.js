const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../config/s3Config')
const { indexAndSearch } = require('../chroma/faceUtils.js');

router.get('/:userId', userController.getUser);
router.post('/signup', upload.single('profilePhoto'), userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUser);
router.post('/status', userController.updateUserStatus);

router.post('/actors', async (req, res) => {
    try {
      const { searchImage } = req.body;
  
      // Call the function to index and search for matches
      const matches = await indexAndSearch(searchImage);
  
      res.status(200).json({ matches });
    } catch (error) {
      console.error("Error matching faces:", error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

module.exports = router;