# Firebase Integration Setup Instructions

## Required Dependencies

To complete the Firebase integration, install the following packages:

```bash
npm install firebase
```

## Firebase Project Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings
4. Copy the Firebase configuration details

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyATP24MQ3PITrpoBsBoEJvC_efQf99romo
REACT_APP_FIREBASE_AUTH_DOMAIN=friendcircle-notifications.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=friendcircle-notifications
REACT_APP_FIREBASE_STORAGE_BUCKET=friendcircle-notifications.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=336749988199
REACT_APP_FIREBASE_APP_ID=1:336749988199:web:4cb9b0d9ff27d63c9987c2
REACT_APP_FIREBASE_MEASUREMENT_ID=G-DP46EJ1FRW
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

## VAPID Key Generation

To get the VAPID key for FCM:

1. Go to Firebase Console
2. Navigate to Project Settings > Cloud Messaging
3. Copy the Server Key as your VAPID key
4. Alternatively, you can generate a new key pair in the Web Push certificates section

The VAPID key is required for web push notifications to work properly.

## Service Worker Setup

For web push notifications to work properly, you'll need to create a service worker file named `firebase-messaging-sw.js` in the `public` folder:

```js
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your configuration
firebase.initializeApp({
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Backend Integration

The frontend components are integrated with the backend API endpoints:

- `/admin/notifications/send-to-user` - Send notifications to specific users
- `/notification/save-token` - Register FCM tokens
- `/notification/remove-token` - Remove FCM tokens

These endpoints should be implemented on your backend server to handle the actual delivery of notifications to FCM.

## How It Works

1. When users access the application, the FCM service requests permission to send notifications
2. If granted, it retrieves an FCM token from Firebase
3. The token is registered with your backend via the `/notification/save-token` endpoint
4. When an admin performs an action (approve/reject), the system sends a notification request to your backend
5. Your backend uses the stored FCM tokens to send push notifications to the appropriate users
6. Users receive notifications on their devices through the Firebase Cloud Messaging service

## Testing

To test the notification system:

1. Make sure your backend endpoints are properly configured
2. Access the admin panel and perform an approval/rejection action
3. Check if the user receives a notification on their device
4. Verify that the notification appears as a browser notification if the user is on the web app