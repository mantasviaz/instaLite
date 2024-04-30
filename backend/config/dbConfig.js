const { Console } = require('console');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database-3', 'admin', 'adminpassword', {
  host: 'database-3.cy8iw4vwyvgm.us-east-1.rds.amazonaws.com',
  port: '3306',
  dialect: 'mysql',
  logging: console.log,
  // other options
});

console.log("Configured");
module.exports = sequelize;

