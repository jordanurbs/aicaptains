'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Target,
  MessageSquare,
  Ship,
  Anchor,
  Telescope,
  Map,
  Crown,
  Compass,
  Star,
  Zap,
  Navigation,
  Eye,
  Lightbulb,
  ChevronRight
} from 'lucide-react'
import { useGenerateResponse, validateGoal, validateExcuse } from '@/lib/api-client'
import { useSoundEffects } from '@/hooks/use-sound-effects'

// Common excuses for quick selection
const PRESET_EXCUSES = [
  "I don't know where to start",
  "I don't have enough time",
  "I'm not technical enough", 
  "It's too expensive",
  "I don't have the right connections",
  "I'm too old to learn this",
  "The market is too saturated",
  "I need more experience first",
  "I don't have enough resources",
  "What if I fail?"
]

interface ResponseGeneratorProps {
  onResponseGenerated?: (response: string, cta: string) => void
  className?: string
}

export function ResponseGenerator({ onResponseGenerated, className }: ResponseGeneratorProps) {
  const [goal, setGoal] = useState('')
  const [excuse, setExcuse] = useState('')
  const [selectedPresetExcuse, setSelectedPresetExcuse] = useState<string | null>(null)
  const [goalError, setGoalError] = useState<string | null>(null)
  const [excuseError, setExcuseError] = useState<string | null>(null)

  const { generateResponse, isLoading, error, lastResponse, clearError } = useGenerateResponse()
  const { playSound } = useSoundEffects()

  const handleGoalChange = (value: string) => {
    setGoal(value)
    setGoalError(null)
    clearError()
  }

  const handleExcuseChange = (value: string) => {
    setExcuse(value)
    setSelectedPresetExcuse(null)
    setExcuseError(null)
    clearError()
  }

  const handlePresetExcuseSelect = (presetExcuse: string) => {
    setExcuse(presetExcuse)
    setSelectedPresetExcuse(presetExcuse)
    setExcuseError(null)
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const goalValidation = validateGoal(goal)
    const excuseValidation = validateExcuse(excuse)

    if (!goalValidation.isValid) {
      setGoalError(goalValidation.error!)
      return
    }

    if (!excuseValidation.isValid) {
      setExcuseError(excuseValidation.error!)
      return
    }

    // Play loading sound and start whimsical loading experience
    playSound('startup')

    // Generate response
    const result = await generateResponse({
      goal: goal.trim(),
      excuse: excuse.trim(),
      isPresetExcuse: selectedPresetExcuse !== null
    })

    // Play success sound when done
    if (result.success) {
      playSound('select')
    }

    // Notify parent component if callback provided
    if (result.success && result.response && result.cta && onResponseGenerated) {
      onResponseGenerated(result.response, result.cta)
    }
  }

  return (
    <div className={className}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Captain Response Generator
          </CardTitle>
          <CardDescription>
            Get a witty, psychologically compelling response to overcome any excuse and take action on your goals.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Input */}
            <div className="space-y-2">
              <Label htmlFor="goal">What's your goal?</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => handleGoalChange(e.target.value)}
                placeholder="e.g., Build AI-powered apps, Start an online business, Learn to code..."
                maxLength={200}
                className={goalError ? 'border-red-500' : ''}
              />
              {goalError && (
                <p className="text-sm text-red-600">{goalError}</p>
              )}
              <p className="text-xs text-gray-500">{goal.length}/200 characters</p>
            </div>

            {/* Preset Excuses */}
            <div className="space-y-3">
              <Label>Common excuses (click to select):</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_EXCUSES.map((presetExcuse) => (
                  <Badge
                    key={presetExcuse}
                    variant={selectedPresetExcuse === presetExcuse ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handlePresetExcuseSelect(presetExcuse)}
                  >
                    {presetExcuse}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Excuse Input */}
            <div className="space-y-2">
              <Label htmlFor="excuse">Or write your own excuse:</Label>
              <Textarea
                id="excuse"
                value={excuse}
                onChange={(e) => handleExcuseChange(e.target.value)}
                placeholder="What's holding you back? Be honest..."
                maxLength={300}
                rows={3}
                className={excuseError ? 'border-red-500' : ''}
              />
              {excuseError && (
                <p className="text-sm text-red-600">{excuseError}</p>
              )}
              <p className="text-xs text-gray-500">{excuse.length}/300 characters</p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !goal.trim() || !excuse.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Response
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>

          {/* Whimsical Loading State */}
          {isLoading && <WhimsicalLoadingExperience />}

          {/* Response Display */}
          {!isLoading && lastResponse?.success && lastResponse.response && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Your AI Captain's Response:</h3>

              <blockquote className="text-lg text-gray-800 mb-4 italic">
                "{lastResponse.response}"
              </blockquote>

              {lastResponse.cta && (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="font-semibold"
                    onClick={() => window.open('https://skool.com/aicaptains', '_blank')}
                  >
                    {lastResponse.cta}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Whimsical Loading Experience Component
function WhimsicalLoadingExperience() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [shipProgress, setShipProgress] = useState(0)
  const [treasureProgress, setTreasureProgress] = useState(0)
  const [captainActivity, setCaptainActivity] = useState<'thinking' | 'sailing' | 'looking' | 'mapping' | 'celebrating'>('thinking')
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([])
  const [particleCounter, setParticleCounter] = useState(0)

  // Captain Jax's excuse-busting loading messages - reinforcing brand promise
  const loadingMessages = [
    "Feeding your excuses into my AI engine...",
    "Converting excuses into rocket fuel...",
    "Decoding the DNA of entrepreneurial breakthroughs...",
    "Navigating through the fog of self-doubt...",
    "Plotting your escape route from excuse island...",
    "Consulting my digital crystal ball of possibilities...",
    "Triangulating your success coordinates with AI precision...",
    "Summoning the winds of 'just do it anyway'...",
    "Charting a course through the sea of procrastination...",
    "Calibrating my excuse-to-action translator...",
    "Brewing a synthesis of wisdom and swift kicks...",
    "Your excuses are my fuel - watch me work!"
  ]

  // Captain Jax's entrepreneurial wisdom - brand-aligned insights
  const funFacts = [
    "⚡ Captain's law: Every excuse burned becomes entrepreneurial fuel!",
    "🚀 Jax fact: 89% of successful founders started with 'I have no idea what I'm doing'",
    "💎 Digital treasure: Your biggest excuse often hides your biggest opportunity!",
    "🧭 Navigation truth: You can't steer a startup that never launches!",
    "🏴‍☠️ Pirate wisdom: The best time to plant an idea was yesterday. The second best? Right now!",
    "⚓ Captain's secret: Every expert was once a disaster with determination!",
    "🌊 Stormy seas build the strongest captains - and entrepreneurs!",
    "👑 Royal decree: Your comfort zone is just a beautiful prison!",
    "🔱 AI insight: Machines learn from mistakes. So should founders!",
    "⭐ Stellar truth: Every unicorn started as someone else's 'impossible' dream!",
    "🗺️ Explorer's code: The map to success is drawn by those brave enough to get lost!",
    "🚢 Captain Jax motto: Turn your 'what ifs' into 'what's next'!"
  ]

  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)

      // Change captain activity with each message
      const activities: typeof captainActivity[] = ['thinking', 'sailing', 'looking', 'mapping']
      setCaptainActivity(activities[Math.floor(Math.random() * activities.length)])
    }, 2000)

    return () => clearInterval(messageInterval)
  }, [])

  // Cycle through fun facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length)
    }, 4000)

    return () => clearInterval(factInterval)
  }, [])

  // Animate progress indicators
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setShipProgress((prev) => {
        const newProgress = prev + Math.random() * 3 + 1
        return newProgress > 100 ? 10 : newProgress // Loop the ship animation
      })

      setTreasureProgress((prev) => {
        const newProgress = prev + Math.random() * 2 + 0.5
        return newProgress > 100 ? 15 : newProgress // Loop the treasure animation
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [])

  // Generate magical particles
  useEffect(() => {
    const particleInterval = setInterval(() => {
      if (particles.length < 15) {
        const newParticle = {
          id: particleCounter,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: 1
        }
        setParticles(prev => [...prev, newParticle])
        setParticleCounter(prev => prev + 1)
      }
    }, 300)

    return () => clearInterval(particleInterval)
  }, [particles.length, particleCounter])

  // Animate particles
  useEffect(() => {
    const animateInterval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            y: particle.y - 1,
            opacity: particle.opacity - 0.02
          }))
          .filter(particle => particle.opacity > 0 && particle.y > -10)
      )
    }, 50)

    return () => clearInterval(animateInterval)
  }, [])

  const getCaptainIcon = () => {
    switch (captainActivity) {
      case 'thinking':
        return <Lightbulb className="w-12 h-12 text-yellow-400 animate-pulse" />
      case 'sailing':
        return <Ship className="w-12 h-12 text-cyan-400 animate-bounce" />
      case 'looking':
        return <Telescope className="w-12 h-12 text-purple-400 animate-pulse" />
      case 'mapping':
        return <Map className="w-12 h-12 text-green-400 animate-pulse" />
      case 'celebrating':
        return <Crown className="w-12 h-12 text-yellow-500 animate-bounce" />
      default:
        return <Navigation className="w-12 h-12 text-cyan-400 animate-spin" />
    }
  }

  return (
    <div className="mt-6 relative overflow-hidden">
      {/* Main Loading Container */}
      <div className="relative p-8 pb-10 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-2 border-cyan-400/50 rounded-xl shadow-2xl">
        {/* Magical Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                boxShadow: '0 0 6px currentColor'
              }}
            />
          ))}
        </div>

        {/* Header with Captain */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Captain's thinking bubble */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-cyan-400/30">
                {getCaptainIcon()}
              </div>
            </div>

            {/* Captain Jax Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-4 border-yellow-400 flex items-center justify-center animate-pulse shadow-lg shadow-cyan-400/30 relative">
              <Crown className="w-10 h-10 text-yellow-400" />
              {/* Captain's distinctive mark */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-cyan-400 rounded-full" />
            </div>

            {/* Activity indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
        </div>

        {/* Main Loading Message */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
            Captain Jax is Destroying Your Excuses! ⚡
          </h3>
          <div className="relative h-8 overflow-hidden">
            <p
              key={currentMessageIndex}
              className="text-lg text-cyan-300 animate-fadeInUp font-medium"
            >
              {loadingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-4 mb-6">
          {/* Ship Progress */}
          <div className="relative">
            <div className="flex items-center justify-between text-sm text-cyan-300 mb-2">
              <span className="flex items-center gap-2">
                <Ship className="w-4 h-4" />
                Sailing past excuse islands
              </span>
              <span>{Math.round(shipProgress)}%</span>
            </div>
            <div className="relative h-3 bg-slate-800 rounded-full border border-cyan-400/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${shipProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
              {/* Sailing ship */}
              <div
                className="absolute top-0 transition-all duration-500 ease-out"
                style={{ left: `${Math.max(0, shipProgress - 5)}%` }}
              >
                <Ship className="w-3 h-3 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Treasure Progress */}
          <div className="relative">
            <div className="flex items-center justify-between text-sm text-yellow-300 mb-2">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Converting excuses to entrepreneurial gold
              </span>
              <span>{Math.round(treasureProgress)}%</span>
            </div>
            <div className="relative h-3 bg-slate-800 rounded-full border border-yellow-400/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${treasureProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-cyan-400/20">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-purple-400 mt-0.5 animate-pulse" />
            <div>
              <p className="text-sm text-purple-300 font-medium mb-1">Captain Jax's Excuse-Busting Wisdom:</p>
              <p
                key={currentFactIndex}
                className="text-cyan-200 text-sm animate-fadeInUp"
              >
                {funFacts[currentFactIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <Anchor className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-30">
          <Compass className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Brand tagline at bottom */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-cyan-300/70 font-medium tracking-wider uppercase">
            Your Excuses Are My Fuel
          </p>
        </div>

        {/* Animated waves at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
      </div>

      {/* CSS for fade animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}