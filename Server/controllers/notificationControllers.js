const HttpError = require('../models/errorModel');
const UserModel = require('../models/userModel');

// Get all notifications for a user
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await UserModel.findById(userId).select('notifications');
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        const notifications = user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        const notification = user.notifications.id(notificationId);
        if (!notification) {
            return next(new HttpError("Notification not found", 404));
        }

        notification.isRead = true;
        await user.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        user.notifications.forEach(notification => {
            notification.isRead = true;
        });

        await user.save();

        res.status(200).json({
            message: "All notifications marked as read"
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

// Delete a notification
const deleteNotification = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        const notification = user.notifications.id(notificationId);
        if (!notification) {
            return next(new HttpError("Notification not found", 404));
        }

        notification.deleteOne();
        await user.save();

        res.status(200).json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

// Get unread notification count
const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).select('notifications');
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        const unreadCount = user.notifications.filter(notification => !notification.isRead).length;

        res.status(200).json({
            unreadCount
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount
};
