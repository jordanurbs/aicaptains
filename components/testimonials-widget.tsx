"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export function TestimonialsWidget() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Use a simple iframe approach to completely isolate the Senja widget
  // This prevents any ResizeObserver loops from affecting our main page
  return (
    <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-yellow-500 text-black p-2 flex justify-between items-center">
        <h2 className="text-xl font-bold retro-text">CAPTAIN TESTIMONIALS</h2>
        <ChevronRight className="w-6 h-6" />
      </div>
      <div className="p-6">
        {/* Retro-styled intro text */}
        <div className="text-center mb-6">
          <p className="text-cyan-400 retro-text text-sm mb-2">PLAYER REVIEWS</p>
          <p className="text-gray-300 text-xs">See what other AI Captains are saying about their journey</p>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="flex justify-center items-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Iframe container with fixed height to prevent layout shifts */}
        <div className="testimonial-iframe-container" style={{ height: "500px", position: "relative" }}>
          <iframe
            src="https://embed.senja.io/6e176c06-65fb-4f96-a92b-38947e83a7e2/shadow"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
            onLoad={() => setIsLoaded(true)}
            title="AI CAPTAINS Testimonials"
          />

          {/* Fallback message in case iframe fails to load */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <noscript>
                <p className="text-cyan-400 text-center">Please enable JavaScript to view testimonials</p>
              </noscript>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
