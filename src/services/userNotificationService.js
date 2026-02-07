import apiClient from './apiClient';
import { fcmNotificationService } from './fcmNotificationService';

/**
 * Service for sending notifications to users about approval/rejection of their requests
 */

export const userNotificationService = {
  /**
   * Send notification to user about registration approval/rejection
   */
  sendRegistrationNotification: async (userId, status, userType, message = null) => {
    try {
      const payload = {
        userId,
        userType,
        notificationType: 'REGISTRATION_STATUS_UPDATE',
        title: status === 'accepted' 
          ? 'Registration Approved' 
          : 'Registration Rejected',
        message: message || (status === 'accepted'
          ? 'Congratulations! Your registration has been approved. You can now access all features of our platform.'
          : 'We regret to inform you that your registration has been rejected. Please contact support for more information.'),
        data: {
          status,
          timestamp: new Date().toISOString()
        }
      };

      // Initialize FCM to ensure token is registered
      await fcmNotificationService.requestPermissionAndInitialize().catch(console.error);
      
      const response = await apiClient.post('/admin/notifications/send-to-user', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending registration notification:', error);
      throw error;
    }
  },

  /**
   * Send notification to user about KYC approval/rejection
   */
  sendKYCNotification: async (userId, status, kycType, message = null) => {
    try {
      const payload = {
        userId,
        userType: kycType, // 'female' or 'agency'
        notificationType: 'KYC_STATUS_UPDATE',
        title: status === 'approved' 
          ? 'KYC Verification Approved' 
          : 'KYC Verification Rejected',
        message: message || (status === 'approved'
          ? 'Great news! Your KYC verification has been approved. You can now access premium features.'
          : 'Your KYC verification has been rejected. Please update your documents and resubmit.'),
        data: {
          status,
          kycType,
          timestamp: new Date().toISOString()
        }
      };

      // Initialize FCM to ensure token is registered
      await fcmNotificationService.requestPermissionAndInitialize().catch(console.error);
      
      const response = await apiClient.post('/admin/notifications/send-to-user', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending KYC notification:', error);
      throw error;
    }
  },

  /**
   * Send notification to user about withdrawal approval/rejection
   */
  sendWithdrawalNotification: async (userId, status, withdrawalId, amount, message = null) => {
    try {
      const payload = {
        userId,
        notificationType: 'WITHDRAWAL_STATUS_UPDATE',
        title: status === 'approved' 
          ? 'Withdrawal Request Approved' 
          : 'Withdrawal Request Rejected',
        message: message || (status === 'approved'
          ? `Your withdrawal request for ₹${amount} has been approved. The funds will be transferred to your account shortly.`
          : `We regret to inform you that your withdrawal request for ₹${amount} has been rejected. Please contact support for more information.`),
        data: {
          status,
          withdrawalId,
          amount,
          timestamp: new Date().toISOString()
        }
      };

      // Initialize FCM to ensure token is registered
      await fcmNotificationService.requestPermissionAndInitialize().catch(console.error);
      
      const response = await apiClient.post('/admin/notifications/send-to-user', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending withdrawal notification:', error);
      throw error;
    }
  },

  /**
   * Generic method to send custom notification to user
   */
  sendCustomNotification: async (userId, userType, title, message, data = {}) => {
    try {
      const payload = {
        userId,
        userType,
        notificationType: 'CUSTOM',
        title,
        message,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };

      // Initialize FCM to ensure token is registered
      await fcmNotificationService.requestPermissionAndInitialize().catch(console.error);
      
      const response = await apiClient.post('/admin/notifications/send-to-user', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending custom notification:', error);
      throw error;
    }
  }
};

export default userNotificationService;