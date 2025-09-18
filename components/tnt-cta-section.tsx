"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { useCelebration } from "@/components/celebration-effects"
import { ConvertKitEmailCapture } from "@/components/convertkit-email-capture"
import {
  Terminal,
  Code2,
  Zap,
  ChevronRight,
  Database,
  Server,
  GitBranch,
  Cpu,
  Monitor,
  Building,
  ArrowRight,
  Sparkles,
  Keyboard
} from "lucide-react"

interface TntCtaSectionProps {
  className?: string
}

export function TntCtaSection({ className = "" }: TntCtaSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [terminalText, setTerminalText] = useState("")
  const { playSound } = useSound()
  const { celebrate } = useCelebration()

  // Terminal animation effect
  useEffect(() => {
    const commands = [
      "$ npm create ai-captain-app",
      "$ ai deploy --production",
      "$ revenue.stream(true)",
      "$ scale --infinite"
    ]

    let currentCommand = 0
    let currentChar = 0

    const typeInterval = setInterval(() => {
      if (currentChar < commands[currentCommand].length) {
        setTerminalText(commands[currentCommand].substring(0, currentChar + 1))
        currentChar++
      } else {
        setTimeout(() => {
          currentChar = 0
          currentCommand = (currentCommand + 1) % commands.length
          setTerminalText("")
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [])

  const handleHover = () => {
    playSound("hover")
    setIsHovered(true)
  }

  return (
    <section className={`relative overflow-hidden rounded-lg border-4 border-yellow-500 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 ${className}`}>

      {/* Grid background overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0" />

      {/* Scanlines effect */}
      <div className="absolute inset-0 z-10 opacity-5">
        <div className="h-px bg-cyan-400 animate-scan" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 p-8 md:p-12">
        <div className="max-w-5xl mx-auto">

          {/* Terminal Window */}
          <div className="mb-8 bg-black/80 rounded-lg border-2 border-cyan-400 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-auto text-xs text-cyan-400">terminal.exe</span>
            </div>
            <div className="font-mono text-green-400 text-sm md:text-base min-h-[24px]">
              {terminalText}
              <span className="animate-pulse">_</span>
            </div>
          </div>

          {/* Main Copy */}
          <div className="space-y-6 mb-8 pt-8">
            <h2 className="text-3xl md:text-4xl lg:text-7xl font-bold text-yellow-400 retro-text text-center">
              <span className="text-cyan-400">FREE</span> TERMINAL NAVIGATION <span className="text-cyan-400">TOOLKIT</span>
            </h2>


          {/* Tech Stack Icons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {[
              { Icon: Database, label: "Database" },
              { Icon: Server, label: "API" },
              { Icon: GitBranch, label: "Git" },
              { Icon: Cpu, label: "AI" },
              { Icon: Monitor, label: "Deploy" },
              { Icon: Building, label: "Scale" }
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-3 bg-black/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400 transition-all"
              >
                <Icon className="w-8 h-8 text-cyan-400" />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>

            <p className="text-lg md:text-xl text-gray-100 leading-relaxed text-center">
              You know AI is the future. You understand intention-driven development beats traditional development.
              Now build the foundational skills to <span className="text-red-400">deploy</span>,{" "}
              <span className="text-purple-400">scale</span>, and{" "}
              <span className="text-yellow-400">own</span> what you build—instead of renting tools forever.
            </p>

            <p className="text-lg md:text-xl text-gray-100 leading-relaxed text-center">
              Start your journey into building{" "}
              <span className="text-yellow-400">directories</span>,{" "}
              <span className="text-cyan-400">SaaS tools</span>, and{" "}
              <span className="text-green-400">AI automation</span>:
            </p>

          </div>


          {/* Email Capture Form */}
          <div className="max-w-md mx-auto">
            <ConvertKitEmailCapture
              formId="7905215"
              title=""
              subtitle="Join 1,000+ builders mastering AI-powered development"
              buttonText="GET TOOLKIT"
              successMessage="ACCESS GRANTED! Check your inbox for the toolkit."
              className=""
            />
          </div>

          {/* Code Snippets in corners */}
          <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400/20 hidden lg:block">
            {"<build>"}
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400/20 hidden lg:block">
            {"</ship>"}
          </div>
          <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-400/20 hidden lg:block">
            {"function profit() {"}
          </div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-cyan-400/20 hidden lg:block">
            {"return revenue; }"}
          </div>
        </div>
      </div>

      {/* Animated border glow effect */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        isHovered
          ? 'shadow-2xl shadow-yellow-500/30'
          : ''
      } pointer-events-none`} />

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </section>
  )
}