const userModel = require('../chromadb/userModel');
const postModel = require('../chromadb/postModel');
//const { User, Post } = require('./models'); 

const User = require('../models/user');
const Post = require('../models/post');

const { generateEmbedding } = require('../chromadb/userModel');



// Create user embedding
exports.createUserEmbedding = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findOne({ where: { userId } });
        const content = `${user.username} ${user.email} ${user.first_name} ${user.last_name}`;
        await userModel.addUserEmbedding(userId, content);
        res.status(201).send('User embedding created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update user embedding
exports.updateUserEmbedding = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await userModel.findOne({ where: { userId } });
      if (!user) {
          return res.status(404).send('User not found');
      }
      const content = `${user.username} ${user.email} ${user.first_name} ${user.last_name}`;

      // Check if an embedding already exists
      const existingEmbedding = await userModel.getUserEmbedding(userId);
      if (existingEmbedding) {
          await userModel.updateUserEmbedding(userId, content);
      } else {
          await userModel.addUserEmbedding(userId, content);
      }
      res.status(200).send('User embedding updated successfully');
  } catch (error) {
      res.status(500).send(error.message);
  }
};

// Delete user embedding
exports.deleteUserEmbedding = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userModel.deleteUserEmbedding(userId);
        res.status(200).send('User embedding deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Create post embedding
exports.createPostEmbedding = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await postModel.findOne({ where: { postId } });
        await postModel.addPostEmbedding(postId, post.content);
        res.status(201).send('Post embedding created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update post embedding
exports.updatePostEmbedding = async (req, res) => {
  try {
      const postId = req.params.postId;
      const post = await postModel.findOne({ where: { postId } });
      if (!post) {
          return res.status(404).send('Post not found');
      }

      // Check if an embedding already exists
      const existingEmbedding = await postModel.getPostEmbedding(postId);
      if (existingEmbedding) {
          await postModel.updatePostEmbedding(postId, post.content);
      } else {
          await postModel.addPostEmbedding(postId, post.content);
      }
      res.status(200).send('Post embedding updated successfully');
  } catch (error) {
      res.status(500).send(error.message);
  }
};

// Delete post embedding
exports.deletePostEmbedding = async (req, res) => {
    try {
        const postId = req.params.postId;
        await postModel.deletePostEmbedding(postId);
        res.status(200).send('Post embedding deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Returns top 10 results for users and top 10 for posts
// Use openai to creat sql queries
exports.searchAll = async (req, res) => {
    try {
        const query = req.query.q;
        const userResults = await userModel.searchUsers(query, 10);
        const postResults = await postModel.searchPosts(query, 10);
        const results = { users: userResults, posts: postResults };
        res.status(200).json(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateAllEmbeddings = async (req, res) => {
  try {
      // Fetch and update all user embeddings
      const users = await User.findAll();
      for (const user of users) {
          const content = `${user.username} ${user.email} ${user.first_name} ${user.last_name}`;
          if (!content) continue; // Skip users with incomplete data
          const embedding = await userModel.generateEmbedding(content);
          if (embedding) {
              await userModel.addUserEmbedding(user.userId, content);
          } else {
              console.error(`Failed to generate embedding for user ${user.userId}`);
          }
      }

      // Fetch and update all post embeddings
      const posts = await Post.findAll();
      for (const post of posts) {
          if (!post.content) continue; // Skip posts with no content
          const embedding = await postModel.generateEmbedding(post.content);
          if (embedding) {
              await postModel.addPostEmbedding(post.postId, post.content);
          } else {
              console.error(`Failed to generate embedding for post ${post.postId}`);
          }
      }

      res.status(200).send('All embeddings updated successfully');
  } catch (error) {
      console.error("Error updating embeddings: ", error);
      res.status(500).send(`Error updating embeddings: ${error.message}`);
  }
};


// Add this temporary route to directly test embedding generation
exports.testEmbedding = async (req, res) => {
  const content = "Test content for embedding generation";
  const embedding = await generateEmbedding(content); // Ensure generateEmbedding is imported or defined
  console.log("Embedding: ", embedding);
  if (embedding) {
      res.status(200).json({ message: "Embedding generated", embedding });
  } else {
      res.status(500).json({ message: "Failed to generate embedding" });
  }
};

