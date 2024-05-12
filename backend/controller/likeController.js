const Like = require('../models/like');

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId, isLike } = req.body; // Assuming you have some way of getting the current user's ID

  try {
    // Check if the user has already liked this post
    if (isLike) {
      await Like.destroy({
        where: {
          postId: postId,
          userId: userId,
        },
      });
      res.status(200).send('unliked');
      return;
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

exports.getLike = async (req, res) => {
  try {
    const { userId, postId } = req.params;

    const like = await Like.findOne({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (like) {
      res.status(200).send('liked');
    } else {
      res.status(200).send('not liked');
    }
  } catch (error) {
    res.status(500).send({ error: 'Cannot get like', message: error.message });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await Like.findAll({
      where: {
        postId: postId,
      },
    });

    res.status(200).send({ num_of_likes: likes.length });
  } catch (error) {
    res.status(500).send({ error: 'Cannot get likes', message: error.message });
  }
};
