"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, RefreshCw, Terminal, Zap, CheckCircle } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import { useCelebration } from "@/components/celebration-effects"
import Image from "next/image"

interface AIResponseDisplayProps {
  className?: string
  goal?: string
  excuse?: string
  response?: string
  cta?: string
  isLoading?: boolean
  error?: string
  onGenerateAnother?: () => void
  onCTAClick?: () => void
}

export function AIResponseDisplay({
  className = "",
  goal,
  excuse,
  response,
  cta,
  isLoading = false,
  error,
  onGenerateAnother,
  onCTAClick
}: AIResponseDisplayProps) {
  const [currentStep, setCurrentStep] = useState<"loading" | "context" | "response" | "cta" | "complete">("loading")
  const [displayedResponse, setDisplayedResponse] = useState("")
  const [typewriterIndex, setTypewriterIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isResponseComplete, setIsResponseComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  
  const { playSound } = useSound()
  const { celebrate, CelebrationComponent } = useCelebration()

  // Reset state when new content arrives
  useEffect(() => {
    if (isLoading) {
      setCurrentStep("loading")
      setDisplayedResponse("")
      setTypewriterIndex(0)
      setIsResponseComplete(false)
      setGlitchActive(false)
      setLoadingStartTime(Date.now()) // Track when loading started
      playSound("hover")
    }
  }, [isLoading, playSound])

  // Animation sequence controller with minimum loading time
  useEffect(() => {
    if (isLoading) return

    if (error) {
      setCurrentStep("complete")
      return
    }

    // Start animation sequence when response is available
    if (response && currentStep === "loading" && loadingStartTime) {
      const sequence = async () => {
        // Ensure minimum loading display time of 3 seconds for better UX
        const minLoadingTime = 3000
        const elapsed = Date.now() - loadingStartTime

        // Wait for remaining time if needed
        if (elapsed < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed))
        }

        // Step 1: Show context
        await new Promise(resolve => setTimeout(resolve, 500))
        setCurrentStep("context")
        playSound("click")

        // Step 2: Start typewriter effect
        await new Promise(resolve => setTimeout(resolve, 800))
        setCurrentStep("response")
        setGlitchActive(true)
        playSound("select")

        // Brief glitch effect
        setTimeout(() => setGlitchActive(false), 300)
      }

      sequence()
    }
  }, [isLoading, response, error, currentStep, loadingStartTime, playSound])

  // Typewriter effect for response
  useEffect(() => {
    if (currentStep !== "response" || !response) return

    if (typewriterIndex < response.length) {
      const timeout = setTimeout(() => {
        setDisplayedResponse(prev => prev + response[typewriterIndex])
        setTypewriterIndex(prev => prev + 1)
        
        // Play typing sound occasionally
        if (Math.random() > 0.85) {
          playSound("hover")
        }
      }, 50 + Math.random() * 50) // Variable typing speed for organic feel

      return () => clearTimeout(timeout)
    } else if (!isResponseComplete) {
      // Response complete - show CTA
      setIsResponseComplete(true)
      setTimeout(() => {
        setCurrentStep("cta")
        playSound("select")
        celebrate("achievement")
      }, 500)
    }
  }, [currentStep, response, typewriterIndex, isResponseComplete, playSound, celebrate])

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!response) return
    
    try {
      const textToCopy = `Goal: ${goal}\n\nChallenge: ${excuse}\n\nCaptain Jax says: "${response}"\n\n${cta ? `Action: ${cta}` : ''}`
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      playSound("click")
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [response, goal, excuse, cta, playSound])

  const handleGenerateAnother = useCallback(() => {
    playSound("select")
    onGenerateAnother?.()
  }, [playSound, onGenerateAnother])

  const handleCTAClick = useCallback(() => {
    playSound("startup")
    onCTAClick?.()
  }, [playSound, onCTAClick])

  return (
    <section className={`relative ${className}`}>
      <CelebrationComponent />
      
      {/* Terminal Container */}
      <div className="relative border-4 border-cyan-400 rounded-lg bg-black/90 overflow-hidden min-h-[400px]">
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-b-2 border-cyan-400 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-mono text-sm font-bold">
                CAPTAIN JAX TRANSMISSION
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="relative p-6 min-h-[300px]">
          {/* Background Matrix Rain Effect */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid-bg"></div>
            {isLoading && <div className="scanline-thin"></div>}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-cyan-400 font-mono mb-4">
                <Zap className="w-4 h-4 animate-spin" />
                <span className="animate-pulse text-lg font-bold">CAPTAIN JAX IS THINKING...</span>
              </div>

              {/* Scanning Animation */}
              <div className="space-y-2 mb-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse rounded"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      width: `${Math.random() * 50 + 50}%`,
                      animationDuration: `${1.5 + Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>

              {/* Loading Progress with Captain Jax's personality */}
              <div className="text-green-400 font-mono text-sm space-y-2">
                <div className="animate-pulse flex items-center gap-2">
                  <span className="text-yellow-400">►</span>
                  <span>Analyzing your mission: "{goal?.substring(0, 50)}..."</span>
                </div>
                <div className="animate-pulse flex items-center gap-2" style={{animationDelay: '0.5s'}}>
                  <span className="text-yellow-400">►</span>
                  <span>Understanding your challenge: "{excuse?.substring(0, 50)}..."</span>
                </div>
                <div className="animate-pulse flex items-center gap-2" style={{animationDelay: '1s'}}>
                  <span className="text-cyan-400">►</span>
                  <span>Captain Jax is crafting your battle plan...</span>
                </div>
                <div className="animate-pulse flex items-center gap-2" style={{animationDelay: '1.5s'}}>
                  <span className="text-purple-400">►</span>
                  <span>Preparing motivational wisdom...</span>
                </div>
                <div className="animate-pulse flex items-center gap-2" style={{animationDelay: '2s'}}>
                  <span className="text-green-400">►</span>
                  <span>Almost ready to set sail!</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-full animate-pulse"
                    style={{
                      animation: 'loading-progress 3s ease-in-out',
                      '@keyframes loading-progress': {
                        '0%': { width: '0%' },
                        '100%': { width: '100%' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="relative z-10">
              <div className="border-4 border-red-500 rounded-lg p-6 bg-red-900/20">
                <div className="flex items-center gap-2 text-red-400 font-mono mb-3">
                  <span className="blink">ERROR</span>
                </div>
                <p className="text-red-300 font-mono text-sm mb-4">{error}</p>

                {/* Retry Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerateAnother}
                    className="
                      flex items-center gap-2 px-6 py-3 rounded border-2 border-red-400
                      bg-red-900/30 text-red-300 hover:bg-red-900/50
                      transition-all duration-200 font-mono text-sm
                      hover:border-red-300 hover:shadow-lg hover:shadow-red-400/20
                    "
                  >
                    <RefreshCw className="w-4 h-4" />
                    TRY ANOTHER GOAL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success State - Context Display - Always visible once past loading */}
          {currentStep !== "loading" && !error && (goal || excuse) && (
            <div className={`
              relative z-10 mb-6 transition-all duration-500
              ${currentStep === "context" || currentStep === "response" || currentStep === "cta"
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"}
            `}>
              <div className="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-900/10">
                <div className="text-yellow-400 font-mono text-sm mb-2 retro-text">MISSION PARAMETERS</div>
                {goal && (
                  <div className="mb-2">
                    <span className="text-cyan-400 font-mono text-xs">TARGET:</span>
                    <span className="text-white ml-2 font-mono text-sm">"{goal}"</span>
                  </div>
                )}
                {excuse && (
                  <div>
                    <span className="text-purple-400 font-mono text-xs">OBSTACLE:</span>
                    <span className="text-white ml-2 font-mono text-sm">"{excuse}"</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Response Display - stays visible when CTA appears */}
          {(currentStep === "response" || currentStep === "cta") && (
            <div className="relative z-10 mb-6">
              <div className={`
                border-4 rounded-lg p-6 transition-all duration-300
                ${glitchActive
                  ? "border-cyan-400 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 animate-pulse"
                  : "border-cyan-500 bg-gradient-to-br from-cyan-900/20 to-blue-900/20"
                }
              `}>
                <div className="flex items-center gap-4 mb-4">
                  {/* Captain Jax Avatar */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src="/images/jax-avatar.png"
                      alt="Captain Jax"
                      fill
                      className="object-cover rounded-full border-2 border-cyan-400"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                  </div>
                  <div>
                    <div className="text-cyan-400 font-mono text-2xl md:text-3xl lg:text-4xl font-bold retro-text">
                      ASK CAPTAIN JAX!
                    </div>
                    <div className="text-cyan-300/60 font-mono text-sm">
                      AI Commander • Leadership Mentor Bot
                    </div>
                  </div>
                </div>

                <blockquote className={`
                  text-lg leading-relaxed font-mono text-cyan-300
                  ${glitchActive ? "animate-pulse" : ""}
                  ${glitchActive ? "glitch" : ""}
                `}>
                  "{displayedResponse}
                  {!isResponseComplete && showCursor && (
                    <span className="text-yellow-400 animate-pulse">|</span>
                  )}"
                </blockquote>

                {/* Holographic border effect */}
                {!glitchActive && (
                  <>
                    <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg pointer-events-none animate-pulse"></div>
                    <div className="absolute -inset-1 border border-yellow-500/20 rounded-lg pointer-events-none animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* CTA Button */}
          {currentStep === "cta" && cta && (
            <div className={`
              relative z-10 mb-6 transition-all duration-500 delay-200
              ${currentStep === "cta" ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}
            `}>
              <div className="flex justify-center">
                <button
                  onClick={handleCTAClick}
                  className="
                    group relative px-8 py-4 rounded-lg font-bold text-lg
                    border-4 border-yellow-400 bg-gradient-to-br from-yellow-900/80 to-orange-900/80
                    text-yellow-300 transition-all duration-200 retro-button font-mono
                    hover:bg-gradient-to-br hover:from-yellow-800/90 hover:to-orange-800/90
                    hover:shadow-lg hover:shadow-yellow-400/40 hover:transform hover:-translate-y-1
                    hover:border-yellow-300 active:transform active:translate-y-0
                  "
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-200"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-2">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="retro-text">{cta}</span>
                  </div>

                  {/* Holographic border */}
                  <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg animate-pulse pointer-events-none"></div>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {currentStep === "cta" && (
            <div className={`
              relative z-10 transition-all duration-500 delay-400
              ${currentStep === "cta" ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}
            `}>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleCopy}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded border-2 border-purple-500
                    bg-purple-900/20 text-purple-300 hover:bg-purple-900/40
                    transition-all duration-200 font-mono text-sm
                    hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/20
                  "
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      COPY RESPONSE
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateAnother}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded border-2 border-green-500
                    bg-green-900/20 text-green-300 hover:bg-green-900/40
                    transition-all duration-200 font-mono text-sm
                    hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20
                  "
                >
                  <RefreshCw className="w-4 h-4" />
                  GENERATE ANOTHER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="border-t-2 border-cyan-400 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 p-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <div className="text-cyan-400">
              CAPTAIN JAX SYSTEM v2.1.0
            </div>
            <div className="flex items-center gap-4">
              <div className="text-green-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                ONLINE
              </div>
              <div className="text-yellow-500">
                STATUS: {isLoading ? "PROCESSING" : error ? "ERROR" : "READY"}
              </div>
            </div>
          </div>
        </div>

        {/* Glitch overlay */}
        {glitchActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Bottom Status Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-full">
          <div className={`w-2 h-2 rounded-full ${
            isLoading ? "bg-yellow-500 animate-pulse" :
            error ? "bg-red-500" :
            currentStep === "cta" ? "bg-green-500 animate-pulse" :
            "bg-cyan-500 animate-pulse"
          }`}></div>
          <span className="text-xs font-mono text-gray-400">
            {isLoading ? "Transmission in progress..." :
             error ? "Transmission failed" :
             currentStep === "cta" ? "Transmission complete" :
             "Receiving transmission..."}
          </span>
        </div>
      </div>
    </section>
  )
}