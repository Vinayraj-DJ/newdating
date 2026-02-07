import apiClient from './apiClient';
import { ENDPOINTS } from '../config/apiConfig';

/**
 * Service for handling admin notifications
 */
export const notificationService = {
  /**
   * Get admin notifications
   */
  getAdminNotifications: async (page = 1, limit = 20, type = null, isRead = false) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(type && { type }),
      isRead
    });
    
    try {
      const response = await apiClient.get(`${ENDPOINTS.NOTIFICATIONS.ADMIN_NOTIFICATIONS}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error.message);
      throw error; // Don't fallback to mock data
    }
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const url = ENDPOINTS.NOTIFICATIONS.MARK_AS_READ.replace(':id', notificationId);
      const response = await apiClient.put(url);
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error.message);
      throw error; // Don't simulate success
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ);
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error.message);
      throw error; // Don't simulate success
    }
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch unread count:', error.message);
      throw error; // Don't fallback to mock data
    }
  },

  /**
   * Save FCM token for admin device
   */
  saveFCMToken: async (fcmToken, deviceId = 'admin-web', platform = 'web') => {
    try {
      const response = await apiClient.post(ENDPOINTS.NOTIFICATIONS.SAVE_TOKEN, {
        fcmToken,
        deviceId,
        platform
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save FCM token:', error.message);
      throw error; // Don't simulate success
    }
  }
};