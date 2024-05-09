const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Notification extends Model {}

Notification.init(
  {
    notificationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Notification',
    timestamps: false,
    tableName: 'notifications',
  }
);

module.exports = Notification;
