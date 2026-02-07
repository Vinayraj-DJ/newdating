// Test script to verify notification functionality
// Run this in browser console to test the notification system

console.log('=== Admin Notification System Test ===');

// Test 1: Check if notification service is available
try {
  const { notificationService } = await import('./src/services/notificationService.js');
  console.log('✅ Notification service loaded successfully');
  
  // Test 2: Get admin notifications (should use mock data)
  const notificationsResponse = await notificationService.getAdminNotifications(1, 10);
  console.log('✅ Get notifications response:', notificationsResponse);
  
  // Test 3: Get unread count (should use mock data)
  const unreadResponse = await notificationService.getUnreadCount();
  console.log('✅ Get unread count response:', unreadResponse);
  
  // Test 4: Check if mock data structure is correct
  if (notificationsResponse.success && notificationsResponse.data.notifications) {
    console.log('✅ Mock notifications data structure is correct');
    console.log('   Total notifications:', notificationsResponse.data.total);
    console.log('   Sample notification:', notificationsResponse.data.notifications[0]);
  }
  
  if (unreadResponse.success && unreadResponse.data.unreadCount !== undefined) {
    console.log('✅ Mock unread count data structure is correct');
    console.log('   Unread count:', unreadResponse.data.unreadCount);
  }
  
} catch (error) {
  console.error('❌ Error testing notification system:', error);
}

console.log('=== Test Complete ===');