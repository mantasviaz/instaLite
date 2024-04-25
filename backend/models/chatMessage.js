const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class ChatMessage extends Model {}

ChatMessage.init({
  messageId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'ChatMessage',
  timestamps: false,
  tableName: 'chat_messages'
});

module.exports = ChatMessage;
