"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export function DiscoveryCallEmbed() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Use a direct iframe embed approach to avoid script loading issues
  return (
    <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-yellow-500 text-black p-2 flex justify-between items-center">
        <h2 className="text-xl font-bold retro-text">STRUGGLING TO BUILD WITH AI?</h2>
        <ChevronRight className="w-6 h-6" />
      </div>
      <div className="p-6">
        {/* Retro-styled intro text */}
        <div className="text-center mb-6">
          <p className="text-cyan-400 retro-text text-lg mb-2">SCHEDULE YOUR DISCOVERY MISSION</p>
          <p className="text-gray-300 text-xs">Select a time slot to begin your AI CAPTAINS journey. Let's connect.</p>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 text-sm">Loading calendar...</p>
          </div>
        )}

        {/* Calendar container with retro styling */}
        <div className="calendar-container relative" style={{ height: "600px" }}>
          {/* Direct iframe embed to Cal.com */}
          <iframe
            src="https://book.jordanurbs.com/me/15min?embed=true&theme=dark&layout=month_view"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "4px",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
            onLoad={() => setIsLoaded(true)}
            title="Schedule a Discovery Call"
            allow="camera; microphone; fullscreen; payment"
          />

          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none calendar-scanlines"></div>

          {/* Retro border */}
          <div className="absolute inset-0 pointer-events-none calendar-border"></div>
        </div>
      </div>
    </section>
  )
}
