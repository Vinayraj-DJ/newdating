# Admin Notification Panel Integration Guide

## Overview
This guide provides detailed instructions for integrating the Admin Notification Panel into your dating admin panel application. The system includes real-time WebSocket notifications and comprehensive admin notification management.

## Features Implemented

### 1. Admin Notification Dashboard
- **Real-time notifications** via WebSocket
- **Notification filtering** by type (Registrations, KYC, Withdrawals, etc.)
- **Action buttons** for quick approval/rejection
- **Statistics overview** showing pending counts
- **Connection status indicator** for WebSocket
- **Responsive design** for all devices

### 2. WebSocket Integration
- **Automatic reconnection** with exponential backoff
- **Admin-specific rooms** for targeted notifications
- **Multiple notification types** support:
  - `ACCOUNT_APPROVAL_REQUEST` - New user registrations
  - `KYC_SUBMITTED` - KYC document submissions
  - `WITHDRAWAL_REQUEST` - Withdrawal requests
  - `SYSTEM_MAINTENANCE` - System updates
  - `FEATURE_ANNOUNCEMENT` - Feature announcements

### 3. Notification Management
- **Mark individual notifications as read**
- **Mark all notifications as read**
- **Unread count tracking**
- **Pagination support**
- **Mock data fallback** for development

## File Structure

```
src/
├── pages/
│   └── AdminNotificationDashboard/
│       ├── AdminNotificationDashboard.jsx
│       └── AdminNotificationDashboard.module.css
├── components/
│   └── NotificationBadge/
│       ├── NotificationBadge.jsx
│       └── NotificationBadge.module.css
├── services/
│   ├── notificationService.js (updated)
│   ├── adminNotificationManager.js (new)
│   └── webSocketService.js (existing)
├── sections/
│   └── SideBar/
│       └── SideBar.jsx (updated)
└── routes/
    └── AppRoutes.js (updated)
```

## Integration Steps

### 1. Route Configuration
The notification dashboard is automatically available at `/notifications` route.

### 2. Sidebar Integration
The notification badge is automatically added to the Notifications menu item in the sidebar.

### 3. WebSocket Setup
The system automatically connects to WebSocket when the admin dashboard loads, using the admin JWT token from localStorage/sessionStorage.

### 4. API Endpoints Used
```javascript
// Get admin notifications
GET /api/v1/notifications/admin?page=1&limit=20&type=ACCOUNT_APPROVAL_REQUEST&isRead=false

// Mark notification as read
PUT /api/v1/notifications/:id/read

// Mark all notifications as read
PUT /api/v1/notifications/read-all

// Get unread count
GET /api/v1/notifications/unread-count

// Save FCM token
POST /api/v1/notification/save-token
```

## WebSocket Events

### Server to Client Events
```javascript
// General notification
socket.on('notification', (data) => { ... });

// Specific notification types
socket.on('notification:account_approval_request', (data) => { ... });
socket.on('notification:kyc_submitted', (data) => { ... });
socket.on('notification:withdrawal_request', (data) => { ... });

// Admin room notifications
socket.on('admin:notification', (data) => { ... });

// System notifications
socket.on('system:maintenance', (data) => { ... });
socket.on('system:update', (data) => { ... });
```

### Client to Server Events
```javascript
// Join admin notifications room
socket.emit('join_admin_notifications');

// Leave admin notifications room
socket.emit('leave_admin_notifications');

// Send notification to admin
socket.emit('admin:send_notification', notificationData);
```

## Customization Options

### 1. Notification Types
Add new notification types by updating:
- `getNotificationIcon()` function in AdminNotificationDashboard.jsx
- `getNotificationColor()` function in AdminNotificationDashboard.jsx
- `getTypeLabel()` function in AdminNotificationDashboard.jsx
- `renderActionButtons()` function for custom actions

### 2. Styling
Modify the CSS modules:
- `AdminNotificationDashboard.module.css` for dashboard styling
- `NotificationBadge.module.css` for badge styling

### 3. Polling Interval
Adjust the unread count polling interval in NotificationBadge.jsx:
```javascript
const interval = setInterval(loadUnreadCount, 30000); // 30 seconds
```

## Environment Variables

```bash
# WebSocket URL for development (optional)
REACT_APP_WS_URL=ws://localhost:3001

# API Base URL
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

## Error Handling

The system includes comprehensive error handling:
- **Fallback to mock data** when API is unavailable
- **Automatic reconnection** for WebSocket
- **Graceful degradation** when services are down
- **Console warnings** for debugging (suppressed in production)

## Testing

### Development Testing
1. The system uses mock data when API calls fail
2. WebSocket connection status is visible in the dashboard
3. Notification badge updates automatically

### Production Testing
1. Ensure WebSocket server is running
2. Verify admin JWT token is properly stored
3. Test notification filtering and actions

## Troubleshooting

### Common Issues

1. **WebSocket not connecting**
   - Check `REACT_APP_WS_URL` environment variable
   - Verify WebSocket server is running
   - Check browser console for connection errors

2. **Notifications not showing**
   - Verify admin JWT token is present in localStorage/sessionStorage
   - Check API endpoint responses
   - Ensure proper authentication headers

3. **Badge not updating**
   - Check polling interval in NotificationBadge component
   - Verify `getUnreadCount` API endpoint
   - Check browser console for errors

## Security Considerations

- **JWT Token Storage**: Tokens are retrieved from localStorage/sessionStorage
- **WebSocket Authentication**: Token passed via socket authentication
- **Route Protection**: Dashboard is protected by authentication
- **Input Validation**: All notification data is validated before display

## Performance Optimization

- **Polling**: Unread count polls every 30 seconds
- **WebSocket**: Real-time updates for immediate notifications
- **Pagination**: Notifications loaded in pages of 10
- **Caching**: Notification data cached in component state

## Future Enhancements

Potential improvements that could be added:
- Push notifications via FCM
- Email/SMS notifications
- Notification templates
- Scheduled notifications
- Notification history/search
- User-specific notification preferences