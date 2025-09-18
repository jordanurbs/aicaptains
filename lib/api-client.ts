import { useState, useCallback } from 'react'

// Enhanced error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export interface ApiError {
  type: ErrorType
  message: string
  code?: string
  details?: any
  retryable: boolean
  timestamp: number
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Shared types for API requests and responses
export interface GenerateResponseRequest {
  goal: string
  excuse: string
  isPresetExcuse: boolean
}

export interface GenerateResponseResponse {
  success: boolean
  response?: string
  cta?: string
  error?: string
  apiError?: ApiError
}

// Health check response
export interface HealthCheckResponse {
  status: string
  timestamp: string
  service: string
}

// Retry configuration
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

// Client-side API utility
export class ApiClient {
  private static baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000'

  private static defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  }

  /**
   * Create an ApiError with proper classification
   */
  private static createApiError(
    type: ErrorType, 
    message: string, 
    code?: string, 
    details?: any,
    retryable: boolean = false
  ): ApiError {
    return {
      type,
      message,
      code,
      details,
      retryable,
      timestamp: Date.now()
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private static getRetryDelay(attempt: number, config: RetryConfig): number {
    const delay = Math.min(
      config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
      config.maxDelay
    )
    // Add jitter to avoid thundering herd
    return delay + Math.random() * 1000
  }

  /**
   * Perform HTTP request with timeout and error handling
   */
  private static async performRequest(
    url: string, 
    options: RequestInit,
    timeoutMs: number = 30000
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error: any) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw this.createApiError(
          ErrorType.TIMEOUT,
          'Request timed out. Please try again.',
          'TIMEOUT',
          { timeoutMs },
          true
        )
      }
      
      throw this.createApiError(
        ErrorType.NETWORK,
        'Network error. Please check your connection and try again.',
        'NETWORK_ERROR',
        error,
        true
      )
    }
  }

  /**
   * Generate a witty response based on user goal and excuse with retry logic
   */
  static async generateResponse(
    data: GenerateResponseRequest, 
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<GenerateResponseResponse> {
    const config = { ...this.defaultRetryConfig, ...retryConfig }
    let lastError: ApiError | null = null
    
    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        const response = await this.performRequest(
          `${this.baseUrl}/api/generate-response`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          // Handle specific status codes
          if (response.status === 429) {
            const rateLimitError = this.createApiError(
              ErrorType.RATE_LIMIT,
              'Too many requests. Please try again in a minute.',
              'RATE_LIMIT_EXCEEDED',
              { status: response.status, ...errorData },
              false // Rate limiting errors are not retryable
            )
            
            return {
              success: false,
              error: rateLimitError.message,
              apiError: rateLimitError
            }
          }
          
          if (response.status === 400) {
            const validationError = this.createApiError(
              ErrorType.VALIDATION,
              errorData.error || 'Invalid request data',
              'VALIDATION_ERROR',
              { status: response.status, ...errorData },
              false // Validation errors are not retryable
            )
            
            return {
              success: false,
              error: validationError.message,
              apiError: validationError
            }
          }
          
          if (response.status >= 500) {
            const serverError = this.createApiError(
              ErrorType.SERVER,
              'Server error. Please try again later.',
              'SERVER_ERROR',
              { status: response.status, ...errorData },
              true // Server errors are retryable
            )
            
            lastError = serverError
            
            // Don't retry on last attempt
            if (attempt <= config.maxRetries) {
              await this.sleep(this.getRetryDelay(attempt, config))
              continue
            }
          }

          const unknownError = this.createApiError(
            ErrorType.UNKNOWN,
            `Request failed with status ${response.status}`,
            'UNKNOWN_ERROR',
            { status: response.status, ...errorData },
            response.status >= 500
          )
          
          return {
            success: false,
            error: unknownError.message,
            apiError: unknownError
          }
        }

        const result: GenerateResponseResponse = await response.json()
        return result

      } catch (error: any) {
        if (error && typeof error === 'object' && 'type' in error && 'retryable' in error) {
          // This looks like an ApiError
          lastError = error as ApiError

          if (error.retryable && attempt <= config.maxRetries) {
            await this.sleep(this.getRetryDelay(attempt, config))
            continue
          }

          return {
            success: false,
            error: error.message,
            apiError: error as ApiError
          }
        }
        
        // Unexpected error
        const unexpectedError = this.createApiError(
          ErrorType.UNKNOWN,
          'An unexpected error occurred',
          'UNEXPECTED_ERROR',
          error,
          true
        )
        
        lastError = unexpectedError
        
        if (attempt <= config.maxRetries) {
          await this.sleep(this.getRetryDelay(attempt, config))
          continue
        }
      }
    }
    
    // All retries exhausted
    return {
      success: false,
      error: lastError?.message || 'Request failed after multiple attempts',
      apiError: lastError || this.createApiError(
        ErrorType.UNKNOWN,
        'Request failed after multiple attempts',
        'MAX_RETRIES_EXCEEDED',
        { attempts: config.maxRetries + 1 },
        false
      )
    }
  }

  /**
   * Check API health status
   */
  static async healthCheck(): Promise<HealthCheckResponse | null> {
    try {
      const response = await this.performRequest(
        `${this.baseUrl}/api/generate-response`,
        { method: 'GET' },
        5000 // 5 second timeout for health checks
      )

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Health check failed:', error)
      return null
    }
  }

  /**
   * Test connection and validate environment
   */
  static async validateEnvironment(): Promise<{
    healthy: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []
    
    try {
      // Test health endpoint
      const health = await this.healthCheck()
      if (!health) {
        errors.push('Health check failed - API may be down')
      }
      
      // Test with minimal valid request
      const testResponse = await this.generateResponse(
        {
          goal: 'Test goal',
          excuse: 'Test excuse for validation',
          isPresetExcuse: false
        },
        { maxRetries: 1 } // Only one retry for validation
      )
      
      if (!testResponse.success && testResponse.apiError?.type === ErrorType.VALIDATION) {
        warnings.push('API validation is working but may have strict requirements')
      } else if (!testResponse.success && testResponse.apiError?.type !== ErrorType.RATE_LIMIT) {
        errors.push(`API test failed: ${testResponse.error}`)
      }
      
    } catch (error) {
      errors.push(`Environment validation failed: ${error}`)
    }
    
    return {
      healthy: errors.length === 0,
      errors,
      warnings
    }
  }
}

// React hook for generating responses with comprehensive error handling
export function useGenerateResponse() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<ApiError | null>(null)
  const [lastResponse, setLastResponse] = useState<GenerateResponseResponse | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const generateResponse = useCallback(async (
    data: GenerateResponseRequest,
    retryConfig?: Partial<RetryConfig>
  ) => {
    setIsLoading(true)
    setError(null)
    setApiError(null)
    setIsRetrying(false)
    
    try {
      const result = await ApiClient.generateResponse(data, retryConfig)
      setLastResponse(result)
      
      if (!result.success) {
        setError(result.error || 'Unknown error occurred')
        setApiError(result.apiError || null)
      }
      
      return result
    } catch (err: any) {
      const errorMessage = 'An unexpected error occurred'
      const unexpectedError: ApiError = {
        type: ErrorType.UNKNOWN,
        message: errorMessage,
        details: err,
        retryable: false,
        timestamp: Date.now()
      }
      
      setError(errorMessage)
      setApiError(unexpectedError)
      return { success: false, error: errorMessage, apiError: unexpectedError }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retry = useCallback(async (data: GenerateResponseRequest) => {
    if (!apiError?.retryable) {
      return { success: false, error: 'This error is not retryable' }
    }
    
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)
    
    const result = await generateResponse(data)
    setIsRetrying(false)
    
    return result
  }, [apiError, generateResponse])

  const clearError = useCallback(() => {
    setError(null)
    setApiError(null)
    setRetryCount(0)
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setApiError(null)
    setLastResponse(null)
    setRetryCount(0)
    setIsRetrying(false)
  }, [])

  return {
    generateResponse,
    retry,
    isLoading,
    isRetrying,
    error,
    apiError,
    lastResponse,
    retryCount,
    clearError,
    reset,
    canRetry: apiError?.retryable || false
  }
}

// Enhanced input validation utilities with detailed feedback
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: string[]
}

export const validateGoal = (goal: string): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: string[] = []
  
  if (!goal || goal.trim().length === 0) {
    errors.push({
      field: 'goal',
      message: 'Goal is required to proceed',
      code: 'GOAL_REQUIRED'
    })
  } else if (goal.trim().length < 5) {
    errors.push({
      field: 'goal',
      message: 'Goal should be at least 5 characters for better AI response',
      code: 'GOAL_TOO_SHORT'
    })
  } else if (goal.trim().length > 200) {
    errors.push({
      field: 'goal',
      message: 'Goal must be less than 200 characters',
      code: 'GOAL_TOO_LONG'
    })
  }
  
  // Check for potentially problematic content
  const trimmedGoal = goal.trim().toLowerCase()
  if (trimmedGoal.includes('<') || trimmedGoal.includes('>')) {
    warnings.push('Goal contains special characters that may be filtered')
  }
  
  if (trimmedGoal.length < 20) {
    warnings.push('More specific goals typically get better AI responses')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateExcuse = (excuse: string): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: string[] = []
  
  if (!excuse || excuse.trim().length === 0) {
    errors.push({
      field: 'excuse',
      message: 'Please select an excuse or write your own',
      code: 'EXCUSE_REQUIRED'
    })
  } else if (excuse.trim().length < 10) {
    errors.push({
      field: 'excuse',
      message: 'Please provide at least 10 characters for a meaningful response',
      code: 'EXCUSE_TOO_SHORT'
    })
  } else if (excuse.trim().length > 300) {
    errors.push({
      field: 'excuse',
      message: 'Please keep your excuse under 300 characters',
      code: 'EXCUSE_TOO_LONG'
    })
  }
  
  // Check for potentially problematic content
  const trimmedExcuse = excuse.trim().toLowerCase()
  if (trimmedExcuse.includes('<') || trimmedExcuse.includes('>')) {
    warnings.push('Excuse contains special characters that may be filtered')
  }
  
  if (trimmedExcuse.length > 250) {
    warnings.push('Shorter excuses often get more focused AI responses')
  }
  
  // Encourage honesty
  if (trimmedExcuse.length >= 50 && trimmedExcuse.length <= 150) {
    warnings.push('Great length! Honest, specific excuses get the best responses')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Comprehensive form validation
export const validateForm = (data: GenerateResponseRequest): ValidationResult => {
  const goalValidation = validateGoal(data.goal)
  const excuseValidation = validateExcuse(data.excuse)
  
  return {
    isValid: goalValidation.isValid && excuseValidation.isValid,
    errors: [...goalValidation.errors, ...excuseValidation.errors],
    warnings: [...goalValidation.warnings, ...excuseValidation.warnings]
  }
}

