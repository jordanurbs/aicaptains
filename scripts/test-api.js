#!/usr/bin/env node

/**
 * Test script for the Venice AI Generate Response API
 * Usage: node scripts/test-api.js
 */

const BASE_URL = 'http://localhost:3000'

// Test data
const testCases = [
  {
    name: 'Preset Excuse Test',
    data: {
      goal: 'Build AI-powered apps',
      excuse: "I don't know where to start",
      isPresetExcuse: true
    }
  },
  {
    name: 'Custom Excuse Test',
    data: {
      goal: 'Start an online business',
      excuse: "I'm worried about failing and losing money",
      isPresetExcuse: false
    }
  },
  {
    name: 'Technical Goal Test',
    data: {
      goal: 'Learn machine learning',
      excuse: "I'm not good at math",
      isPresetExcuse: false
    }
  }
]

async function testHealthCheck() {
  console.log('🔍 Testing Health Check...')
  try {
    const response = await fetch(`${BASE_URL}/api/generate-response`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Health check passed:', data)
    } else {
      console.log('❌ Health check failed:', response.status, data)
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message)
  }
  console.log('')
}

async function testGenerateResponse(testCase) {
  console.log(`🧪 Testing: ${testCase.name}`)
  console.log(`   Goal: "${testCase.data.goal}"`)
  console.log(`   Excuse: "${testCase.data.excuse}"`)
  console.log(`   Is Preset: ${testCase.data.isPresetExcuse}`)
  
  try {
    const startTime = Date.now()
    
    const response = await fetch(`${BASE_URL}/api/generate-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.data)
    })
    
    const data = await response.json()
    const duration = Date.now() - startTime
    
    console.log(`   Status: ${response.status}`)
    console.log(`   Duration: ${duration}ms`)
    
    if (response.ok && data.success) {
      console.log('✅ Response generated successfully!')
      console.log(`   Response: "${data.response}"`)
      console.log(`   CTA: "${data.cta}"`)
    } else {
      console.log('❌ Failed to generate response')
      console.log(`   Error: ${data.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.log('❌ Request error:', error.message)
  }
  console.log('')
}

async function testRateLimit() {
  console.log('🚦 Testing Rate Limiting (sending 12 requests quickly)...')
  
  const testData = {
    goal: 'Test rate limiting',
    excuse: 'Just testing',
    isPresetExcuse: false
  }
  
  const promises = Array(12).fill().map(async (_, i) => {
    try {
      const response = await fetch(`${BASE_URL}/api/generate-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      return {
        request: i + 1,
        status: response.status,
        success: response.ok
      }
    } catch (error) {
      return {
        request: i + 1,
        status: 'ERROR',
        success: false,
        error: error.message
      }
    }
  })
  
  const results = await Promise.all(promises)
  
  const successful = results.filter(r => r.success).length
  const rateLimited = results.filter(r => r.status === 429).length
  
  console.log(`   Successful requests: ${successful}/12`)
  console.log(`   Rate limited requests: ${rateLimited}/12`)
  
  if (rateLimited > 0) {
    console.log('✅ Rate limiting is working!')
  } else {
    console.log('⚠️  Rate limiting may not be working as expected')
  }
  console.log('')
}

async function testInvalidData() {
  console.log('🚫 Testing Input Validation...')
  
  const invalidCases = [
    {
      name: 'Missing goal',
      data: { excuse: 'No goal provided', isPresetExcuse: false }
    },
    {
      name: 'Missing excuse',
      data: { goal: 'Test goal', isPresetExcuse: false }
    },
    {
      name: 'Empty strings',
      data: { goal: '', excuse: '', isPresetExcuse: false }
    },
    {
      name: 'Too long goal',
      data: { 
        goal: 'A'.repeat(201), 
        excuse: 'Test excuse', 
        isPresetExcuse: false 
      }
    }
  ]
  
  for (const testCase of invalidCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/generate-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      })
      
      const data = await response.json()
      
      if (response.status === 400) {
        console.log(`✅ ${testCase.name}: Correctly rejected (400)`)
      } else {
        console.log(`❌ ${testCase.name}: Should have been rejected but got ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: Request error -`, error.message)
    }
  }
  console.log('')
}

async function runTests() {
  console.log('🚀 Starting Venice AI API Tests...\n')
  
  // Test health check
  await testHealthCheck()
  
  // Test valid requests
  for (const testCase of testCases) {
    await testGenerateResponse(testCase)
  }
  
  // Test rate limiting
  await testRateLimit()
  
  // Test input validation
  await testInvalidData()
  
  console.log('✅ All tests completed!')
}

// Check if this script is being run directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testHealthCheck, testGenerateResponse, testRateLimit, testInvalidData }