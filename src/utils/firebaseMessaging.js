import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from "../config/firebaseConfig";
import { notificationService } from "../services/notificationService";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // VAPID key should be provided by your Firebase project
      // For now, using a placeholder - you should replace with your actual VAPID key
      const vapidKey = process.env.REACT_APP_VAPID_KEY || 'BKxp0LAxOjC8y7a7XmN4n1h8t0k9z3l2v7u6y5r4e3w2q1p9o8i7u6y5t4r3e2w1q';
      
      const token = await getToken(messaging, { 
        vapidKey: vapidKey
      });
      
      if (token) {
        // Send token to backend
        await notificationService.saveFCMToken(token);
        return token;
      }
    }
  } catch (error) {
    // Suppress console message in development
    // console.warn('Error getting FCM token (this is normal in development):', error.message);
    // In development, we might not have the service worker set up, so just return null
    // This is expected in development environments
    return null;
  }
  return null;
};

/**
 * Listen for incoming messages
 */
export const listenForMessages = (onNotificationReceived) => {
  return onMessage(messaging, (payload) => {
    console.log('Foreground notification received:', payload);
    if (onNotificationReceived) {
      onNotificationReceived(payload);
    }
  });
};

/**
 * Get current FCM token
 */
export const getCurrentToken = async () => {
  try {
    const vapidKey = process.env.REACT_APP_VAPID_KEY || 'BKxp0LAxOjC8y7a7XmN4n1h8t0k9z3l2v7u6y5r4e3w2q1p9o8i7u6y5t4r3e2w1q';
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};