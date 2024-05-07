const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class UserHashtags extends Model {}

UserHashtags.init({
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'users', // name of Target model
      key: 'userId',
    }
  },
  hashtag_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'hashtags', // name of Target model
      key: 'hashtag_id',
    }
  }
}, {
  sequelize,
  modelName: 'UserHashtags',
  timestamps: false,
  tableName: 'user_hashtags'
});

console.log("UserHashtags table created");
module.exports = UserHashtags;
