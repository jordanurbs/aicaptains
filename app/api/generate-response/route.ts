import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Simple in-memory cache for responses (in production, use Redis)
const responseCache = new Map<string, { response: string; cta: string; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

// Enhanced request validation schema
const GenerateResponseSchema = z.object({
  goal: z.string()
    .min(1, 'Goal is required')
    .max(200, 'Goal must be less than 200 characters')
    .refine(val => val.trim().length >= 5, 'Goal must be at least 5 characters'),
  excuse: z.string()
    .min(1, 'Excuse is required')
    .max(300, 'Excuse must be less than 300 characters')
    .refine(val => val.trim().length >= 10, 'Excuse must be at least 10 characters'),
  isPresetExcuse: z.boolean()
})

// Response interfaces
interface GenerateResponseRequest {
  goal: string
  excuse: string
  isPresetExcuse: boolean
}

interface GenerateResponseResponse {
  success: boolean
  response?: string
  cta?: string
  error?: string
}

interface VeniceAPIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10

  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (userLimit.count >= maxRequests) {
    return false
  }
  
  userLimit.count++
  return true
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return (request as any).ip || 'unknown'
}

// Generate cache key for responses
function getCacheKey(goal: string, excuse: string, isPresetExcuse: boolean): string {
  return `${goal.toLowerCase().trim()}|${excuse.toLowerCase().trim()}|${isPresetExcuse}`
}

// Clean expired cache entries
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      responseCache.delete(key)
    }
  }
}

// Generate witty response using Venice AI with retry logic
async function generateWittyResponse(goal: string, excuse: string, isPresetExcuse: boolean): Promise<{ response: string; cta: string }> {
  // Check cache first
  const cacheKey = getCacheKey(goal, excuse, isPresetExcuse)
  const cached = responseCache.get(cacheKey)

  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('Cache hit for request:', cacheKey.substring(0, 50) + '...')
    return { response: cached.response, cta: cached.cta }
  }

  const veniceApiKey = process.env.VENICE_API_KEY

  if (!veniceApiKey) {
    throw new Error('AI_CONFIG_MISSING: Venice AI service is not configured. Please check your environment setup.')
  }

  // Retry logic for network issues
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await attemptVeniceAPICall(veniceApiKey, goal, excuse, isPresetExcuse, cacheKey, attempt)
    } catch (error) {
      lastError = error as Error

      // If it's a DNS/network error and we have retries left, wait and retry
      if (attempt < maxRetries && (
        error instanceof TypeError && error.message.includes('fetch failed') ||
        error instanceof Error && error.message.includes('ENOTFOUND') ||
        error instanceof Error && error.message.includes('network')
      )) {
        console.log(`Venice AI API attempt ${attempt} failed, retrying in ${attempt * 1000}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000))
        continue
      }

      // For other errors or final retry, break and handle below
      break
    }
  }

  // If all retries failed, log and return fallback
  console.error(`Venice AI API failed after ${maxRetries} attempts:`, lastError)
  return getFallbackResponse(goal, excuse)
}

// Separate function for API call attempt
async function attemptVeniceAPICall(
  veniceApiKey: string,
  goal: string,
  excuse: string,
  isPresetExcuse: boolean,
  cacheKey: string,
  attempt: number
): Promise<{ response: string; cta: string }> {

  const prompt = `You are Captain Jax, a witty naval AI coach helping people overcome excuses and achieve their goals.

Goal: "${goal}"
Excuse: "${excuse}"

Respond with ONLY a JSON object, no other text, in exactly this format:
{
  "response": "1-2 sentences acknowledging their excuse and reframing it as opportunity to achieve their goal",
  "cta": "2-5 word action phrase"
}

Use a tone that's encouraging yet confident, like: "Every captain started as a confused recruit. The difference? They chose action over excuses. NOW GO GET EM SAILOR!"

Return ONLY the JSON, nothing else.`

  console.log(`Venice AI API attempt ${attempt} starting...`)

  const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${veniceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.2-3b:strip_thinking_response=true&disable_thinking=true',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 1,
      top_p: 0.9
    }),
    signal: AbortSignal.timeout(15000) // 15 second timeout
  })

  if (!response.ok) {
    throw new Error(`Venice API error: ${response.status} ${response.statusText}`)
  }

  const data: VeniceAPIResponse = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content received from Venice AI')
  }

  // Parse the JSON response from the AI
  console.log('Raw Venice AI response:', content)

  try {
    let parsed

    // Simple direct parse - Venice AI should return clean JSON
    try {
      parsed = JSON.parse(content)
      console.log('Successfully parsed JSON from Venice AI')
    } catch (parseError) {
      console.log('Direct parse failed, error:', parseError.message)

      // Fallback: Try extracting fields manually if JSON is incomplete
      const responseMatch = content.match(/"response"\s*:\s*"([^"]*)"/)
      const ctaMatch = content.match(/"cta"\s*:\s*"([^"]*)"/)

      if (responseMatch && ctaMatch) {
        parsed = {
          response: responseMatch[1],
          cta: ctaMatch[1]
        }
        console.log('Manually constructed JSON from extracted fields')
      } else {
        throw new Error('Could not extract response and cta fields from content')
      }
    }

    if (parsed.response && parsed.cta) {
      const result = {
        response: parsed.response.trim(),
        cta: parsed.cta.trim()
      }

      // Cache the result
      responseCache.set(cacheKey, {
        ...result,
        timestamp: Date.now()
      })

      // Clean expired entries periodically
      if (Math.random() < 0.1) { // 10% chance
        cleanExpiredCache()
      }

      console.log(`Venice AI API attempt ${attempt} succeeded with response:`, result)
      return result
    } else {
      throw new Error('Response missing required fields')
    }
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError)
    console.error('Content that failed to parse:', content)

    // Don't throw here - let it retry or fall back
    throw new Error('Invalid JSON response from Venice AI: ' + (parseError as Error).message)
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(goal: string, excuse: string): { response: string; cta: string } {
  const fallbackResponses = [
    {
      response: "Every expert was once a beginner who refused to give up. Your excuse is just your starting point, not your ceiling.",
      cta: "Start Your Journey"
    },
    {
      response: "That obstacle you see? It's actually the doorway to your breakthrough. The only difference between you and success is action.",
      cta: "Take Action Now"
    },
    {
      response: "Perfect conditions don't exist, but perfect moments do. This is yours.",
      cta: "Seize This Moment"
    },
    {
      response: "The path forward becomes clear only after you take the first step. Ready to see what's possible?",
      cta: "Begin Today"
    },
    {
      response: "Your excuse is valid, but so is your potential. Which one will you choose to nurture?",
      cta: "Choose Growth"
    }
  ]

  // Simple hash function to consistently pick same fallback for same input
  const hash = (goal + excuse).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % fallbackResponses.length
  
  return fallbackResponses[index]
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let requestData: GenerateResponseRequest
    try {
      const body = await request.json()
      requestData = GenerateResponseSchema.parse(body)
    } catch (error) {
      console.error('Validation error:', error)
      
      let errorMessage = 'Invalid request data'
      if (error instanceof z.ZodError) {
        errorMessage = error.errors.map(e => e.message).join(', ')
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: error instanceof z.ZodError ? error.errors : undefined
        },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedGoal = sanitizeInput(requestData.goal)
    const sanitizedExcuse = sanitizeInput(requestData.excuse)

    // Log request for debugging (remove in production)
    console.log(`[${new Date().toISOString()}] Generate Response Request:`, {
      ip: clientIP,
      goal: sanitizedGoal,
      excuse: sanitizedExcuse,
      isPresetExcuse: requestData.isPresetExcuse
    })

    // Generate response
    const { response, cta } = await generateWittyResponse(
      sanitizedGoal,
      sanitizedExcuse,
      requestData.isPresetExcuse
    )

    const result: GenerateResponseResponse = {
      success: true,
      response,
      cta
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)

    // Provide specific error messages for common issues
    let errorMessage = 'Something went wrong. Please try again later.'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('AI_CONFIG_MISSING')) {
        errorMessage = 'AI Captain transmission failed - service not configured. Please check back later!'
        statusCode = 503 // Service Unavailable
      } else if (error.message.includes('Venice API error')) {
        errorMessage = 'AI Captain is temporarily offline. Please try again in a moment.'
        statusCode = 503
      } else if (error.message.includes('No content received')) {
        errorMessage = 'AI Captain response was incomplete. Please try again.'
        statusCode = 502
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'generate-response'
    },
    { status: 200 }
  )
}