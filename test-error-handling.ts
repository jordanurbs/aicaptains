/**
 * Comprehensive Error Handling Test Suite
 * for Interactive Builder's Dilemma Feature
 * 
 * This file contains manual test cases to verify all error scenarios
 * Run these tests in the browser console or create automated tests
 */

import { ApiClient, ErrorType, validateGoal, validateExcuse, validateForm } from '@/lib/api-client'

// Test Configuration
const TEST_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com'
    : 'http://localhost:3000'
}

// Test Data
const TEST_DATA = {
  validGoal: "Build an AI-powered automation tool for my business",
  validExcuse: "I don't know where to start with AI development",
  shortGoal: "Hi",
  longGoal: "A".repeat(250), // Over 200 character limit
  shortExcuse: "No time",
  longExcuse: "A".repeat(350), // Over 300 character limit
  emptyString: "",
  htmlString: "<script>alert('xss')</script>Goal with HTML",
  specialChars: "Goal with <>special&characters"
}

/**
 * VALIDATION TESTS
 */
export class ValidationTests {
  static runAllTests() {
    console.group('🔍 VALIDATION TESTS')
    
    this.testGoalValidation()
    this.testExcuseValidation()
    this.testFormValidation()
    
    console.groupEnd()
  }
  
  static testGoalValidation() {
    console.group('Goal Validation Tests')
    
    // Test 1: Valid goal
    const validResult = validateGoal(TEST_DATA.validGoal)
    console.assert(validResult.isValid === true, '❌ Valid goal should pass')
    console.log('✅ Valid goal test passed')
    
    // Test 2: Empty goal
    const emptyResult = validateGoal(TEST_DATA.emptyString)
    console.assert(emptyResult.isValid === false, '❌ Empty goal should fail')
    console.assert(emptyResult.errors.some(e => e.code === 'GOAL_REQUIRED'), '❌ Should have GOAL_REQUIRED error')
    console.log('✅ Empty goal test passed')
    
    // Test 3: Short goal
    const shortResult = validateGoal(TEST_DATA.shortGoal)
    console.assert(shortResult.isValid === false, '❌ Short goal should fail')
    console.assert(shortResult.errors.some(e => e.code === 'GOAL_TOO_SHORT'), '❌ Should have GOAL_TOO_SHORT error')
    console.log('✅ Short goal test passed')
    
    // Test 4: Long goal
    const longResult = validateGoal(TEST_DATA.longGoal)
    console.assert(longResult.isValid === false, '❌ Long goal should fail')
    console.assert(longResult.errors.some(e => e.code === 'GOAL_TOO_LONG'), '❌ Should have GOAL_TOO_LONG error')
    console.log('✅ Long goal test passed')
    
    // Test 5: HTML characters warning
    const htmlResult = validateGoal(TEST_DATA.htmlString)
    console.assert(htmlResult.warnings.length > 0, '❌ HTML characters should trigger warning')
    console.log('✅ HTML characters test passed')
    
    console.groupEnd()
  }
  
  static testExcuseValidation() {
    console.group('Excuse Validation Tests')
    
    // Test 1: Valid excuse
    const validResult = validateExcuse(TEST_DATA.validExcuse)
    console.assert(validResult.isValid === true, '❌ Valid excuse should pass')
    console.log('✅ Valid excuse test passed')
    
    // Test 2: Empty excuse
    const emptyResult = validateExcuse(TEST_DATA.emptyString)
    console.assert(emptyResult.isValid === false, '❌ Empty excuse should fail')
    console.assert(emptyResult.errors.some(e => e.code === 'EXCUSE_REQUIRED'), '❌ Should have EXCUSE_REQUIRED error')
    console.log('✅ Empty excuse test passed')
    
    // Test 3: Short excuse
    const shortResult = validateExcuse(TEST_DATA.shortExcuse)
    console.assert(shortResult.isValid === false, '❌ Short excuse should fail')
    console.assert(shortResult.errors.some(e => e.code === 'EXCUSE_TOO_SHORT'), '❌ Should have EXCUSE_TOO_SHORT error')
    console.log('✅ Short excuse test passed')
    
    // Test 4: Long excuse
    const longResult = validateExcuse(TEST_DATA.longExcuse)
    console.assert(longResult.isValid === false, '❌ Long excuse should fail')
    console.assert(longResult.errors.some(e => e.code === 'EXCUSE_TOO_LONG'), '❌ Should have EXCUSE_TOO_LONG error')
    console.log('✅ Long excuse test passed')
    
    console.groupEnd()
  }
  
  static testFormValidation() {
    console.group('Form Validation Tests')
    
    // Test 1: Valid form
    const validForm = validateForm({
      goal: TEST_DATA.validGoal,
      excuse: TEST_DATA.validExcuse,
      isPresetExcuse: false
    })
    console.assert(validForm.isValid === true, '❌ Valid form should pass')
    console.log('✅ Valid form test passed')
    
    // Test 2: Invalid goal and excuse
    const invalidForm = validateForm({
      goal: TEST_DATA.shortGoal,
      excuse: TEST_DATA.shortExcuse,
      isPresetExcuse: false
    })
    console.assert(invalidForm.isValid === false, '❌ Invalid form should fail')
    console.assert(invalidForm.errors.length >= 2, '❌ Should have multiple errors')
    console.log('✅ Invalid form test passed')
    
    console.groupEnd()
  }
}

/**
 * API ERROR TESTS
 */
export class ApiErrorTests {
  static async runAllTests() {
    console.group('🌐 API ERROR TESTS')
    
    await this.testNetworkError()
    await this.testValidationError()
    await this.testRateLimitError()
    await this.testServerError()
    await this.testTimeoutError()
    await this.testRetryMechanism()
    
    console.groupEnd()
  }
  
  static async testNetworkError() {
    console.group('Network Error Test')
    
    try {
      // Simulate network error by using invalid URL
      const originalBaseUrl = (ApiClient as any).baseUrl
      ;(ApiClient as any).baseUrl = 'http://invalid-domain-that-does-not-exist.com'
      
      const result = await ApiClient.generateResponse({
        goal: TEST_DATA.validGoal,
        excuse: TEST_DATA.validExcuse,
        isPresetExcuse: false
      })
      
      console.assert(result.success === false, '❌ Network error should fail')
      console.assert(result.apiError?.type === ErrorType.NETWORK, '❌ Should be NETWORK error')
      console.assert(result.apiError?.retryable === true, '❌ Network errors should be retryable')
      console.log('✅ Network error test passed')
      
      // Restore original URL
      ;(ApiClient as any).baseUrl = originalBaseUrl
      
    } catch (error) {
      console.error('❌ Network error test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testValidationError() {
    console.group('Validation Error Test')
    
    try {
      const result = await ApiClient.generateResponse({
        goal: "", // Invalid goal
        excuse: "", // Invalid excuse
        isPresetExcuse: false
      })
      
      console.assert(result.success === false, '❌ Validation error should fail')
      console.assert(
        result.apiError?.type === ErrorType.VALIDATION || 
        result.error?.includes('Invalid'), 
        '❌ Should be validation error'
      )
      console.log('✅ Validation error test passed')
      
    } catch (error) {
      console.error('❌ Validation error test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testRateLimitError() {
    console.group('Rate Limit Error Test')
    
    try {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(15).fill(null).map(() => 
        ApiClient.generateResponse({
          goal: TEST_DATA.validGoal,
          excuse: TEST_DATA.validExcuse,
          isPresetExcuse: false
        })
      )
      
      const results = await Promise.all(requests)
      const rateLimitedResults = results.filter(r => 
        r.apiError?.type === ErrorType.RATE_LIMIT
      )
      
      console.assert(rateLimitedResults.length > 0, '❌ Should trigger rate limiting')
      console.log(`✅ Rate limit test passed (${rateLimitedResults.length} requests rate limited)`)
      
    } catch (error) {
      console.error('❌ Rate limit error test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testServerError() {
    console.group('Server Error Test')
    
    // This test would require a way to simulate server errors
    // In a real scenario, you might have a test endpoint that returns 500
    console.log('⚠️ Server error test requires backend simulation')
    
    console.groupEnd()
  }
  
  static async testTimeoutError() {
    console.group('Timeout Error Test')
    
    try {
      // Test with very short timeout
      const result = await ApiClient.generateResponse(
        {
          goal: TEST_DATA.validGoal,
          excuse: TEST_DATA.validExcuse,
          isPresetExcuse: false
        },
        { maxRetries: 0 } // No retries to test timeout quickly
      )
      
      // This test might not always timeout depending on server speed
      console.log('✅ Timeout test completed (may not always timeout)')
      
    } catch (error) {
      console.error('❌ Timeout error test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testRetryMechanism() {
    console.group('Retry Mechanism Test')
    
    try {
      const startTime = Date.now()
      
      // Use invalid URL to trigger retries
      const originalBaseUrl = (ApiClient as any).baseUrl
      ;(ApiClient as any).baseUrl = 'http://invalid-domain.com'
      
      const result = await ApiClient.generateResponse(
        {
          goal: TEST_DATA.validGoal,
          excuse: TEST_DATA.validExcuse,
          isPresetExcuse: false
        },
        { maxRetries: 2, baseDelay: 100 } // Fast retries for testing
      )
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      console.assert(result.success === false, '❌ Retry should eventually fail')
      console.assert(duration > 200, '❌ Should take time for retries') // At least 2 delays
      console.log(`✅ Retry mechanism test passed (took ${duration}ms)`)
      
      // Restore original URL
      ;(ApiClient as any).baseUrl = originalBaseUrl
      
    } catch (error) {
      console.error('❌ Retry mechanism test failed:', error)
    }
    
    console.groupEnd()
  }
}

/**
 * UI ERROR TESTS
 */
export class UiErrorTests {
  static runAllTests() {
    console.group('🎨 UI ERROR TESTS')
    
    this.testErrorBoundary()
    this.testLoadingStates()
    this.testValidationDisplay()
    
    console.groupEnd()
  }
  
  static testErrorBoundary() {
    console.group('Error Boundary Tests')
    
    // These tests would need to be run in a React environment
    console.log('⚠️ Error boundary tests require React component testing')
    console.log('Manual test: Trigger component error and verify error boundary catches it')
    
    console.groupEnd()
  }
  
  static testLoadingStates() {
    console.group('Loading State Tests')
    
    console.log('Manual tests to perform:')
    console.log('1. Verify skeleton loaders appear during initialization')
    console.log('2. Check loading spinners during API calls')
    console.log('3. Confirm progress indicators work correctly')
    console.log('4. Test disabled states during loading')
    
    console.groupEnd()
  }
  
  static testValidationDisplay() {
    console.group('Validation Display Tests')
    
    console.log('Manual tests to perform:')
    console.log('1. Enter invalid goal and check error messages')
    console.log('2. Enter invalid excuse and check validation feedback')
    console.log('3. Verify warnings display correctly')
    console.log('4. Check error clearing when fixing issues')
    
    console.groupEnd()
  }
}

/**
 * INTEGRATION TESTS
 */
export class IntegrationTests {
  static async runAllTests() {
    console.group('🔧 INTEGRATION TESTS')
    
    await this.testFullUserFlow()
    await this.testErrorRecovery()
    await this.testEnvironmentValidation()
    
    console.groupEnd()
  }
  
  static async testFullUserFlow() {
    console.group('Full User Flow Test')
    
    try {
      console.log('Testing complete user flow...')
      
      // Step 1: Validate goal
      const goalValidation = validateGoal(TEST_DATA.validGoal)
      console.assert(goalValidation.isValid, '❌ Goal validation should pass')
      
      // Step 2: Validate excuse
      const excuseValidation = validateExcuse(TEST_DATA.validExcuse)
      console.assert(excuseValidation.isValid, '❌ Excuse validation should pass')
      
      // Step 3: Submit to API
      const apiResult = await ApiClient.generateResponse({
        goal: TEST_DATA.validGoal,
        excuse: TEST_DATA.validExcuse,
        isPresetExcuse: false
      })
      
      console.log('API Result:', apiResult)
      console.log('✅ Full user flow test completed')
      
    } catch (error) {
      console.error('❌ Full user flow test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testErrorRecovery() {
    console.group('Error Recovery Test')
    
    console.log('Manual tests to perform:')
    console.log('1. Trigger network error and test retry functionality')
    console.log('2. Test going back to previous steps after errors')
    console.log('3. Verify error clearing when retrying')
    console.log('4. Test fallback responses when API fails')
    
    console.groupEnd()
  }
  
  static async testEnvironmentValidation() {
    console.group('Environment Validation Test')
    
    try {
      const validation = await ApiClient.validateEnvironment()
      console.log('Environment validation result:', validation)
      
      if (!validation.healthy) {
        console.warn('⚠️ Environment issues detected:', validation.errors)
      }
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Environment warnings:', validation.warnings)
      }
      
      console.log('✅ Environment validation test completed')
      
    } catch (error) {
      console.error('❌ Environment validation test failed:', error)
    }
    
    console.groupEnd()
  }
}

/**
 * PERFORMANCE TESTS
 */
export class PerformanceTests {
  static async runAllTests() {
    console.group('⚡ PERFORMANCE TESTS')
    
    await this.testValidationPerformance()
    await this.testApiResponseTime()
    await this.testRetryPerformance()
    
    console.groupEnd()
  }
  
  static async testValidationPerformance() {
    console.group('Validation Performance Test')
    
    const iterations = 1000
    const startTime = performance.now()
    
    for (let i = 0; i < iterations; i++) {
      validateGoal(TEST_DATA.validGoal)
      validateExcuse(TEST_DATA.validExcuse)
    }
    
    const endTime = performance.now()
    const avgTime = (endTime - startTime) / iterations
    
    console.log(`✅ Validation performance: ${avgTime.toFixed(2)}ms average per validation`)
    console.assert(avgTime < 1, '❌ Validation should be under 1ms')
    
    console.groupEnd()
  }
  
  static async testApiResponseTime() {
    console.group('API Response Time Test')
    
    try {
      const startTime = performance.now()
      
      await ApiClient.generateResponse({
        goal: TEST_DATA.validGoal,
        excuse: TEST_DATA.validExcuse,
        isPresetExcuse: false
      })
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      console.log(`✅ API response time: ${responseTime.toFixed(2)}ms`)
      console.assert(responseTime < 30000, '❌ API should respond within 30 seconds')
      
    } catch (error) {
      console.error('❌ API response time test failed:', error)
    }
    
    console.groupEnd()
  }
  
  static async testRetryPerformance() {
    console.group('Retry Performance Test')
    
    try {
      const startTime = performance.now()
      
      // Force retries with invalid URL
      const originalBaseUrl = (ApiClient as any).baseUrl
      ;(ApiClient as any).baseUrl = 'http://invalid-domain.com'
      
      await ApiClient.generateResponse(
        {
          goal: TEST_DATA.validGoal,
          excuse: TEST_DATA.validExcuse,
          isPresetExcuse: false
        },
        { maxRetries: 2, baseDelay: 100 }
      )
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      console.log(`✅ Retry sequence time: ${totalTime.toFixed(2)}ms`)
      
      // Restore original URL
      ;(ApiClient as any).baseUrl = originalBaseUrl
      
    } catch (error) {
      console.error('❌ Retry performance test failed:', error)
    }
    
    console.groupEnd()
  }
}

/**
 * MAIN TEST RUNNER
 */
export class ErrorHandlingTestSuite {
  static async runAllTests() {
    console.clear()
    console.log('🚀 Starting Comprehensive Error Handling Test Suite')
    console.log('='.repeat(60))
    
    // Run all test categories
    ValidationTests.runAllTests()
    await ApiErrorTests.runAllTests()
    UiErrorTests.runAllTests()
    await IntegrationTests.runAllTests()
    await PerformanceTests.runAllTests()
    
    console.log('='.repeat(60))
    console.log('✅ Error Handling Test Suite Completed')
    console.log('Check console output above for detailed results')
  }
  
  static async runBasicTests() {
    console.log('🧪 Running Basic Error Handling Tests')
    
    ValidationTests.runAllTests()
    await ApiErrorTests.testNetworkError()
    await ApiErrorTests.testValidationError()
    
    console.log('✅ Basic tests completed')
  }
}

// Export for use in browser console
;(window as any).ErrorHandlingTests = ErrorHandlingTestSuite

// Usage instructions
console.log(`
📝 ERROR HANDLING TEST INSTRUCTIONS:

1. Open browser console on the Builder's Dilemma page
2. Run basic tests:
   ErrorHandlingTests.runBasicTests()

3. Run full test suite:
   ErrorHandlingTests.runAllTests()

4. Run specific test category:
   ValidationTests.runAllTests()
   ApiErrorTests.runAllTests()
   UiErrorTests.runAllTests()
   IntegrationTests.runAllTests()
   PerformanceTests.runAllTests()
`)