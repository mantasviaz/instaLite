const Chat = require('../models/chat');
const ChatMessage = require('../models/chatMessage');
const ChatUser = require('../models/chatUser');
const User = require('../models/user');
const sequelize = require('../config/dbConfig');
const { Op } = require('sequelize');
const Friendship = require('../models/friendship');

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
          required: true,
        },
      ],
      group: ['chatId'],
      having: sequelize.literal('COUNT(*) = 2'),
    });

    if (chatUsers.length > 0) {
      res.status(201).send(chatUsers[0]);
      return;
    }

    console.log({ length: chatUsers.length, ...req.body });

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
    const { chatId, userId } = req.body;

    await ChatUser.destroy({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });

    const usersLeft = await ChatUser.findAll({
      where: {
        chatId: chatId,
      },
    });

    if (usersLeft.length === 1) {
      await Chat.destroy({
        where: {
          chatId: chatId,
        },
      });
    }
    const chat = await Chat.findOne({
      where: {
        chatId: chatId,
      },
    });
    chat.isGroup = false;
    await chat.save();
    res.status(200).send('success');
  } catch (error) {
    res.status(500).send({ error: 'Failed to decline chat request', message: error.message });
  }
};

exports.sendChatRequest = async (req, res) => {
  try {
    const { chatId, username, userId, groupChatName } = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      res.status(400).send({ error: 'No user found' });
      return;
    }

    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user_id_1: userId, user_id_2: user.userId },
          { user_id_1: user.userId, user_id_2: userId },
        ],
      },
    });

    if (!friendship) {
      res.status(400).send({ error: 'Not friends with this user' });
      return;
    }

    const existingChatUser = await ChatUser.findOne({
      where: {
        userId: user.userId,
        chatId: chatId,
      },
    });

    if (existingChatUser) {
      res.status(400).send({ error: 'User is already in the chat' });
      return;
    }

    const allChatUsers = await ChatUser.findAll({
      where: {
        chatId: chatId,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const allChatUsernames = [...allChatUsers.map((u) => u.User.username), username];

    const existingChatIds = await ChatUser.findAll({
      group: ['chatId'],
      include: [
        {
          model: User,
          where: {
            username: allChatUsernames,
          },
        },
      ],
      attributes: ['chatId'],
    });

    for (const chat of existingChatIds) {
      let allUsers = await ChatUser.findAll({
        where: {
          chatId: chat.chatId,
        },
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });

      if (allUsers.length === allChatUsernames.length) {
        allUsers = allUsers.map((u) => u.User.username);

        if (allUsers.every((element) => allChatUsernames.includes(element))) {
          res.status(400).send({ error: 'Group chat already exists' });
          return;
        }
      }
    }
    const exisitingChat = await Chat.findOne({
      where: {
        chatId: chatId,
      },
    });
    if (exisitingChat) {
      const chatUser = await ChatUser.create({
        chatId: exisitingChat.chatId,
        userId: user.userId,
      });

      res.status(200).send(chatUser);
      return;
    }
    const groupChat = await Chat.create({
      isGroup: true,
      name: groupChatName,
    });

    await ChatUser.create({
      chatId: groupChat.chatId,
      userId: userId,
    });

    const chatUser = await ChatUser.create({
      chatId: groupChat.chatId,
      userId: user.userId,
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
      attributes: ['chatId'],
    });

    const chatIds = chatSessions.map((chat) => chat.chatId);

    const chats = await ChatUser.findAll({
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
      include: [
        {
          model: Chat,
          where: {
            chatId: chatIds,
          },
          attributes: ['chatId', 'isGroup'],
        },
        {
          model: User,
          required: true,
          attributes: ['username'],
        },
      ],
      group: ['chatId'],
    });

    res.status(200).send(chats);
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

    res.status(200).send(chatMessages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat messages', message: error.message });
  }
};

exports.getChatStatus = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chatUsers = await ChatUser.findAll({
      where: {
        chatId: chatId,
      },
      include: [
        {
          model: User,
          require: true,
        },
      ],
    });
    res.status(200).send(chatUsers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get chat status', message: error.message });
  }
};

exports.getGroupChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const groupChats = await ChatUser.findAll({
      include: [
        {
          model: Chat,
          where: {
            isGroup: true,
          },
        },
      ],
      where: {
        userId: userId,
      },
      attributes: ['chatId'],
    });
    res.status(200).send(groupChats);
  } catch (error) {
    res.status(500).send({ error: 'Failed to get group chats', message: error.message });
  }
};

exports.getGroupChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const groupChatUsers = await ChatUser.findAll({
      where: {
        chatId: chatId,
      },
      include: [
        {
          model: Chat,
          required: true,
        },
        {
          model: User,
          require: true,
          attributes: ['username'],
        },
      ],
    });
    res.status(200).send(groupChatUsers);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get group chat users', message: error.message });
  }
};

exports.sendMessage = async (message, chatId, userId) => {
  try {
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
