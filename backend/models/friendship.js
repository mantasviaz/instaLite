const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Friendship extends Model {}

Friendship.init({
  user_id_1: { type: DataTypes.INTEGER, allowNull: false },
  user_id_2: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Friendship',
  timestamps: false,
  tableName: 'friendships'
});

module.exports = Friendship;
