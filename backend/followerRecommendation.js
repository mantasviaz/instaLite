const { Op } = require('sequelize');
const Friendship = require('./models/friendship');
const User = require('./models/user');
const UserHashtag = require('./models/userHashtag');
const FollowerRecommendation = require('./models/followerRecommendation');

const getRecommendations = async (userId) => {
  try {
    // Get all of users friendship
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ user_id_1: userId }, { user_id_2: userId }],
      },
    });

    // Get friends' userId
    let friendsUserId = [...friendships.map((friend) => (friend.user_id_1 === userId ? friend.user_id_2 : friend.user_id_1))];

    if (friendsUserId.length === 0) {
      return null;
    }

    // Get friends of friends
    const friendsOfFriends = await Friendship.findAll({
      [Op.or]: [{ user_id_1: { [Op.in]: friendsUserId } }, { user_id_2: { [Op.in]: friendsUserId } }],
      [Op.not]: [{ user_id_1: userId }, { user_id_2: userId }],
    });
    // Get friends of friends userId
    const friendsOfFriendsId = [
      ...friendsOfFriends.map((friend) => {
        return { user_id_1: friend.user_id_1, user_id_2: friend.user_id_2 };
      }),
    ];
    // Add userid to filter array
    friendsUserId = [...friendsUserId, userId];

    // Filter to get friends of friends only
    const filteredFriendsOfFriends = friendsOfFriendsId.filter((friend) => !(friendsUserId.includes(friend.user_id_1) && friendsUserId.includes(friend.user_id_2)));

    // Count number of recommendations
    const userRecommendations = {};
    filteredFriendsOfFriends.forEach((friend) => {
      if (!friendsUserId.includes(friend.user_id_1)) {
        userRecommendations[friend.user_id_1] = (userRecommendations[friend.user_id_1] || 0) + 1;
      }
      if (!friendsUserId.includes(friend.user_id_2)) {
        userRecommendations[friend.user_id_2] = (userRecommendations[friend.user_id_2] || 0) + 1;
      }
    });
    // console.log(friendsUserId);
    // console.log(friendsOfFriendsId);
    // console.log(filteredFriendsOfFriends);
    // console.log(userRecommendations);
    console.log(`Recommendations for User ${userId}:`, userRecommendations);
    const recommendationsPromises = Object.entries(userRecommendations).map(([userId2, strength]) => updateRecommendation(userId, userId2, strength));
    const recommendations = await Promise.all(recommendationsPromises);

    return recommendations;
  } catch (error) {
    console.log(error);
  }
};

const updateRecommendation = async (userId, userId2, strength) => {
  let userRecommendation = await FollowerRecommendation.findOne({
    where: {
      userId: userId,
      recommendId: userId2,
    },
  });

  if (userRecommendation) {
    userRecommendation.strength = strength;
    await userRecommendation.save();
    return userRecommendation;
  }

  userRecommendation = await FollowerRecommendation.create({
    userId: userId,
    recommendId: userId2,
    strength: strength,
  });

  return userRecommendation;
};

const getHashtagBasedRecommendations = async (userId) => {
  try {
    const userHashtags = await UserHashtag.findAll({
      where: {
        user_id: userId,
      },
    });
    const hashtags = [...userHashtags.map((h) => h.hashtag_id)];
    const commonUsers = await UserHashtag.findAll({
      where: {
        hashtag_id: hashtags,
        user_id: {
          [Op.ne]: userId,
        },
      },
    });

    const userRecommendation = {};
    commonUsers.forEach((u) => {
      userRecommendation[u.user_id] = (userRecommendation[u.user_id] || 0) + 1;
    });

    return userRecommendation;
  } catch (error) {
    console.log(error);
  }
};

const getAllRecommendations = async () => {
  try {
    const allUsers = await User.findAll();
    const allUsersId = [...allUsers.map((u) => u.userId)];
    const recommendationsPromises = allUsersId.map((userId) => getRecommendations(userId));
    await Promise.all(recommendationsPromises);

    // console.log(recommendations.filter((r) => r !== null));
  } catch (error) {
    console.log(error);
  }
};

getAllRecommendations();
