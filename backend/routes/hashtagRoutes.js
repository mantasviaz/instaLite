const express = require('express');
const sequelize = require('../config/dbConfig');
const router = express.Router();
const PostHashtag = require('../models/postHashtag');
const Hashtag = require('../models/hashtag');

router.get('/top10', async (req, res) => {
    try {
        const [response, metadata] = await sequelize.query(`
        SELECT p.hashtagId AS hashtagId, h.text, COUNT(postId) as count
        FROM post_hashtags p JOIN hashtags h ON p.hashtagId = h.hashtagId
        GROUP BY p.hashtagId
        ORDER BY count DESC
        LIMIT 10
        `)
          res.status(200).send(response.map(h => h.text));
    } catch (error) {
        res.status(500).send({ error: 'Cannot get feed', message: error.message });
    }
});

module.exports = router;

