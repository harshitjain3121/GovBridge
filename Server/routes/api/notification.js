const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount
} = require('../../controllers/notificationControllers');

router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);
router.patch('/read-all', authMiddleware, markAllNotificationsAsRead);
router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router;
