const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Chat = require('./chat');

class ChatUser extends Model {}

ChatUser.init({
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chats', // This should match the table name of Chat
      key: 'chatId'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // This should match the table name of User
      key: 'userId'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'joined'],
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ChatUser',
  timestamps: false,
  tableName: 'chat_users'
});

// can also define model associations here if necessary
// ChatUser.belongsTo(User, {foreignKey: 'userId'});
// ChatUser.belongsTo(Chat, {foreignKey: 'chatId'});

module.exports = ChatUser;
