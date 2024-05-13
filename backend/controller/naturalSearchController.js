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
      const query = req.query.q;  // Query from the request

      // Perform search queries
      const userResultsPromise = userModel.searchUsers(query, 10);
      const postResultsPromise = postModel.searchPosts(query, 10);

      // Await both promises
      const [userResults, postResults] = await Promise.all([userResultsPromise, postResultsPromise]);

      // Prepare combined results array
      let combinedResults = userResults.ids[0].map((id, index) => ({
          type: 'user',
          id: id,
          score: userResults.distances[0][index],
          content: userResults.documents[0][index],
          metadata: userResults.metadatas[0][index]
      }));

      combinedResults = combinedResults.concat(postResults.ids[0].map((id, index) => ({
          type: 'post',
          id: id,
          score: postResults.distances[0][index],
          content: postResults.documents[0][index],
          metadata: postResults.metadatas[0][index]
      })));

      // Sort combined results by score (distance), ascending since lower is better
      combinedResults.sort((a, b) => a.score - b.score);

      // Slice to keep only the top 10 results
      combinedResults = combinedResults.slice(0, 10);

      // Format output as a string with specified formatting
      const userDetailsPromises = combinedResults.map(async result => {
          if (result.type === 'user') {
              // Async fetching user details
              const user = await User.findByPk(result.id);
              if (user) {
                  return `User ID: ${user.userId}, User Name: ${user.username}, First Name: ${user.first_name}, Last Name: ${user.last_name}`;
              } else {
                  return `User ID: ${result.id} not found`;
              }
          } else {
              return `Post ID: ${result.id}, Text: ${result.content}`;
          }
      });

      // Resolve all promises and format the output
      const output = await Promise.all(userDetailsPromises);
      res.send(output.join("\n\n"));  // Sending the formatted output with new lines
  } catch (error) {
      console.error("Error in searchAll:", error);
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
         const content = `${post.text}`;
          if (!content) continue; // Skip posts with no content
          const embedding = await postModel.generateEmbedding(content);
          if (embedding) {
              await postModel.addPostEmbedding(post.postId, content);
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