"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipForward, Maximize, Volume2, VolumeX } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import Image from "next/image"

interface MobileTVPlayerProps {
  videoSrc: string
  autoPlay?: boolean
  onStateChange?: (state: 'off' | 'booting' | 'static' | 'playing' | 'paused') => void
  onSkipToMain?: () => void
}

type TVState = 'off' | 'booting' | 'static' | 'playing' | 'paused'

export function MobileTVPlayer({
  videoSrc,
  autoPlay = false,
  onStateChange,
  onSkipToMain
}: MobileTVPlayerProps) {
  const [tvState, setTvState] = useState<TVState>('booting')
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [isMuted, setIsMuted] = useState(true) // Always start muted for mobile autoplay
  const [isExplicitlyMuted, setIsExplicitlyMuted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const staticCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const bootTimerRef = useRef<NodeJS.Timeout | null>(null)
  const staticTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tvStateRef = useRef<TVState>('booting')
  const { playSound } = useSound()

  // Update tvStateRef when tvState changes
  useEffect(() => {
    tvStateRef.current = tvState
  }, [tvState])

  // Static animation effect
  const drawStatic = useCallback(() => {
    const canvas = staticCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255
      data[i] = value     // Red
      data[i + 1] = value // Green
      data[i + 2] = value // Blue
      data[i + 3] = 255   // Alpha
    }

    ctx.putImageData(imageData, 0, 0)

    if (tvStateRef.current === 'static' || tvStateRef.current === 'booting') {
      animationFrameRef.current = requestAnimationFrame(drawStatic)
    }
  }, [])

  // Boot sequence on mount
  useEffect(() => {
    console.log('🚀 Mobile TV boot sequence starting')
    setTvState('booting')
    playSound('startup')

    // Boot sequence timing
    bootTimerRef.current = setTimeout(() => {
      setTvState('static')
      drawStatic()
      playSound('hover')
    }, 800)

    staticTimerRef.current = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (autoPlay && videoRef.current) {
        const video = videoRef.current
        video.muted = true
        setIsMuted(true)
        video.load()

        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setTvState('playing')
              setShowPlayButton(false)
              playSound('select')
            })
            .catch(() => {
              setTvState('paused')
              setShowPlayButton(true)
            })
        }
      } else {
        setTvState('paused')
        setShowPlayButton(true)
      }
    }, 2000)

    return () => {
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current)
      if (staticTimerRef.current) clearTimeout(staticTimerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, []) // Run only on mount

  // TV state change callback
  useEffect(() => {
    onStateChange?.(tvState)
  }, [tvState, onStateChange])

  // Play/Pause handler
  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (tvState === 'playing') {
      videoRef.current.pause()
      setTvState('paused')
      setShowPlayButton(true)
      playSound('click')
    } else {
      // Only keep muted if explicitly muted by user
      if (!isExplicitlyMuted) {
        videoRef.current.muted = false
        setIsMuted(false)
      }
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setTvState('playing')
            setShowPlayButton(false)
            playSound('select')
          })
          .catch(() => {
            // Fallback to muted play if unmuted fails
            if (videoRef.current) {
              videoRef.current.muted = true
              setIsMuted(true)
              videoRef.current.play().then(() => {
                setTvState('playing')
                setShowPlayButton(false)
                playSound('select')
              }).catch(() => {
                console.error('Mobile play failed')
              })
            }
          })
      }
    }
  }

  // Audio toggle handler
  const handleAudioToggle = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
      setIsExplicitlyMuted(newMutedState)
      playSound('click')
    }
  }

  // Skip handler
  const handleSkip = () => {
    playSound('click')
    onSkipToMain?.()
  }

  // Fullscreen handler
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen()
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen()
      }
      playSound('click')
    }
  }

  // Video event handlers
  const handleVideoPlay = () => {
    setShowPlayButton(false)
    setTvState('playing')
  }

  const handleVideoPause = () => {
    setShowPlayButton(true)
    setTvState('paused')
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/vertical-phone-bg.jpg"
          alt="Mobile Background"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* Logo - Fixed at top */}
      <div className="relative z-10 flex justify-center pt-6 pb-4">
        <Image
          src="/images/academy-logo-min.png"
          alt="AI CAPTAINS ACADEMY"
          width={160}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Content Container */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4">

        {/* Video Container - Mobile optimized */}
        <div className="relative w-full max-w-sm aspect-video bg-black/50 rounded-xl overflow-hidden shadow-2xl border border-orange-500/30">
          {/* Static Canvas */}
          <canvas
            ref={staticCanvasRef}
            className={`absolute inset-0 w-full h-full ${
              tvState === 'static' || tvState === 'booting' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            width={320}
            height={180}
          />

          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            className={`w-full h-full object-cover ${
              tvState === 'playing' || tvState === 'paused' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={() => {
              playSound('select')
              onSkipToMain?.()
            }}
            muted={isMuted}
            loop={false}
            preload="auto"
            playsInline
            controls={false}
            webkit-playsinline="true"
          />

          {/* Play Overlay */}
          {showPlayButton && tvState !== 'booting' && tvState !== 'static' && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              onClick={handlePlayPause}
            >
              <div className="w-20 h-20 bg-orange-500/80 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </div>
          )}

          {/* Fullscreen button - top right of video */}
          <button
            onClick={handleFullscreen}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Instructions - Below video */}
        <div className="mt-4 text-center text-orange-400 text-sm font-mono">
          {tvState === 'booting' && "INITIALIZING..."}
          {tvState === 'static' && "LOADING VIDEO..."}
          {(tvState === 'paused' || showPlayButton) && tvState !== 'booting' && tvState !== 'static' && "TAP PLAY TO START"}
          {tvState === 'playing' && !showPlayButton && "TAP VIDEO FOR FULLSCREEN"}
        </div>
      </div>

      {/* Control Buttons - Anchored to bottom */}
      <div className="relative z-10 pb-8">
        <div className="flex gap-3 justify-center">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            disabled={tvState === 'booting' || tvState === 'static'}
          >
            {tvState === 'playing' ? (
              <>
                <Pause className="w-5 h-5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Audio Toggle Button */}
          <button
            onClick={handleAudioToggle}
            className={`flex items-center gap-2 px-5 py-3 ${isMuted ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
          >
            <SkipForward className="w-5 h-5" />
            <span>SKIP</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-gray-500 text-xs">
          © 2025 AI CAPTAINS LLC. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Mobile-optimized styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .fixed {
            -webkit-tap-highlight-color: transparent;
          }

          button {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          video {
            -webkit-playsinline: true;
            playsinline: true;
          }
        }
      `}</style>
    </div>
  )
}