# Venice AI Response Generator API

A production-ready API integration for generating witty, psychologically compelling responses that help users overcome excuses and take action on their goals.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Required: Venice AI API Key
VENICE_API_KEY=your_venice_api_key_here

# Optional: For production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Get your Venice AI API key:**
1. Visit [https://venice.ai/](https://venice.ai/)
2. Sign up for an account
3. Navigate to your API settings
4. Generate a new API key
5. Copy the key to your `.env.local` file

### 2. Install Dependencies

All required dependencies are already included in your `package.json`:
- `zod` - Input validation
- `next` - API routes framework

No additional packages needed!

### 3. Test the API

Start your development server:
```bash
npm run dev
```

Test the health check:
```bash
curl http://localhost:3000/api/generate-response
```

Run the comprehensive test suite:
```bash
node scripts/test-api.js
```

## 📡 API Reference

### Endpoint
```
POST /api/generate-response
```

### Request Body
```typescript
{
  goal: string,           // User's goal (1-200 characters)
  excuse: string,         // User's excuse (1-300 characters)  
  isPresetExcuse: boolean // Whether excuse was selected from presets
}
```

### Response Format
```typescript
{
  success: boolean,
  response?: string,      // Generated witty response (1-2 sentences)
  cta?: string,          // Call-to-action button text (3-6 words)
  error?: string         // Error message if request failed
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/generate-response \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build AI-powered apps",
    "excuse": "I don'\''t know where to start",
    "isPresetExcuse": true
  }'
```

### Example Response
```json
{
  "success": true,
  "response": "Every AI Captain started exactly where you are—confused but curious. The difference? They stopped making excuses and started making moves.",
  "cta": "Start Your Journey"
}
```

## 🏗️ Architecture

### API Route Structure
```
app/
├── api/
│   └── generate-response/
│       └── route.ts          # Main API handler
```

### Core Components
- **Venice AI Integration**: Uses Llama 3.1 8B model for response generation
- **Rate Limiting**: 10 requests per minute per IP address
- **Input Validation**: Zod schema validation with sanitization
- **Caching**: 24-hour in-memory cache for improved performance
- **Fallback System**: 5 high-quality fallback responses when AI unavailable
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

### Client-Side Integration
```typescript
import { ApiClient } from '@/lib/api-client'

// Generate response
const result = await ApiClient.generateResponse({
  goal: "Learn machine learning",
  excuse: "I'm not good at math",
  isPresetExcuse: false
})

if (result.success) {
  console.log('Response:', result.response)
  console.log('CTA:', result.cta)
}
```

### React Hook Usage
```typescript
import { useGenerateResponse } from '@/lib/api-client'

function MyComponent() {
  const { generateResponse, isLoading, error } = useGenerateResponse()
  
  const handleSubmit = async () => {
    const result = await generateResponse({
      goal: goalValue,
      excuse: excuseValue,
      isPresetExcuse: false
    })
    
    if (result.success) {
      // Handle success
    }
  }
}
```

## 🛡️ Security Features

### Rate Limiting
- **Limit**: 10 requests per minute per IP
- **Implementation**: In-memory storage (use Redis in production)
- **Response**: 429 status code when exceeded

### Input Validation
- **Goal**: 1-200 characters, required
- **Excuse**: 1-300 characters, required
- **Sanitization**: HTML tag removal, length limiting

### Error Handling
- **Client Errors**: 400 for invalid input, 429 for rate limiting
- **Server Errors**: 500 with generic message (no internal details exposed)
- **API Key**: Server-side only, never exposed to client

## 🎯 Prompt Engineering

The API uses a carefully crafted prompt that:

1. **Acknowledges** the user's excuse without being dismissive
2. **Reframes** it as a starting point rather than a barrier
3. **Uses psychological triggers** like social proof, urgency, curiosity
4. **Maintains tone** that's encouraging but with cheeky confidence
5. **Creates momentum** toward action

### Response Examples
- "Every AI Captain started exactly where you are—confused but curious. The difference? They stopped making excuses and started making moves."
- "That obstacle you see? It's actually the doorway to your breakthrough. The only difference between you and success is action."
- "Perfect conditions don't exist, but perfect moments do. This is yours."

## 📊 Performance Optimizations

### Caching Strategy
- **Duration**: 24 hours for identical goal/excuse combinations
- **Storage**: In-memory Map (use Redis in production)
- **Key Generation**: Normalized goal + excuse + isPresetExcuse
- **Cleanup**: Automatic cleanup of expired entries

### API Configuration
- **Model**: `llama-3.1-8b-instruct` (fast and cost-effective)
- **Max Tokens**: 300 (sufficient for response + CTA)
- **Temperature**: 0.8 (creative but consistent)
- **Top P**: 0.9 (good balance of creativity and coherence)

## 🧪 Testing

### Comprehensive Test Suite
Run the full test suite to verify all functionality:

```bash
node scripts/test-api.js
```

**Tests include:**
- Health check endpoint
- Valid request generation
- Rate limiting verification
- Input validation testing
- Error handling validation

### Manual Testing
```bash
# Health check
curl http://localhost:3000/api/generate-response

# Generate response
curl -X POST http://localhost:3000/api/generate-response \
  -H "Content-Type: application/json" \
  -d '{"goal":"Test","excuse":"Testing","isPresetExcuse":false}'

# Test rate limiting (run 12 times quickly)
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/generate-response \
    -H "Content-Type: application/json" \
    -d '{"goal":"Test","excuse":"Testing","isPresetExcuse":false}' &
done
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Required
VENICE_API_KEY=your_production_api_key

# Recommended for production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Production Considerations

1. **Redis Caching**: Replace in-memory cache with Redis
2. **Database Rate Limiting**: Replace Map with database storage
3. **Monitoring**: Add request logging and monitoring
4. **CORS**: Configure CORS if needed for cross-domain requests
5. **API Key Rotation**: Implement key rotation strategy

### Example Redis Integration
```typescript
// For production, replace in-memory cache with Redis
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Cache implementation
await redis.setex(cacheKey, 86400, JSON.stringify(result)) // 24 hours
const cached = await redis.get(cacheKey)
```

## 🔧 Customization

### Modify Response Style
Edit the prompt in `/app/api/generate-response/route.ts`:

```typescript
const prompt = `You are a witty, psychologically compelling AI coach...`
```

### Add Custom Fallbacks
Modify the `getFallbackResponse` function to add your own fallback responses:

```typescript
const fallbackResponses = [
  {
    response: "Your custom response here...",
    cta: "Custom CTA"
  },
  // Add more...
]
```

### Adjust Rate Limits
Modify rate limiting parameters:

```typescript
const windowMs = 60 * 1000 // 1 minute
const maxRequests = 10     // 10 requests per minute
```

## 📈 Monitoring & Analytics

### Request Logging
All requests are logged with:
- Timestamp
- Client IP
- Goal and excuse (sanitized)
- Response time
- Cache hit/miss status

### Key Metrics to Track
- **Request volume** per hour/day
- **Cache hit rate** (should be >30% for cost efficiency)
- **Error rate** (should be <1%)
- **Response time** (should be <2 seconds)
- **Rate limit violations** (indicates potential abuse)

## 🆘 Troubleshooting

### Common Issues

**"Venice API key not configured"**
- Ensure `VENICE_API_KEY` is set in `.env.local`
- Restart your development server after adding the key

**Rate limiting too aggressive**
- Adjust `maxRequests` in the rate limiting function
- Consider implementing user-based instead of IP-based limiting

**Slow response times**
- Check Venice AI API status
- Verify cache hit rate
- Consider reducing `max_tokens` in API call

**Fallback responses always used**
- Check Venice API key validity
- Verify API endpoint URL
- Check network connectivity

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## 📋 Todo / Future Enhancements

- [ ] Redis integration for production caching
- [ ] User-based rate limiting with authentication
- [ ] Response analytics and A/B testing
- [ ] Multiple AI model fallbacks
- [ ] Custom response templates per goal category
- [ ] Webhook notifications for admin monitoring
- [ ] Response quality feedback system

---

## 🤝 Contributing

When modifying this API:

1. Maintain backward compatibility
2. Add tests for new functionality
3. Update this documentation
4. Follow security best practices
5. Test rate limiting thoroughly

## 📄 License

This API integration is part of the AI Captains Academy project.