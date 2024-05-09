const { Op } = require('sequelize');
const Friendship = require('./models/friendship');
const User = require('./models/user');

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

    return userRecommendations;
  } catch (error) {
    console.log(error);
  }
};

const getAllRecommendations = async () => {
  try {
    const allUsers = await User.findAll();
    const allUsersId = [...allUsers.map((u) => u.userId)];
    const recommendationsPromises = allUsersId.map((userId) => getRecommendations(userId));
    const recommendations = await Promise.all(recommendationsPromises);

    console.log(recommendations.filter((r) => r !== null));
  } catch (error) {
    console.log(error);
  }
};

getAllRecommendations();
// getRecommendations(1);