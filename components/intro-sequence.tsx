"use client"

import { useState, useEffect } from "react"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import JaxAdventure from "@/components/jax-adventure-animation"

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
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Skip button */}
      <button onClick={handleSkipIntro} className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm z-50">
        SKIP INTRO
      </button>

      {/* TV Frame (4:3) */}
      <div className="relative flex items-center justify-center w-full h-full z-10">
        <div className="tv-frame bg-black border-8 border-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center mx-auto aspect-[4/3] w-[90vw] max-w-[960px] h-auto max-h-[80vh] overflow-hidden relative">
          {/* CRT overlay */}
          <div className="absolute inset-0 pointer-events-none crt-effect z-20"></div>
          
          {/* Scanline effect */}
          <div className="scanline"></div>
          
          {/* JAX Adventure Animation */}
          <div className="w-full h-full">
            <JaxAdventure />
          </div>

          {/* Text overlays inside TV */}
          <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-full max-w-2xl md:w-3/4 mx-auto text-center px-4 py-2 bg-black/40 rounded-lg" style={{ fontFamily: 'VT323, monospace' }}>
              {/* Ocean intro text */}
              {currentStep === "ocean-intro" && (
                <div className="animate-fade-in">
                  <p className="text-cyan-400 text-2xl md:text-3xl mb-2">In the sea of shiny no-code platforms...</p>
                </div>
              )}
              {/* Ocean navigation text */}
              {currentStep === "ocean-navigate" && (
                <div className="animate-fade-in">
                  <p className="text-cyan-400 text-2xl md:text-3xl mb-2">The AI Revolution has brought unprecedented opportunities...</p>
                </div>
              )}
              {/* Space transformation text */}
              {currentStep === "space-transform" && (
                <div className="animate-fade-in">
                  <p className="text-cyan-400 text-2xl md:text-3xl mb-2">But also confusion. Complexity. Hype.</p>
                </div>
              )}
              {/* Space navigation text */}
              {currentStep === "space-navigate" && (
                <div className="animate-fade-in">
                  <p className="text-cyan-400 text-2xl md:text-3xl mb-2">Most are drifting. Few are navigating.</p>
                </div>
              )}
              {/* Final destination text */}
              {currentStep === "final-destination" && (
                <div className="animate-fade-in">
                  <p className="text-cyan-400 text-2xl md:text-3xl mb-2">COMMAND YOUR FUTURE.</p>
                  <p className="text-cyan-400 text-2xl md:text-3xl mt-2">NAVIGATE WITH POWER.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Press Start Button */}
      {currentStep === "press-start" && (
        <div className="mt-12 animate-bounce z-20">
          <Button
            variant="outline"
            className="retro-button bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-6 text-xl"
            onClick={handlePressStart}
          >
            <Gamepad2 className="mr-2 h-6 w-6" /> PRESS START
          </Button>
        </div>
      )}

      {/* Nintendo-style copyright text */}
      <div className="absolute bottom-4 text-gray-500 text-xs">
        © 2024 JAYEYE. ALL RIGHTS RESERVED.
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
      `}</style>
    </div>
  )
}
