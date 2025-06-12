"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

interface RetroFooterProps {
  className?: string
}

export function RetroFooter({ className = "" }: RetroFooterProps) {
  const { playSound } = useSound()
  const [isJaxBoinking, setIsJaxBoinking] = useState(false)

  const handleHover = () => {
    playSound("hover")
  }

  const handleButtonClick = () => {
    playSound("click")
  }

  const handleJaxClick = () => {
    playSound("click")
    setIsJaxBoinking(true)
    // Reset the boink animation after it completes
    setTimeout(() => setIsJaxBoinking(false), 600)
  }

  const handleScrollToTop = () => {
    playSound("click")
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <section className={`retro-footer-container ${className}`}>
      {/* Starry Background */}
      <div className="retro-footer-bg">
        {/* Stars */}
        <div className="stars-layer"></div>
        
        {/* Neon Grid Platform */}
        <div className="neon-grid-platform"></div>
        
        {/* Content Container */}
        <div className="retro-footer-content">
          {/* Main Text */}
          <div className="retro-footer-text">
            <h2 className="retro-text text-4xl md:text-6xl text-center mb-4">
              COMMAND YOUR FUTURE.
            </h2>
            <h2 className="retro-text text-4xl md:text-6xl text-center">
              NAVIGATE WITH POWER.
            </h2>
          </div>
          
          {/* Floating Captain Jax */}
          <div className="floating-jax-container">
            <Image
              src="/images/jax-tp.png"
              alt="Captain Jax"
              width={200}
              height={300}
              className={`floating-jax pixel-art cursor-pointer ${isJaxBoinking ? 'jax-boink' : ''}`}
              onMouseEnter={handleHover}
              onClick={handleJaxClick}
            />
          </div>

          {/* CTA Button */}
          <div className="retro-footer-cta">
            <Button
              className="retro-button bg-red-600 text-yellow-400 hover:bg-yellow-400 hover:text-red-600 font-bold px-8 py-3 text-lg border-4 border-yellow-500"
              onClick={handleButtonClick}
              onMouseEnter={handleHover}
              asChild
            >
              <a href="#">
                BECOME A CAPTAIN NOW
              </a>
            </Button>
          </div>

          {/* Scroll Up Button */}
          <div className="scroll-up-container">
            <Button
              variant="outline"
              size="icon"
              className="scroll-up-button border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent"
              onClick={handleScrollToTop}
              onMouseEnter={handleHover}
              title="Scroll to top"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 