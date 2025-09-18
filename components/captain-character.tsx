"use client"

import { useState, useEffect } from "react"
import { useSound } from "@/components/sound-provider"
import { 
  MessageSquare, 
  Ship, 
  Anchor, 
  Navigation,
  Telescope,
  Crown,
  Map,
  Heart,
  Lightbulb,
  Zap
} from "lucide-react"

interface Message {
  id: number
  text: string
  type: 'tip' | 'encouragement' | 'discovery' | 'achievement' | 'warning'
  duration: number
}

interface CaptainCharacterProps {
  className?: string
  disabled?: boolean
}

export function CaptainCharacter({ className = "", disabled = false }: CaptainCharacterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null)
  const [characterMood, setCharacterMood] = useState<'neutral' | 'happy' | 'excited' | 'thinking'>('neutral')
  const [interactionCount, setInteractionCount] = useState(0)
  const [lastInteraction, setLastInteraction] = useState(0)
  const { playSound } = useSound()

  // Captain's personality messages
  const messages = {
    welcome: [
      "Ahoy there, future Captain! Ready to navigate the digital seas?",
      "Welcome aboard the AI Captains ship! I'm here to guide your journey.",
      "Greetings, sailor! Let's chart a course to your AI mastery!"
    ],
    tips: [
      "💡 Pro tip: Every great Captain started as a curious passenger!",
      "⚓ Remember: AI is your compass, not your destination.",
      "🗺️ The best way to learn AI? Start building something you care about!",
      "🚢 Don't fear the storm - that's where Captains are forged!",
      "⭐ Each small step forward is wind in your sails!"
    ],
    encouragement: [
      "You're doing great! Keep exploring, Captain!",
      "I see that spark in your eyes - the mark of a true AI Captain!",
      "Every expert was once a beginner. You're on the right course!",
      "The digital seas await your command. Keep learning!",
      "Your AI journey is unique - embrace the adventure!"
    ],
    discoveries: [
      "🔍 You've discovered a hidden feature! Click around more!",
      "🎯 Found a secret interaction! You've got a Captain's instincts!",
      "💎 Easter egg unlocked! You're exploring like a true navigator!",
      "🏴‍☠️ Arr! You found treasure in the code! Keep digging!"
    ],
    achievements: [
      "🏆 Outstanding! You're thinking like a Captain already!",
      "⚡ Brilliant move! That's AI Captain thinking right there!",
      "🎉 Excellent! You've just leveled up your navigation skills!",
      "🌟 Magnificent! The digital seas bow to your command!"
    ],
    warnings: [
      "⚠️ Careful there, sailor! That's uncharted waters.",
      "🌊 Hold steady! Sometimes the best course is patience.",
      "🚨 Easy does it! Even Captains need to check their compass."
    ]
  }

  // Track user interactions to trigger appearances
  useEffect(() => {
    if (disabled) return

    const handleUserInteraction = () => {
      const now = Date.now()
      if (now - lastInteraction > 3000) { // Only react if 3+ seconds since last interaction
        setInteractionCount(prev => prev + 1)
        setLastInteraction(now)
        
        // Appear occasionally based on interaction patterns
        if (Math.random() > 0.85) {
          triggerAppearance('tips')
        }
      }
    }

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      
      // Appear at certain scroll milestones
      if (scrollPercent > 0.25 && scrollPercent < 0.3 && Math.random() > 0.7) {
        triggerAppearance('encouragement')
      } else if (scrollPercent > 0.75 && Math.random() > 0.8) {
        triggerAppearance('achievements')
      }
    }

    const handleClick = (e: MouseEvent) => {
      handleUserInteraction()
      
      const target = e.target as HTMLElement
      
      // React to specific interactions
      if (target.closest('button')) {
        if (Math.random() > 0.9) {
          triggerAppearance('encouragement')
        }
      } else if (target.closest('.problem-grid')) {
        if (Math.random() > 0.85) {
          triggerAppearance('discoveries')
        }
      }
    }

    const handleHover = () => {
      handleUserInteraction()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll)
    document.addEventListener('mouseenter', handleHover, true)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseenter', handleHover, true)
    }
  }, [disabled, lastInteraction])

  // Welcome message on first load
  useEffect(() => {
    if (disabled) return
    
    const hasSeenCaptain = sessionStorage.getItem('hasSeenCaptain')
    if (!hasSeenCaptain) {
      setTimeout(() => {
        triggerAppearance('welcome')
        sessionStorage.setItem('hasSeenCaptain', 'true')
      }, 3000)
    }
  }, [disabled])

  const triggerAppearance = (messageType: keyof typeof messages) => {
    if (disabled || isVisible) return

    const messageArray = messages[messageType]

    // Check if messageArray exists and has messages
    if (!messageArray || messageArray.length === 0) {
      console.warn(`No messages found for type: ${messageType}`)
      return
    }

    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)]

    const newMessage: Message = {
      id: Date.now(),
      text: randomMessage,
      type: messageType as Message['type'],
      duration: 4000 + randomMessage.length * 50 // Longer messages stay longer
    }

    setCurrentMessage(newMessage)
    setIsVisible(true)
    setCharacterMood(messageType === 'achievements' ? 'excited' :
                    messageType === 'encouragement' ? 'happy' :
                    messageType === 'tips' ? 'thinking' : 'neutral')
    
    playSound('hover')

    // Auto-hide after duration
    setTimeout(() => {
      hideCharacter()
    }, newMessage.duration)
  }

  const hideCharacter = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentMessage(null)
      setCharacterMood('neutral')
    }, 500)
  }

  const handleCharacterClick = () => {
    playSound('click')
    
    if (!currentMessage) return
    
    // Give different responses based on message type
    if (currentMessage.type === 'tip') {
      triggerAppearance('encouragement')
    } else if (currentMessage.type === 'encouragement') {
      triggerAppearance('achievements')
    } else {
      hideCharacter()
    }
  }

  const getCharacterIcon = () => {
    switch (characterMood) {
      case 'excited':
        return <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />
      case 'happy':
        return <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
      case 'thinking':
        return <Lightbulb className="w-8 h-8 text-yellow-400 animate-pulse" />
      default:
        return <Ship className="w-8 h-8 text-cyan-400" />
    }
  }

  const getMessageIcon = () => {
    if (!currentMessage) return null
    
    switch (currentMessage.type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />
      case 'encouragement':
        return <Heart className="w-4 h-4 text-pink-400" />
      case 'discovery':
        return <Telescope className="w-4 h-4 text-cyan-400" />
      case 'achievement':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'warning':
        return <Zap className="w-4 h-4 text-orange-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />
    }
  }

  if (disabled || !isVisible || !currentMessage) return null

  return (
    <div className={`fixed bottom-6 right-6 z-[9000] ${className}`}>
      {/* Character bubble */}
      <div 
        className={`
          relative group cursor-pointer transform transition-all duration-500 ease-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'}
        `}
        onClick={handleCharacterClick}
      >
        {/* Message bubble */}
        <div className="relative mb-4 mr-4">
          <div className={`
            relative max-w-xs p-4 rounded-lg border-2 bg-black/90 shadow-lg backdrop-blur-sm
            transition-all duration-300 hover:scale-105
            ${currentMessage.type === 'achievement' ? 'border-yellow-500 shadow-yellow-500/20' :
              currentMessage.type === 'encouragement' ? 'border-pink-500 shadow-pink-500/20' :
              currentMessage.type === 'tip' ? 'border-blue-500 shadow-blue-500/20' :
              currentMessage.type === 'discovery' ? 'border-cyan-500 shadow-cyan-500/20' :
              'border-gray-500 shadow-gray-500/20'
            }
          `}>
            {/* Message content */}
            <div className="flex items-start gap-2">
              {getMessageIcon()}
              <p className="text-sm text-white leading-relaxed">
                {currentMessage.text}
              </p>
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-6 transform translate-y-full">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-500" />
              <div className="absolute top-0 left-[2px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black" />
            </div>
            
            {/* Typing indicator for new messages */}
            <div className="absolute -bottom-1 right-2 text-xs text-gray-400 opacity-60">
              <span className="animate-pulse">Captain</span>
            </div>
          </div>
        </div>

        {/* Character avatar */}
        <div className="flex justify-end">
          <div className={`
            relative w-16 h-16 rounded-full border-4 bg-gradient-to-br from-blue-900 to-purple-900 
            flex items-center justify-center cursor-pointer group-hover:scale-110 transition-all duration-300
            ${characterMood === 'excited' ? 'border-yellow-500 shadow-yellow-500/30' :
              characterMood === 'happy' ? 'border-pink-500 shadow-pink-500/30' :
              characterMood === 'thinking' ? 'border-blue-500 shadow-blue-500/30' :
              'border-cyan-500 shadow-cyan-500/30'
            } shadow-lg
          `}>
            {getCharacterIcon()}
            
            {/* Captain hat indicator */}
            <div className="absolute -top-2 -right-1">
              <Navigation className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Activity indicator */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
          </div>
        </div>

        {/* Click hint */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/80 px-2 py-1 rounded border border-gray-600">
            Click me!
          </span>
        </div>
      </div>
    </div>
  )
}

// Global character manager hook
export function useCharacterInteraction() {
  const [shouldShow, setShouldShow] = useState(false)
  
  const triggerCharacter = () => {
    setShouldShow(true)
    setTimeout(() => setShouldShow(false), 100) // Reset trigger
  }

  return {
    shouldShow,
    triggerCharacter,
    CharacterComponent: (props: Omit<CaptainCharacterProps, 'trigger'>) => (
      <CaptainCharacter {...props} />
    )
  }
}