"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RetrowaveSvgBackground } from "./retrowave-svg-background"

interface MagazineHeroSectionProps {
  onButtonClick?: () => void
  onHover?: () => void
  onCelebrate?: (type: string) => void
}

export function MagazineHeroSection({ onButtonClick, onHover, onCelebrate }: MagazineHeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  // Track mouse position for eye-following effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])


  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-lg border-4 border-yellow-500 bg-gradient-to-b from-blue-900 to-purple-900"
    >
      {/* Background Effects */}
      {/* <RetrowaveSvgBackground /> */}
      <div className="absolute inset-0 grid-bg opacity-30 z-[2]"></div>
      <div className="scanline-overlay"></div>


      {/* Magazine Content Container */}
      <div className="relative z-10 p-6 lg:p-12">
        {/* Top Headline - Improved mobile spacing */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold retro-text leading-tight space-y-1 md:space-y-2">
            <span className="block text-yellow-400">READY TO BUILD</span>
            <span className="block">YOUR FIRST BUSINESS</span>
            <span className="block text-yellow-400 animate-pulse-glow">WITH AI?</span>
          </h1>
        </div>

        {/* Subheading - positioned between headline and portrait */}
        <div className="text-center mb-8 lg:mb-12 flex justify-center">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed hover:text-cyan-400 transition-colors duration-300 max-w-[60%]">
            So you've mastered building things online,<br />
            but you don't know how to harness AI to do the heavy lifting?
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-center">

          {/* Left Text Block */}
          <div className="space-y-4 text-center lg:text-left order-3 lg:order-1">
 {/* AI Captains Logo */}
            <div className="hidden lg:flex justify-center lg:justify-start mb-4 transform lg:-rotate-3">
              <Image
                src="/images/aiclogo.png"
                alt="AI Captains"
                width={100}
                height={50}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-yellow-400 font-bold transform lg:-rotate-3 hover:rotate-0 transition-transform duration-300">
              Master the Art of Intention-Driven Development
            </h2>
               
          </div>

          {/* Center Portrait */}
          <div className="relative flex justify-center items-center order-1 lg:order-2 pt-24 pb-24 scale-[3.5] md:scale-[3] lg:scale-[3.2]">
            <div
              className="floating-portrait relative"
              onMouseEnter={onHover}
            >
              {/* Glow Effect */}
              <div className="absolute inset-[-10%] bg-gradient-to-r from-cyan-400/30 via-purple-500/20 to-yellow-400/30 rounded-full blur-2xl animate-pulse"></div>

              {/* Portrait Image */}
              <div className="relative">
                <Image
                  src="/images/jordan-urbs-character-sprite-min.png"
                  alt="AI Captain Jordan Urbs"
                  width={280}
                  height={350}
                  className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:drop-shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all duration-300"
                  priority
                />

               
              </div>

              {/* Easter Egg Animation */}

            </div>
            {/* Extra padding below for click counter visibility */}
            <div className="h-16"></div>
          </div>

          {/* Right Text Block */}
          <div className="space-y-4 text-center lg:text-right order-2 lg:order-3">
            {/* Neon Callout */}
            <div className="inline-block lg:block">
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500 neon-flicker transform lg:rotate-3 hover:rotate-0 transition-transform duration-300 pt-8 pb-8">
                You're not alone!
              </p>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed hover:text-cyan-400 transition-colors duration-300">
              Most digital builders feel stuck between leveraging what they already know and what they know AI can do... and not getting overwhelmed in the process.</p><p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed hover:text-cyan-400 transition-colors duration-300">But where do you even begin?
            </p>
          </div>
        </div>

        {/* Exclamatory Brand Statement */}
        <div className="mt-8 lg:mt-10 flex justify-center">
          <div className="text-center relative">
            {/* Dynamic Maritime Background */}
            <div className="captain-cta-background absolute inset-0 -mx-8 -my-4 rounded-2xl overflow-hidden">
              {/* Naval Chart Grid */}
              <div className="naval-chart-grid absolute inset-0"></div>

              {/* Compass Rose Animation */}
              <div className="compass-rose absolute top-4 left-4 w-16 h-16 opacity-30">
                <div className="compass-needle"></div>
              </div>

              {/* Wave Pattern Bottom */}
              <div className="wave-pattern absolute bottom-0 left-0 right-0 h-8"></div>

              {/* Lighthouse Beam Effect */}
              <div className="lighthouse-beam absolute top-0 right-0 w-32 h-32"></div>

              {/* Anchor Icons */}
              <div className="anchor-decorations absolute inset-0 pointer-events-none">
                <div className="anchor-icon anchor-1">⚓</div>
                <div className="anchor-icon anchor-2">⚓</div>
              </div>
            </div>

            <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white retro-text animate-pulse-glow transform hover:scale-105 transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)] shadow-[0_0_20px_rgba(255,204,0,0.2)] captain-cta-text">
              BECOME AN AI CAPTAIN TODAY!
            </h2>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 lg:mt-12 flex justify-center">
          <div className="w-[45%]">
            <Button
              className="w-full retro-button bg-red-600 text-yellow-400 hover:bg-yellow-400 hover:text-red-800 font-bold px-10 md:px-16 py-4 md:py-6 text-base md:text-lg button-text shareable-moment transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                onButtonClick?.()
                onCelebrate?.("signup")
              }}
              onMouseEnter={onHover}
              asChild
            >
              <a href="https://skool.com/aicaptains" target="_blank" rel="noopener noreferrer">
                POWER UP NOW <Zap className="ml-2 h-5 w-5 animate-pulse" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Magazine Page Corner Effect */}
      <div className="absolute bottom-0 right-0 w-16 h-16 lg:w-24 lg:h-24">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[60px] lg:border-t-[90px] border-t-transparent border-r-[60px] lg:border-r-[90px] border-r-yellow-500 opacity-30 hover:opacity-50 transition-opacity cursor-pointer"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[58px] lg:border-t-[88px] border-t-gray-800 border-r-[58px] lg:border-r-[88px] border-r-transparent"></div>
        </div>
      </div>
    </section>
  )
}