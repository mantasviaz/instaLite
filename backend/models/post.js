const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');

class Post extends Model {}

Post.init(
  {
    postId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING },
    video_url: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: false,
    tableName: 'posts',
  }
);

Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = Post;
