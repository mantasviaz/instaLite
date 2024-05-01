const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Comment extends Model {}

Comment.init({
  commentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Comment',
  timestamps: false,
  tableName: 'comments'
});

module.exports = Comment;
