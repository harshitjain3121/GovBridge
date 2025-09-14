import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketProvider';
import axios from '../api/axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchNotifications();
        fetchUnreadCount();
    }, [currentUser, navigate]);

    useEffect(() => {
        if (socket) {
            socket.on('newNotification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
            return () => {
                socket.off('newNotification');
            };
        }
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/notifications');
            setNotifications(response.data.notifications);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/notifications/unread-count');
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/notifications/read-all');
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);
            setNotifications(prev => 
                prev.filter(notification => notification._id !== notificationId)
            );
            // Check if the deleted notification was unread
            const deletedNotification = notifications.find(n => n._id === notificationId);
            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read if not already read
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        // Navigate to the issue page
        navigate(`/issues/${notification.issue}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const diffInHoursRounded = Math.floor(diffInHours);
            return `${diffInHoursRounded} hour${diffInHoursRounded !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 168) { // 7 days
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'OFFICIAL_RESPONSE':
                return '💬';
            case 'STATUS_UPDATE':
                return '📋';
            case 'ISSUE_CLOSED':
                return '✅';
            default:
                return '🔔';
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: 'var(--color-muted)' }}>
                    Loading notifications...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ color: 'var(--color-danger)', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', margin: '20px 0', padding: '1rem', textAlign: 'center' }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '30px',
                padding: '20px',
                background: 'var(--color-surface)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
            }}>
                <h1 style={{ margin: '0', color: 'var(--color-text)', fontSize: '2rem', fontWeight: '600' }}>
                    Notifications
                </h1>
                {unreadCount > 0 && (
                    <div style={{
                        background: 'var(--color-danger)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        marginLeft: '15px'
                    }}>
                        {unreadCount} unread
                    </div>
                )}
                {notifications.length > 0 && unreadCount > 0 && (
                    <button 
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'background-color 0.3s ease'
                        }}
                        onClick={markAllAsRead}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--color-primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--color-primary)';
                        }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>🔔</div>
                    <h3 style={{ color: 'var(--color-text)', marginBottom: '10px', fontSize: '1.5rem' }}>
                        No notifications yet
                    </h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
                        You'll receive notifications when officials respond to issues you've interacted with.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map((notification) => (
                        <div 
                            key={notification._id}
                            style={{
                                background: 'var(--color-surface)',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: 'var(--shadow-md)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                borderLeft: !notification.isRead ? '4px solid var(--color-primary)' : '4px solid transparent',
                                backgroundColor: !notification.isRead ? '#f8fcff' : 'var(--color-surface)'
                            }}
                            onClick={() => handleNotificationClick(notification)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                <div style={{ fontSize: '1.5rem', marginTop: '2px', flexShrink: 0 }}>
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        color: 'var(--color-text)',
                                        fontSize: '1rem',
                                        lineHeight: '1.5',
                                        fontWeight: !notification.isRead ? '600' : '500'
                                    }}>
                                        {notification.message}
                                    </p>
                                    <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '15px', marginTop: '10px' }}>
                                {!notification.isRead && (
                                    <button 
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-success)'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification._id);
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#d5f4e6';
                                            e.target.style.color = '#047857';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'none';
                                            e.target.style.color = 'var(--color-success)';
                                        }}
                                        title="Mark as read"
                                    >
                                        ✓
                                    </button>
                                )}
                                <button 
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        transition: 'all 0.2s ease',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-danger)'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification._id);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#fadbd8';
                                        e.target.style.color = '#b91c1c';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'none';
                                        e.target.style.color = 'var(--color-danger)';
                                    }}
                                    title="Delete notification"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
