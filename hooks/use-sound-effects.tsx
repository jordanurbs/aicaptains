"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type SoundType = "click" | "select" | "hover" | "startup" | "background" | "scroll"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false)
  
  const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    select: null,
    hover: null,
    startup: null,
    background: null,
    scroll: null,
  })

  // Initialize audio elements
  useEffect(() => {
    const sounds: Record<SoundType, HTMLAudioElement> = {
      click: new Audio("/sounds/retro-video-game-coin-pickup.mp3"),
      select: new Audio("/sounds/level-up.mp3"),
      hover: new Audio("/sounds/video-game-select.mp3"),
      startup: new Audio("/sounds/magic.mp3"),
      background: new Audio("/sounds/bgmusic.mp3"),
      scroll: new Audio("/sounds/retro-select.mp3"),
    }

    // Set volume for each sound
    Object.values(sounds).forEach((audio) => {
      audio.volume = 0.3 // Set a reasonable default volume
    })

    // Startup sound can be a bit louder
    sounds.startup.volume = 0.4
    
    // Background music should loop and be a bit quieter
    sounds.background.loop = true
    sounds.background.volume = 0.2

    setAudioElements(sounds)
    backgroundMusicRef.current = sounds.background
    setIsLoaded(true)

    // Cleanup
    return () => {
      Object.values(sounds).forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  // Update background music when mute state changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (isMuted) {
        backgroundMusicRef.current.pause()
      } else if (isBackgroundMusicPlaying) {
        backgroundMusicRef.current.play().catch(e => console.error("Error playing background music:", e))
      }
    }
  }, [isMuted, isBackgroundMusicPlaying])

  // Play sound function
  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted || !isLoaded || !audioElements[type]) return

      // Special handling for background music
      if (type === "background") {
        if (!isBackgroundMusicPlaying) {
          const audio = audioElements[type]!
          audio.currentTime = 0
          audio.play().catch((error) => {
            console.log("Background music playback error:", error)
          })
          setIsBackgroundMusicPlaying(true)
        }
        return
      }

      // Reset the audio to start for regular sounds
      const audio = audioElements[type]!
      audio.currentTime = 0

      // Play the sound
      audio.play().catch((error) => {
        // Handle any autoplay restrictions
        console.log("Audio playback error:", error)
      })
    },
    [audioElements, isMuted, isLoaded, isBackgroundMusicPlaying],
  )

  // Toggle mute function - Fixed to properly control background music
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      
      // Directly control all audio elements immediately
      if (newMutedState) {
        // Pause all sounds when muting
        Object.values(audioElements).forEach(audio => {
          if (audio) {
            audio.pause();
          }
        });
        
        // Make sure background music is definitely paused
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause();
        }
      } else if (isBackgroundMusicPlaying && backgroundMusicRef.current) {
        // Only resume background music if it was playing before
        backgroundMusicRef.current.play().catch(e => console.error("Error playing background music:", e));
      }
      
      return newMutedState;
    });
  }, [audioElements, isBackgroundMusicPlaying]);

  return { playSound, toggleMute, isMuted, isLoaded, isBackgroundMusicPlaying }
}
