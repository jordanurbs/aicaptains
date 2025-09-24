"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X as CloseIcon, Volume2, VolumeX, Calendar, MessageSquare, Play as YoutubeIcon, X as XIcon, Zap, Wrench, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameButton } from "@/components/mini-game/game-button"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { DigitalMarquee } from "@/components/digital-marquee"

interface MobileNavigationProps {
  isMuted: boolean
  toggleMute: () => void
  onButtonClick: () => void
  onHover: () => void
  scrollToTestimonials: () => void
  scrollToCourses: () => void
  scrollToTnt: () => void
}

export function MobileNavigation({
  isMuted,
  toggleMute,
  onButtonClick,
  onHover,
  scrollToTestimonials,
  scrollToCourses,
  scrollToTnt
}: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    onButtonClick()
  }

  return (
    <>
      {/* Mobile Header - Fixed at top */}
      <div className="lg:hidden sticky-nav-mobile sticky-nav-optimized sticky-nav-accessible px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/academy-logo-min.png"
              alt="AI CAPTAINS ACADEMY"
              width={120}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                toggleMute()
                onButtonClick()
              }}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
              onMouseEnter={onHover}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {/* Hamburger Menu */}
            <Button
              variant="outline"
              size="icon"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              onClick={toggleMenu}
              onMouseEnter={onHover}
            >
              {isMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleMenu}
        />

        {/* Drawer */}
        <div className={`absolute left-0 right-0 bottom-0 bg-gray-900 border-4 border-yellow-500 border-t-0 mobile-drawer-optimized overflow-y-auto ${
          isMenuOpen ? 'open' : 'closed'
        }`}
        style={{ top: 'var(--nav-height-mobile)' }}>
          <div className="p-6 space-y-6">
            {/* Marquee */}
            <div className="flex items-center justify-center">
              <DigitalMarquee text="BUILD WITH AI, NOT LIMITS" />
            </div>

            {/* Tagline */}
            <div className="text-center">
              <p className="text-cyan-400 retro-text text-3xl sm:text-4xl md:text-5xl retro-leading-tight">COMMAND YOUR FUTURE.</p>
              <p className="text-cyan-400 retro-text text-3xl sm:text-4xl md:text-5xl retro-leading-tight">NAVIGATE WITH POWER!</p>
            </div>

            {/* Bio */}              <div className="space-y-6 border-t-2 border-b-2 border-yellow-500 py-4">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    AI CAPTAINS ACADEMY empowers online builders to learn to build & deploy AI-powered apps with conversation-driven development.<br></br><br></br>We transform no code passengers into AI Captains.</p>
                </div>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold justify-start"
                onClick={() => {
                  scrollToTnt()
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <Wrench className="w-4 h-4 mr-2" />
                FREE TOOLKIT
              </Button>
              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold justify-start"
                onClick={() => {
                  onButtonClick()
                  window.open('https://youtube.com/@jordanurbsai', '_blank')
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <YoutubeIcon className="w-4 h-4 mr-2" />
                YOUTUBE
              </Button>

              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold justify-start"
                onClick={() => {
                  scrollToCourses()
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                COURSES
              </Button>

              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold justify-start"
                onClick={() => {
                  scrollToTestimonials()
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                TESTIMONIALS
              </Button>

              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold justify-start"
                onClick={() => {
                  onButtonClick()
                  window.open('https://calls.ai-captains.com/', '_blank')
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <Calendar className="w-4 h-4 mr-2" />
                GET HELP NOW
              </Button>

              <Button
                className="w-full retro-button bg-yellow-500 text-black hover:bg-cyan-400 hover:text-black font-bold justify-start"
                onClick={() => {
                  onButtonClick()
                  window.open('https://www.skool.com/aicaptains', '_blank')
                  setIsMenuOpen(false)
                }}
                onMouseEnter={onHover}
              >
                <Zap className="w-4 h-4 mr-2" />
                 ENROLL TODAY
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
                {[
                  { name: "Twitter", url: "https://twitter.com/jordanurbs" },
                  { name: "Youtube", url: "https://youtube.com/@jordanurbsai" }
                ].map((platform) => (
                  <Button
                    key={platform.name}
                    variant="ghost"
                    size="icon"
                    className="text-yellow-500 hover:text-cyan-400 hover:bg-transparent"
                    asChild
                    onClick={() => {
                      onButtonClick()
                      setIsMenuOpen(false)
                    }}
                    onMouseEnter={onHover}
                  >
                    <Link href={platform.url} target="_blank" rel="noopener noreferrer">
                      {platform.name === "Twitter" && <XIcon className="w-5 h-5" />}
                      {platform.name === "Youtube" && <YoutubeIcon className="w-5 h-5" />}
                    </Link>
                  </Button>
                ))}
              </div>
              <div className="text-gray-400 text-xs text-center">
                <p>© 2025 AI CAPTAINS LLC</p>
                <p>Built by <a href="https://jordanurbs.com" className="hover:text-cyan-400">Jordan Urbs</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}