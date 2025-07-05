const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHelixDB() {
  try {
    console.log('Testing HelixDB connection...');
    
    // Test basic connection
    const response = await fetch('http://localhost:6969', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'hnswsearch',
        args: {
          query: [0.1, 0.2, 0.3],
          k: 5
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ HelixDB is running!');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ HelixDB responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to HelixDB:', error.message);
    console.log('Make sure HelixDB is running on http://localhost:6969');
    return false;
  }
}

testHelixDB(); 