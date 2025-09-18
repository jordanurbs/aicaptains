"use client"

import { useState } from "react"
import { useSound } from "@/components/sound-provider"
import { 
  Compass, 
  Anchor, 
  Ship, 
  Zap, 
  Code, 
  Palette, 
  Camera,
  Layers,
  TrendingUp
} from "lucide-react"

// TypeScript interfaces
interface AudienceCard {
  id: string
  title: string
  icon: React.ReactNode
  frontDescription: string
  backCTA: string
  maritimeIcon: React.ReactNode
  gradientColors: string
  borderGlow: string
}

interface AudienceCardsProps {
  className?: string
}

export function AudienceCards({ className = "" }: AudienceCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const { playSound } = useSound()

  // Define audience cards with maritime themes
  const audienceCards: AudienceCard[] = [
    {
      id: "wordpress",
      title: "WordPress Builders",
      icon: <Code className="w-8 h-8" />,
      frontDescription: "Transform your WordPress workflow with AI automation and smart content generation.",
      backCTA: "Chart Your Course",
      maritimeIcon: <Compass className="w-6 h-6" />,
      gradientColors: "from-purple-900 to-blue-900",
      borderGlow: "shadow-purple-500/30"
    },
    {
      id: "webflow",
      title: "Webflow Designers",
      icon: <Palette className="w-8 h-8" />,
      frontDescription: "Enhance your design process with AI-powered prototyping and dynamic content.",
      backCTA: "Set Sail to Success",
      maritimeIcon: <Ship className="w-6 h-6" />,
      gradientColors: "from-indigo-900 to-purple-900",
      borderGlow: "shadow-indigo-500/30"
    },
    {
      id: "creators",
      title: "Content Creators",
      icon: <Camera className="w-8 h-8" />,
      frontDescription: "Scale your content empire with AI assistants for every creative challenge.",
      backCTA: "Navigate to Victory",
      maritimeIcon: <Anchor className="w-6 h-6" />,
      gradientColors: "from-pink-900 to-purple-900",
      borderGlow: "shadow-pink-500/30"
    },
    {
      id: "nocode",
      title: "No-Code Builders",
      icon: <Layers className="w-8 h-8" />,
      frontDescription: "Build powerful applications without limits using AI-enhanced no-code tools.",
      backCTA: "Drop Anchor Here",
      maritimeIcon: <Zap className="w-6 h-6" />,
      gradientColors: "from-green-900 to-teal-900",
      borderGlow: "shadow-green-500/30"
    },
    {
      id: "entrepreneurs",
      title: "Digital Entrepreneurs",
      icon: <TrendingUp className="w-8 h-8" />,
      frontDescription: "Launch your AI-powered business and command the digital seas of opportunity.",
      backCTA: "Claim Your Territory",
      maritimeIcon: <Ship className="w-6 h-6" />,
      gradientColors: "from-orange-900 to-red-900",
      borderGlow: "shadow-orange-500/30"
    }
  ]

  const handleCardHover = (cardId: string) => {
    playSound("hover")
  }

  const handleCardClick = (cardId: string) => {
    playSound("click")
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const handleCTAClick = (cardId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    playSound("select")
    
    // Trigger celebration for choosing a path
    const event2 = new CustomEvent('celebrate', { detail: { type: 'achievement' } })
    window.dispatchEvent(event2)
    
    // Navigate to power-up section
    const powerUpSection = document.getElementById("power-up-section")
    if (powerUpSection) {
      powerUpSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <section className={`relative ${className}`}>
      {/* Section Header */}
      <div className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900 mb-8">
        <div className="bg-yellow-500 text-black p-4 flex justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-bold retro-text">CHOOSE YOUR CREW</h2>
          <Compass className="w-8 h-8 ship-wheel-rotation" />
        </div>
        <div className="p-4">
          <p className="text-cyan-400 text-lg md:text-xl text-center">
            Every Captain needs their specialized crew. Which role best describes your current mission?
          </p>
        </div>
      </div>

      {/* Maritime Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="maritime-waves absolute inset-0 opacity-10"></div>
        <div className="grid-bg absolute inset-0 opacity-20"></div>
        
        {/* Floating maritime elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Ship className="w-16 h-16 text-cyan-400 ocean-drift" />
        </div>
        <div className="absolute top-32 right-20 opacity-15">
          <Anchor className="w-12 h-12 text-yellow-500 anchor-chain" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-25">
          <Compass className="w-10 h-10 text-cyan-400 compass-navigation" />
        </div>
      </div>

      {/* Audience Cards Grid */}
      <div className="audience-cards-grid grid gap-6">
        {audienceCards.map((card) => {
          const isFlipped = flippedCards.has(card.id)
          
          return (
            <div
              key={card.id}
              className="audience-card-container relative h-80 cursor-pointer group perspective-1000"
              onClick={() => handleCardClick(card.id)}
              onMouseEnter={() => handleCardHover(card.id)}
            >
              {/* 3D Flip Container */}
              <div className={`
                relative w-full h-full transition-transform duration-700 preserve-3d
                ${isFlipped ? 'rotate-y-180' : ''}
              `}>
                
                {/* Front of Card */}
                <div className={`
                  absolute inset-0 w-full h-full backface-hidden
                  border-4 border-yellow-500 rounded-lg overflow-hidden
                  bg-gradient-to-b ${card.gradientColors}
                  crt-screen transform-gpu
                  hover:border-cyan-400 hover:${card.borderGlow} hover:shadow-lg
                  transition-all duration-300 group-hover:scale-105
                `}>
                  {/* CRT Effects */}
                  <div className="crt-scanlines-fast"></div>
                  <div className="crt-phosphor-glow"></div>
                  <div className="crt-vignette absolute inset-0"></div>
                  
                  {/* Grid overlay */}
                  <div className="grid-bg absolute inset-0 opacity-30"></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    
                    {/* Header with icons */}
                    <div className="text-center space-y-4">
                      <div className="flex justify-center items-center gap-3">
                        <div className="text-yellow-500 ocean-drift">
                          {card.icon}
                        </div>
                        <div className="text-cyan-400 compass-navigation">
                          {card.maritimeIcon}
                        </div>
                      </div>
                      
                      <h3 className="text-cyan-400 retro-text text-xl font-bold">
                        {card.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1 flex items-center">
                      <p className="text-gray-300 text-sm leading-relaxed text-center">
                        {card.frontDescription}
                      </p>
                    </div>
                    
                    {/* Flip instruction */}
                    <div className="text-center">
                      <div className="text-yellow-500 text-xs font-bold animate-pulse">
                        CLICK TO FLIP
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        ↻ DISCOVER YOUR PATH ↺
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className={`
                  absolute inset-0 w-full h-full backface-hidden rotate-y-180
                  border-4 border-cyan-400 rounded-lg overflow-hidden
                  bg-gradient-to-b from-gray-900 to-black
                  crt-screen transform-gpu
                  hover:border-yellow-500 hover:shadow-cyan-400/30 hover:shadow-lg
                  transition-all duration-300
                `}>
                  {/* CRT Effects */}
                  <div className="crt-scanlines-slow"></div>
                  <div className="crt-phosphor-glow"></div>
                  
                  {/* Grid overlay */}
                  <div className="grid-bg absolute inset-0 opacity-40"></div>
                  
                  {/* Transformation energy burst effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="transformation-energy absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full"></div>
                  </div>
                  
                  {/* Back Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center space-y-6">
                    
                    {/* Maritime emblem */}
                    <div className="relative">
                      <div className="text-cyan-400 text-6xl captain-glow">
                        {card.maritimeIcon}
                      </div>
                      <div className="absolute -top-2 -right-2 text-yellow-500 animate-pulse">
                        <Zap className="w-6 h-6" />
                      </div>
                    </div>
                    
                    {/* Journey text */}
                    <div className="space-y-3">
                      <h3 className="text-yellow-500 retro-text text-2xl font-bold retro-glow">
                        YOUR JOURNEY
                      </h3>
                      <h4 className="text-cyan-400 retro-text text-xl font-bold">
                        STARTS HERE
                      </h4>
                    </div>
                    
                    {/* CTA Button */}
                    <button
                      onClick={(e) => handleCTAClick(card.id, e)}
                      className="
                        retro-button bg-yellow-500 text-black hover:bg-cyan-400 hover:text-black
                        font-bold px-6 py-3 button-text text-sm
                        transition-all duration-200 transform
                        hover:scale-110 active:scale-95
                        border-2 border-yellow-500 hover:border-cyan-400
                        relative overflow-hidden group/btn
                      "
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {card.backCTA}
                        <Zap className="w-4 h-4 blink" />
                      </span>
                    </button>
                    
                    {/* Rank badge */}
                    <div className="text-gray-400 text-xs">
                      <span className="border border-gray-600 px-2 py-1 rounded bg-black/50">
                        RANK: READY SAILOR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card selection glow when flipped */}
              {isFlipped && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-yellow-500 to-cyan-400 rounded-lg opacity-75 blur-sm animate-pulse -z-10"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-12 text-center space-y-4">
        <div className="border-2 border-dashed border-cyan-400 rounded-lg p-6 bg-black/50">
          <p className="text-cyan-400 text-lg mb-4">
            <span className="retro-text font-bold">CAN'T DECIDE?</span> Every great Captain masters multiple skills!
          </p>
          <p className="text-gray-300 text-sm">
            Join the Academy and unlock training for all crew specializations
          </p>
        </div>
      </div>

      {/* Hidden scanline for global effect */}
      <div className="scanline"></div>
    </section>
  )
}