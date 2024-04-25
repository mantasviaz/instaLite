const express = require('express');
const sequelize = require('./config/dbConfig'); 
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user'); 

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

// Sync all models
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.log('Error syncing database', error);
});

module.exports = app;
