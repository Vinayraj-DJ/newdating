import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { initializeAdminNotifications, cleanupAdminNotifications, adminNotificationManager } from '../../services/adminNotificationManager';
import apiClient from '../../services/apiClient';
import { userNotificationService } from '../../services/userNotificationService';
import { fcmNotificationService } from '../../services/fcmNotificationService';
import styles from './AdminNotificationDashboard.module.css';
import { FaBell, FaCheck, FaTimes, FaUserCheck, FaUserShield, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

const AdminNotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('all');
  const [stats, setStats] = useState({
    pendingRegistrations: 0,
    pendingKYC: 0,
    pendingWithdrawals: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadNotifications(),
          loadUnreadCount(),
          loadStats()
        ]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();
    
    // Get admin JWT token from localStorage or auth context
    const adminJwtToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    
    if (adminJwtToken) {
      // Initialize WebSocket for real-time notifications
      initializeAdminNotifications(
        adminJwtToken,
        handleNewNotification,
        handleConnectionStatusChange
      );
    }
    
    return () => {
      cleanupAdminNotifications();
      controller.abort();
    };
  }, [currentPage, selectedType]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAdminNotifications(
        currentPage, 
        10, 
        selectedType !== 'all' ? selectedType : null, 
        false
      );
      
      if (response.success) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error.message);
      setNotifications([]); // Show empty state instead of mock data
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error.message);
      setUnreadCount(0); // Show 0 instead of mock data
    }
  };

  const loadStats = async () => {
    try {
      const response = await notificationService.getAdminNotifications(1, 100, null, false);
      if (response.success) {
        const allNotifications = response.data.notifications;
        
        setStats({
          pendingRegistrations: allNotifications.filter(n => 
            n.type === 'ACCOUNT_APPROVAL_REQUEST' && !n.isRead
          ).length,
          pendingKYC: allNotifications.filter(n => 
            n.type === 'KYC_SUBMITTED' && !n.isRead
          ).length,
          pendingWithdrawals: allNotifications.filter(n => 
            n.type === 'WITHDRAWAL_REQUEST' && !n.isRead
          ).length
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error.message);
      setStats({
        pendingRegistrations: 0,
        pendingKYC: 0,
        pendingWithdrawals: 0
      }); // Show zeros instead of mock data
    }
  };

  const handleNewNotification = (notification) => {
    console.log('New notification received:', notification);
    // Add new notification to the top of the list
    setNotifications(prev => [notification, ...prev]);
    loadUnreadCount();
    loadStats();
    // Show alert for testing
    if (process.env.NODE_ENV === 'development') {
      alert(`New notification: ${notification.title}`);
    }
  };

  const handleConnectionStatusChange = (connected) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('WebSocket connection status:', connected ? 'Connected' : 'Disconnected');
    }
    setIsConnected(connected);
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      loadUnreadCount();
      loadStats();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      loadUnreadCount();
      loadStats();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleAction = async (notification, action) => {
    try {
      console.log(`Performing ${action} on notification:`, notification);
      
      // Actually process the approval/rejection
      if (notification.type === 'ACCOUNT_APPROVAL_REQUEST') {
        if (action === 'approve') {
          // Approve the user
          await apiClient.post(`/admin/users/review-registration`, {
            userType: notification.data.userType,
            userId: notification.data.userId,
            reviewStatus: 'accepted'
          });
          
          // Send notification to user about approval
          await userNotificationService.sendRegistrationNotification(
            notification.data.userId,
            'accepted',
            notification.data.userType,
            'Congratulations! Your registration has been approved. You can now access all features of our platform.'
          );
          
          console.log('User approved successfully and notification sent');
        } else {
          // Reject the user
          await apiClient.post(`/admin/users/review-registration`, {
            userType: notification.data.userType,
            userId: notification.data.userId,
            reviewStatus: 'rejected'
          });
          
          // Send notification to user about rejection
          await userNotificationService.sendRegistrationNotification(
            notification.data.userId,
            'rejected',
            notification.data.userType,
            'We regret to inform you that your registration has been rejected. Please contact support for more information.'
          );
          
          console.log('User rejected successfully and notification sent');
        }
      } else if (notification.type === 'KYC_SUBMITTED') {
        if (action === 'approve') {
          // Approve KYC
          await apiClient.post(`/admin/users/review-kyc`, {
            kycId: notification.data.kycId,
            status: 'approved',
            kycType: notification.data.userType
          });
          
          // Send notification to user about KYC approval
          await userNotificationService.sendKYCNotification(
            notification.data.userId,
            'approved',
            notification.data.userType,
            'Great news! Your KYC verification has been approved. You can now access premium features.'
          );
          
          console.log('KYC approved successfully and notification sent');
        } else {
          // Reject KYC
          await apiClient.post(`/admin/users/review-kyc`, {
            kycId: notification.data.kycId,
            status: 'rejected',
            kycType: notification.data.userType
          });
          
          // Send notification to user about KYC rejection
          await userNotificationService.sendKYCNotification(
            notification.data.userId,
            'rejected',
            notification.data.userType,
            'Your KYC verification has been rejected. Please update your documents and resubmit.'
          );
          
          console.log('KYC rejected successfully and notification sent');
        }
      } else if (notification.type === 'WITHDRAWAL_REQUEST') {
        if (action === 'approve') {
          // Approve withdrawal
          await apiClient.post(`/admin/withdrawals/${notification.data.withdrawalId}/approve`);
          
          // Send notification to user about withdrawal approval
          await userNotificationService.sendWithdrawalNotification(
            notification.data.userId,
            'approved',
            notification.data.withdrawalId,
            notification.data.amount,
            `Your withdrawal request for ₹${notification.data.amount} has been approved. The funds will be transferred to your account shortly.`
          );
          
          console.log('Withdrawal approved successfully and notification sent');
        } else {
          // Reject withdrawal
          await apiClient.post(`/admin/withdrawals/${notification.data.withdrawalId}/reject`);
          
          // Send notification to user about withdrawal rejection
          await userNotificationService.sendWithdrawalNotification(
            notification.data.userId,
            'rejected',
            notification.data.withdrawalId,
            notification.data.amount,
            `We regret to inform you that your withdrawal request for ₹${notification.data.amount} has been rejected. Please contact support for more information.`
          );
          
          console.log('Withdrawal rejected successfully and notification sent');
        }
      }
      
      // Mark notification as read
      await markAsRead(notification._id);
      
      // Refresh all data
      loadNotifications();
      loadUnreadCount();
      loadStats();
      
      // Show success message
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)}d successfully!`);
      
    } catch (error) {
      console.error('Error performing action:', error);
      alert(`Failed to ${action} user: ${error.message}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ACCOUNT_APPROVAL_REQUEST':
        return <FaUserCheck />;
      case 'KYC_SUBMITTED':
        return <FaUserShield />;
      case 'WITHDRAWAL_REQUEST':
        return <FaMoneyBillWave />;
      default:
        return <FaBell />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ACCOUNT_APPROVAL_REQUEST':
        return '#3b82f6';
      case 'KYC_SUBMITTED':
        return '#f59e0b';
      case 'WITHDRAWAL_REQUEST':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'ACCOUNT_APPROVAL_REQUEST': 'Registration Request',
      'KYC_SUBMITTED': 'KYC Submission',
      'WITHDRAWAL_REQUEST': 'Withdrawal Request',
      'SYSTEM_MAINTENANCE': 'System Maintenance',
      'FEATURE_ANNOUNCEMENT': 'Feature Update'
    };
    return labels[type] || type;
  };

  const renderActionButtons = (notification) => {
    if (notification.isRead) return null;
    
    switch (notification.type) {
      case 'ACCOUNT_APPROVAL_REQUEST':
        return (
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.btn} ${styles.approveBtn}`}
              onClick={() => handleAction(notification, 'approve')}
            >
              <FaCheck /> Approve
            </button>
            <button 
              className={`${styles.btn} ${styles.rejectBtn}`}
              onClick={() => handleAction(notification, 'reject')}
            >
              <FaTimes /> Reject
            </button>
          </div>
        );
      case 'KYC_SUBMITTED':
        return (
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.btn} ${styles.approveBtn}`}
              onClick={() => handleAction(notification, 'approve')}
            >
              <FaCheck /> Verify
            </button>
            <button 
              className={`${styles.btn} ${styles.rejectBtn}`}
              onClick={() => handleAction(notification, 'reject')}
            >
              <FaTimes /> Reject
            </button>
          </div>
        );
      case 'WITHDRAWAL_REQUEST':
        return (
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.btn} ${styles.approveBtn}`}
              onClick={() => handleAction(notification, 'approve')}
            >
              <FaCheck /> Approve
            </button>
            <button 
              className={`${styles.btn} ${styles.rejectBtn}`}
              onClick={() => handleAction(notification, 'reject')}
            >
              <FaTimes /> Reject
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading notifications...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Admin Notifications</h1>
        <div className={styles.headerActions}>
{/* Connection status removed for cleaner interface */}
          <div className={styles.statsOverview}>
            <div className={styles.statItem}>
              <FaUserCheck className={styles.statIcon} />
              <div>
                <div className={styles.statCount}>{stats.pendingRegistrations}</div>
                <div className={styles.statLabel}>Registrations</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <FaUserShield className={styles.statIcon} />
              <div>
                <div className={styles.statCount}>{stats.pendingKYC}</div>
                <div className={styles.statLabel}>KYC Requests</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <FaMoneyBillWave className={styles.statIcon} />
              <div>
                <div className={styles.statCount}>{stats.pendingWithdrawals}</div>
                <div className={styles.statLabel}>Withdrawals</div>
              </div>
            </div>
          </div>
          <button 
            className={styles.markAllReadBtn}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read ({unreadCount} unread)
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Notifications</option>
          <option value="ACCOUNT_APPROVAL_REQUEST">Registration Requests</option>
          <option value="KYC_SUBMITTED">KYC Submissions</option>
          <option value="WITHDRAWAL_REQUEST">Withdrawal Requests</option>
        </select>
      </div>

      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FaBell size={48} />
            <h3>No notifications found</h3>
            <p>No {selectedType !== 'all' ? getTypeLabel(selectedType).toLowerCase() : ''} notifications to display</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`${styles.notificationCard} ${notification.isRead ? styles.read : styles.unread}`}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationIcon} style={{color: getNotificationColor(notification.type)}}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationTitle}>
                    {notification.title}
                    <span className={styles.notificationType} style={{backgroundColor: getNotificationColor(notification.type)}}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <div className={styles.notificationTime}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                <button 
                  className={styles.markReadBtn}
                  onClick={() => markAsRead(notification._id)}
                >
                  {notification.isRead ? 'Read' : 'Mark as Read'}
                </button>
              </div>
              
              <div className={styles.notificationContent}>
                <p>{notification.message}</p>
                {notification.data && (
                  <div className={styles.notificationData}>
                    {Object.entries(notification.data).map(([key, value]) => (
                      <div key={key} className={styles.dataItem}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {renderActionButtons(notification)}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationDashboard;