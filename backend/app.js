const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const sequelize = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // Import post routes
const commentRoutes = require('./routes/commentRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedRoutes = require('./routes/feedRoutes');
const likeRoutes = require('./routes/likeRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const hashtagRoutes = require('./routes/hashtagRoutes');

const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Friendship = require('./models/friendship');
const PostHashtag = require('./models/postHashtag');
const Hashtag = require('./models/hashtag');
const notification = require('./models/notification');
const UserHashtag = require('./models/userHashtag');
const followerRecommendation = require('./models/followerRecommendation');


const app = express();
app.use(cors());


app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api', feedRoutes);
app.use('/api/hashtags', hashtagRoutes)

// Sync all models
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.log('Error syncing database', error);
  });

// Socket.io
const { sendMessage } = require('./controller/chatController');
const Notification = require('./models/notification');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`USER CONNECTED ${socket.id}`);

  socket.on('join_room', (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on('join_notifications', (data) => {
    console.log(`UserId${data}`);
    socket.join(`UserId${data}`);
  });

  socket.on('send_notifications', async (data) => {
    console.log(data);
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      text: data.notification,
      created_at: data.timestamp,
      senderId: data.senderId ? data.senderId : null,
    });
    await socket.to(`UserId${data.userId}`).emit('get_notifications', notification);
  });

  socket.on('user_typing', (data) => {
    socket.to(data.room).emit('user_is_typing', data);
  });

  socket.on('send_message', async (data) => {
    console.log(data);
    console.log({
      message: data.message,
      chatId: data.room,
      userId: data.userId,
      created_at: data.timestamp,
    });
    await sendMessage(data.message, data.room, data.userId);
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECT', socket.id);
  });
});

server.listen(3001, () => {
  console.log('IO SERVER');
});
module.exports = app;
