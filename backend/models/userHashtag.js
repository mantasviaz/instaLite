const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class UserHashtag extends Model {}

UserHashtag.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // name of Target model
        key: 'userId',
      },
    },
    hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hashtags', // name of Target model
        key: 'hashtagId',
      },
    },
  },
  {
    sequelize,
    modelName: 'UserHashtag',
    timestamps: false,
    tableName: 'user_hashtags',
  }
);

console.log('UserHashtag table created');
module.exports = UserHashtag;
