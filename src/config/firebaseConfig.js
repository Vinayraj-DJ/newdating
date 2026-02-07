// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyATP24MQ3PITrpoBsBoEJvC_efQf99romo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "friendcircle-notifications.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "friendcircle-notifications",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "friendcircle-notifications.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "336749988199",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:336749988199:web:4cb9b0d9ff27d63c9987c2",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-DP46EJ1FRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

/**
 * Request permission to send notifications and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export const requestFCMToken = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || "BPxoxzYyXJ2dCk3wzVjR1O4N9o6r8J2fP1n5yT6v7wE3xR2yQ9u8j7h6g5f4e3d2c1b9a8z7y6x5w4v3u2t1s0"
      });
      
      return token;
    } else {
      console.warn('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Listen for incoming messages when the app is in foreground
 * @param {Function} callback - Callback function to handle incoming messages
 */
export const onForegroundMessage = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

export {
  app,
  messaging
};