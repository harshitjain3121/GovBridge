import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketProvider';
import axios from '../api/axios';

const NotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;
        
        fetchUnreadCount();
    }, [currentUser]);

    useEffect(() => {
        if (socket) {
            socket.on('newNotification', (notification) => {
                setUnreadCount(prev => prev + 1);
                setRecentNotifications(prev => [notification, ...prev.slice(0, 4)]);
            });

            return () => {
                socket.off('newNotification');
            };
        }
    }, [socket]);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/notifications/unread-count');
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const fetchRecentNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/notifications');
            setRecentNotifications(response.data.notifications.slice(0, 5));
        } catch (err) {
            console.error('Error fetching recent notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/notifications/${notificationId}/read`);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setRecentNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleBellClick = () => {
        if (showDropdown) {
            setShowDropdown(false);
        } else {
            setShowDropdown(true);
            fetchRecentNotifications();
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        setShowDropdown(false);
        navigate(`/issues/${notification.issue}`);
    };

    const handleViewAllClick = () => {
        setShowDropdown(false);
        navigate('/notifications');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            const diffInHoursRounded = Math.floor(diffInHours);
            return `${diffInHoursRounded}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
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

    if (!currentUser) return null;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    color: 'var(--color-text)'
                }}
                onClick={handleBellClick}
                onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-light)';
                    e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'var(--color-danger)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        animation: 'pulse 2s infinite'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '350px',
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                    marginTop: '8px',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--color-border)',
                        background: 'var(--color-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            margin: '0',
                            fontSize: '1.1rem',
                            color: 'var(--color-text)',
                            fontWeight: '600'
                        }}>Recent Notifications</h3>
                        {unreadCount > 0 && (
                            <span style={{
                                background: 'var(--color-danger)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                            }}>{unreadCount} unread</span>
                        )}
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                                Loading...
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                <p style={{ margin: '0', fontSize: '0.9rem' }}>No notifications yet</p>
                            </div>
                        ) : (
                            recentNotifications.map((notification) => (
                                <div 
                                    key={notification._id}
                                    style={{
                                        padding: '12px 20px',
                                        borderBottom: '1px solid var(--color-border)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        background: !notification.isRead ? '#f0f8ff' : 'var(--color-surface)',
                                        borderLeft: !notification.isRead ? '3px solid var(--color-primary)' : 'none'
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'var(--color-light)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = !notification.isRead ? '#f0f8ff' : 'var(--color-surface)';
                                    }}
                                >
                                    <div style={{ fontSize: '1.2rem', marginTop: '2px', flexShrink: 0 }}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            margin: '0 0 4px 0',
                                            color: 'var(--color-text)',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            fontWeight: !notification.isRead ? '600' : '500'
                                        }}>
                                            {notification.message.length > 60 
                                                ? notification.message.substring(0, 60) + '...'
                                                : notification.message
                                            }
                                        </p>
                                        <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{
                        padding: '12px 20px',
                        borderTop: '1px solid var(--color-border)',
                        background: 'var(--color-light)'
                    }}>
                        <button 
                            style={{
                                width: '100%',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'background-color 0.3s ease'
                            }}
                            onClick={handleViewAllClick}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--color-primary-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--color-primary)';
                            }}
                        >
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
