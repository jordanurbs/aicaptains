'use client'

import { ResponseGenerator } from '@/components/response-generator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap, Shield, Clock, Brain } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const handleResponseGenerated = (response: string, cta: string) => {
    console.log('Response generated:', { response, cta })
    // You could trigger analytics, show a modal, etc.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Venice AI Response Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any excuse into motivation with our AI-powered response system.
              Built for the AI Captains Academy.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-gray-600">Venice AI with Llama 3.1</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Sub-2 second responses</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Rate Limited</h3>
                <p className="text-sm text-gray-600">10 requests per minute</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Cached</h3>
                <p className="text-sm text-gray-600">24-hour response cache</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Generator */}
        <ResponseGenerator 
          onResponseGenerated={handleResponseGenerated}
          className="mb-8"
        />

        {/* API Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint</CardTitle>
              <CardDescription>
                Integrate this response generator into your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-md p-4 mb-4">
                <code className="text-sm">POST /api/generate-response</code>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Request Body:</h4>
                <pre className="bg-gray-100 rounded-md p-3 text-xs overflow-x-auto">
{`{
  "goal": "Build AI-powered apps",
  "excuse": "Don't know where to start",
  "isPresetExcuse": true
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Response</CardTitle>
              <CardDescription>
                Witty, psychologically compelling responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">Response Format:</h4>
                <pre className="bg-gray-100 rounded-md p-3 text-xs overflow-x-auto">
{`{
  "success": true,
  "response": "Every AI Captain started...",
  "cta": "Start Your Journey"
}`}
                </pre>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Status Codes:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">200</Badge>
                    <span>Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600">400</Badge>
                    <span>Invalid input</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-600">429</Badge>
                    <span>Rate limited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-600">500</Badge>
                    <span>Server error</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Link */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-2">Need More Details?</h3>
            <p className="text-gray-600 mb-4">
              Check out the comprehensive documentation for setup, customization, and production deployment.
            </p>
            <Link href="/VENICE_AI_API_SETUP.md" target="_blank">
              <Button size="lg">
                View Documentation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}