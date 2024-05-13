const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Chat = require('./chat');
const User = require('./user');

class ChatUser extends Model {}

ChatUser.init(
  {
    chatId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'ChatUser',
    timestamps: false,
    tableName: 'chat_users',
  }
);

ChatUser.belongsTo(Chat, { foreignKey: 'chatId' });
ChatUser.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatUser;
