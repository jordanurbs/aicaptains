"use client"

import { useState, useEffect } from "react"
import { useSound } from "@/components/sound-provider"
import { InteractiveTVPlayer } from "@/components/interactive-tv-player"
import Image from "next/image"

type IntroStep = 
  | "black" 
  | "ocean-intro" 
  | "ocean-navigate" 
  | "ocean-obstacles" 
  | "space-transform" 
  | "space-navigate" 
  | "retrowave-transform" 
  | "final-destination" 
  | "press-start" 
  | "complete"

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState<IntroStep>("black")
  const [skipIntro] = useState(false)
  const [tvState, setTvState] = useState<'off' | 'booting' | 'static' | 'playing' | 'paused'>('off')

  // Handle the intro sequence steps
  useEffect(() => {
    if (skipIntro) {
      setCurrentStep("complete")
      onComplete()
      return
    }

    const timers: NodeJS.Timeout[] = []

    // Sequence timing - adjusted with longer intervals to prevent restart
    timers.push(setTimeout(() => setCurrentStep("ocean-intro"), 500))
    timers.push(setTimeout(() => setCurrentStep("ocean-navigate"), 6000))
    timers.push(setTimeout(() => setCurrentStep("ocean-obstacles"), 12000))
    timers.push(setTimeout(() => setCurrentStep("space-transform"), 18000))
    timers.push(setTimeout(() => setCurrentStep("space-navigate"), 24000))
    timers.push(setTimeout(() => setCurrentStep("retrowave-transform"), 30000))
    timers.push(setTimeout(() => setCurrentStep("final-destination"), 36000))
    timers.push(setTimeout(() => setCurrentStep("press-start"), 42000))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [skipIntro, onComplete])


  // If intro is complete, don't render anything
  if (currentStep === "complete") {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Logo at the top - always visible */}
      <div className="flex justify-center pt-6 pb-4 z-40">
        <Image
          src="/images/aiclogo.png"
          alt="AI CAPTAINS"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Interactive TV Player Container - Well Proportioned */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="relative aspect-[16/9] w-[120vw] max-w-[1400px] h-auto max-h-[80vh]">
          <InteractiveTVPlayer
            videoSrc="/videos/intro-teaser-v1.mp4"  
            autoPlay={!skipIntro}
            onStateChange={setTvState}
            onSkipToMain={onComplete}
          />
        </div>
      </div>

      {/* TV Status Indicator */}
      {tvState !== 'off' && (
        <div className="absolute top-8 right-8 z-60 bg-black/80 border border-orange-500 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              tvState === 'playing' ? 'bg-green-500 animate-pulse' :
              tvState === 'paused' ? 'bg-yellow-500' :
              tvState === 'static' || tvState === 'booting' ? 'bg-red-500 animate-pulse' :
              'bg-gray-500'
            }`} />
            <span className="text-orange-400 text-sm font-mono uppercase">{tvState}</span>
          </div>
        </div>
      )}


      {/* Nintendo-style copyright text */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs">
        © 2025 AI CAPTAINS LLC. ALL RIGHTS RESERVED.
      </div>

      {/* Retro Gaming CSS */}
      <style jsx global>{`
        .retro-button {
          font-family: 'Courier Prime Mono', monospace;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
        }
        
        .retro-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .retro-button:hover::before {
          left: 100%;
        }
        
        .button-text {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 16px;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
