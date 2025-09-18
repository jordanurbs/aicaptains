"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useSound } from "@/components/sound-provider"

const problems = [
  "I want to use AI agents to build apps for me but don't know where to start",
  "I can build basic things but don't know how to best leverage AI", 
  "I have no idea what's going on under the hood",
  "I've never used the command line",
  "There are too many options out there and my subscription costs are adding up",
  "My clients are asking me for AI features and I don't know where to start",
  "I understand hosting and domains, but app deployment feels foreign"
]

interface ProblemGridProps {
  className?: string
}

export function ProblemGrid({ className = "" }: ProblemGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const { playSound } = useSound()

  const handleHover = (index: number) => {
    setHoveredIndex(index)
    playSound("hover")
  }

  const handleClick = (index: number) => {
    setClickedIndex(index)
    playSound("click")
    
    // Add celebration effect for problem analysis
    if (Math.random() > 0.7) {
      // Trigger achievement celebration occasionally
      const event = new CustomEvent('celebrate', { detail: { type: 'discovery' } })
      window.dispatchEvent(event)
    }
    
    // Reset clicked state after animation
    setTimeout(() => setClickedIndex(null), 200)
  }

  return (
    <section className={`border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-yellow-500 text-black p-4 flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold retro-text retro-leading-tight">
          WHAT'S YOUR BUILDER'S DILEMMA?
        </h2>
        <div className="hidden md:block">
          <div className="w-8 h-8 bg-red-600 rounded border-2 border-black flex items-center justify-center">
            <X className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="p-6 relative">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>
        
        {/* Scanline Effect */}
        <div className="scanline-thin"></div>
        
        {/* Masonry Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`
                relative group cursor-pointer
                border-4 rounded-lg p-4 
                transition-all duration-200 ease-out
                retro-button overflow-hidden
                min-h-[120px] flex flex-col
                ${hoveredIndex === index 
                  ? 'border-cyan-400 bg-gradient-to-br from-blue-900/80 to-purple-900/80 transform -translate-y-1 shadow-lg shadow-cyan-400/20' 
                  : 'border-gray-700 bg-gray-800/90 hover:border-gray-600'
                }
                ${clickedIndex === index ? 'transform translate-x-1 translate-y-1 shadow-none' : ''}
                ${index % 3 === 0 ? 'sm:row-span-2' : ''}
                ${index % 4 === 1 ? 'lg:row-span-2' : ''}
                ${index % 5 === 2 ? 'sm:row-span-1' : ''}
              `}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(index)}
            >
              {/* Glitch overlay on hover */}
              {hoveredIndex === index && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-400/5 to-transparent animate-pulse pointer-events-none" style={{animationDelay: '0.1s'}} />
                </>
              )}
              
              {/* Static Effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-gray-500/5 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* X Icon */}
                <div className="flex justify-start mb-3">
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 transform
                    ${hoveredIndex === index 
                      ? 'border-cyan-400 bg-cyan-400/20 scale-110 rotate-180' 
                      : 'border-red-500 bg-red-500/20 scale-100 rotate-0'
                    }
                  `}>
                    <X className={`
                      w-4 h-4 font-bold transition-all duration-200
                      ${hoveredIndex === index ? 'text-cyan-400' : 'text-red-500'}
                    `} />
                  </div>
                </div>

                {/* Problem Text */}
                <div className="flex-1 flex items-center">
                  <blockquote className={`
                    text-sm leading-relaxed font-medium
                    transition-all duration-200
                    ${hoveredIndex === index 
                      ? 'text-cyan-300 transform scale-105' 
                      : 'text-gray-300'
                    }
                  `}>
                    <span className={`text-lg font-bold mr-1 transition-colors duration-200 ${
                      hoveredIndex === index ? 'text-cyan-400' : 'text-yellow-500'
                    }`}>"</span>
                    {problem}
                    <span className={`text-lg font-bold ml-1 transition-colors duration-200 ${
                      hoveredIndex === index ? 'text-cyan-400' : 'text-yellow-500'
                    }`}>"</span>
                  </blockquote>
                </div>

                {/* Hover Indicator */}
                {hoveredIndex === index && (
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-yellow-500 text-xs font-bold retro-text blink">
                      [{String(index + 1).padStart(2, '0')}]
                    </div>
                    <div className="text-cyan-400 text-xs font-bold retro-text animate-pulse">
                      &gt; ANALYZING...
                    </div>
                  </div>
                )}
              </div>

              {/* Glitch Effect Border */}
              {hoveredIndex === index && (
                <>
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg animate-pulse pointer-events-none"></div>
                  <div className="absolute -inset-1 border border-yellow-500 rounded-lg opacity-50 pointer-events-none" style={{animationDelay: '0.2s'}}></div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 border-t-2 border-yellow-500 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="text-cyan-400 font-mono flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              PROBLEMS DETECTED: {problems.length}
            </div>
            <div className="text-yellow-500 font-mono blink">
              STATUS: READY FOR AI CAPTAIN SOLUTIONS
            </div>
          </div>
          <div className="mt-2 text-gray-400 font-mono text-xs">
            HOVER TO SCAN • CLICK TO ANALYZE
          </div>
        </div>
      </div>
    </section>
  )
}