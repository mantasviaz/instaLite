const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { Op } = require('sequelize');
const User = require('../models/user');

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
    const posts = await Post.findAll({
      where: {
        [Op.or]: {
          text: {
            [Op.not]: null,
          },
          image_url: {
            [Op.not]: null,
          },
        }
      },
      order: [['created_at', 'DESC']],
      include: [{ model: User, required: true, attributes: ['username'] }],
      limit: req.query?.page ? 10 : 100,
      offset: Number(req.query.page) * 10
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get feed', message: error.message });
  }
});

module.exports = router;
