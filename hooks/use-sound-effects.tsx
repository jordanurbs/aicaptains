"use client"

import { useState, useEffect, useCallback } from "react"

type SoundType = "click" | "select" | "hover" | "startup"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    select: null,
    hover: null,
    startup: null,
  })

  // Initialize audio elements
  useEffect(() => {
    const sounds: Record<SoundType, HTMLAudioElement> = {
      click: new Audio("/sounds/click.mp3"),
      select: new Audio("/sounds/select.mp3"),
      hover: new Audio("/sounds/hover.mp3"),
      startup: new Audio("/sounds/startup.mp3"),
    }

    // Set volume for each sound
    Object.values(sounds).forEach((audio) => {
      audio.volume = 0.3 // Set a reasonable default volume
    })

    // Startup sound can be a bit louder
    sounds.startup.volume = 0.4

    setAudioElements(sounds)
    setIsLoaded(true)

    // Cleanup
    return () => {
      Object.values(sounds).forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  // Play sound function
  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted || !isLoaded || !audioElements[type]) return

      // Reset the audio to start
      const audio = audioElements[type]!
      audio.currentTime = 0

      // Play the sound
      audio.play().catch((error) => {
        // Handle any autoplay restrictions
        console.log("Audio playback error:", error)
      })
    },
    [audioElements, isMuted, isLoaded],
  )

  // Toggle mute function
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return { playSound, toggleMute, isMuted, isLoaded }
}
