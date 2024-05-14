const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { Op } = require('sequelize');
const User = require('../models/user');
const sequelize = require('../config/dbConfig');

router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        text: {
          [Op.not]: null,
        },
      },
      include: [{ model: User, required: true, attributes: ['username'] }],
      limit: 100,
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get feed', message: error.message });
  }
});

router.get('/imagepost', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        image_url: {
          [Op.not]: null,
        },
      },
      include: [{ model: User, required: true, attributes: ['username'] }],
      limit: 100,
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get feed', message: error.message });
  }
});

router.get('/allposts', async (req, res) => {
  try {
    const [response, metadata] = await sequelize.query(`
        SELECT *
        FROM recommendations
        ORDER BY -LOG(1.0 - RAND()) / (labelWeight + 0.00001)
        `);

    const postIds = response.map((p) => parseInt(p.postId.slice(1, p.length)));
    console.log(postIds);
    const posts = await Post.findAll({
      where: {
        [Op.or]: {
          text: {
            [Op.not]: null,
          },
          image_url: {
            [Op.not]: null,
          },
        },
        postId: postIds,
      },
      order: [['created_at', 'DESC']],
      include: [{ model: User, required: true, attributes: ['username'] }],
      limit: req.query?.page ? 10 : 100,
      offset: Number(req.query.page) * 10,
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get feed', message: error.message });
  }
});

module.exports = router;
