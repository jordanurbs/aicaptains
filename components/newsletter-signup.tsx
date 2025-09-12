"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { playSound } = useSound()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playSound("select")
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setEmail("")
      // Reset after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 500)
  }

  const handleInputFocus = () => {
    playSound("hover")
  }

  return (
    <div className="newsletter-container border-2 border-yellow-500 bg-gray-900 p-3 rounded-lg">
      <div className="bg-yellow-500 text-black p-2 -mt-5 mb-3 rounded-md transform rotate-1 shadow-lg">
        <h3 className="text-3xl md:text-4xl font-bold retro-text text-center">JOIN THE VIBE BUILDERS</h3>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="YOUR EMAIL"
              required
              className="w-full bg-black border-2 border-cyan-400 text-cyan-400 p-4 uppercase rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-cyan-700 font-bold"
              style={{ fontFamily: '"SHPinscher", monospace', fontSize: '1.5rem' }}
            />
            <div className="absolute inset-0 pointer-events-none scanline-thin"></div>
          </div>

          <Button
            type="submit"
            className="w-full retro-button bg-cyan-600 text-yellow-400 hover:bg-yellow-400 hover:text-cyan-600 font-bold sidebar-button-text px-4 py-2"
          >
            SUBSCRIBE <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="text-center py-2">
          <p className="text-cyan-400 retro-text text-sm blink">TRANSMISSION RECEIVED!</p>
          <p className="text-gray-400 text-xs mt-2">Welcome to the crew, Captain!</p>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Weekly power-ups. No spam.</p>
        <p>Unsubscribe anytime.</p>
      </div>
    </div>
  )
}
