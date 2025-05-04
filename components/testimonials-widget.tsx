"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"

export function TestimonialsWidget() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load the Senja script
    const script = document.createElement("script")
    script.src = "https://widget.senja.io/widget/6e176c06-65fb-4f96-a92b-38947e83a7e2/platform.js"
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-yellow-500 text-black p-2 flex justify-between items-center">
        <h2 className="text-xl font-bold retro-text">PLAYER REVIEWS</h2>
        <ChevronRight className="w-6 h-6" />
      </div>
      <div className="p-6">


        {/* Loading indicator */}
        {!isLoaded && (
          <div className="flex justify-center items-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Senja embed container */}
        <div 
          className="senja-embed" 
          data-id="6e176c06-65fb-4f96-a92b-38947e83a7e2" 
          data-mode="shadow" 
          data-lazyload="false" 
          style={{ display: "block", width: "100%" }}
        />
      </div>
    </section>
  )
}
