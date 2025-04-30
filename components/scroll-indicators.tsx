"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export function ScrollIndicators() {
  const [showIndicators, setShowIndicators] = useState(true)
  const [activeArrow, setActiveArrow] = useState<"up" | "down" | null>(null)

  // Hide indicators after user has scrolled or used arrow keys
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowIndicators(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setActiveArrow("up")
        setTimeout(() => setActiveArrow(null), 300)

        // Hide after a few arrow key presses
        setTimeout(() => {
          setShowIndicators(false)
        }, 3000)
      } else if (e.key === "ArrowDown") {
        setActiveArrow("down")
        setTimeout(() => setActiveArrow(null), 300)

        // Hide after a few arrow key presses
        setTimeout(() => {
          setShowIndicators(false)
        }, 3000)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleKeyDown)

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setShowIndicators(false)
    }, 10000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timer)
    }
  }, [])

  if (!showIndicators) return null

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center">
      <div className="text-center mb-2">
        <p className="text-yellow-500 text-xs retro-text">PRESS</p>
      </div>

      <div className={`arrow-container ${activeArrow === "up" ? "arrow-active" : ""}`}>
        <ChevronUp className="h-8 w-8 text-yellow-500 arrow-up" />
      </div>

      <div className="arrow-key-label">
        <span className="text-cyan-400 text-xs">UP</span>
      </div>

      <div className="my-2 text-gray-500">/</div>

      <div className={`arrow-container ${activeArrow === "down" ? "arrow-active" : ""}`}>
        <ChevronDown className="h-8 w-8 text-yellow-500 arrow-down" />
      </div>

      <div className="arrow-key-label">
        <span className="text-cyan-400 text-xs">DOWN</span>
      </div>
    </div>
  )
}
