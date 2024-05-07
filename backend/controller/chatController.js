const Chat = require('../models/chat');
const ChatMessage = require('../models/chatMessage');
const ChatUser = require('../models/chatUser');

exports.createChat = async (req, res) => {
  try {
    const { userId, userId2 } = req.body;
    const chat = await Chat.create();
    const chatId = chat.chatId;

    const chatUser = await ChatUser.create({
      chatId: chatId,
      userId: userId,
      status: 'joined',
    });

    await ChatUser.create({
      chatId: chatId,
      userId: userId2,
    });

    res.status(201).send(chatUser);
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
      where: {
        chatId: chatId,
      },
    });

    res.status(200).send(chatMessages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat messages', message: error.message });
  }
};

exports.sendMessage = async (message, chatId, userId) => {
  try {
    const chatMessage = await ChatMessage.create({
      chatId: chatId,
      text: message,
      senderId: userId,
    });

    res.status(200).send(chatMessage);
  } catch (error) {
    res.status(500).send({ error: 'Failed to store message', message: error.message });
  }
};
