const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Hashtag extends Model {}

Hashtag.init({
  hashtagId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Hashtag',
  timestamps: false,
  tableName: 'hashtags'
});

module.exports = Hashtag;
