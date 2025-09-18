"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { 
  AlertTriangle, 
  Ship, 
  Anchor,
  Compass,
  LifeBuoy,
  Map,
  RefreshCw,
  Home,
  MessageSquare,
  Zap,
  Waves,
  Navigation
} from "lucide-react"

interface MaritimeErrorProps {
  error?: string
  errorCode?: string | number
  type?: '404' | '500' | 'network' | 'form' | 'permission' | 'generic'
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
}

export function MaritimeError({ 
  error = "Oops! Something went wrong",
  errorCode = "UNKNOWN",
  type = 'generic',
  onRetry,
  onGoHome,
  className = ""
}: MaritimeErrorProps) {
  const [isShaking, setIsShaking] = useState(false)
  const [waveOffset, setWaveOffset] = useState(0)
  const [showLifeline, setShowLifeline] = useState(false)
  const { playSound } = useSound()

  // Wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 3) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Show lifeline after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLifeline(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const getErrorDetails = () => {
    switch (type) {
      case '404':
        return {
          title: "UNCHARTED WATERS!",
          subtitle: "The page you're looking for has sailed away",
          message: "This digital island doesn't exist on our map. Perhaps it was swallowed by the Kraken of broken links!",
          icon: <Map className="w-16 h-16 text-yellow-500" />,
          actionText: "Navigate Back to Safety"
        }
      case '500':
        return {
          title: "SHIP'S ENGINE MALFUNCTION!",
          subtitle: "Our AI crew is working to fix the problem",
          message: "The server kraken has tangled our propellers! Our best engineers are diving deep to untangle this mess.",
          icon: <Ship className="w-16 h-16 text-red-500" />,
          actionText: "Attempt Emergency Restart"
        }
      case 'network':
        return {
          title: "LOST AT SEA!",
          subtitle: "Connection to the mainland has been severed",
          message: "The digital lighthouse has gone dark! Check your internet connection and we'll guide you back to shore.",
          icon: <Navigation className="w-16 h-16 text-orange-500" />,
          actionText: "Signal for Rescue"
        }
      case 'form':
        return {
          title: "CHARTS INCOMPLETE!",
          subtitle: "Some required navigation data is missing",
          message: "Captain, we need all navigation coordinates to proceed safely. Please check your inputs and try again!",
          icon: <Compass className="w-16 h-16 text-blue-500" />,
          actionText: "Review Navigation Charts"
        }
      case 'permission':
        return {
          title: "RESTRICTED WATERS!",
          subtitle: "You need special clearance to enter this area",
          message: "These are Admiral-only waters! You'll need proper credentials to navigate this exclusive territory.",
          icon: <Anchor className="w-16 h-16 text-purple-500" />,
          actionText: "Request Port Authority"
        }
      default:
        return {
          title: "ROUGH SEAS AHEAD!",
          subtitle: "We've encountered an unexpected storm",
          message: "Even the most experienced Captains face unexpected weather. Let's batten down the hatches and try again!",
          icon: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
          actionText: "Weather the Storm"
        }
    }
  }

  const handleRetry = () => {
    setIsShaking(true)
    playSound('click')
    
    setTimeout(() => {
      setIsShaking(false)
      if (onRetry) onRetry()
    }, 500)
  }

  const handleGoHome = () => {
    playSound('select')
    if (onGoHome) onGoHome()
  }

  const details = getErrorDetails()

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black flex items-center justify-center p-6 ${className}`}>
      
      {/* Stormy ocean background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated storm waves */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800/40 to-transparent"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(0, 100, 200, 0.3) 0%, transparent 70%)`,
            transform: `translateX(${waveOffset}px) scaleY(1.5)`,
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-700/30 to-transparent"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(100, 100, 100, 0.2) 0%, transparent 60%)`,
            transform: `translateX(${-waveOffset * 1.5}px) scaleY(2)`,
          }}
        />
        
        {/* Storm clouds */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gray-800/50 to-transparent" />
        
        {/* Lightning effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-white animate-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: '10%',
                height: '30%',
                animationDelay: `${i * 2}s`,
                animationDuration: '0.1s',
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Error content */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className={`
          bg-black/80 backdrop-blur-sm border-4 border-red-500 rounded-lg p-8 text-center space-y-6
          transform transition-all duration-300 ${isShaking ? 'animate-pulse scale-95' : 'scale-100'}
        `}>
          
          {/* Error icon with animation */}
          <div className="flex justify-center relative">
            <div className={`
              transform transition-all duration-500 
              ${type === 'network' ? 'animate-bounce' : 'animate-pulse'}
            `}>
              {details.icon}
            </div>
            
            {/* Warning signals */}
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Error code display */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 border border-red-500/50 rounded-full">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-mono text-sm">ERROR CODE: {errorCode}</span>
            </div>
          </div>

          {/* Error messages */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold retro-text text-red-400">
              {details.title}
            </h1>
            
            <h2 className="text-xl md:text-2xl text-yellow-400 retro-text">
              {details.subtitle}
            </h2>
            
            <p className="text-gray-300 leading-relaxed">
              {details.message}
            </p>
            
            {error !== "Oops! Something went wrong" && (
              <div className="mt-4 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                <p className="text-gray-400 text-sm font-mono">
                  Technical Details: {error}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <Button
                onClick={handleRetry}
                className="retro-button bg-yellow-600 text-black hover:bg-yellow-400 font-bold px-6 py-3 border-2 border-yellow-500"
                onMouseEnter={() => playSound('hover')}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {details.actionText}
              </Button>
            )}
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
              onMouseEnter={() => playSound('hover')}
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Port
            </Button>
          </div>

          {/* Lifeline help */}
          {showLifeline && (
            <div className="border-t border-gray-600 pt-6 mt-6 space-y-4 animate-fadeInUp">
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                <LifeBuoy className="w-5 h-5" />
                <span className="font-semibold">Need a Lifeline?</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <button 
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 justify-center"
                  onClick={() => playSound('hover')}
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Support Crew
                </button>
                <span className="hidden sm:inline text-gray-600">|</span>
                <button 
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 justify-center"
                  onClick={() => playSound('hover')}
                >
                  <Map className="w-4 h-4" />
                  Check Status Page
                </button>
                <span className="hidden sm:inline text-gray-600">|</span>
                <button 
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 justify-center"
                  onClick={() => playSound('hover')}
                >
                  <Navigation className="w-4 h-4" />
                  Navigation Help
                </button>
              </div>
            </div>
          )}

          {/* Maritime decorations */}
          <div className="flex justify-center gap-8 opacity-30 pt-4">
            <Waves className="w-6 h-6 text-blue-400 animate-pulse" />
            <Ship className="w-6 h-6 text-gray-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Anchor className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
            <Compass className="w-6 h-6 text-cyan-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Floating debris for ambiance */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-600 rounded opacity-30 animate-bounce"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + Math.sin(Date.now() / 1000 + i) * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for easy error management
export function useMaritimeError() {
  const [error, setError] = useState<{
    message: string
    code: string | number
    type: MaritimeErrorProps['type']
  } | null>(null)
  
  const showError = (
    message: string, 
    code: string | number = 'UNKNOWN',
    type: MaritimeErrorProps['type'] = 'generic'
  ) => {
    setError({ message, code, type })
  }
  
  const clearError = () => {
    setError(null)
  }
  
  return {
    error,
    showError,
    clearError,
    ErrorComponent: (props: Omit<MaritimeErrorProps, 'error' | 'errorCode' | 'type'>) => (
      error ? (
        <MaritimeError 
          error={error.message}
          errorCode={error.code}
          type={error.type}
          {...props} 
        />
      ) : null
    )
  }
}