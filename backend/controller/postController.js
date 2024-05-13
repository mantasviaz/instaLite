const User = require('../models/user');
const Post = require('../models/post');
const Hashtag = require('../models/hashtag');
const PostHashtag = require('../models/postHashtag');
const sequelize = require('../config/dbConfig');
const produceFederatedPost = require('../kafka/produceFederatedPost');

const createHashtag = async (hashtags) => {
  const newHashtags = [];
  try {
    for (const hashtag of hashtags) {
      const existingHashtag = await Hashtag.findOne({ where: { text: hashtag } });
      if (existingHashtag) {
        newHashtags.push(existingHashtag);
      } else {
        const newHashtag = await Hashtag.create({ text: hashtag });
        newHashtags.push(newHashtag);
      }
    }
  } catch (error) {
    throw error;
  }
  return newHashtags;
};

exports.createPost = async (req, res) => {
  try {
    // Extract relevant properties from the request body
    const { userId, image_url, video_url, text } = req.body;

    let postHashtags;

    // Construct the object to be passed to Post.create() based on the properties present in the request body
    const postData = {};
    if (userId) postData.userId = userId;
    if (image_url) postData.image_url = image_url;
    if (video_url) postData.video_url = video_url;
    if (text) {
      postData.text = text;
      const hashtags = text.replace(/\s/g, '').split('#').slice(1, text.length);
      postHashtags = await createHashtag(hashtags);
    }

    // Create the post using the constructed object
    const post = await Post.create(postData);

    for (const hashtag of postHashtags) {
      const newPostHashtag = PostHashtag.create({ postId: post.postId, hashtagId: hashtag.hashtagId });
      console.log(newPostHashtag);
    }

    // Send the created post as the response
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    await produceFederatedPost(post, user.username);
    res.status(201).send(post);
  } catch (error) {
    console.error('Create Post Error:', error); // Error log
    res.status(500).send({ error: 'Failed to create post', message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    console.log('Getting posts from:', req.params.userId);
    const userId = req.params.userId;
    const posts = await Post.findAll({
      where: { userId },
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
      where: { postId },
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

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({
      where: {
        postId: postId,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: ['username'],
        },
      ],
    });
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get posts', message: error.message });
  }
};

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id; // Assuming you have some way of getting the current user's ID

  try {
    // Check if the user has already liked this post
    const existingLike = await Like.findOne({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingLike) {
      return res.status(409).send({ error: 'You have already liked this post' });
    }

    // Create a new like
    const newLike = await Like.create({
      postId: postId,
      userId: userId,
    });

    res.status(201).send({ message: `Post ${postId} liked successfully`, likeId: newLike.likeId });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send({ error: 'Failed to like the post', message: error.message });
  }
};
