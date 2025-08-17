// Simple localStorage test utility
// You can run this in the browser console to test localStorage functionality

console.log('🧪 Testing localStorage functionality...');

// Test 1: Basic write/read
try {
  localStorage.setItem('test_key', 'test_value');
  const retrieved = localStorage.getItem('test_key');
  console.log('✅ Basic localStorage test:', retrieved === 'test_value' ? 'PASSED' : 'FAILED');
  localStorage.removeItem('test_key');
} catch (e) {
  console.error('❌ Basic localStorage test FAILED:', e);
}

// Test 2: JSON write/read
try {
  const testData = { id: 'test', value: 123 };
  localStorage.setItem('test_json', JSON.stringify(testData));
  const retrievedJson = JSON.parse(localStorage.getItem('test_json'));
  console.log('✅ JSON localStorage test:', retrievedJson.id === 'test' ? 'PASSED' : 'FAILED');
  localStorage.removeItem('test_json');
} catch (e) {
  console.error('❌ JSON localStorage test FAILED:', e);
}

// Test 3: Check existing Zenith data
console.log('🔍 Checking existing Zenith data:');
const policies = localStorage.getItem('ZENITH_POLICIES');
const activities = localStorage.getItem('ZENITH_ACTIVITIES');
const claims = localStorage.getItem('ZENITH_CLAIMS');

console.log('📋 ZENITH_POLICIES:', policies);
console.log('🏃 ZENITH_ACTIVITIES:', activities);
console.log('💰 ZENITH_CLAIMS:', claims);

if (policies) {
  try {
    const parsedPolicies = JSON.parse(policies);
    console.log('📦 Parsed policies count:', parsedPolicies.length);
    console.log('📊 Policies data:', parsedPolicies);
  } catch (e) {
    console.error('❌ Error parsing policies:', e);
  }
}

// Test 4: Simulate policy creation
console.log('🧪 Simulating policy creation...');
try {
  const testPolicy = {
    id: `test_policy_${Date.now()}`,
    user_wallet_address: '0x1234567890abcdef',
    policy_type: 'test',
    premium: 100,
    coverage: 1000,
    duration: 365,
    purchase_date: new Date().toISOString(),
    status: 'active',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const existingPolicies = policies ? JSON.parse(policies) : [];
  existingPolicies.push(testPolicy);
  localStorage.setItem('ZENITH_POLICIES', JSON.stringify(existingPolicies));
  
  console.log('✅ Test policy created successfully');
  console.log('📊 New policy count:', existingPolicies.length);
  
  // Clean up
  const finalPolicies = JSON.parse(localStorage.getItem('ZENITH_POLICIES'));
  const filteredPolicies = finalPolicies.filter(p => !p.id.startsWith('test_policy_'));
  localStorage.setItem('ZENITH_POLICIES', JSON.stringify(filteredPolicies));
  console.log('🧹 Cleaned up test policy');
  
} catch (e) {
  console.error('❌ Policy simulation FAILED:', e);
}

console.log('🏁 LocalStorage test complete!');
