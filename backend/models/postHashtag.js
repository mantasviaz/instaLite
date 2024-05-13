const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Post = require('./post');
const Hashtag = require('./hashtag');

class PostHashtag extends Model { }

PostHashtag.init({
  postId: { type: DataTypes.INTEGER, allowNull: false },
  hashtagId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'PostHashtag',
  timestamps: false,
  tableName: 'post_hashtags',
  indexes: [{ fields: ['postId', 'hashtagId'], unique: true }]
});
Post.belongsToMany(Hashtag, { through: PostHashtag });
Hashtag.belongsToMany(Post, { through: PostHashtag });

module.exports = PostHashtag;
