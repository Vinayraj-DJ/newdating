// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your configuration
// This should match the configuration in src/config/firebaseConfig.js
firebase.initializeApp({
  apiKey: "AIzaSyATP24MQ3PITrpoBsBoEJvC_efQf99romo",
  authDomain: "friendcircle-notifications.firebaseapp.com",
  projectId: "friendcircle-notifications",
  storageBucket: "friendcircle-notifications.firebasestorage.app",
  messagingSenderId: "336749988199",
  appId: "1:336749988199:web:4cb9b0d9ff27d63c9987c2",
  measurementId: "G-DP46EJ1FRW"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: payload.notification.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.messageId || 'default-tag'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});