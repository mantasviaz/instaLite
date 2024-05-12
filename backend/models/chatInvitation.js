const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Chat = require('./chat');

class ChatInvitation extends Model {}


ChatInvitation.init({
    invitationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chatId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'chats', key: 'chatId' } },
    senderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'userId' } },
    receiverId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'userId' } },
    status: { type: DataTypes.ENUM, values: ['pending', 'accepted', 'rejected'], allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'ChatInvitation',
    tableName: 'chat_invitations'
  });
  
  module.exports = ChatInvitation;