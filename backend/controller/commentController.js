const Comment = require('../models/comment');

exports.addCommentToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;
        const comment = await Comment.create({
            postId,
            userId,
            text
        });
        res.status(201).send(comment);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add comment', message: error.message });
    }
};

exports.getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.findAll({
            where: { postId }
        });
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send({ error: 'Failed to get comments', message: error.message });
    }
};
