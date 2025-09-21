"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { X as TwitterIcon, Play as YoutubeIcon, Zap, Volume2, VolumeX, MessageSquare, Calendar, Wrench, GraduationCap } from "lucide-react"
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
import { RetroFooter } from "@/components/retro-footer"
import { InteractiveBuildersDolemma } from "@/components/interactive-builders-dolemma"
import { TransformationBanner } from "@/components/transformation-banner"
import { TntCtaSection } from "@/components/tnt-cta-section"
import { AudienceCards } from "@/components/audience-cards"
import { EnhancedCourseGrid } from "@/components/enhanced-course-grid"
import { PricingTiers } from "@/components/pricing-tiers"
import { MaritimeCursorEffects } from "@/components/maritime-cursor-effects"
import { CelebrationEffects, useCelebration } from "@/components/celebration-effects"
import { MaritimeLoading } from "@/components/maritime-loading"
import { EasterEggs } from "@/components/easter-eggs"
import { MagazineHeroSection } from "@/components/magazine-hero-section"
import { MobileNavigation } from "@/components/mobile-navigation"
import { StickyScrollToTop } from "@/components/sticky-scroll-to-top"
import { useIsMobile } from "@/hooks/use-mobile"

// Wrap the main component with sound effects
function AICaptainsContent() {
  // Removed selectedItem state - handled by EnhancedCourseGrid
  const isMobile = useIsMobile()
  const [showIntro, setShowIntro] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionStage, setTransitionStage] = useState<'idle' | 'instant-glitch' | 'shrinking' | 'static' | 'expanding' | 'tuning' | 'signal-lock' | 'complete'>('idle')
  const [showWhimsicalEffects, setShowWhimsicalEffects] = useState(false)
  const [hasStartedMusic, setHasStartedMusic] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const { playSound, isLoaded, toggleMute, isMuted, fadeBackgroundMusic, originalBackgroundVolume } = useSound()
  const { celebrate, CelebrationComponent } = useCelebration()

  // Check if we should show the intro (only once per session, or skip entirely on mobile)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")
    // Skip intro on mobile devices or if already seen
    if (isMobile || hasSeenIntro) {
      setShowIntro(false)
      setShowWhimsicalEffects(true)
      // Mark as seen for mobile users
      if (isMobile) {
        sessionStorage.setItem("hasSeenIntro", "true")
      }
    }
  }, [isMobile])

  // Listen for celebration events from components
  useEffect(() => {
    const handleCelebrationEvent = (event: CustomEvent) => {
      const { type } = event.detail
      celebrate(type)
    }

    window.addEventListener('celebrate', handleCelebrationEvent as EventListener)
    return () => {
      window.removeEventListener('celebrate', handleCelebrationEvent as EventListener)
    }
  }, [celebrate])

  // Preload all critical images immediately
  useEffect(() => {
    const preloadImages = [
      '/images/academy-logo-min.png',
      '/images/magazine.png',
      '/images/tnt-boxart.png',
      '/images/implementation-call.png',
      '/images/academy-boxart.png',
      '/images/ccc-boxart.png'
    ]

    const imagePromises = preloadImages.map(src => {
      return new Promise<void>((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => resolve()
        img.onerror = () => reject()
        img.src = src
      })
    })

    Promise.all(imagePromises)
      .then(() => {
        console.log('✅ All images preloaded successfully')
      })
      .catch(error => {
        console.warn('⚠️ Some images failed to preload:', error)
      })
  }, [])

  // Track user interaction for audio playback
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userHasInteracted) {
        console.log("User interaction detected - can now play background music")
        setUserHasInteracted(true)

        // Remove the event listeners after first interaction
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  // Handle intro completion with instant glitch and CRT tune-in transition
  const handleIntroComplete = () => {
    console.log("🎬 INTRO COMPLETE - Starting transition...")
    // ⚡ INSTANT RESPONSE - trigger glitch overlay immediately
    setIsTransitioning(true)
    setTransitionStage('instant-glitch')
    console.log("⚡ INSTANT GLITCH TRIGGERED")
    sessionStorage.setItem("hasSeenIntro", "true")
    
    // Enable whimsical effects after intro
    setTimeout(() => {
      setShowWhimsicalEffects(true)
      celebrate('achievement')
    }, 3500)

    // Play startup sound immediately
    if (isLoaded) {
      playSound("startup")
    }

    // Quick transition to shrinking after glitch starts
    setTimeout(() => {
      setTransitionStage('shrinking')
    }, 800) // Longer delay to make glitch more visible

    // Enhanced CRT transition sequence
    setTimeout(() => {
      setTransitionStage('static')
      if (isLoaded) playSound('hover') // Static sound effect
    }, 800) // After intro shrink animation

    setTimeout(() => {
      setTransitionStage('expanding')
    }, 1200) // After static flash

    setTimeout(() => {
      setTransitionStage('tuning')
      setShowIntro(false) // Homepage starts rendering during tune-in
      if (isLoaded) playSound('hover') // Continue static during tuning
    }, 1900) // After grid expansion

    setTimeout(() => {
      setTransitionStage('signal-lock')
      if (isLoaded) playSound('select') // Signal found sound
    }, 2700) // After channel tune-in

    setTimeout(() => {
      setTransitionStage('complete')
      // Auto-play background music after intro completes (if user has interacted)
      if (isLoaded && !isMuted && userHasInteracted && !hasStartedMusic) {
        console.log("Starting background music after intro...")
        playSound("background")
        setHasStartedMusic(true)
      }
    }, 3200) // After signal lock

    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionStage('idle')
    }, 3700) // Final cleanup
  }

  // Keyboard navigation is now handled by EnhancedCourseGrid component

  // Watch for footer visibility to fade out music
  useEffect(() => {
    if (!showIntro && typeof window !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Footer is visible, fade out music
              fadeBackgroundMusic(0.05, 2000) // Fade to very low volume
            } else {
              // Footer is not visible, restore music
              fadeBackgroundMusic(originalBackgroundVolume, 1000)
            }
          })
        },
        { threshold: 0.1 } // Trigger when 10% of footer is visible
      )

      // Wait a bit for DOM to be ready
      setTimeout(() => {
        const footer = document.querySelector('.retro-footer')
        if (footer) {
          observer.observe(footer)
        }
      }, 1000)

      return () => {
        observer.disconnect()
      }
    }
  }, [showIntro, fadeBackgroundMusic, originalBackgroundVolume])

  // No more complex preloading detection needed!

  // Try to start background music when conditions are met
  useEffect(() => {
    if (!showIntro && userHasInteracted && isLoaded && !isMuted && !hasStartedMusic) {
      console.log("All conditions met - starting background music")
      playSound("background")
      setHasStartedMusic(true)
    }
  }, [showIntro, userHasInteracted, isLoaded, isMuted, hasStartedMusic, playSound])

  // Handle button click sound and start background music on first interaction
  const handleButtonClick = () => {
    playSound("click")

    // Start background music on first button click after intro
    if (!showIntro && !hasStartedMusic && !isMuted && userHasInteracted) {
      console.log("Starting background music on button click")
      playSound("background")
      setHasStartedMusic(true)
    }
  }

  // Handle hover sound
  const handleHover = () => {
    playSound("hover")
  }

  // Scroll to testimonials section
  const scrollToTestimonials = () => {
    const testimonialsSection = document.getElementById('testimonials-section')
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' })
      handleButtonClick()
    }
  }

  // Scroll to courses section
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('power-up-section')
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' })
      handleButtonClick()
    }
  }

  // Scroll to TNT section
  const scrollToTnt = () => {
    const tntSection = document.getElementById('tnt-section')
    if (tntSection) {
      tntSection.scrollIntoView({ behavior: 'smooth' })
      handleButtonClick()
    }
  }

  return (
    <div className="bg-black text-white relative crt-effect transition-container">
      {/* Whimsical Maritime Effects */}
      {showWhimsicalEffects && (
        <>
          <MaritimeCursorEffects />
          <EasterEggs />
        </>
      )}
      
      {/* Celebration Effects */}
      <CelebrationComponent />

      {/* Sticky Scroll to Top Button */}
      {!showIntro && <StickyScrollToTop />}
      
      {/* Scroll Indicators - HIDDEN: Remote control not needed */}
      {/* {!showIntro && <ScrollIndicators />} */}

      {/* Show intro sequence with transition effects */}
      {showIntro && (
        <div className={`${
          transitionStage === 'shrinking' ? 'transition-intro-shrink transition-intro-exit' : ''
        }`}>
          <IntroSequence onComplete={handleIntroComplete} />
        </div>
      )}

      {/* Instant Glitch Overlay - appears immediately */}
      {transitionStage === 'instant-glitch' && (
        <div className="fixed inset-0 z-[10001] bg-white pointer-events-none animate-pulse" />
      )}

      {/* Transition effects overlay */}
      {isTransitioning && (
        <div>
          {transitionStage === 'static' && (
            <div className="transition-static-flash" />
          )}
          {transitionStage === 'expanding' && (
            <div className="transition-grid-expand" />
          )}
          {transitionStage === 'tuning' && (
            <div className="transition-scan-lines" />
          )}
        </div>
      )}

      {/* Mobile Navigation */}
      {!showIntro && (
        <MobileNavigation
          isMuted={isMuted}
          toggleMute={toggleMute}
          onButtonClick={handleButtonClick}
          onHover={handleHover}
          scrollToTestimonials={scrollToTestimonials}
          scrollToCourses={scrollToCourses}
          scrollToTnt={scrollToTnt}
        />
      )}

      {/* Homepage content with CRT tune-in effect */}
      {!showIntro && (
        <div
          className={`relative z-10 ${
            transitionStage === 'tuning' ? 'transition-channel-tuning' :
            transitionStage === 'signal-lock' ? 'transition-signal-lock' :
            transitionStage === 'complete' ? 'transition-homepage-enter' : ''
          }`}
        >
          {/* Grid background */}
          <div className="grid-bg fixed inset-0 z-0"></div>

          {/* Desktop-only Sticky Top Controls Bar - Outside overflow containers */}
          <div className="hidden lg:block sticky-nav-desktop sticky-nav-optimized sticky-nav-accessible px-6 py-4">
            <div className="flex justify-end items-center gap-2">
              {/* Free Toolkit Button - First item */}
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-4 py-2"
                onClick={scrollToTnt}
                onMouseEnter={handleHover}
              >
                <Wrench className="w-4 h-4 mr-1" />
                FREE TOOLKIT
              </Button>
              {/* YouTube Button */}
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-4 py-2"
                onClick={() => {
                  handleButtonClick()
                  window.open('https://youtube.com/@jordanurbsai', '_blank')
                }}
                onMouseEnter={handleHover}
              >
                <YoutubeIcon className="w-4 h-4 mr-1" />
                YOUTUBE
              </Button>

              {/* Courses Button */}
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-4 py-2"
                onClick={scrollToCourses}
                onMouseEnter={handleHover}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                COURSES
              </Button>

              {/* Testimonials Button */}
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-4 py-2"
                onClick={scrollToTestimonials}
                onMouseEnter={handleHover}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                TESTIMONIALS
              </Button>

              {/* Get Help Now Button */}
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-4 py-2"
                onClick={() => {
                  handleButtonClick()
                  window.open('https://calls.ai-captains.com/', '_blank')
                }}
                onMouseEnter={handleHover}
              >
                <Calendar className="w-4 h-4 mr-1" />
                GET HELP NOW
              </Button>


              {/* ENROLL CTA Button - Furthest right */}
              <Button
                className="retro-button bg-yellow-500 text-black hover:bg-cyan-400 hover:text-black font-bold px-4 py-2"
                onClick={() => {
                  handleButtonClick()
                  window.open('https://www.skool.com/aicaptains', '_blank')
                }}
                onMouseEnter={handleHover}
              >
                <Zap className="w-4 h-4 mr-1" />
                ENROLL NOW
              </Button>

              {/* Audio Toggle Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toggleMute()
                  handleButtonClick()
                }}
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                title={isMuted ? "Unmute sounds" : "Mute sounds"}
                onMouseEnter={handleHover}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Left Sidebar - Fixed on desktop, outside scroll container */}
          <div className="sticky-sidebar bg-gray-900 p-6 border-4 border-yellow-500 rounded-lg lg:rounded-none lg:border-r-4 lg:border-l-0 lg:border-t-0 lg:border-b-0">
            <div className="space-y-6 h-full flex flex-col">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src="/images/academy-logo-min.png"
                  alt="AI CAPTAINS ACADEMY"
                  width={300}
                  height={150}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Marquee - now full width */}
              <div className="flex items-center justify-center">
                <DigitalMarquee text="BUILD WITH AI, NOT LIMITS" />
              </div>

              {/* Tagline */}
              <div className="text-center">
                <p className="text-cyan-400 retro-text text-3xl sm:text-4xl md:text-3xl lg:text-3xl xl:text-3xl retro-leading-tight">COMMAND YOUR FUTURE.</p>
                <p className="text-cyan-400 retro-text text-3xl sm:text-4xl md:text-3xl lg:text-3xl xl:text-3xl retro-leading-tight">NAVIGATE WITH POWER!</p>
              </div>

              {/* Bio */}
                <div className="space-y-6 border-t-2 border-b-2 border-yellow-500 py-4">
                <p className="text-gray-300 leading-relaxed text-sm">
                  We transform platform-dependent passengers into AI Captains.
              </p></div>
              {/* Game Button */}
              <div className="text-center pt-6 pb-6">
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
                      onClick={handleButtonClick}
                      onMouseEnter={handleHover}
                    >
                      <Link href={platform.url} target="_blank" rel="noopener noreferrer">
                        {platform.name === "Twitter" && <TwitterIcon className="w-5 h-5" />}
                        {platform.name === "Youtube" && <YoutubeIcon className="w-5 h-5" />}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="text-gray-400 text-xs text-center">
                  <p>© 2025 AI CAPTAINS LLC</p>
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
          <div className="content-with-sidebar space-y-8">
            <div className="px-6 space-y-8">
              {/* Hero Section - New Magazine Style */}
              <MagazineHeroSection
                onButtonClick={handleButtonClick}
                onHover={handleHover}
                onCelebrate={(type) => celebrate(type as any)}
              />

              {/* Terminal Navigation Toolkit CTA Section */}
              <div id="tnt-section">
                <TntCtaSection />
              </div>

              {/* Problem Grid Section */}
              <InteractiveBuildersDolemma />

              {/* Transformation Banner Section - Hidden */}
              {/* <TransformationBanner /> */}

              {/* Audience Cards Section - Hidden */}
              {/* <AudienceCards /> */}

              {/* Enhanced Course Grid Section */}
              <EnhancedCourseGrid />

              {/* Pricing Tiers Section - Temporarily hidden */}
              {/* <PricingTiers /> */}

              {/* Testimonials Section - Full Width */}
              <div id="testimonials-section">
                <TestimonialsWidget />
              </div>

              {/* Discovery Call Calendar - Full Width */}
              <DiscoveryCallEmbed />

              {/* Contact Section - Full Width
              <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
                <div className="bg-yellow-500 text-black p-2">
                  <h2 className="text-5xl md:text-6xl font-bold retro-text">CONTACT</h2>
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
      )}

      {/* Retro-Futuristic Footer - Full Width, Completely Outside All Layout Containers */}
      {!showIntro && <RetroFooter />}
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
