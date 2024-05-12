const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

// Create a new chat session
router.post('/', chatController.createChat);

// Send an invitation to join a chat
router.post('/:chat_id/invitations', chatController.sendInvitation);

// Update invitation status (accept/reject)
router.patch('/invitations/:invitation_id', chatController.updateInvitationStatus);

// Fetch all chat sessions for a user
router.get('/', chatController.getChats);

// Send a message in a chat session
router.post('/:chat_id/messages', chatController.sendMessage);

// Fetch all messages from a chat session
router.get('/:chat_id/messages', chatController.getMessages);

// User leaves a chat session
router.delete('/:chat_id/users/:user_id', chatController.leaveChat);

// Optional: Delete a chat session
router.delete('/:chat_id', chatController.deleteChat);

module.exports = router;
