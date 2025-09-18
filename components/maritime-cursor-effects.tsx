"use client"

import { useEffect, useState } from "react"
import { 
  Anchor, 
  Ship, 
  Compass, 
  Waves, 
  Zap,
  Star,
  Crown,
  Navigation
} from "lucide-react"

interface CursorTrail {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
  rotation: number
}

interface BubbleEffect {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  velocity: { x: number; y: number }
  lifetime: number
}

export function MaritimeCursorEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorTrail, setCursorTrail] = useState<CursorTrail[]>([])
  const [bubbles, setBubbles] = useState<BubbleEffect[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [cursorMode, setCursorMode] = useState<'normal' | 'anchor' | 'ship' | 'compass'>('normal')
  const [trailCounter, setTrailCounter] = useState(0)
  const [bubbleCounter, setBubbleCounter] = useState(0)

  // Track mouse movement and create trail effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Create trail effect
      const uniqueTrailId = Date.now() + Math.random() + Math.random() * 1000
      const newTrail: CursorTrail = {
        id: uniqueTrailId,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        scale: 1,
        rotation: Math.random() * 360
      }
      
      setCursorTrail(prev => [...prev.slice(-5), newTrail])
      setTrailCounter(prev => prev + 1)

      // Create occasional bubble effects when moving
      if (Math.random() < 0.1) {
        createBubble(e.clientX, e.clientY)
      }
    }

    // Track hoverable elements to change cursor mode
    const handleMouseEnter = (e: Event) => {
      const target = e.target

      // Check if target is an HTMLElement before using closest
      if (!(target instanceof HTMLElement)) {
        return
      }

      setIsHovering(true)

      if (target.closest('button') || target.closest('a')) {
        setCursorMode('anchor')
      } else if (target.closest('.problem-grid') || target.closest('.pricing-tiers')) {
        setCursorMode('compass')
      } else if (target.closest('.transformation-banner') || target.closest('.audience-cards')) {
        setCursorMode('ship')
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorMode('normal')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [trailCounter])

  // Animate trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorTrail(prev => 
        prev
          .map(trail => ({
            ...trail,
            opacity: Math.max(0, trail.opacity - 0.25),
            scale: trail.scale * 0.92,
            rotation: trail.rotation + 5
          }))
          .filter(trail => trail.opacity > 0.01 && trail.scale > 0.1)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Animate bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({
            ...bubble,
            x: bubble.x + bubble.velocity.x,
            y: bubble.y + bubble.velocity.y,
            opacity: bubble.opacity * 0.98,
            size: bubble.size * 1.01,
            lifetime: bubble.lifetime - 1
          }))
          .filter(bubble => bubble.lifetime > 0 && bubble.opacity > 0.1)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const createBubble = (x: number, y: number) => {
    const uniqueId = Date.now() + Math.random()
    const newBubble: BubbleEffect = {
      id: uniqueId,
      x,
      y,
      size: Math.random() * 8 + 4,
      opacity: 0.7,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: -Math.random() * 3 - 1
      },
      lifetime: 60
    }
    
    setBubbles(prev => [...prev.slice(-15), newBubble])
    setBubbleCounter(prev => prev + 1)
  }

  const createClickWave = () => {
    // Create multiple bubbles on click
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        createBubble(
          mousePosition.x + (Math.random() - 0.5) * 40,
          mousePosition.y + (Math.random() - 0.5) * 40
        )
      }, i * 50)
    }
  }

  // Handle click events to create wave effects
  useEffect(() => {
    const handleClick = () => {
      createClickWave()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [mousePosition])

  const getCursorIcon = () => {
    switch (cursorMode) {
      case 'anchor':
        return <Anchor className="w-6 h-6 text-yellow-500" />
      case 'ship':
        return <Ship className="w-6 h-6 text-cyan-400" />
      case 'compass':
        return <Compass className="w-6 h-6 text-yellow-500" />
      default:
        return <Navigation className="w-5 h-5 text-cyan-400" />
    }
  }

  return (
    <>
      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isHovering ? 1.5 : 1}) rotate(${isHovering ? '180deg' : '0deg'})`,
          transition: 'all 0.2s ease-out'
        }}
      >
        <div className={`
          drop-shadow-lg transition-all duration-200
          ${isHovering ? 'animate-pulse' : ''}
        `}>
          {getCursorIcon()}
        </div>
      </div>

      {/* Cursor Trail */}
      {cursorTrail.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9998] mix-blend-screen"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
            opacity: trail.opacity * 0.6,
            transform: `scale(${trail.scale * 0.5}) rotate(${trail.rotation}deg)`,
            transition: 'none'
          }}
        >
          <div className="w-4 h-4 border-2 border-cyan-400 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Bubble Effects */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="fixed pointer-events-none z-[9997] mix-blend-screen"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            transition: 'none'
          }}
        >
          <div 
            className="w-full h-full rounded-full bg-gradient-to-t from-cyan-400/30 to-blue-400/50 border border-cyan-400/40 animate-pulse"
            style={{
              boxShadow: '0 0 8px rgba(0, 255, 255, 0.3), inset 0 0 4px rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>
      ))}

      {/* Easter Egg: Special cursor for achievement areas */}
      {cursorMode === 'ship' && (
        <div
          className="fixed pointer-events-none z-[9996] mix-blend-screen"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 20,
          }}
        >
          <div className="flex items-center gap-1 bg-black/80 px-2 py-1 rounded text-xs text-yellow-400 border border-yellow-500/50">
            <Star className="w-3 h-3" />
            <span>AHOY CAPTAIN!</span>
          </div>
        </div>
      )}

      {/* Water wake effect behind cursor */}
      <div
        className="fixed pointer-events-none z-[9995] mix-blend-multiply"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 10,
          width: 100,
          height: 20,
          opacity: 0.3,
          transform: 'rotate(-15deg)',
          background: 'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
          borderRadius: '50%',
          animation: 'wake-ripple 1s ease-out infinite'
        }}
      />
    </>
  )
}