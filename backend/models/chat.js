const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Chat extends Model {}

Chat.init({
  chatId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {type: DataTypes.STRING},
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Chat',
  timestamps: false,
  tableName: 'chats'
});

module.exports = Chat;
