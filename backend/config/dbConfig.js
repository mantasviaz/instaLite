const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database-2', 'admin', 'adminpassword', {
  host: 'database-1.cy8iw4vwyvgm.us-east-1.rds.amazonaws.com',
  port: '3306',
  dialect: 'mysql',
  // other options
});

module.exports = sequelize;
