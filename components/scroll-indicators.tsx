"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Gamepad2 } from "lucide-react"

export function ScrollIndicators({ alwaysVisible = true }: { alwaysVisible?: boolean }) {
  const [showIndicators, setShowIndicators] = useState(true)
  const [activeArrow, setActiveArrow] = useState<"up" | "down" | null>(null)

  // Handle arrow key presses to show activity
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setActiveArrow("up")
        setTimeout(() => setActiveArrow(null), 300)
      } else if (e.key === "ArrowDown") {
        setActiveArrow("down")
        setTimeout(() => setActiveArrow(null), 300)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // If in always visible mode, don't hide the indicators
  if (!showIndicators && !alwaysVisible) return null

  return (
    <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-[100]">
      {/* Game controller container */}
      <div className="bg-gray-900 bg-opacity-90 border-4 border-yellow-500 rounded-lg p-4 flex flex-col items-center shadow-lg shadow-black/50 relative">
        {/* Controller light indicator */}
        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-glow"></div>
        
        {/* Controller icon */}
        <div className="absolute -top-3 -left-3 bg-black rounded-full p-1 border-2 border-yellow-500">
          <Gamepad2 className="h-5 w-5 text-yellow-500" />
        </div>

        {/* Controller name */}
        <div className="absolute -top-2.5 left-6 right-6 text-center">
          <div className="bg-black text-yellow-500 text-xs px-2 py-0.5 rounded border border-yellow-500 text-[8px] font-bold">
            AI-PAD
          </div>
        </div>

        <div className="text-center mb-2 mt-1">
          <p className="text-yellow-500 text-xs retro-text">PRESS</p>
        </div>

        <div className={`arrow-container ${activeArrow === "up" ? "arrow-active" : ""}`}>
          <ChevronUp className="h-8 w-8 text-yellow-500 arrow-up" />
        </div>

        <div className="arrow-key-label">
          <span className="text-cyan-400 text-xs retro-text">UP</span>
        </div>

        <div className="my-2 text-gray-500 font-bold">/</div>

        <div className={`arrow-container ${activeArrow === "down" ? "arrow-active" : ""}`}>
          <ChevronDown className="h-8 w-8 text-yellow-500 arrow-down" />
        </div>

        <div className="arrow-key-label mb-1">
          <span className="text-cyan-400 text-xs retro-text">DOWN</span>
        </div>
        
        {/* Controller bottom dots */}
        <div className="flex space-x-3 mt-1 border-t border-gray-700 pt-2 w-full justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
        </div>
      </div>
    </div>
  )
}
