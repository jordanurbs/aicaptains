"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { MobileVideoPlayer } from "@/components/mobile-video-player"

interface RetroFooterProps {
  className?: string
}

export function RetroFooter({ className = "" }: RetroFooterProps) {
  const { playSound, fadeBackgroundMusic, originalBackgroundVolume } = useSound()
  const [isJaxBoinking, setIsJaxBoinking] = useState(false)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [shouldAutoplay, setShouldAutoplay] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

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

  const handleVideoStart = () => {
    setIsVideoPlaying(true)
    // Background music is already faded when footer comes into view
  }

  const handleVideoEnd = () => {
    setIsVideoPlaying(false)
    // Only restore background music if user scrolls away from footer
    // This will be handled by the intersection observer
  }

  // Trigger animation sequence and audio management when footer comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true)
            // Fade background music when footer comes into view
            fadeBackgroundMusic(originalBackgroundVolume * 0.1, 1500)
            // Enable video autoplay after a short delay for animations to settle
            setTimeout(() => {
              setShouldAutoplay(true)
            }, 2000)
            console.log("Footer animations started - footer is in view!")
          } else if (!entry.isIntersecting && animationStarted) {
            // Restore background music when footer goes out of view
            fadeBackgroundMusic(originalBackgroundVolume, 1500)
          }
        })
      },
      {
        threshold: 0.1 // Trigger when 10% of footer is visible
      }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [animationStarted, fadeBackgroundMusic, originalBackgroundVolume])

  return (
    <section ref={footerRef} className={`retro-footer-container ${className}`}>
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
            <h2 className={`retro-text text-4xl md:text-6xl text-center mb-1 ${animationStarted ? 'text-slam-1' : 'text-pre-slam'}`}>
              COMMAND YOUR FUTURE.
            </h2>
            <h2 className={`retro-text text-4xl md:text-6xl text-center ${animationStarted ? 'text-slam-2' : 'text-pre-slam'}`}>
              NAVIGATE WITH POWER.
            </h2>
          </div>
          
          {/* Mobile Video Player */}
          <div className="floating-jax-container">
            <MobileVideoPlayer
              videoSrc="/videos/jax-jumps.webm"
              className={`${animationStarted ? 'phone-cinematic-entry' : 'phone-pre-materialize'}`}
              onVideoStart={handleVideoStart}
              onVideoEnd={handleVideoEnd}
              autoplay={shouldAutoplay}
            />
          </div>

          {/* CTA Button */}
          <div className={`retro-footer-cta ${animationStarted ? 'cta-materialize' : 'cta-pre-materialize'}`}>
            <Button
              className="retro-button bg-red-600 text-yellow-400 hover:bg-yellow-400 hover:text-red-600 font-bold px-12 py-6 button-text border-4 border-yellow-500"
              onClick={handleButtonClick}
              onMouseEnter={handleHover}
              asChild
            >
              <a href="https://skool.com/aicaptains" target="_blank" rel="noopener noreferrer">
                BECOME A CAPTAIN NOW
              </a>
            </Button>
          </div>

          {/* Note: Scroll Up Button moved to sticky position outside footer */}
        </div>
      </div>
    </section>
  )
} 