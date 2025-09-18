"use client"

import { useEffect, useState } from "react"
import { useSound } from "@/components/sound-provider"
import { 
  Crown, 
  Ship, 
  Anchor,
  Zap,
  Star,
  Trophy,
  Navigation,
  Eye,
  Gamepad2
} from "lucide-react"

interface EasterEgg {
  id: string
  trigger: string[]
  unlocked: boolean
  name: string
  description: string
  icon: React.ReactNode
  reward?: string
}

export function EasterEggs() {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [unlockedEggs, setUnlockedEggs] = useState<Set<string>>(new Set())
  const [showNotification, setShowNotification] = useState<EasterEgg | null>(null)
  const [clickSequence, setClickSequence] = useState<{ x: number; y: number; timestamp: number }[]>([])
  const [scrollPattern, setScrollPattern] = useState<number[]>([])
  const { playSound } = useSound()

  // Easter egg definitions
  const easterEggs: EasterEgg[] = [
    {
      id: "konami",
      trigger: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"],
      unlocked: false,
      name: "Captain's Code",
      description: "You've discovered the ancient naval code! All captains know this sequence.",
      icon: <Navigation className="w-6 h-6" />,
      reward: "Unlock secret cursor trails"
    },
    {
      id: "captain-summon",
      trigger: ["KeyC", "KeyA", "KeyP", "KeyT", "KeyA", "KeyI", "KeyN"],
      unlocked: false,
      name: "Captain Summoning",
      description: "You've learned the captain's true name! They appear when called.",
      icon: <Crown className="w-6 h-6" />,
      reward: "Captain appears more frequently"
    },
    {
      id: "maritime-master",
      trigger: ["KeyS", "KeyH", "KeyI", "KeyP", "KeyA", "KeyH", "KeyO", "KeyY"],
      unlocked: false,
      name: "Maritime Master",
      description: "Ship ahoy! You speak the ancient maritime tongue!",
      icon: <Ship className="w-6 h-6" />,
      reward: "Weather effects intensified"
    },
    {
      id: "treasure-hunter",
      trigger: ["KeyT", "KeyR", "KeyE", "KeyA", "KeyS", "KeyU", "KeyR", "KeyE"],
      unlocked: false,
      name: "Treasure Hunter",
      description: "X marks the spot! You've found the hidden treasure command.",
      icon: <Star className="w-6 h-6" />,
      reward: "Golden particle effects"
    },
    {
      id: "anchor-drop",
      trigger: ["KeyA", "KeyN", "KeyC", "KeyH", "KeyO", "KeyR"],
      unlocked: false,
      name: "Anchor Drop",
      description: "You've mastered the art of anchoring! Your ship is steady.",
      icon: <Anchor className="w-6 h-6" />,
      reward: "Reduced animation motion"
    }
  ]

  // Keyboard sequence tracking
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Skip easter egg processing if user is typing in an input field
      const activeElement = document.activeElement as HTMLElement
      const isInputField = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('[contenteditable="true"]')
      )

      // If user is typing in an input field, ignore the keypress for easter eggs
      if (isInputField) {
        return
      }

      const newSequence = [...keySequence, event.code].slice(-10)
      setKeySequence(newSequence)

      // Check for easter egg matches
      easterEggs.forEach(egg => {
        if (!unlockedEggs.has(egg.id) && arraysEqual(newSequence.slice(-egg.trigger.length), egg.trigger)) {
          unlockEasterEgg(egg)
        }
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [keySequence, unlockedEggs])

  // Special click patterns
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const now = Date.now()
      const newClick = { x: event.clientX, y: event.clientY, timestamp: now }
      
      // Keep only recent clicks (last 3 seconds)
      const recentClicks = [...clickSequence, newClick].filter(click => 
        now - click.timestamp < 3000
      ).slice(-7)
      
      setClickSequence(recentClicks)
      
      // Check for special patterns
      if (recentClicks.length >= 5) {
        const isCircularPattern = checkCircularPattern(recentClicks)
        const isZigZagPattern = checkZigZagPattern(recentClicks)
        
        if (isCircularPattern && !unlockedEggs.has('circle-navigator')) {
          unlockEasterEgg({
            id: 'circle-navigator',
            name: 'Circle Navigator',
            description: 'You\'ve drawn the sacred circle! Master of navigation.',
            icon: <Navigation className="w-6 h-6" />,
            trigger: [],
            unlocked: false,
            reward: 'Compass always points to treasures'
          })
        }
        
        if (isZigZagPattern && !unlockedEggs.has('storm-rider')) {
          unlockEasterEgg({
            id: 'storm-rider',
            name: 'Storm Rider',
            description: 'Your erratic clicking mimics riding through a storm!',
            icon: <Zap className="w-6 h-6" />,
            trigger: [],
            unlocked: false,
            reward: 'Lightning effects in storms'
          })
        }
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [clickSequence, unlockedEggs])

  // Scroll pattern detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.floor((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
      const newPattern = [...scrollPattern, scrollPercent].slice(-10)
      setScrollPattern(newPattern)
      
      // Check for specific scroll patterns
      if (newPattern.length >= 6) {
        const isUpDown = checkUpDownPattern(newPattern)
        if (isUpDown && !unlockedEggs.has('wave-rider')) {
          unlockEasterEgg({
            id: 'wave-rider',
            name: 'Wave Rider',
            description: 'Your scrolling follows the rhythm of the ocean waves!',
            icon: <Ship className="w-6 h-6" />,
            trigger: [],
            unlocked: false,
            reward: 'Enhanced wave animations'
          })
        }
      }
    }

    const throttledScroll = throttle(handleScroll, 200)
    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollPattern, unlockedEggs])

  // Unlock easter egg
  const unlockEasterEgg = (egg: EasterEgg) => {
    setUnlockedEggs(prev => new Set([...prev, egg.id]))
    setShowNotification(egg)
    playSound('select')
    
    // Store unlocked eggs in localStorage
    const stored = JSON.parse(localStorage.getItem('unlockedEasterEggs') || '[]')
    localStorage.setItem('unlockedEasterEggs', JSON.stringify([...stored, egg.id]))
    
    // Trigger celebration
    const event = new CustomEvent('celebrate', { detail: { type: 'achievement' } })
    window.dispatchEvent(event)
    
    // Apply special effects based on easter egg
    applyEasterEggEffect(egg.id)
    
    // Hide notification after 5 seconds
    setTimeout(() => setShowNotification(null), 5000)
  }

  // Load unlocked easter eggs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('unlockedEasterEggs') || '[]')
    setUnlockedEggs(new Set(stored))
  }, [])

  // Apply special effects
  const applyEasterEggEffect = (eggId: string) => {
    const body = document.body
    
    switch (eggId) {
      case 'konami':
        body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'14\' fill=\'%2300ffff\' opacity=\'0.8\'/></svg>") 16 16, auto'
        setTimeout(() => { body.style.cursor = '' }, 30000)
        break
      case 'treasure-hunter':
        document.documentElement.style.setProperty('--treasure-glow', '0 0 20px gold')
        break
      case 'maritime-master':
        const event = new CustomEvent('intensifyWeather')
        window.dispatchEvent(event)
        break
    }
  }

  // Utility functions
  const arraysEqual = (a: string[], b: string[]) => {
    return a.length === b.length && a.every((val, i) => val === b[i])
  }

  const checkCircularPattern = (clicks: { x: number; y: number; timestamp: number }[]) => {
    if (clicks.length < 5) return false
    
    // Simple circle detection: check if points roughly form a circle
    const centerX = clicks.reduce((sum, click) => sum + click.x, 0) / clicks.length
    const centerY = clicks.reduce((sum, click) => sum + click.y, 0) / clicks.length
    
    const distances = clicks.map(click => 
      Math.sqrt(Math.pow(click.x - centerX, 2) + Math.pow(click.y - centerY, 2))
    )
    
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length
    
    return variance < avgDistance * 0.3 && avgDistance > 50
  }

  const checkZigZagPattern = (clicks: { x: number; y: number; timestamp: number }[]) => {
    if (clicks.length < 4) return false
    
    let directionChanges = 0
    for (let i = 2; i < clicks.length; i++) {
      const prevSlope = (clicks[i-1].y - clicks[i-2].y) / (clicks[i-1].x - clicks[i-2].x)
      const currSlope = (clicks[i].y - clicks[i-1].y) / (clicks[i].x - clicks[i-1].x)
      
      if ((prevSlope > 0 && currSlope < 0) || (prevSlope < 0 && currSlope > 0)) {
        directionChanges++
      }
    }
    
    return directionChanges >= 2
  }

  const checkUpDownPattern = (pattern: number[]) => {
    let changes = 0
    for (let i = 1; i < pattern.length; i++) {
      if (Math.abs(pattern[i] - pattern[i-1]) > 20) {
        changes++
      }
    }
    return changes >= 3
  }

  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  return (
    <>
      {/* Easter Egg Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-[10001] max-w-sm">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 border-4 border-yellow-400 rounded-lg p-4 shadow-lg animate-bounce">
            <div className="flex items-start gap-3">
              <div className="text-yellow-200 animate-pulse">
                {showNotification.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-100 retro-text text-lg mb-1">
                  🎉 EASTER EGG UNLOCKED!
                </h3>
                <h4 className="font-semibold text-yellow-200 mb-2">
                  {showNotification.name}
                </h4>
                <p className="text-yellow-100 text-sm mb-2">
                  {showNotification.description}
                </p>
                {showNotification.reward && (
                  <p className="text-orange-200 text-xs font-bold">
                    REWARD: {showNotification.reward}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Master Navigator Achievement */}
      {unlockedEggs.size >= 5 && !unlockedEggs.has('master-navigator') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10002] flex items-center justify-center animate-fadeInUp">
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 border-4 border-gold rounded-lg p-8 text-center max-w-md">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-3xl font-bold text-yellow-400 retro-text mb-4">
              MASTER NAVIGATOR
            </h2>
            <p className="text-cyan-300 mb-6">
              You've discovered most of the hidden secrets! You are now a true Master Navigator of the digital seas!
            </p>
            <button
              onClick={() => {
                setUnlockedEggs(prev => new Set([...prev, 'master-navigator']))
                playSound('select')
              }}
              className="retro-button bg-yellow-600 text-black hover:bg-yellow-400 font-bold px-6 py-3 border-2 border-yellow-400"
            >
              <Crown className="w-5 h-5 mr-2 inline" />
              Claim Your Crown
            </button>
          </div>
        </div>
      )}
    </>
  )
}