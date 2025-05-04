"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

type IntroStep = "black" | "logo-appear" | "tagline" | "grid-appear" | "products-appear" | "press-start" | "complete"

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

    // Sequence timing - 3x faster
    timers.push(setTimeout(() => setCurrentStep("logo-appear"), 333))
    timers.push(setTimeout(() => setCurrentStep("tagline"), 7000))
    timers.push(setTimeout(() => setCurrentStep("grid-appear"), 1267))
    timers.push(setTimeout(() => setCurrentStep("press-start"), 1633))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [skipIntro, onComplete])

  // Handle the "PRESS START" action
  const handlePressStart = () => {
    playSound("click")
    // Play background music when PRESS START is clicked
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

      {/* Scanline effect */}
      <div className="scanline"></div>

      {/* Grid background - only visible after certain step */}
      {currentStep !== "black" && currentStep !== "logo-appear" && (
        <div
          className={`absolute inset-0 grid-bg transition-opacity duration-300 ${
            currentStep === "grid-appear" || currentStep === "products-appear" || currentStep === "press-start"
              ? "opacity-100"
              : "opacity-0"
          }`}
        ></div>
      )}

      {/* Logo animation */}
      <div
        className={`transition-all duration-300 transform ${
          currentStep === "black" ? "opacity-0 scale-50" : "opacity-100 scale-100"
        }`}
      >
        <Image
          src="/images/aiclogo.png"
          alt="AI CAPTAINS"
          width={500}
          height={250}
          className={`object-contain ${currentStep === "press-start" ? "animate-pulse" : ""}`}
        />
      </div>

      {/* Tagline */}
      <div
        className={`mt-6 transition-all duration-100 ${
          currentStep === "black" || currentStep === "logo-appear"
            ? "opacity-0 transform translate-y-10"
            : "opacity-100 transform translate-y-0"
        }`}
      >
        <p className="text-cyan-400 retro-text text-xl text-center">COMMAND YOUR FUTURE.</p>
        <p className="text-cyan-400 retro-text text-xl text-center mt-2 mb-6">NAVIGATE WITH POWER.</p>
      </div>

      {/* Press Start Button */}
      {currentStep === "press-start" && (
        <div className="mt-12 animate-bounce">
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
      <div
        className={`absolute bottom-8 text-gray-500 text-xs ${
          currentStep === "press-start" ? "opacity-100" : "opacity-0"
        } transition-opacity duration-90`}
      >
        © 2025 AI CAPTAINS INC. ALL RIGHTS RESERVED.
      </div>
    </div>
  )
}
