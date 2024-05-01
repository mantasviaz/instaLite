const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Group extends Model {}

Group.init({
  groupId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  groupName: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Group',
  timestamps: false,
  tableName: 'groups'
});

module.exports = Group;
