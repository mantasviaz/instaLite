const User = require('../models/user');
const Post = require('../models/post');
const sequelize = require('../config/dbConfig');


exports.createPost = async (req, res) => {
  try {
      // Extract relevant properties from the request body
      const { userId, image_url, video_url, text } = req.body;

      // Construct the object to be passed to Post.create() based on the properties present in the request body
      const postData = {};
      if (userId) postData.userId = userId;
      if (image_url) postData.image_url = image_url;
      if (video_url) postData.video_url = video_url;
      if (text) postData.text = text;

      // Create the post using the constructed object
      const post = await Post.create(postData);

      // Send the created post as the response
      res.status(201).send(post);
  } catch (error) {
      console.error('Create Post Error:', error);  // Error log
      res.status(500).send({ error: 'Failed to create post', message: error.message });
  }
};



exports.getPosts = async (req, res) => {
  try {
    console.log('Getting posts from:', req.params.userId);
      const userId = req.params.userId;
      const posts = await Post.findAll({
          where: { userId }
      });
      res.status(200).send(posts);
  } catch (error) {
      res.status(500).send({ error: 'Failed to get posts', message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
      const { postId } = req.params;
      const deleted = await Post.destroy({
          where: { postId }
      });
      if (deleted) {
          res.status(200).send('Post deleted successfully');
      } else {
          res.status(404).send('Post not found');
      }
  } catch (error) {
      res.status(500).send({ error: 'Failed to delete post', message: error.message });
  }
};
