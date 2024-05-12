const express = require('express');
const cors = require('cors');
const sequelize = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // Import post routes
const commentRoutes = require('./routes/commentRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const User = require('./models/user'); 
const Post = require('./models/post'); 
const Comment = require('./models/comment'); 
const Friendship = require('./models/friendship'); 

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friendships', friendshipRoutes);

// Sync all models
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.log('Error syncing database', error);
});

module.exports = app;
