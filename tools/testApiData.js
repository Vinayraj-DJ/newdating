// Test script to verify API data fetching
// Run this in browser console to test the integration

console.log('=== API Data Fetching Test ===');

try {
  // Test 1: Check if service is available
  const { scoreRuleService } = await import('./src/services/scoreRuleService.js');
  console.log('✅ ScoreRule service loaded successfully');
  
  // Test 2: Fetch rules directly
  console.log('🔄 Fetching rules from API...');
  const rules = await scoreRuleService.getAllScoreRules();
  
  console.log('✅ API Response:', {
    success: true,
    isArray: Array.isArray(rules),
    length: rules.length,
    sampleRule: rules[0],
    allRuleTypes: [...new Set(rules.map(r => r.ruleType))]
  });
  
  // Test 3: Verify data structure
  if (Array.isArray(rules) && rules.length > 0) {
    console.log('✅ Data structure is correct');
    console.log('📊 Rule distribution:');
    const ruleCounts = rules.reduce((acc, rule) => {
      acc[rule.ruleType] = (acc[rule.ruleType] || 0) + 1;
      return acc;
    }, {});
    console.table(ruleCounts);
    
    // Check for required fields
    const requiredFields = ['_id', 'ruleType', 'scoreValue', 'isActive'];
    const hasAllFields = requiredFields.every(field => field in rules[0]);
    console.log('✅ Required fields present:', hasAllFields);
    
  } else {
    console.warn('⚠️ No rules found or invalid data structure');
    console.log('Rules data:', rules);
  }
  
} catch (error) {
  console.error('❌ Error testing API data:', error);
  
  // Check specific error types
  if (error.message?.includes('404')) {
    console.log('🔧 404 Error - Endpoint not found');
  }
  if (error.message?.includes('NetworkError')) {
    console.log('🔧 Network Error - Check API server');
  }
  if (error.response?.status === 401) {
    console.log('🔒 Authentication Error - Check JWT token');
  }
  console.log('Error details:', error.response?.data || error.message);
}

console.log('=== Test Complete ===');