const express = require('express');
const { getNotifications, deleteNotification } = require('../controller/notificationController');
const router = express.Router();

// GET notifications
router.get('/:userId', getNotifications);

// DELETE notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
