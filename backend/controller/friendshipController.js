const { Op } = require('sequelize');
const Friendship = require('../models/friendship');
const User = require('../models/user');

exports.getFriendships = async (req, res) => {
  try {
    const { userId } = req.params;
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ user_id_1: userId }, { user_id_2: userId }],
      },
    });
    const userIds = friendships.flatMap((friend) => {
      const userIds = [friend.user_id_1, friend.user_id_2];
      return userIds.filter((id) => id != userId);
    });

    const friends = await User.findAll({
      where: {
        userId: userIds,
      },
    });

    res.status(200).send(friends);
  } catch (error) {
    console.error('Error fetching friendships:', error);
    res.status(500).send({ error: 'Failed to get friendships', message: error.message });
  }
};

exports.createFriendship = async (req, res) => {
  try {
    const { userId } = req.params; // Ensure this param is parsed as integer if necessary
    const { user_id_2 } = req.body; // Renamed for consistency with the model

    if (!user_id_2) {
      return res.status(400).send({ error: 'Validation Error', message: 'Friend ID must be provided' });
    }

    console.log(`Creating friendship between userId: ${userId} and friendId: ${user_id_2}`);

    const friendship = await Friendship.create({
      user_id_1: userId,
      user_id_2: user_id_2,
      status: 'pending', // Default status
    });

    res.status(201).send(friendship);
  } catch (error) {
    console.error('Error creating friendship:', error);
    res.status(500).send({ error: 'Failed to create friendship', message: error.message });
  }
};

exports.updateFriendshipStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user_id_2, status } = req.body; // Ensure that body keys are correctly named

    if (!user_id_2 || !status) {
      return res.status(400).send({ error: 'Validation Error', message: 'Friend ID and status must be provided' });
    }

    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user_id_1: userId, user_id_2: user_id_2 },
          { user_id_1: user_id_2, user_id_2: userId },
        ],
      },
    });

    if (friendship) {
      friendship.status = status;
      await friendship.save();
      res.status(200).send(friendship);
    } else {
      res.status(404).send({ error: 'Friendship not found' });
    }
  } catch (error) {
    console.error('Error updating friendship status:', error);
    res.status(500).send({ error: 'Failed to update friendship status', message: error.message });
  }
};

exports.removeFriendship = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const result = await Friendship.destroy({
      where: {
        [Op.or]: [
          { user_id_1: userId1, user_id_2: userId2 },
          { user_id_1: userId2, user_id_2: userId1 },
        ],
      },
    });

    if (result > 0) {
      res.status(200).send({ message: 'Friendship removed successfully' });
    } else {
      res.status(404).send({ error: 'Friendship not found' });
    }
  } catch (error) {
    console.error('Error removing friendship:', error);
    res.status(500).send({ error: 'Failed to remove friendship', message: error.message });
  }
};
