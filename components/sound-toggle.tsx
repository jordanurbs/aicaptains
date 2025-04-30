"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSoundEffects } from "@/hooks/use-sound-effects"

export function SoundToggle() {
  const { toggleMute, isMuted, playSound } = useSoundEffects()

  const handleToggle = () => {
    toggleMute()
    playSound("click")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  )
}
