const express = require('express');
const { createChat, acceptChatRequest, sendChatRequest, getChatMessages, getChatSessions, getChatStatus, declineChatRequest, getGroupChats } = require('../controller/chatController');
const router = express.Router();

// Create Chat Session
router.post('/', createChat);

// Accept Chat Request
router.post('/requests', acceptChatRequest);

// Send Chat Request
router.post('/send', sendChatRequest);

// Get Chat Sessions
router.get('/:userId', getChatSessions);

// Get Chat Messages
router.get('/:chatId/messages', getChatMessages);

// Get All Chat Users
router.get('/groupchats/:userId', getGroupChats);

// Get All User's Group Chats
router.post('/users', getChatStatus);

// Decline Chat Request
router.post('/decline', declineChatRequest);

module.exports = router;