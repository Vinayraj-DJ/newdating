// Mock API Setup for Development
// This file helps simulate API responses during development when backend is not available

const mockApiResponses = {
  // Mock notifications data
  notifications: [
    {
      _id: '1',
      title: 'New User Registration',
      message: 'A new user has registered and requires approval',
      type: 'ACCOUNT_APPROVAL_REQUEST',
      createdAt: new Date().toISOString(),
      isRead: false,
      data: {
        userId: 'user123',
        username: 'john_doe',
        email: 'john@example.com',
        userType: 'male'
      }
    },
    {
      _id: '2',
      title: 'KYC Documents Submitted',
      message: 'User has submitted KYC documents for review',
      type: 'KYC_SUBMITTED',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: false,
      data: {
        userId: 'user456',
        username: 'jane_smith',
        kycType: 'identity',
        documents: ['id_front.jpg', 'id_back.jpg']
      }
    },
    {
      _id: '3',
      title: 'Withdrawal Request',
      message: 'User has requested a withdrawal of ₹500',
      type: 'WITHDRAWAL_REQUEST',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: true,
      data: {
        withdrawalId: 'withdrawal789',
        userId: 'user789',
        amount: 500,
        paymentMethod: 'bank_transfer'
      }
    },
    {
      _id: '4',
      title: 'System Maintenance',
      message: 'Scheduled maintenance planned for tomorrow',
      type: 'SYSTEM_MAINTENANCE',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isRead: true,
      data: {
        scheduledTime: '2024-01-15 02:00 AM',
        duration: '2 hours'
      }
    },
    {
      _id: '5',
      title: 'New Feature Released',
      message: 'New chat feature is now available',
      type: 'FEATURE_ANNOUNCEMENT',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      isRead: false,
      data: {
        featureName: 'Video Chat',
        version: '2.1.0'
      }
    }
  ],
  
  // Mock unread count
  unreadCount: 3,
  
  // Mock stats
  stats: {
    pendingRegistrations: 1,
    pendingKYC: 1,
    pendingWithdrawals: 0
  }
};

// Utility functions for mock data
export const getMockNotifications = (page = 1, limit = 10, type = null, isRead = false) => {
  let filteredNotifications = [...mockApiResponses.notifications];
  
  // Filter by read status
  if (isRead !== null) {
    filteredNotifications = filteredNotifications.filter(n => n.isRead === isRead);
  }
  
  // Filter by type
  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: {
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredNotifications.length / limit),
    }
  };
};

export const getMockUnreadCount = () => {
  const unreadNotifications = mockApiResponses.notifications.filter(n => !n.isRead);
  return {
    success: true,
    data: {
      unreadCount: unreadNotifications.length
    }
  };
};

export const getMockStats = () => {
  return {
    success: true,
    data: mockApiResponses.stats
  };
};

// Export for use in development
export default mockApiResponses;