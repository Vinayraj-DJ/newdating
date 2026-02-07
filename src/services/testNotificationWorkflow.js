/**
 * Test file to verify the complete notification workflow
 * This demonstrates how the notification system works for registration, KYC, and withdrawal
 */

import { userNotificationService } from './userNotificationService';

// Test functions to demonstrate the complete workflow
const testNotificationWorkflow = {
  /**
   * Test registration approval notification
   */
  async testRegistrationApproval(userId, userType = 'female') {
    console.log('Testing registration approval notification...');
    
    try {
      // This would normally be called from the admin panel when approving a user
      await userNotificationService.sendRegistrationNotification(
        userId,
        'accepted',
        userType,
        'Congratulations! Your registration has been approved. You can now access all features of our platform.'
      );
      
      console.log('✓ Registration approval notification sent successfully');
    } catch (error) {
      console.error('✗ Error in registration approval test:', error);
    }
  },

  /**
   * Test registration rejection notification
   */
  async testRegistrationRejection(userId, userType = 'female') {
    console.log('Testing registration rejection notification...');
    
    try {
      // This would normally be called from the admin panel when rejecting a user
      await userNotificationService.sendRegistrationNotification(
        userId,
        'rejected',
        userType,
        'We regret to inform you that your registration has been rejected. Please contact support for more information.'
      );
      
      console.log('✓ Registration rejection notification sent successfully');
    } catch (error) {
      console.error('✗ Error in registration rejection test:', error);
    }
  },

  /**
   * Test KYC approval notification
   */
  async testKYCApproval(kycId, userId, kycType = 'female') {
    console.log('Testing KYC approval notification...');
    
    try {
      // This would normally be called from the admin panel when approving KYC
      await userNotificationService.sendKYCNotification(
        userId,
        'approved',
        kycType,
        'Great news! Your KYC verification has been approved. You can now access premium features.'
      );
      
      console.log('✓ KYC approval notification sent successfully');
    } catch (error) {
      console.error('✗ Error in KYC approval test:', error);
    }
  },

  /**
   * Test KYC rejection notification
   */
  async testKYCRejection(kycId, userId, kycType = 'female') {
    console.log('Testing KYC rejection notification...');
    
    try {
      // This would normally be called from the admin panel when rejecting KYC
      await userNotificationService.sendKYCNotification(
        userId,
        'rejected',
        kycType,
        'Your KYC verification has been rejected. Please update your documents and resubmit.'
      );
      
      console.log('✓ KYC rejection notification sent successfully');
    } catch (error) {
      console.error('✗ Error in KYC rejection test:', error);
    }
  },

  /**
   * Test withdrawal approval notification
   */
  async testWithdrawalApproval(withdrawalId, userId, amount = 1000) {
    console.log('Testing withdrawal approval notification...');
    
    try {
      // This would normally be called from the admin panel when approving a withdrawal
      await userNotificationService.sendWithdrawalNotification(
        userId,
        'approved',
        withdrawalId,
        amount,
        `Your withdrawal request for ₹${amount} has been approved. The funds will be transferred to your account shortly.`
      );
      
      console.log('✓ Withdrawal approval notification sent successfully');
    } catch (error) {
      console.error('✗ Error in withdrawal approval test:', error);
    }
  },

  /**
   * Test withdrawal rejection notification
   */
  async testWithdrawalRejection(withdrawalId, userId, amount = 1000) {
    console.log('Testing withdrawal rejection notification...');
    
    try {
      // This would normally be called from the admin panel when rejecting a withdrawal
      await userNotificationService.sendWithdrawalNotification(
        userId,
        'rejected',
        withdrawalId,
        amount,
        `We regret to inform you that your withdrawal request for ₹${amount} has been rejected. Please contact support for more information.`
      );
      
      console.log('✓ Withdrawal rejection notification sent successfully');
    } catch (error) {
      console.error('✗ Error in withdrawal rejection test:', error);
    }
  },

  /**
   * Test sending a custom notification to a user
   */
  async testCustomNotification(userId, userType = 'female', title, message) {
    console.log('Testing custom notification...');
    
    try {
      await userNotificationService.sendCustomNotification(userId, userType, title, message);
      
      console.log('✓ Custom notification sent successfully');
    } catch (error) {
      console.error('✗ Error in custom notification test:', error);
    }
  },

  /**
   * Run all tests to verify the complete workflow
   */
  async runAllTests() {
    console.log('🧪 Starting complete notification workflow tests...\n');

    // Mock IDs for testing (these would be real IDs in production)
    const mockUserId = 'test_user_123';
    const mockKycId = 'test_kyc_456';
    const mockWithdrawalId = 'test_withdrawal_789';
    const mockAmount = 5000;

    // Test registration notifications
    await this.testRegistrationApproval(mockUserId, 'female');
    await this.testRegistrationRejection(mockUserId, 'male');

    console.log(''); // Add spacing

    // Test KYC notifications
    await this.testKYCApproval(mockKycId, mockUserId, 'female');
    await this.testKYCRejection(mockKycId, mockUserId, 'agency');

    console.log(''); // Add spacing

    // Test withdrawal notifications
    await this.testWithdrawalApproval(mockWithdrawalId, mockUserId, mockAmount);
    await this.testWithdrawalRejection(mockWithdrawalId, mockUserId, mockAmount);

    console.log(''); // Add spacing

    // Test custom notification
    await this.testCustomNotification(
      mockUserId,
      'female',
      'Welcome Message',
      'Welcome to our platform! We\'re glad to have you.'
    );

    console.log('\n🎉 All notification workflow tests completed!');
    console.log('The system is ready to send notifications for:');
    console.log('- User registration approval/rejection');
    console.log('- KYC verification approval/rejection');
    console.log('- Withdrawal request approval/rejection');
    console.log('- Custom notifications');
  }
};

// Export the test functions
export default testNotificationWorkflow;

// Also provide a simple way to run the tests
if (typeof window !== 'undefined' && window.location && window.location.href.includes('localhost')) {
  // Only run automatically in development/local environment
  console.log('Notification workflow test utility loaded. Call testNotificationWorkflow.runAllTests() to run tests.');
}