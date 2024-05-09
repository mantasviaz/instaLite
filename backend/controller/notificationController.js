const Notification = require('../models/notification');

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const allNotifications = await Notification.findAll({
      where: {
        userId: userId,
      },
    });
    res.status(200).send(allNotifications);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get notifications', message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.destroy({
      where: {
        notificationId: notificationId,
      },
    });
    res.status(200).send('sucess');
  } catch (error) {
    res.status(500).send({ error: 'Cannot delete notification', message: error.message });
  }
};
