"use client"

import { useEffect, useState } from "react"
import { 
  Anchor, 
  Ship, 
  Star, 
  Crown, 
  Zap,
  Trophy,
  Compass,
  Navigation
} from "lucide-react"

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  icon: React.ReactNode
  scale: number
  gravity: number
}

interface CelebrationEffectsProps {
  trigger?: boolean
  type?: 'achievement' | 'signup' | 'purchase' | 'transformation'
  duration?: number
}

export function CelebrationEffects({ 
  trigger = false, 
  type = 'achievement',
  duration = 3000 
}: CelebrationEffectsProps) {
  // DISABLED - Performance optimization
  return null

  const maritimeIcons = [
    <Anchor key="anchor" className="w-4 h-4" />,
    <Ship key="ship" className="w-4 h-4" />,
    <Star key="star" className="w-4 h-4" />,
    <Crown key="crown" className="w-4 h-4" />,
    <Zap key="zap" className="w-4 h-4" />,
    <Trophy key="trophy" className="w-4 h-4" />,
    <Compass key="compass" className="w-4 h-4" />,
    <Navigation key="navigation" className="w-4 h-4" />
  ]

  const colors = [
    'text-yellow-500',
    'text-cyan-400',
    'text-blue-400',
    'text-purple-400',
    'text-green-400',
    'text-orange-400',
    'text-pink-400',
    'text-red-400'
  ]

  const createConfetti = (count: number) => {
    const newConfetti: Confetti[] = []
    
    for (let i = 0; i < count; i++) {
      const confettiItem: Confetti = {
        id: counter + i,
        x: window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8,
        y: -50,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: maritimeIcons[Math.floor(Math.random() * maritimeIcons.length)],
        scale: 0.5 + Math.random() * 1,
        gravity: 0.2 + Math.random() * 0.1
      }
      newConfetti.push(confettiItem)
    }
    
    setConfetti(prev => [...prev, ...newConfetti])
    setCounter(prev => prev + count)
  }

  const createCannonBlast = () => {
    // Create multiple bursts from different points
    const burstPoints = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.1 }
    ]

    burstPoints.forEach((point, index) => {
      setTimeout(() => {
        const burstConfetti: Confetti[] = []
        for (let i = 0; i < 15; i++) {
          const angle = (Math.PI * 2 * i) / 15
          const speed = 8 + Math.random() * 6
          
          burstConfetti.push({
            id: counter + index * 15 + i,
            x: point.x,
            y: point.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            icon: maritimeIcons[Math.floor(Math.random() * maritimeIcons.length)],
            scale: 0.8 + Math.random() * 0.7,
            gravity: 0.15
          })
        }
        
        setConfetti(prev => [...prev, ...burstConfetti])
      }, index * 200)
    })
    
    setCounter(prev => prev + 45)
  }

  const createAchievementCelebration = () => {
    // Create a spectacular celebration for major achievements
    createCannonBlast()
    
    // Add extra confetti rain
    setTimeout(() => createConfetti(30), 500)
    setTimeout(() => createConfetti(20), 1000)
    setTimeout(() => createConfetti(15), 1500)
  }

  // Trigger effects when prop changes
  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      switch (type) {
        case 'achievement':
          createAchievementCelebration()
          break
        case 'transformation':
          createCannonBlast()
          break
        case 'signup':
          createConfetti(25)
          break
        case 'purchase':
          createAchievementCelebration()
          break
        default:
          createConfetti(20)
      }

      // Stop celebration after duration
      setTimeout(() => {
        setIsActive(false)
        setConfetti([])
      }, duration)
    }
  }, [trigger, isActive, type, duration])

  // Animate confetti
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setConfetti(prev => 
        prev
          .map(item => ({
            ...item,
            x: item.x + item.vx,
            y: item.y + item.vy,
            vy: item.vy + item.gravity,
            rotation: item.rotation + item.rotationSpeed,
            scale: Math.max(0, item.scale - 0.005)
          }))
          .filter(item => 
            item.y < window.innerHeight + 100 && 
            item.scale > 0.1 &&
            item.x > -100 && 
            item.x < window.innerWidth + 100
          )
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive && confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {confetti.map(item => (
        <div
          key={item.id}
          className={`absolute ${item.color} drop-shadow-lg`}
          style={{
            left: item.x,
            top: item.y,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            filter: 'drop-shadow(0 0 4px currentColor)'
          }}
        >
          {item.icon}
        </div>
      ))}
      
      {/* Special effects overlay for major celebrations */}
      {type === 'achievement' && isActive && (
        <>
          {/* Golden flash */}
          <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" 
               style={{ animation: 'flash 0.5s ease-out' }} />
          
          {/* Radiating rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-4 border-yellow-500/50 rounded-full animate-ping" />
            <div className="absolute inset-0 w-32 h-32 border-2 border-cyan-400/50 rounded-full animate-ping" 
                 style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-0 w-32 h-32 border border-yellow-500/30 rounded-full animate-ping" 
                 style={{ animationDelay: '0.4s' }} />
          </div>
        </>
      )}
    </div>
  )
}

// Hook for easy celebration triggering
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    trigger: boolean
    type: 'achievement' | 'signup' | 'purchase' | 'transformation'
  }>({ trigger: false, type: 'achievement' })

  const celebrate = (type: 'achievement' | 'signup' | 'purchase' | 'transformation' = 'achievement') => {
    setCelebration({ trigger: false, type })
    // Small delay to ensure re-render
    setTimeout(() => setCelebration({ trigger: true, type }), 50)
  }

  return {
    celebration,
    celebrate,
    CelebrationComponent: () => (
      <CelebrationEffects 
        trigger={celebration.trigger} 
        type={celebration.type} 
      />
    )
  }
}