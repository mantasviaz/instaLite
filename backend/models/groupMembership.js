const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class GroupMembership extends Model {}

GroupMembership.init({
  groupId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'member' },
  joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'GroupMembership',
  timestamps: false,
  tableName: 'group_memberships'
});

module.exports = GroupMembership;
