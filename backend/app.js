const express = require('express');
const sequelize = require('./config/dbConfig'); 
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // Import post routes
const User = require('./models/user'); 
const Post = require('./models/post'); 

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // Mount post routes

// Sync all models
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.log('Error syncing database', error);
});

module.exports = app;
