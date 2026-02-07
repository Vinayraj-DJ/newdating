import { io } from 'socket.io-client';
import { notificationService } from './notificationService';

class AdminNotificationManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.onNotificationReceived = null;
    this.onConnectionStatusChange = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Initialize WebSocket connection for admin notifications
   */
  async connect(adminJwtToken, onNotificationReceived, onConnectionStatusChange) {
    this.onNotificationReceived = onNotificationReceived;
    this.onConnectionStatusChange = onConnectionStatusChange;

    try {
      const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://friendcircle-x7d6.onrender.com";
      
      let wsUrl;
      if (process.env.NODE_ENV === 'development') {
        wsUrl = process.env.REACT_APP_WS_URL;
        if (!wsUrl) {
          console.warn('WebSocket: No development URL configured, skipping connection');
          return false;
        }
        console.log('WebSocket connecting to development URL:', wsUrl);
      } else {
        if (API_BASE.startsWith('https')) {
          wsUrl = API_BASE.replace('https://', 'wss://');
        } else {
          wsUrl = API_BASE.replace('http://', 'ws://');
        }
      }

      if (!wsUrl) {
        console.warn('WebSocket: No URL configured, skipping connection');
        return false;
      }

      // Initialize socket connection
      this.socket = io(wsUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
        auth: {
          token: adminJwtToken
        }
      });

      this.setupSocketListeners();
      return true;

    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
      return false;
    }
  }

  /**
   * Setup all socket event listeners
   */
  setupSocketListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Admin WebSocket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (this.onConnectionStatusChange) {
        this.onConnectionStatusChange(true);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Admin WebSocket disconnected:', reason);
      this.isConnected = false;
      if (this.onConnectionStatusChange) {
        this.onConnectionStatusChange(false);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.warn('Admin WebSocket connection error:', error.message);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        if (this.onConnectionStatusChange) {
          this.onConnectionStatusChange(false);
        }
      }
    });

    // Admin-specific notification events
    this.socket.on('notification', (data) => {
      console.log('Received admin notification:', data);
      this.handleNotification(data);
    });

    // Specific notification types for admin
    this.socket.on('notification:account_approval_request', (data) => {
      console.log('New account approval request:', data);
      this.handleNotification({
        ...data,
        type: 'ACCOUNT_APPROVAL_REQUEST',
        title: 'New User Registration Request',
        message: `User ${data.data?.username || data.data?.email} has requested account approval`
      });
    });

    this.socket.on('notification:kyc_submitted', (data) => {
      console.log('New KYC submission:', data);
      this.handleNotification({
        ...data,
        type: 'KYC_SUBMITTED',
        title: 'New KYC Document Submission',
        message: `User has submitted ${data.data?.kycType || 'KYC'} documents for review`
      });
    });

    this.socket.on('notification:withdrawal_request', (data) => {
      console.log('New withdrawal request:', data);
      this.handleNotification({
        ...data,
        type: 'WITHDRAWAL_REQUEST',
        title: 'New Withdrawal Request',
        message: `User has requested withdrawal of ${data.data?.amount || 'amount'}`
      });
    });

    // Admin room notifications
    this.socket.on('admin:notification', (data) => {
      console.log('Admin room notification:', data);
      this.handleNotification(data);
    });

    // System notifications
    this.socket.on('system:maintenance', (data) => {
      console.log('System maintenance notification:', data);
      this.handleNotification({
        ...data,
        type: 'SYSTEM_MAINTENANCE',
        title: 'System Maintenance Scheduled',
        message: data.message || 'System maintenance is scheduled'
      });
    });

    this.socket.on('system:update', (data) => {
      console.log('System update notification:', data);
      this.handleNotification({
        ...data,
        type: 'FEATURE_ANNOUNCEMENT',
        title: 'System Update Available',
        message: data.message || 'New system features are available'
      });
    });
  }

  /**
   * Handle incoming notifications
   */
  handleNotification(notification) {
    // Add timestamp if not present
    if (!notification.createdAt) {
      notification.createdAt = new Date().toISOString();
    }

    // Call the notification handler callback
    if (this.onNotificationReceived) {
      this.onNotificationReceived(notification);
    }
  }

  /**
   * Join admin notifications room
   */
  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_admin_notifications');
      console.log('Joined admin notifications room');
    }
  }

  /**
   * Leave admin notifications room
   */
  leaveAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_admin_notifications');
      console.log('Left admin notifications room');
    }
  }

  /**
   * Send notification to specific admin
   */
  sendAdminNotification(notificationData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('admin:send_notification', notificationData);
    }
  }

  /**
   * Check connection status
   */
  isConnected() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketConnected: this.socket?.connected || false,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.leaveAdminRoom();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      if (this.onConnectionStatusChange) {
        this.onConnectionStatusChange(false);
      }
      console.log('Admin WebSocket disconnected');
    }
  }

  /**
   * Reconnect WebSocket
   */
  async reconnect(adminJwtToken) {
    this.disconnect();
    return await this.connect(adminJwtToken, this.onNotificationReceived, this.onConnectionStatusChange);
  }
}

// Export singleton instance
export const adminNotificationManager = new AdminNotificationManager();

// Export utility functions
export const initializeAdminNotifications = async (adminJwtToken, onNotificationReceived, onConnectionStatusChange) => {
  const success = await adminNotificationManager.connect(adminJwtToken, onNotificationReceived, onConnectionStatusChange);
  if (success) {
    adminNotificationManager.joinAdminRoom();
  }
  return success;
};

export const cleanupAdminNotifications = () => {
  adminNotificationManager.disconnect();
};

export default adminNotificationManager;