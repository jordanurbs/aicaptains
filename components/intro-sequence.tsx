"use client"

import { useState, useEffect } from "react"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import JaxAdventure from "@/components/jax-adventure-animation"
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
  const [skipIntro, setSkipIntro] = useState(false)
  const [keysPressed, setKeysPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  })
  const { playSound } = useSound()

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

  // Handle the "PRESS START" action
  const handlePressStart = () => {
    console.log("Press Start button clicked!")
    playSound("click")
    playSound("background")
    setCurrentStep("complete")
    onComplete()
  }

  // Handle skip intro
  const handleSkipIntro = () => {
    playSound("click")
    setSkipIntro(true)
  }

  // If intro is complete, don't render anything
  if (currentStep === "complete") {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Logo at the top - always visible */}
      <div className="flex justify-center pt-4 pb-2 z-40">
        <Image
          src="/images/aiclogo.png"
          alt="AI CAPTAINS"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      {/* TV Frame Container - adjusted for smaller size */}
      <div className="flex-1 flex items-center justify-center px-4 z-10">
        <div className="tv-frame bg-black border-8 border-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center aspect-[4/3] w-[80vw] max-w-[720px] h-auto max-h-[50vh] overflow-hidden relative">
          {/* CRT overlay */}
          <div className="absolute inset-0 pointer-events-none crt-effect z-20"></div>
          
          {/* Scanline effect */}
          <div className="scanline"></div>
          
          {/* JAX Adventure Animation */}
          <div className="w-full h-full">
            <JaxAdventure onKeysPressed={setKeysPressed} />
          </div>


        </div>
      </div>

      {/* Arrow Key Controller - Outside TV frame */}
      <div className="absolute bottom-8 right-8 z-60">
        <div className="arrow-key-overlay bg-black/80 border border-yellow-500 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-1">
            {/* Top row */}
            <div></div>
            <div 
              className={`arrow-key ${keysPressed.ArrowUp ? 'active' : ''}`}
              style={{ gridColumn: 2 }}
            >
              ↑
            </div>
            <div></div>
            
            {/* Middle row */}
            <div className={`arrow-key ${keysPressed.ArrowLeft ? 'active' : ''}`}>
              ←
            </div>
            <div></div>
            <div className={`arrow-key ${keysPressed.ArrowRight ? 'active' : ''}`}>
              →
            </div>
            
            {/* Bottom row */}
            <div></div>
            <div 
              className={`arrow-key ${keysPressed.ArrowDown ? 'active' : ''}`}
              style={{ gridColumn: 2 }}
            >
              ↓
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Press Start Button - Always visible at bottom */}
      <div className="flex justify-center pb-20 z-50 relative">
        <button
          className={`retro-button bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black px-6 py-4 text-lg cursor-pointer border border-yellow-500 rounded-md inline-flex items-center justify-center gap-2 ${currentStep === "press-start" ? "animate-bounce" : ""}`}
          onClick={handlePressStart}
          style={{ pointerEvents: 'auto' }}
        >
          <Gamepad2 className="mr-2 h-5 w-5" /> PRESS START
        </button>
      </div>

      {/* Nintendo-style copyright text */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs">
        © 2025 AI CAPTAINS LLC. ALL RIGHTS RESERVED.
      </div>

      {/* CRT and Scanline CSS */}
      <style jsx global>{`
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 25;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.2) 51%
          );
          background-size: 100% 4px;
          pointer-events: none;
        }
        
        .crt-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 24;
          background: radial-gradient(
            circle at center,
            transparent 60%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
        }
        
        .tv-frame {
          position: relative;
          box-shadow: 0 0 30px rgba(255, 204, 0, 0.5);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .arrow-key-overlay {
          backdrop-filter: blur(4px);
          box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
        }
        
        .arrow-key {
          width: 32px;
          height: 32px;
          border: 1px solid #fbbf24;
          background: rgba(0, 0, 0, 0.7);
          color: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          border-radius: 4px;
          transition: all 0.1s ease;
        }
        
        .arrow-key.active {
          background: #fbbf24;
          color: #000;
          box-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}
