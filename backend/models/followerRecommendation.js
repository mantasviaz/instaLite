const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

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

module.exports = FollowerRecommendation;
