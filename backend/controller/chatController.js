const Chat = require('../models/chat');
const ChatMessage = require('../models/chatMessage');
const ChatInvitation = require('../models/chatInvitation');
const User = require('../models/user');
const ChatUser = require('../models/chatUser');
const { Op } = require('sequelize');

exports.createChat = async (req, res) => {
    try {
        const chat = await Chat.create({ name: req.body.name });
        res.status(201).send(chat);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.sendInvitation = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const { receiverId } = req.body;
        const invitation = await ChatInvitation.create({
            chatId: chat_id,
            senderId: req.user.userId,
            receiverId: receiverId,
            status: 'pending'
        });
        res.status(201).send(invitation);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateInvitationStatus = async (req, res) => {
    try {
        const { invitation_id } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'
        const invitation = await ChatInvitation.findByPk(invitation_id);
        if (invitation) {
            invitation.status = status;
            await invitation.save();
            res.status(200).send(invitation);
        } else {
            res.status(404).send({ message: 'Invitation not found' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            include: [{
                model: User,
                as: 'participants'
            }]
        });
        res.status(200).send(chats);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const message = await ChatMessage.create({
            chatId: chat_id,
            senderId: req.user.userId,
            text: req.body.text,
            timestamp: new Date()
        });
        res.status(201).send(message);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const messages = await ChatMessage.findAll({
            where: { chatId: chat_id },
            order: [['timestamp', 'ASC']]
        });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.leaveChat = async (req, res) => {
    try {
        const { chat_id, user_id } = req.params;
        // Logic to handle leaving the chat
        res.status(200).send({ message: 'User has left the chat' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteChat = async (req, res) => {
    try {
        const { chat_id } = req.params;
        await Chat.destroy({ where: { chatId: chat_id } });
        res.status(200).send({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};
