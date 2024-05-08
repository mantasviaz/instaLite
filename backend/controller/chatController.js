const Chat = require('../models/chat');
const ChatMessage = require('../models/chatMessage');
const ChatUser = require('../models/chatUser');
const User = require('../models/user');
const sequelize = require('../config/dbConfig');

exports.createChat = async (req, res) => {
  try {
    const { userId, userId2 } = req.body;
    const chatUsers = await ChatUser.findAll({
      where: {
        userId: [userId, userId2],
      },
      include: [
        {
          model: Chat,
          where: {
            isGroup: false,
          },
        },
      ],
      group: ['chatId'],
      having: sequelize.literal('COUNT(*) = 2'),
    });

    if (chatUsers.length > 0) {
      res.status(201).send(chatUsers[0]);
    } else {
      const chat = await Chat.create();
      const chatId = chat.chatId;

      await ChatUser.create({
        chatId: chatId,
        userId: userId,
        status: 'joined',
      });

      await ChatUser.create({
        chatId: chatId,
        userId: userId2,
      });

      res.status(201).send(chat);
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to create chat', message: error.message });
  }
};

exports.acceptChatRequest = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chatUser = await ChatUser.findOne({
      where: { chatId: chatId, userId: userId },
    });
    chatUser.status = 'joined';
    await chatUser.save();
    res.status(200).send(chatUser);
  } catch (error) {
    res.status(500).send({ error: 'Failed to accept chat request', message: error.message });
  }
};

exports.declineChatRequest = async (req, res) => {
  try {
    const { chatId } = req.body;
    await ChatUser.destroy({
      where: {
        chatId: chatId,
      },
    });

    await Chat.destroy({
      where: {
        chatId: chatId,
      },
    });

    res.status(200).send('sucess');
  } catch (error) {
    res.status(500).send({ error: 'Failed to decline chat request', message: error.message });
  }
};

exports.sendChatRequest = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chatUser = await ChatUser.create({
      chatId: chatId,
      userId: userId,
    });
    res.status(200).send(chatUser);
  } catch (error) {
    res.status(500).send({ error: 'Failed to send chat request', message: error.message });
  }
};

exports.getChatSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatSessions = await ChatUser.findAll({
      where: {
        userId: userId,
      },
    });

    res.status(200).send(chatSessions);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat sessions', message: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chatMessages = await ChatMessage.findAll({
      include: [
        {
          model: User,
          required: true,
          attributes: ['username'],
        },
      ],
      where: {
        chatId: chatId,
      },
    });
    console.log(chatMessages);

    res.status(200).send(chatMessages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat messages', message: error.message });
  }
};

exports.getChatStatus = async (req, res) => {
  try {
    const { chatId } = req.body;
    console.log(chatId);
    const chatUsers = await ChatUser.findAll({
      where: {
        chatId: chatId,
      },
    });
    res.status(200).send(chatUsers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat status', message: error.message });
  }
};

exports.sendMessage = async (message, chatId, userId) => {
  try {
    console.log({ message, chatId, userId });
    const chatMessage = await ChatMessage.create({
      chatId: chatId,
      text: message,
      userId: userId,
    });
    return chatMessage;
  } catch (error) {
    console.log(error);
  }
};
