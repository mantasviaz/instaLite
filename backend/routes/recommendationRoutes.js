const express = require('express');
const router = express.Router();
const FollowerRecommendation = require('../models/followerRecommendation');
const User = require('../models/user');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userRecommendation = await FollowerRecommendation.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: ['username'],
        },
      ],
      order: [['strength', 'DESC']],
    });
    res.status(200).send(userRecommendation);
  } catch (error) {
    res.status(500).send({ error: 'Could not get user recommendation', message: error.message });
  }
});

module.exports = router;
