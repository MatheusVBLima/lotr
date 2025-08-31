// Test file to check API directly
export async function testAPI() {
  const token = process.env.THE_ONE_API_TOKEN
  const baseUrl = process.env.THE_ONE_API_BASE_URL || 'https://the-one-api.dev/v2'
  
  console.log('🧪 Testing API directly')
  console.log('Token available:', !!token)
  console.log('Base URL:', baseUrl)
  
  if (!token) {
    console.error('❌ No token found in environment variables')
    return
  }
  
  try {
    const response = await fetch(`${baseUrl}/character?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response status:', response.status, response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Test successful:', data.docs?.length, 'characters received')
      return data
    } else {
      const error = await response.text()
      console.error('❌ API Test failed:', error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}