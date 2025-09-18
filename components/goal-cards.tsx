"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Target, Zap, Rocket, Briefcase, TrendingUp, Users } from "lucide-react"
import { useSound } from "@/components/sound-provider"

interface Goal {
  id: string
  title: string
  icon: React.ReactNode
  color: "cyan" | "yellow" | "purple"
  category: "build" | "automate" | "create" | "business" | "startup" | "collaborate"
}

interface Position {
  x: number
  y: number
}

interface GoalCardsProps {
  className?: string
  onGoalDrop?: (goal: Goal, position: Position) => void
  dropZones?: Array<{
    id: string
    bounds: DOMRect
    label: string
  }>
}

const goals: Goal[] = [
  {
    id: "ai-apps",
    title: "Build AI-powered apps that solve real problems",
    icon: <Target className="w-5 h-5" />,
    color: "cyan",
    category: "build"
  },
  {
    id: "workflow-automation",
    title: "Automate my workflow with intelligent agents",
    icon: <Zap className="w-5 h-5" />,
    color: "yellow",
    category: "automate"
  },
  {
    id: "content-tools",
    title: "Create viral content tools for creators",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "purple",
    category: "create"
  },
  {
    id: "consultancy",
    title: "Launch my own AI consultancy business",
    icon: <Briefcase className="w-5 h-5" />,
    color: "cyan",
    category: "business"
  },
  {
    id: "unicorn-startup",
    title: "Build the next unicorn startup with AI",
    icon: <Rocket className="w-5 h-5" />,
    color: "yellow",
    category: "startup"
  },
  {
    id: "ai-collaboration",
    title: "Enhance my dev workflow with AI collaboration",
    icon: <Users className="w-5 h-5" />,
    color: "purple",
    category: "collaborate"
  }
]

export function GoalCards({ className = "", onGoalDrop, dropZones = [] }: GoalCardsProps) {
  const [draggedGoal, setDraggedGoal] = useState<Goal | null>(null)
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 })
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null)
  const [clickedGoal, setClickedGoal] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartPos, setTouchStartPos] = useState<Position>({ x: 0, y: 0 })
  const { playSound } = useSound()
  
  const dragRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getColorClasses = (color: Goal["color"], isHovered: boolean, isDragged: boolean) => {
    const baseClasses = {
      cyan: {
        border: isHovered || isDragged ? "border-cyan-400" : "border-cyan-600",
        bg: isHovered || isDragged ? "bg-gradient-to-br from-blue-900/80 to-cyan-900/80" : "bg-gray-800/90",
        text: isHovered || isDragged ? "text-cyan-300" : "text-gray-300",
        icon: isHovered || isDragged ? "text-cyan-400" : "text-cyan-500",
        glow: "shadow-cyan-400/20"
      },
      yellow: {
        border: isHovered || isDragged ? "border-yellow-400" : "border-yellow-600",
        bg: isHovered || isDragged ? "bg-gradient-to-br from-orange-900/80 to-yellow-900/80" : "bg-gray-800/90",
        text: isHovered || isDragged ? "text-yellow-300" : "text-gray-300",
        icon: isHovered || isDragged ? "text-yellow-400" : "text-yellow-500",
        glow: "shadow-yellow-400/20"
      },
      purple: {
        border: isHovered || isDragged ? "border-purple-400" : "border-purple-600",
        bg: isHovered || isDragged ? "bg-gradient-to-br from-purple-900/80 to-pink-900/80" : "bg-gray-800/90",
        text: isHovered || isDragged ? "text-purple-300" : "text-gray-300",
        icon: isHovered || isDragged ? "text-purple-400" : "text-purple-500",
        glow: "shadow-purple-400/20"
      }
    }
    return baseClasses[color]
  }

  const handleDragStart = useCallback((e: React.DragEvent, goal: Goal) => {
    setDraggedGoal(goal)
    setIsDragging(true)
    playSound("hover")
    
    // Set drag data
    e.dataTransfer.setData("text/plain", goal.id)
    e.dataTransfer.effectAllowed = "move"
    
    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.transform = "rotate(5deg) scale(0.8)"
    dragImage.style.opacity = "0.8"
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    document.body.appendChild(dragImage)
    
    // Center the drag image on the cursor
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY)
    
    // Clean up drag image after a delay
    setTimeout(() => {
      if (dragImage.parentNode) {
        dragImage.parentNode.removeChild(dragImage)
      }
    }, 100)
  }, [playSound])

  const handleDragEnd = useCallback(() => {
    setDraggedGoal(null)
    setIsDragging(false)
    setDragPosition({ x: 0, y: 0 })
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    if (e.clientX !== 0 && e.clientY !== 0) {
      setDragPosition({ x: e.clientX, y: e.clientY })
    }
  }, [])

  // Touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent, goal: Goal) => {
    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setHoveredGoal(goal.id)
    playSound("hover")
  }, [playSound])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.y)
    
    // Start dragging if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      if (!isDragging && hoveredGoal) {
        const goal = goals.find(g => g.id === hoveredGoal)
        if (goal) {
          setDraggedGoal(goal)
          setIsDragging(true)
        }
      }
      setDragPosition({ x: touch.clientX, y: touch.clientY })
    }
  }, [touchStartPos, isDragging, hoveredGoal])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isDragging && draggedGoal) {
      const touch = e.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      
      // Check if dropped on a valid drop zone
      if (elementBelow && onGoalDrop) {
        onGoalDrop(draggedGoal, { x: touch.clientX, y: touch.clientY })
        playSound("click")
      }
    }
    
    setDraggedGoal(null)
    setIsDragging(false)
    setHoveredGoal(null)
    setDragPosition({ x: 0, y: 0 })
  }, [isDragging, draggedGoal, onGoalDrop, playSound])

  const handleHover = useCallback((goalId: string) => {
    setHoveredGoal(goalId)
    playSound("hover")
  }, [playSound])

  const handleClick = useCallback((goalId: string) => {
    setClickedGoal(goalId)
    playSound("click")
    
    // Add celebration effect
    if (Math.random() > 0.8) {
      const event = new CustomEvent('celebrate', { detail: { type: 'goal-selection' } })
      window.dispatchEvent(event)
    }
    
    // Reset clicked state after animation
    setTimeout(() => setClickedGoal(null), 200)
  }, [playSound])

  return (
    <section className={`relative ${className}`} ref={containerRef}>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {goals.map((goal, index) => {
          const isHovered = hoveredGoal === goal.id
          const isClicked = clickedGoal === goal.id
          const isDragged = draggedGoal?.id === goal.id
          const colors = getColorClasses(goal.color, isHovered, isDragged)
          
          return (
            <div
              key={goal.id}
              className={`
                relative group cursor-move select-none
                border-4 rounded-lg p-4 
                transition-all duration-200 ease-out
                retro-button overflow-hidden
                min-h-[140px] flex flex-col
                ${colors.border} ${colors.bg}
                ${isHovered || isDragged ? `transform -translate-y-1 shadow-lg ${colors.glow}` : 'hover:border-gray-600'}
                ${isClicked ? 'transform translate-x-1 translate-y-1 shadow-none' : ''}
                ${isDragged ? 'opacity-50 scale-95 rotate-2' : ''}
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, goal)}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              onTouchStart={(e) => handleTouchStart(e, goal)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => handleHover(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
              onClick={() => handleClick(goal.id)}
            >
              {/* Background Grid Effect */}
              <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
              
              {/* Scanline Effect */}
              <div className="scanline-thin"></div>

              {/* Glitch overlay on hover */}
              {(isHovered || isDragged) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-400/5 to-transparent animate-pulse pointer-events-none" style={{animationDelay: '0.1s'}} />
                </>
              )}

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 transform
                    ${isHovered || isDragged
                      ? `${colors.border} bg-${goal.color}-400/20 scale-110` 
                      : `border-gray-600 bg-gray-700/20 scale-100`
                    }
                  `}>
                    <div className={`transition-all duration-200 ${colors.icon}`}>
                      {goal.icon}
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`
                    px-2 py-1 rounded text-xs font-mono uppercase tracking-wider
                    transition-all duration-200
                    ${isHovered || isDragged 
                      ? `bg-${goal.color}-400/20 text-${goal.color}-300 border border-${goal.color}-400/50`
                      : 'bg-gray-700/50 text-gray-500 border border-gray-600/50'
                    }
                  `}>
                    {goal.category}
                  </div>
                </div>

                {/* Goal Text */}
                <div className="flex-1 flex items-center">
                  <h3 className={`
                    text-sm leading-relaxed font-medium
                    transition-all duration-200
                    ${colors.text}
                    ${isHovered || isDragged ? 'transform scale-105' : ''}
                  `}>
                    {goal.title}
                  </h3>
                </div>

                {/* Status Indicator */}
                {(isHovered || isDragged) && (
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-yellow-500 text-xs font-bold retro-text blink">
                      [{String(index + 1).padStart(2, '0')}]
                    </div>
                    <div className={`text-xs font-bold retro-text animate-pulse ${colors.icon}`}>
                      {isDragged ? '&gt; DRAGGING...' : '&gt; READY TO DRAG'}
                    </div>
                  </div>
                )}
              </div>

              {/* Glitch Effect Border */}
              {(isHovered || isDragged) && (
                <>
                  <div className={`absolute inset-0 border-2 ${colors.border} rounded-lg animate-pulse pointer-events-none`}></div>
                  <div className="absolute -inset-1 border border-yellow-500 rounded-lg opacity-50 pointer-events-none" style={{animationDelay: '0.2s'}}></div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Drag Ghost/Preview */}
      {isDragging && draggedGoal && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: dragPosition.x,
            top: dragPosition.y,
          }}
        >
          <div className={`
            border-4 rounded-lg p-4 
            bg-gradient-to-br from-cyan-900/90 to-purple-900/90
            border-cyan-400 shadow-lg shadow-cyan-400/50
            min-h-[140px] w-64 opacity-80 rotate-3 scale-90
            retro-button
          `}>
            <div className="flex items-center justify-center h-full">
              <div className="text-cyan-300 font-medium text-sm text-center">
                {draggedGoal.title}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}