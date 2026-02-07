// src/services/fcmNotificationService.js
import apiClient from './apiClient';
import { requestFCMToken, onForegroundMessage } from '../config/firebaseConfig';

/**
 * Service for managing FCM notifications and tokens
 */
export const fcmNotificationService = {
  /**
   * Initialize FCM and register token with backend
   */
  async initializeAndRegisterToken() {
    try {
      // Get FCM token from Firebase
      const token = await requestFCMToken();
      
      if (token) {
        // Register token with backend
        await this.registerToken(token);
        console.log('FCM token registered successfully:', token);
        return token;
      } else {
        console.warn('Could not get FCM token');
        return null;
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
      throw error;
    }
  },

  /**
   * Register FCM token with backend
   * @param {string} fcmToken - The FCM token to register
   * @param {string} platform - Platform (web, android, ios)
   * @param {string} deviceId - Device ID (optional)
   */
  async registerToken(fcmToken, platform = 'web', deviceId = null) {
    try {
      const response = await apiClient.post('/notification/save-token', {
        fcmToken,
        platform,
        deviceId
      });

      return response.data;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      throw error;
    }
  },

  /**
   * Remove FCM token from backend
   * @param {string} fcmToken - The FCM token to remove
   */
  async removeToken(fcmToken) {
    try {
      const response = await apiClient.delete('/notification/remove-token', {
        data: { token: fcmToken }
      });

      return response.data;
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  },

  /**
   * Listen for foreground messages and handle them
   */
  setupForegroundListener() {
    onForegroundMessage((payload) => {
      console.log('Foreground message received:', payload);
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon || '/favicon.ico',
          tag: payload.messageId
        });
      }

      // Optionally trigger UI update or event
      // For example, you could dispatch a custom event
      window.dispatchEvent(new CustomEvent('notificationReceived', {
        detail: payload
      }));
    });
  },

  /**
   * Request notification permissions and initialize FCM
   */
  async requestPermissionAndInitialize() {
    try {
      // Check if Notification is supported
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      // Check current permission
      if (Notification.permission === 'granted') {
        console.log('Notification permission already granted');
        return await this.initializeAndRegisterToken();
      } else if (Notification.permission === 'denied') {
        console.log('Notification permission denied by user');
        return null;
      } else {
        // Permission not yet requested
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
          return await this.initializeAndRegisterToken();
        } else {
          console.log('Notification permission denied');
          return null;
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }
};

// Initialize FCM when service is loaded
fcmNotificationService.setupForegroundListener();

export default fcmNotificationService;