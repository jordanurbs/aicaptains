"use client"

import { useState } from "react"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameModal } from "./game-modal"
import { useSound } from "@/components/sound-provider"

export function GameButton() {
  const [isGameOpen, setIsGameOpen] = useState(false)
  const { playSound } = useSound()

  const handleOpenGame = () => {
    playSound("click")
    setIsGameOpen(true)
  }

  const handleCloseGame = () => {
    playSound("click")
    setIsGameOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        className="retro-button bg-red-600 text-yellow-400 hover:bg-yellow-400 hover:text-red-600 font-bold"
        onClick={handleOpenGame}
        onMouseEnter={() => playSound("hover")}
      >
        <Gamepad2 className="mr-2 h-5 w-5" /> PLAY GAME
      </Button>

      <GameModal isOpen={isGameOpen} onClose={handleCloseGame} />
    </>
  )
}
