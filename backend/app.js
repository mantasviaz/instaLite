const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

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

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`USER CONNECTED ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('USER DISCONNECT', socket.id);
  });
});

server.listen(3001, () => {
  console.log('IO SERVER');
});

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friendships', friendshipRoutes);

// Sync all models
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.log('Error syncing database', error);
  });

module.exports = app;
