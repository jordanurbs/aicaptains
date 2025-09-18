"use client"

import { useState, useEffect } from "react"
import { 
  Ship, 
  Anchor, 
  Navigation, 
  Waves,
  Compass,
  Map,
  Telescope,
  Crown
} from "lucide-react"

interface MaritimeLoadingProps {
  isLoading?: boolean
  loadingText?: string
  type?: 'default' | 'page' | 'form' | 'content'
  showProgress?: boolean
  className?: string
}

export function MaritimeLoading({ 
  isLoading = true,
  loadingText = "Navigating the digital seas...",
  type = 'default',
  showProgress = false,
  className = ""
}: MaritimeLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(loadingText)
  const [waveOffset, setWaveOffset] = useState(0)
  const [shipPosition, setShipPosition] = useState(0)

  // Funny maritime loading messages
  const loadingMessages = [
    "Hoisting the digital sails...",
    "Consulting the AI compass...",
    "Charting course through the cloud...",
    "Recruiting crew members...",
    "Loading treasure maps...",
    "Preparing the navigation deck...",
    "Checking wind conditions...",
    "Scanning for digital icebergs...",
    "Adjusting the AI rudder...",
    "Plotting coordinates...",
    "Decoding ancient scroll APIs...",
    "Warming up the AI engines...",
    "Synchronizing with Poseidon...",
    "Calibrating the neural nets...",
    "Tuning the quantum radio...",
    "Summoning digital dolphins...",
    "Consulting the Oracle Database...",
    "Gathering stardust for processing...",
    "Waking up sleeping algorithms...",
    "Polishing the crystal ball cache..."
  ]

  // Animate progress and text
  useEffect(() => {
    if (!isLoading) return

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 8 + 2
        return Math.min(prev + increment, 95)
      })
    }, 300)

    const textInterval = setInterval(() => {
      setCurrentText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [isLoading])

  // Wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 2) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Ship sailing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShipPosition(prev => (prev + 1) % 200)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  if (!isLoading) return null

  const getLoadingIcon = () => {
    switch (type) {
      case 'page':
        return <Navigation className="w-8 h-8 text-cyan-400 animate-spin" />
      case 'form':
        return <Anchor className="w-8 h-8 text-yellow-500 animate-bounce" />
      case 'content':
        return <Telescope className="w-8 h-8 text-purple-400 animate-pulse" />
      default:
        return <Compass className="w-8 h-8 text-cyan-400 animate-spin" />
    }
  }

  const getContainerClass = () => {
    switch (type) {
      case 'page':
        return 'fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000]'
      case 'form':
        return 'absolute inset-0 bg-black/80 backdrop-blur-sm'
      case 'content':
        return 'relative bg-gray-900/50 backdrop-blur-sm rounded-lg'
      default:
        return 'relative'
    }
  }

  return (
    <div className={`${getContainerClass()} ${className}`}>
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="relative max-w-md w-full">
          
          {/* Ocean background */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {/* Animated waves */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-600/30 to-transparent"
              style={{
                backgroundImage: `radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)`,
                transform: `translateX(${waveOffset}px)`,
              }}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-600/20 to-transparent"
              style={{
                backgroundImage: `radial-gradient(ellipse at center, rgba(0, 255, 255, 0.05) 0%, transparent 60%)`,
                transform: `translateX(${-waveOffset}px)`,
              }}
            />
            
            {/* Floating bubbles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-bounce"
                style={{
                  left: `${10 + i * 10}%`,
                  bottom: `${20 + Math.sin(Date.now() / 1000 + i) * 10}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              />
            ))}
          </div>

          {/* Main loading content */}
          <div className="relative z-10 text-center space-y-6">
            
            {/* Sailing ship */}
            <div className="relative">
              <div 
                className="inline-block transition-transform duration-300"
                style={{
                  transform: `translateX(${Math.sin(shipPosition / 20) * 20}px) rotate(${Math.sin(shipPosition / 30) * 5}deg)`
                }}
              >
                <Ship className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
              </div>
              
              {/* Captain's flag */}
              <div className="absolute -top-2 -right-2">
                <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              
              {/* Wake trail */}
              <div className="absolute top-8 left-12 w-8 h-1 bg-cyan-400/50 rounded-full animate-pulse" />
              <div className="absolute top-10 left-8 w-6 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>

            {/* Loading icon */}
            <div className="flex justify-center">
              {getLoadingIcon()}
            </div>

            {/* Dynamic loading text */}
            <div className="space-y-2">
              <p className="text-cyan-400 text-lg font-bold retro-text animate-pulse">
                {currentText}
              </p>
              
              {/* Sub-text with personality */}
              <p className="text-gray-400 text-sm">
                {type === 'page' && "Setting up your command center..."}
                {type === 'form' && "Processing your captain credentials..."}
                {type === 'content' && "Decoding the digital treasures..."}
                {type === 'default' && "Please stand by, Captain..."}
              </p>
            </div>

            {/* Progress bar with ship indicator */}
            {showProgress && (
              <div className="space-y-2">
                <div className="relative w-full h-3 bg-gray-800 rounded-full border border-cyan-500/30 overflow-hidden">
                  {/* Progress fill */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  
                  {/* Ship progress indicator */}
                  <div 
                    className="absolute top-0 h-full flex items-center transition-all duration-300"
                    style={{ left: `${Math.max(0, progress - 2)}%` }}
                  >
                    <Anchor className="w-3 h-3 text-yellow-400 animate-bounce" />
                  </div>
                  
                  {/* Sparkle effect */}
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent w-8 animate-pulse"
                    style={{ left: `${Math.max(0, progress - 4)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Departed: Port Loading</span>
                  <span>{Math.round(progress)}% Complete</span>
                  <span>Destination: Ready State</span>
                </div>
              </div>
            )}

            {/* Navigation instruments */}
            <div className="flex justify-center gap-4 opacity-50">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
              <Map className="w-4 h-4 text-yellow-400 animate-pulse" />
              <Telescope className="w-4 h-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Loading dots */}
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 opacity-30">
            <Waves className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div className="absolute top-2 right-2 opacity-30">
            <Waves className="w-6 h-6 text-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute bottom-2 left-2 opacity-30">
            <Anchor className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute bottom-2 right-2 opacity-30">
            <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for easy loading state management
export function useMaritimeLoading() {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading...")
  
  const startLoading = (text?: string) => {
    if (text) setLoadingText(text)
    setLoading(true)
  }
  
  const stopLoading = () => {
    setLoading(false)
  }
  
  return {
    loading,
    startLoading,
    stopLoading,
    LoadingComponent: (props: Omit<MaritimeLoadingProps, 'isLoading'>) => (
      <MaritimeLoading isLoading={loading} loadingText={loadingText} {...props} />
    )
  }
}