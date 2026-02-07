// Test script to verify user ID-based data fetching
// Run this in browser console to test the integration

console.log('=== User ID Data Fetching Test ===');

// Test with the specific user ID from your example
const testUserId = '695b47d9a40ac5f37a018fe2';

console.log('Testing user ID:', testUserId);

// Test 1: Check if service is available
try {
  const { scoreRuleService } = await import('./src/services/scoreRuleService.js');
  console.log('✅ ScoreRule service loaded successfully');
  
  // Test 2: Fetch user scores
  console.log('🔄 Fetching user scores...');
  const userScores = await scoreRuleService.getUserScores(testUserId);
  console.log('✅ User scores response:', userScores);
  
  // Test 3: Fetch user score history
  console.log('🔄 Fetching user score history...');
  const scoreHistory = await scoreRuleService.getUserScoreHistory(testUserId);
  console.log('✅ Score history response:', scoreHistory);
  
  // Verify data structure
  if (scoreHistory && Array.isArray(scoreHistory.data)) {
    console.log('✅ History data structure correct');
    console.log('   Total records:', scoreHistory.data.length);
    console.log('   Sample record:', scoreHistory.data[0]);
  } else {
    console.warn('⚠️ History data structure issue');
  }
  
  // Check pagination
  if (scoreHistory && scoreHistory.pagination) {
    console.log('✅ Pagination data present:', scoreHistory.pagination);
  }
  
} catch (error) {
  console.error('❌ Error testing user ID data fetching:', error);
  
  // Common issues to check:
  if (error.message?.includes('404')) {
    console.log('🔧 404 Error - Check if API endpoint exists');
  }
  if (error.message?.includes('NetworkError')) {
    console.log('🔧 Network Error - Check if API server is running');
  }
  if (error.response?.status === 401) {
    console.log('🔒 Authentication Error - Check JWT token');
  }
}

console.log('=== Test Complete ===');

// Additional debugging info
console.log('\n=== Debugging Information ===');
console.log('Expected API call: GET /admin/reward-rules/users/695b47d9a40ac5f37a018fe2/history');
console.log('Current endpoint config:', {
  USER_SCORES: '/admin/reward-rules/users'
});