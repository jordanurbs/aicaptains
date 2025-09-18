"use client"

import { useState, useEffect } from "react"
import { 
  Anchor, 
  Ship, 
  Zap, 
  Code, 
  Palette, 
  Megaphone, 
  Wrench, 
  TrendingUp,
  Navigation,
  Crown,
  Waves
} from "lucide-react"
import { useSound } from "@/components/sound-provider"

export function TransformationBanner() {
  const [isHovered, setIsHovered] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [waveOffset, setWaveOffset] = useState(0)
  const [transformationStage, setTransformationStage] = useState(0)
  const { playSound } = useSound()

  // Continuous ship wheel rotation (faster when transforming)
  useEffect(() => {
    const interval = setInterval(() => {
      setWheelRotation(prev => (prev + (transformationStage > 0 ? 5 : 1)) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [transformationStage])

  // Wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 2) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handleHover = () => {
    setIsHovered(true)
    playSound("hover")
  }

  const handleLeave = () => {
    setIsHovered(false)
  }

  const handleClick = () => {
    playSound("click")
    // Trigger transformation sequence
    if (transformationStage < 5) {
      setTransformationStage(prev => prev + 1)
      setTimeout(() => {
        playSound("select")
        // Trigger celebration when transformation completes
        if (transformationStage === 4) {
          const event = new CustomEvent('celebrate', { detail: { type: 'transformation' } })
          window.dispatchEvent(event)
        }
      }, 500)
    } else {
      setTransformationStage(0)
    }
  }

  const transformations = [
    {
      icon: Code,
      title: "WordPress Builders",
      description: "Deploy AI apps like WordPress sites",
      color: "text-blue-400"
    },
    {
      icon: Palette,
      title: "Webflow Designers", 
      description: "Own the backend logic behind designs",
      color: "text-purple-400"
    },
    {
      icon: Megaphone,
      title: "Content Creators",
      description: "Build AI tools your audience needs",
      color: "text-green-400"
    },
    {
      icon: Wrench,
      title: "No-Code Builders",
      description: "Break through platform limitations", 
      color: "text-orange-400"
    },
    {
      icon: TrendingUp,
      title: "Digital Entrepreneurs",
      description: "Launch AI-powered businesses",
      color: "text-red-400"
    }
  ]

  return (
    <section 
      className="transformation-section relative overflow-hidden border-4 border-yellow-500 rounded-lg bg-gradient-to-b from-gray-900 to-black p-6 my-8 crt-screen"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {/* Animated Wave Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none maritime-waves">
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600 to-transparent ocean-drift"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(0, 255, 255, 0.3) 0%, transparent 70%)`,
            transform: `translateX(${waveOffset}px)`,
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyan-600 to-transparent"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(0, 255, 255, 0.2) 0%, transparent 60%)`,
            transform: `translateX(${-waveOffset}px)`,
            animation: 'ocean-drift 8s ease-in-out infinite reverse'
          }}
        />
        <Waves 
          className="absolute bottom-4 left-4 w-8 h-8 text-cyan-400 opacity-60 anchor-chain"
        />
        <Waves 
          className="absolute bottom-8 right-8 w-6 h-6 text-blue-400 opacity-40 sail-wind"
        />
      </div>

      {/* Grid background overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`retro-text text-3xl sm:text-4xl md:text-6xl text-yellow-500 mb-2 retro-leading-tight transition-all duration-500 ${
            transformationStage >= 5 ? 'text-cyan-400 animate-pulse' : ''
          }`}>
            {transformationStage >= 5 ? 'CAPTAIN TRANSFORMATION COMPLETE' : 'TRANSFORMATION SEQUENCE'}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-cyan-400 text-lg sm:text-xl md:text-2xl">
            <div className="flex items-center gap-2">
              <Anchor className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                transformationStage > 0 ? 'text-gray-500 opacity-50' : ''
              }`} />
              <span className="retro-text text-sm sm:text-base md:text-lg">NO-CODE PASSENGER</span>
            </div>
            <span className="mx-2 sm:mx-4 text-yellow-500 text-2xl">→</span>
            <div className="flex items-center gap-2">
              <span className="retro-text text-sm sm:text-base md:text-lg">AI CAPTAIN</span>
              <Crown className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                transformationStage >= 5 ? 'text-yellow-500 animate-bounce' : ''
              }`} />
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          
          {/* Left Side - Platform Passenger */}
          <div className="relative order-2 lg:order-1">
            <div className={`border-2 rounded-lg p-4 sm:p-6 bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-500 crt-curvature ${
              transformationStage > 0 ? 'border-red-500 opacity-50 scale-95' : 'border-gray-600'
            }`}>
              <div className="text-center mb-4">
                <Anchor className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 transition-all duration-300 ${
                  transformationStage > 0 ? 'text-red-500 animate-pulse' : 'text-gray-500'
                }`} />
                <h3 className="retro-text text-xl sm:text-2xl text-gray-400 mb-2">PLATFORM PASSENGER</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Limited by platform constraints</p>
              </div>
              
              <div className="space-y-3">
                {transformations.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-500">
                    <item.icon className="w-5 h-5 opacity-50" />
                    <div>
                      <div className="text-sm font-bold opacity-70">{item.title}</div>
                      <div className="text-xs opacity-50">Stuck in platform limitations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Ship Wheel Transformation */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              {/* Rotating Ship Wheel */}
              <div 
                className={`relative w-24 h-24 sm:w-32 sm:h-32 transition-all duration-300 ship-wheel-rotation ${
                  transformationStage >= 5 ? 'scale-125' :
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  transform: `rotate(${wheelRotation}deg) scale(${
                    transformationStage >= 5 ? '1.25' :
                    isHovered ? '1.1' : '1'
                  })`,
                  filter: transformationStage >= 5 ? 'drop-shadow(0 0 20px rgba(255, 255, 0, 0.8))' : 'none'
                }}
              >
                <Navigation className={`w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg compass-navigation transition-colors duration-300 ${
                  transformationStage >= 5 ? 'text-cyan-400' : 'text-yellow-500'
                }`} />
                
                {/* Center glowing dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg transition-all duration-300 ${
                    transformationStage >= 5 ? 'bg-yellow-500 animate-bounce' :
                    transformationStage > 0 ? 'bg-cyan-400 transformation-energy' :
                    'bg-cyan-400 animate-pulse'
                  }`}></div>
                </div>
                
                {/* Energy rings */}
                <div className={`absolute inset-0 rounded-full border-2 border-cyan-400 transition-all duration-300 ${
                  isHovered ? 'scale-125 opacity-80' : 'scale-100'
                } ${
                  transformationStage > 0 ? 'opacity-80 animate-pulse' : 'opacity-50'
                }`} style={{ animation: `blink ${transformationStage > 0 ? '0.5s' : '2s'} infinite` }}></div>
                <div className={`absolute inset-2 rounded-full border border-yellow-500 transition-all duration-300 ${
                  isHovered ? 'scale-110 opacity-60' : 'scale-100'
                } ${
                  transformationStage > 2 ? 'opacity-70' : 'opacity-30'
                }`} style={{ animation: `blink ${transformationStage > 2 ? '0.3s' : '1.5s'} infinite reverse` }}></div>
                
                {/* Transformation energy bursts */}
                {transformationStage > 0 && (
                  <div className="absolute inset-0 rounded-full border border-yellow-500 opacity-60 transformation-energy"></div>
                )}
                {transformationStage > 3 && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-40 transformation-energy" style={{ animationDelay: '0.5s' }}></div>
                )}
              </div>
              
              {/* Transformation Arrow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <Zap className={`w-8 h-8 text-yellow-500 transition-all duration-300 ${
                  transformationStage > 0 ? 'animate-bounce text-cyan-400' : 'animate-pulse'
                }`} />
              </div>
            </div>
          </div>

          {/* Right Side - AI Captain */}
          <div className="relative order-3">
            <div className={`border-4 rounded-lg p-4 sm:p-6 bg-gradient-to-br from-blue-900 to-purple-900 transition-all duration-500 captain-glow ${
              transformationStage >= 5 ? 'border-yellow-500 shadow-2xl shadow-cyan-400/40 scale-105' :
              transformationStage > 0 ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' :
              isHovered ? 'border-yellow-500 shadow-lg shadow-cyan-400/20' : 'border-cyan-400'
            }`}>
              <div className="text-center mb-4">
                <Ship className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 transition-all duration-300 ${
                  transformationStage >= 5 ? 'text-yellow-500 animate-bounce' : 'text-cyan-400'
                }`} />
                <h3 className={`retro-text text-xl sm:text-2xl mb-2 transition-all duration-300 ${
                  transformationStage >= 5 ? 'text-yellow-500' : 'text-cyan-400'
                }`}>AI CAPTAIN</h3>
                <p className="text-cyan-300 text-xs sm:text-sm">Command your digital destiny</p>
              </div>
              
              <div className="space-y-3">
                {transformations.map((item, index) => (
                  <div key={index} className={`flex items-center gap-3 transition-all duration-500 ${
                    isHovered ? 'transform translate-x-1' : ''
                  } ${
                    transformationStage > index ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
                  }`}>
                    <item.icon className={`w-5 h-5 ${item.color} transition-all duration-300 ${
                      transformationStage > index ? 'animate-pulse' : ''
                    }`} />
                    <div>
                      <div className={`text-sm font-bold transition-colors duration-300 ${
                        transformationStage > index ? 'text-cyan-400' : 'text-white'
                      }`}>{item.title}</div>
                      <div className="text-xs text-cyan-300">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Transformation Progress */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="mb-4">
            <div className="flex justify-center gap-1 sm:gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    i < transformationStage 
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-cyan-400 text-xs sm:text-sm px-2">
              {transformationStage === 0 && "Click to begin transformation sequence"}
              {transformationStage === 1 && "Navigation systems online..."}
              {transformationStage === 2 && "Breaking platform limitations..."}
              {transformationStage === 3 && "Acquiring AI capabilities..."}
              {transformationStage === 4 && "Command protocols activated..."}
              {transformationStage === 5 && "🎉 TRANSFORMATION COMPLETE - You are now an AI Captain! 🎉"}
            </p>
          </div>
          
          <button 
            onClick={handleClick}
            className={`inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 retro-button text-sm sm:text-base ${
              transformationStage >= 5 
                ? 'bg-gradient-to-r from-cyan-400 to-yellow-500 text-black shadow-lg shadow-cyan-400/30'
                : 'bg-gradient-to-r from-yellow-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-yellow-500/20'
            }`}
          >
            <Ship className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="retro-text">
              {transformationStage < 5 ? 'INITIATE TRANSFORMATION' : 'RESET SEQUENCE'}
            </span>
            <Navigation className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Floating Maritime Elements */}
        <div className="absolute top-4 left-4 opacity-60">
          <Anchor className="w-6 h-6 text-cyan-400 anchor-chain" />
        </div>
        <div className="absolute top-8 right-12 opacity-40">
          <Ship className="w-8 h-8 text-yellow-500 sail-wind" />
        </div>
        <div className="absolute bottom-12 left-8 opacity-50">
          <Navigation className="w-5 h-5 text-cyan-400 compass-navigation" />
        </div>

        {/* CRT Effects overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="crt-scanlines-fast"></div>
          <div className="crt-scanlines-slow"></div>
          <div className="crt-phosphor-glow"></div>
        </div>
      </div>
    </section>
  )
}