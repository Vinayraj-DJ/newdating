import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import styles from './NotificationBadge.module.css';
import { FaBell } from 'react-icons/fa';

const NotificationBadge = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnreadCount();
    
    // Set up polling for unread count (every 30 seconds)
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
      setUnreadCount(0); // Show 0 instead of mock data
    } finally {
      setLoading(false);
    }
  };

  // Don't show badge when loading and no previous count
  if (loading && unreadCount === 0) {
    return (
      <div className={styles.badgeContainer} onClick={onClick}>
        <FaBell size={20} />
        <span className={styles.badge}></span>
      </div>
    );
  }
  
  // Show badge even when loading if we have a previous count
  const shouldShowBadge = unreadCount > 0;

  return (
    <div className={styles.badgeContainer} onClick={onClick}>
      <FaBell size={20} />
      {shouldShowBadge && (
        <span className={styles.badge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;