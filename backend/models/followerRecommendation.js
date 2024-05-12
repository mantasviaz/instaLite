const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');

class FollowerRecommendation extends Model {}

FollowerRecommendation.init(
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    recommendId: { type: DataTypes.INTEGER, allowNull: false },
    strength: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'FollowerRecommendation',
    timestamps: false,
    tableName: 'follower_recommendations',
  }
);

FollowerRecommendation.belongsTo(User, { foreignKey: 'recommendId' });

module.exports = FollowerRecommendation;
