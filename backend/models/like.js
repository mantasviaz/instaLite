const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Like extends Model {}

Like.init({
  likeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Like',
  timestamps: false,
  tableName: 'likes'
});

module.exports = Like;
