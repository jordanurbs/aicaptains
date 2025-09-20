"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { GAME_WIDTH, GAME_HEIGHT, updateGameDimensions, initGameState, updateGameState, renderGame, type GameState } from "./game-engine"

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GameModal({ isOpen, onClose }: GameModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>(initGameState())
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const { playSound, isMuted } = useSound()

  // Update canvas size and game dimensions
  const updateCanvasSize = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    // Set actual canvas resolution to match display size for crisp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    // Scale the drawing context back down
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Update game engine dimensions
    updateGameDimensions(rect.width, rect.height)
  }

  // Initialize game
  useEffect(() => {
    if (!isOpen) return

    // Update canvas size first
    setTimeout(updateCanvasSize, 100) // Small delay to ensure layout is complete

    // Reset game state when modal opens
    setGameState(initGameState())
    lastTimeRef.current = performance.now()

    // Set up keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      // Prevent default for game controls to avoid scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault()
      }

      setKeys((prevKeys) => {
        const newKeys = new Set(prevKeys)
        newKeys.add(e.key)
        return newKeys
      })

      // Handle pause
      if (e.key === "p") {
        setGameState((prevState) => ({
          ...prevState,
          paused: !prevState.paused,
        }))
      }

      // Handle restart if game over
      if (e.key === " " && gameState.gameOver) {
        setGameState(initGameState())
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = new Set(prevKeys)
        newKeys.delete(e.key)
        return newKeys
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("resize", updateCanvasSize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isOpen, gameState.gameOver, onClose])

  // Game loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      // Update game state
      setGameState((prevState) =>
        updateGameState(
          prevState,
          keys,
          deltaTime,
          () => !isMuted && playSound("laser"),
          () => !isMuted && playSound("explosion"),
          () => !isMuted && playSound("powerup"),
          () => !isMuted && playSound("game-over"),
        ),
      )

      // Render game
      renderGame(ctx, gameState)

      // Continue game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isOpen, gameState, keys, isMuted, playSound])

  if (!isOpen) return null

  // Use portal to render outside of sidebar container
  return createPortal(
    <div className="fixed inset-0 z-[10002] bg-black bg-opacity-95">
      {/* Close button - positioned at top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="icon" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Game title - positioned at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-500 retro-text text-center">
          AI CAPTAINS ACADEMY: SPACE DEFENDER
        </h2>
      </div>

      {/* Game canvas - almost full screen */}
      <div className="flex items-center justify-center h-full p-8 pt-20">
        <canvas
          ref={canvasRef}
          className="border-2 border-cyan-500"
          style={{
            width: 'min(95vw, 95vh * 1.33)', // Maintain 4:3 aspect ratio, use 95% of viewport
            height: 'min(95vh - 100px, 95vw * 0.75)', // Account for title space
            display: 'block',
          }}
        />
      </div>

      {/* Controls - positioned at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-sm text-gray-300 bg-black bg-opacity-70 p-4 rounded-lg border border-yellow-500">
        <p className="mb-2 text-center text-cyan-400 font-bold">CONTROLS:</p>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p>← → or A/D: Move ship</p>
            <p>SPACE or ↑: Fire</p>
          </div>
          <div>
            <p>P: Pause game</p>
            <p>ESC: Exit game</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
