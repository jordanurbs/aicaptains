"use client"

import { useState, useEffect, useRef } from "react"
import { X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { GAME_WIDTH, GAME_HEIGHT, initGameState, updateGameState, renderGame, type GameState } from "./game-engine"

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GameModal({ isOpen, onClose }: GameModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>(initGameState())
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(false)
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const { playSound } = useSound()

  // Initialize game
  useEffect(() => {
    if (!isOpen) return

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-gray-900 border-4 border-yellow-500 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-5xl md:text-6xl font-bold text-yellow-500 retro-text">AI CAPTAINS ACADEMY: SPACE DEFENDER</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-yellow-500 text-yellow-500"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" className="border-yellow-500 text-yellow-500" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="border-2 border-cyan-500"></canvas>

        <div className="mt-4 text-sm text-gray-300">
          <p className="mb-2 text-center text-cyan-400">CONTROLS:</p>
          <div className="grid grid-cols-2 gap-2">
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
      </div>
    </div>
  )
}
