const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class User extends Model {}

User.init({
  userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  profile_photo_url: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'User',
  timestamps: false,
  tableName: 'users'
});

console.log("User table created");
module.exports = User;
