"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type SoundType = "click" | "select" | "hover" | "startup" | "background" | "scroll"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false)
  const [originalBackgroundVolume, setOriginalBackgroundVolume] = useState(0.2)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  
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
      hover: new Audio("/sounds/retro-select.mp3"),
      startup: new Audio("/sounds/magic.mp3"),
      background: new Audio("/sounds/bgmusic.mp3"),
      scroll: new Audio("/sounds/retro-select.mp3"),
    }

    // Set volume for each sound
    Object.values(sounds).forEach((audio) => {
      audio.volume = 0.3 // Set a reasonable default volume
      // Preload audio
      audio.load()
    })

    // Startup sound can be a bit louder
    sounds.startup.volume = 0.4

    // Background music should loop and be a bit quieter
    sounds.background.loop = true
    sounds.background.volume = 0.2

    setAudioElements(sounds)
    backgroundMusicRef.current = sounds.background
    setOriginalBackgroundVolume(sounds.background.volume)
    setIsLoaded(true)

    // Handle user interaction for audio context
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true)
        console.log("User interaction detected - audio context unlocked")
      }
    }

    // Add listeners for user interaction
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    // Cleanup
    return () => {
      Object.values(sounds).forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
      })
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
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
      // Don't play any sounds if muted or not loaded
      if (isMuted || !isLoaded || !audioElements[type]) {
        return
      }

      // Don't play any sounds before user interaction
      if (!hasUserInteracted) {
        console.log("Waiting for user interaction before playing sounds")
        return
      }

      // Special handling for background music
      if (type === "background") {
        if (!isBackgroundMusicPlaying && hasUserInteracted) {
          const audio = audioElements[type]!
          audio.currentTime = 0
          audio.play().then(() => {
            setIsBackgroundMusicPlaying(true)
          }).catch((error) => {
            console.error("Background music playback error:", error)
          })
        }
        return
      }

      // Reset the audio to start for regular sounds
      const audio = audioElements[type]!
      audio.currentTime = 0

      // Play the sound
      audio.play().catch((error) => {
        console.error(`Audio playback error for ${type}:`, error)
      })
    },
    [audioElements, isMuted, isLoaded, isBackgroundMusicPlaying, hasUserInteracted],
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

  // Fade background music
  const fadeBackgroundMusic = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!backgroundMusicRef.current || !isBackgroundMusicPlaying) return

    const audio = backgroundMusicRef.current
    const startVolume = audio.volume
    const volumeChange = targetVolume - startVolume
    const steps = 50
    const stepTime = duration / steps
    const volumeStep = volumeChange / steps

    let currentStep = 0
    const fadeInterval = setInterval(() => {
      currentStep++
      const newVolume = startVolume + (volumeStep * currentStep)
      audio.volume = Math.max(0, Math.min(1, newVolume))

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        audio.volume = targetVolume
      }
    }, stepTime)
  }, [isBackgroundMusicPlaying])

  return { 
    playSound, 
    toggleMute, 
    isMuted, 
    isLoaded, 
    isBackgroundMusicPlaying,
    fadeBackgroundMusic,
    originalBackgroundVolume 
  }
}
