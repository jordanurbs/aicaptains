"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, Twitter, Linkedin, Youtube, ChevronRight, Star, Gamepad2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SoundProvider } from "@/components/sound-provider"
import { SoundToggle } from "@/components/sound-toggle"
import { useSound } from "@/components/sound-provider"
import { IntroSequence } from "@/components/intro-sequence"
import { GameButton } from "@/components/mini-game/game-button"
import { TestimonialsWidget } from "@/components/testimonials-widget"
import { DiscoveryCallEmbed } from "@/components/discovery-call-embed"
import { DigitalMarquee } from "@/components/digital-marquee"
import { ScrollIndicators } from "@/components/scroll-indicators"
import { NewsletterSignup } from "@/components/newsletter-signup"

// Wrap the main component with sound effects
function AICaptainsContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const { playSound, isLoaded } = useSound()

  // Check if we should show the intro (only once per session)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")
    if (hasSeenIntro) {
      setShowIntro(false)
    }
  }, [])

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false)
    sessionStorage.setItem("hasSeenIntro", "true")

    // Play startup sound after intro completes
    if (isLoaded) {
      playSound("startup")
    }
  }

  // Nintendo-style menu navigation with keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro) return // Don't handle keyboard navigation during intro

      if (e.key === "ArrowDown") {
        // Play scroll sound first for better user feedback
        playSound("scroll")
        
        setSelectedItem((prev) => {
          const newValue = prev < 3 ? prev + 1 : prev
          if (newValue !== prev) playSound("select")
          return newValue
        })
      } else if (e.key === "ArrowUp") {
        // Play scroll sound first for better user feedback
        playSound("scroll")
        
        setSelectedItem((prev) => {
          const newValue = prev > 0 ? prev - 1 : prev
          if (newValue !== prev) playSound("select")
          return newValue
        })
      } else if (e.key === "Enter") {
        playSound("click")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playSound, showIntro])

  // Handle button click sound
  const handleButtonClick = () => {
    playSound("click")
  }

  // Handle PRESS START button click
  const handlePressStart = () => {
    playSound("click")
    // No longer start background music here since it's started in the intro sequence
  }

  // Handle hover sound
  const handleHover = () => {
    playSound("hover")
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative crt-effect">
      {/* Scroll Indicators - placed at top level to always be visible */}
      <ScrollIndicators />

      {/* Show intro sequence if needed */}
      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}

      {/* Scanline effect */}
      <div className="scanline"></div>

      {/* Grid background */}
      <div className="grid-bg absolute inset-0 z-0"></div>

      <div className="relative z-10 flex flex-col h-screen">
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Left Sidebar - Sticky on desktop */}
          <div className="sticky-sidebar bg-gray-900 p-6 border-4 border-yellow-500 rounded-lg lg:rounded-none lg:border-r-4 lg:border-l-0 lg:border-t-0 lg:border-b-0">
            <div className="space-y-6 h-full flex flex-col">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src="/images/aiclogo.png"
                  alt="AI CAPTAINS"
                  width={300}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Marquee - now full width */}
              <div className="flex items-center justify-center">
                <DigitalMarquee text="BUILD WITH AI, NOT LIMITS" />
              </div>

              {/* Tagline */}
              <div className="text-center">
                <p className="text-cyan-400 retro-text text-lg">COMMAND YOUR FUTURE.</p>
                <p className="text-cyan-400 retro-text text-lg">NAVIGATE WITH POWER.</p>
              </div>

              {/* Bio */}
              <div className="space-y-6 border-t-2 border-b-2 border-yellow-500 py-4">
                <p className="text-gray-300 leading-relaxed text-sm">
                  We train tech-capable BUILDERS to build business tools with AI and vibe coding.</p><p className="text-gray-300 leading-relaxed text-sm">
                  <span className="text-yellow-500 font-bold"> PRESS START</span> to begin your journey:
                </p>
                <Button
                  variant="outline"
                  className="w-full retro-button bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black"
                  onClick={handlePressStart}
                  onMouseEnter={handleHover}
                >
                  <Gamepad2 className="mr-2 h-4 w-4" /> PRESS START
                </Button>
              </div>

              {/* Game Button */}
              <div className="text-center">
                <GameButton />
              </div>

              {/* Newsletter Signup */}
              <div className="py-2">
                <NewsletterSignup />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  {["Twitter", "Linkedin", "Youtube"].map((platform) => (
                    <Button
                      key={platform}
                      variant="ghost"
                      size="icon"
                      className="text-yellow-500 hover:text-cyan-400 hover:bg-transparent"
                      asChild
                      onClick={handleButtonClick}
                      onMouseEnter={handleHover}
                    >
                      <Link href="#">
                        {platform === "Twitter" && <Twitter className="w-5 h-5" />}
                        {platform === "Linkedin" && <Linkedin className="w-5 h-5" />}
                        {platform === "Youtube" && <Youtube className="w-5 h-5" />}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="text-gray-400 text-xs text-center">
                  <p>© 2025 AI-CAPTAINS.COM</p>
                  <p>Built by <a href="https://jordanurbs.com" className="hover:text-cyan-400">Jordan Urbs</a></p>
                {/*  <div className="flex justify-center gap-4 mt-1">
                    <Link
                      href="#"
                      className="hover:text-cyan-400"
                      onClick={handleButtonClick}
                      onMouseEnter={handleHover}
                    >
                      MANUAL
                    </Link>
                    <Link
                      href="#"
                      className="hover:text-cyan-400"
                      onClick={handleButtonClick}
                      onMouseEnter={handleHover}
                    >
                      CHEAT CODES
                    </Link>
                  </div>*/}
                </div> 
              </div>
            </div>
          </div>

          {/* Right Content - Scrollable */}
          <div className="content-with-sidebar p-6 space-y-8 overflow-y-auto">
            {/* Menu Button - Only show on mobile */}
            <div className="flex justify-end lg:hidden">
              <Button
                variant="outline"
                size="icon"
                className="border-yellow-500 text-yellow-500"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                  handleButtonClick()
                }}
                onMouseEnter={handleHover}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-lg border-4 border-yellow-500 p-6 bg-gradient-to-b from-blue-900 to-purple-900">
              <div className="absolute inset-0 grid-bg opacity-50"></div>
              <div className="relative z-10">
                <Image
                  src="/images/magazine.png"
                  alt="AI CAPTAINS Magazine"
                  width={500}
                  height={300}
                  className="mx-auto object-contain"
                />
                <div className="mt-4 text-center">
                  <Button
                    className="retro-button bg-red-600 text-yellow-400 hover:bg-yellow-400 hover:text-red-600 font-bold px-8 py-2 text-lg"
                    onClick={handleButtonClick}
                    onMouseEnter={handleHover}
                  >
                    POWER UP NOW <Zap className="ml-2 h-5 w-5 blink" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
              <div className="bg-yellow-500 text-black p-2 flex justify-between items-center">
                <h2 className="text-xl font-bold retro-text">SELECT YOUR POWER-UP</h2>
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Terminal Navigation Toolkit */}
                <div
                  className={`relative border-4 ${selectedItem === 0 ? "border-cyan-400 blink" : "border-gray-700"} rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => {
                    setSelectedItem(0)
                    playSound("click")
                  }}
                  onMouseEnter={() => {
                    handleHover()
                  }}
                >
                  <Image
                    src="/images/tnt-boxart.png"
                    alt="Terminal Navigation Toolkit"
                    width={200}
                    height={300}
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                    <p className="text-yellow-500 text-sm font-bold">TERMINAL NAVIGATION TOOLKIT</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Implementation Call */}
                <div
                  className={`relative border-4 ${selectedItem === 1 ? "border-cyan-400 blink" : "border-gray-700"} rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => {
                    setSelectedItem(1)
                    playSound("click")
                  }}
                  onMouseEnter={() => {
                    handleHover()
                  }}
                >
                  <Image
                    src="/images/implementation-call.png"
                    alt="Implementation Call"
                    width={200}
                    height={300}
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                    <p className="text-yellow-500 text-sm font-bold">IMPLEMENTATION CALL</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Captains Academy */}
                <div
                  className={`relative border-4 ${selectedItem === 2 ? "border-cyan-400 blink" : "border-gray-700"} rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => {
                    setSelectedItem(2)
                    playSound("click")
                  }}
                  onMouseEnter={() => {
                    handleHover()
                  }}
                >
                  <Image
                    src="/images/academy-boxart.png"
                    alt="AI Captains Academy"
                    width={200}
                    height={300}
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                    <p className="text-yellow-500 text-sm font-bold">AI CAPTAINS ACADEMY <span className="text-cyan-400 text-xs">(Coming Soon!)</span></p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Co-Founder Program */}
                <div
                  className={`relative border-4 ${selectedItem === 3 ? "border-cyan-400 blink" : "border-gray-700"} rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => {
                    setSelectedItem(3)
                    playSound("click")
                  }}
                  onMouseEnter={() => {
                    handleHover()
                  }}
                >
                  <Image
                    src="/images/cofounderprogram.png"
                    alt="Executive Co-Founder Program"
                    width={200}
                    height={300}
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                    <p className="text-yellow-500 text-sm font-bold">EXECUTIVE CO-FOUNDER PROGRAM</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* Testimonials Section - Full Width */}
            <TestimonialsWidget />

            {/* Discovery Call Calendar - Full Width */}
            <DiscoveryCallEmbed />

            {/* Contact Section - Full Width 
            <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
              <div className="bg-yellow-500 text-black p-2">
                <h2 className="text-xl font-bold retro-text">CONTACT</h2>
              </div>
              <div className="p-4 relative">
                <div className="absolute inset-0 grid-bg opacity-30"></div>
                <div className="relative z-10">
                  <p className="text-cyan-400 mb-4">READY PLAYER ONE?</p>
                  <Button
                    className="retro-button bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    onClick={handleButtonClick}
                    onMouseEnter={handleHover}
                  >
                    SEND MESSAGE <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with sound provider
export default function AICaptains() {
  return (
    <SoundProvider>
      <AICaptainsContent />
    </SoundProvider>
  )
}
