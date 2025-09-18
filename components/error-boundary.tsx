"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
  fallbackDescription?: string
  showDetails?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isRetrying: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, this would send to your error tracking service
    // like Sentry, LogRocket, or Bugsnag
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.log('Error logged to service:', errorData)
    
    // Example: Send to error tracking service
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // })
  }

  private handleRetry = () => {
    this.setState({ isRetrying: true })
    
    // Add a delay to prevent rapid retries
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      })
    }, 1000)
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { error, errorInfo } = this.state
    const bugReport = {
      error: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      component: errorInfo?.componentStack || 'Unknown component',
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    const subject = encodeURIComponent('Bug Report: Builder\'s Dilemma Error')
    const body = encodeURIComponent(`
Bug Report

Error: ${bugReport.error}

URL: ${bugReport.url}
Timestamp: ${bugReport.timestamp}

Stack Trace:
${bugReport.stack}

Component Stack:
${bugReport.component}

Steps to reproduce:
1. 
2. 
3. 

Additional information:
    `.trim())

    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = "SYSTEM ERROR DETECTED",
        fallbackDescription = "The AI Captain encountered an unexpected malfunction",
        showDetails = process.env.NODE_ENV === 'development'
      } = this.props

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-gray-900">
          {/* Retro-style error container */}
          <div className="max-w-2xl w-full">
            {/* Error Terminal */}
            <div className="border-4 border-red-500 rounded-lg bg-black/90 overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-gradient-to-r from-red-900/80 to-orange-900/80 border-b-2 border-red-500 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                    <span className="text-red-300 font-mono text-sm font-bold">
                      CRITICAL ERROR
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="p-6 relative">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 grid-bg opacity-10"></div>
                <div className="scanline-thin"></div>

                <div className="relative z-10 space-y-6">
                  {/* Error Icon and Title */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center bg-red-900/20">
                        <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-red-400 retro-text mb-2">
                        {fallbackTitle}
                      </h2>
                      <p className="text-red-300 font-mono text-sm">
                        {fallbackDescription}
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="border-2 border-red-600 rounded-lg p-4 bg-red-900/10">
                    <div className="text-red-400 font-mono text-xs mb-2">ERROR MESSAGE:</div>
                    <div className="text-red-300 font-mono text-sm">
                      {this.state.error?.message || 'Unknown error occurred'}
                    </div>
                  </div>

                  {/* Developer Details */}
                  {showDetails && this.state.error && (
                    <details className="border-2 border-yellow-600 rounded-lg p-4 bg-yellow-900/10">
                      <summary className="text-yellow-400 font-mono text-xs cursor-pointer hover:text-yellow-300">
                        TECHNICAL DETAILS (CLICK TO EXPAND)
                      </summary>
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="text-yellow-400 font-mono text-xs">STACK TRACE:</div>
                          <pre className="text-yellow-300 font-mono text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                        {this.state.errorInfo && (
                          <div>
                            <div className="text-yellow-400 font-mono text-xs">COMPONENT STACK:</div>
                            <pre className="text-yellow-300 font-mono text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={this.handleRetry}
                      disabled={this.state.isRetrying}
                      className="
                        flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                        border-4 border-cyan-400 bg-gradient-to-br from-blue-900/80 to-cyan-900/80
                        text-cyan-300 transition-all duration-200 retro-button font-mono
                        hover:bg-gradient-to-br hover:from-blue-800/90 hover:to-cyan-800/90
                        hover:shadow-lg hover:shadow-cyan-400/30 hover:transform hover:-translate-y-1
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      "
                    >
                      <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                      <span>{this.state.isRetrying ? 'REBOOTING...' : 'RETRY SYSTEM'}</span>
                    </button>

                    <button
                      onClick={this.handleGoHome}
                      className="
                        flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                        border-4 border-green-400 bg-gradient-to-br from-green-900/80 to-emerald-900/80
                        text-green-300 transition-all duration-200 retro-button font-mono
                        hover:bg-gradient-to-br hover:from-green-800/90 hover:to-emerald-800/90
                        hover:shadow-lg hover:shadow-green-400/30 hover:transform hover:-translate-y-1
                      "
                    >
                      <Home className="w-4 h-4" />
                      <span>RETURN HOME</span>
                    </button>

                    <button
                      onClick={this.handleReportBug}
                      className="
                        flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                        border-4 border-orange-400 bg-gradient-to-br from-orange-900/80 to-red-900/80
                        text-orange-300 transition-all duration-200 retro-button font-mono
                        hover:bg-gradient-to-br hover:from-orange-800/90 hover:to-red-800/90
                        hover:shadow-lg hover:shadow-orange-400/30 hover:transform hover:-translate-y-1
                      "
                    >
                      <Bug className="w-4 h-4" />
                      <span>REPORT BUG</span>
                    </button>
                  </div>

                  {/* Status Info */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-gray-400">
                        ERROR CODE: {this.state.error?.name || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="border-t-2 border-red-500 bg-gradient-to-r from-red-900/80 to-orange-900/80 p-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <div className="text-red-400">
                    ERROR BOUNDARY v1.0.0
                  </div>
                  <div className="text-orange-400">
                    TIMESTAMP: {new Date().toISOString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Help Text */}
            <div className="mt-4 text-center text-gray-400 font-mono text-xs">
              If this error persists, please refresh the page or contact support
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundary for the Builder's Dilemma components
export function BuildersDilemmaErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="BUILDER'S DILEMMA MALFUNCTION"
      fallbackDescription="The interactive experience encountered a critical error"
      onError={(error, errorInfo) => {
        // Custom logging for this specific feature
        console.error('Builder\'s Dilemma Error:', {
          error: error.message,
          component: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Error boundary specifically for API-related components
export function ApiErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="API CONNECTION FAILURE"
      fallbackDescription="Unable to communicate with the AI Captain systems"
      onError={(error, errorInfo) => {
        // Log API-related errors with specific context
        console.error('API Error Boundary:', {
          error: error.message,
          stack: error.stack,
          component: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          type: 'api_error'
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}