"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Power, VolumeX, Volume2 } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import Image from "next/image"

// Responsive positioning hook for TV controls
const useResponsiveControlPositions = () => {
  const [screenWidth, setScreenWidth] = useState(1240) // Default to perfect width
  
  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(window.innerWidth)
    updateScreenWidth()
    window.addEventListener('resize', updateScreenWidth)
    return () => window.removeEventListener('resize', updateScreenWidth)
  }, [])
  
  // Calculate responsive positions based on screen width
  // 1240px is the perfect reference point
  const getResponsivePosition = (baseRightPercent: number) => {
    if (screenWidth >= 1400) {
      // Very large screens: move controls further left
      return `${baseRightPercent + 3}%`
    } else if (screenWidth >= 1240) {
      // Perfect range (1240px-1400px): keep stationary at perfect position
      return `${baseRightPercent}%`
    } else if (screenWidth >= 1024) {
      // Medium screens: slight adjustment
      return `${baseRightPercent - 1}%`
    } else if (screenWidth >= 768) {
      // Small screens: more adjustment
      return `${baseRightPercent - 2}%`
    } else {
      // Mobile: significant adjustment
      return `${baseRightPercent - 3}%`
    }
  }
  
  // Special positioning for power button above 1240px
  const getPowerButtonPosition = () => {
    if (screenWidth >= 1400) {
      // 1400px and above
      return { 
        top: '44.5%', 
        right: '7%'
      }
    } else if (screenWidth >= 1240) {
      // 1240px-1400px range
      return { 
        top: '44.5%', 
        right: '7%'
      }
    } else {
      return { 
        top: '44%', 
        right: getResponsivePosition(5) 
      }
    }
  }
  
  // Enhanced knob positioning with scaling/hiding and smooth interpolation
  const getKnobPositionAndVisibility = () => {
    let visibility = true
    let scale = 1
    let rightPosition = '17%'

    if (screenWidth < 1080) {
      // Hide knobs completely under 1080px (they're just for fun anyway)
      visibility = false
    } else if (screenWidth >= 1400) {
      // 1400px and above
      rightPosition = '18%'
      scale = 1
    } else if (screenWidth >= 1240) {
      // 1240px-1400px range
      rightPosition = '18%'
      
      // Progressive scaling down as screen gets smaller from 1400px to 1240px
      const progress = (screenWidth - 1240) / (1400 - 1240) // 0 to 1
      scale = 0.7 + (0.3 * progress) // Scale from 0.7 to 1.0
    } else {
      // Use normal responsive logic for smaller screens
      rightPosition = getResponsivePosition(17)
      scale = 1
    }

    return { right: rightPosition, visible: visibility, scale }
  }

  const knobSettings = getKnobPositionAndVisibility()

  return {
    powerButton: getPowerButtonPosition(),
    volumeKnob: { 
      right: knobSettings.right, 
      visible: knobSettings.visible, 
      scale: knobSettings.scale 
    },
    channelKnob: { 
      right: knobSettings.right, 
      visible: knobSettings.visible, 
      scale: knobSettings.scale 
    },
    muteButton: { 
      right: (() => {
        if (screenWidth >= 1400) {
          return '19%' // 1400px and above
        } else if (screenWidth >= 1240) {
          return '16%' // 1240px-1400px range
        } else {
          return getResponsivePosition(18)
        }
      })()
    }
  }
}

interface InteractiveTVPlayerProps {
  videoSrc: string
  autoPlay?: boolean
  onStateChange?: (state: 'off' | 'booting' | 'static' | 'playing' | 'paused') => void
  onSkipToMain?: () => void
}

type TVState = 'off' | 'booting' | 'static' | 'playing' | 'paused'
type ChannelEffect = 'none' | 'sepia' | 'invert' | 'blur' | 'contrast' | 'saturate'

export function InteractiveTVPlayer({ 
  videoSrc, 
  autoPlay = false, 
  onStateChange,
  onSkipToMain 
}: InteractiveTVPlayerProps) {
  const [tvState, setTvState] = useState<TVState>('off')
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(autoPlay)
  const [isExplicitlyMuted, setIsExplicitlyMuted] = useState(false)
  const [currentChannel, setCurrentChannel] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(true)
  
  // Get responsive control positions
  const controlPositions = useResponsiveControlPositions()
  
  // Debug showPlayButton changes
  useEffect(() => {
    console.log('🎮 Play button visibility changed:', showPlayButton ? 'VISIBLE' : 'HIDDEN')
  }, [showPlayButton])
  const [knobRotations, setKnobRotations] = useState({ volume: 252, channel: 0 }) // 70% of 360deg
  const [ambientGlow, setAmbientGlow] = useState(false)
  const [screenGlow, setScreenGlow] = useState('rgba(0, 255, 255, 0.3)')
  const [konamiSequence, setKonamiSequence] = useState<string[]>([])
  const [easterEggActive, setEasterEggActive] = useState(false)
  const [leftControllerHover, setLeftControllerHover] = useState(false)
  const [rightControllerHover, setRightControllerHover] = useState(false)
  // const [currentVideoSrc, setCurrentVideoSrc] = useState(videoSrc)
  // const [hasTriedWebM, setHasTriedWebM] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const staticCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const bootTimerRef = useRef<NodeJS.Timeout | null>(null)
  const staticTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasBootedRef = useRef(false)
  const tvStateRef = useRef<TVState>('off')
  const { playSound, isMuted: soundProviderMuted } = useSound()
  
  // The famous Konami Code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

  // Space bar pause/play functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle spacebar for video control
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault() // Prevent page scrolling
        
        // Only respond to spacebar if TV is on and not in static/booting state
        if (tvState === 'off' || tvState === 'booting' || tvState === 'static') {
          return
        }
        
        if (videoRef.current) {
          if (tvState === 'playing' && !videoRef.current.paused) {
            // Pause the video
            videoRef.current.pause()
            setTvState('paused')
            setShowPlayButton(true)
            playSound('click')
          } else if (tvState === 'paused' || showPlayButton) {
            // Play the video
            // User interaction allows unmuting (unless explicitly muted)
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
                .catch((error) => {
                  console.error('Spacebar play failed:', error)
                  // Fallback to muted play
                  if (videoRef.current) {
                    videoRef.current.muted = true
                    setIsMuted(true)
                    videoRef.current.play().then(() => {
                      setTvState('playing')
                      setShowPlayButton(false)
                      playSound('select')
                    }).catch(() => {
                      console.error('Spacebar muted play failed')
                    })
                  }
                })
            }
          }
        }
      }
    }

    // Add event listener to document for global keyboard handling
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tvState, showPlayButton, isExplicitlyMuted, playSound])

  // Video format fallback helper (temporarily disabled)
  const tryWebMFallback = useCallback(() => {
    console.log('WebM fallback temporarily disabled for debugging')
    return false
  }, [])

  const channels: ChannelEffect[] = ['none', 'sepia', 'invert', 'blur', 'contrast', 'saturate']
  const channelNames = ['NORMAL', 'RETRO', 'NEGATIVE', 'DREAM', 'CRISP', 'VIVID']

  // Update tvStateRef when tvState changes
  useEffect(() => {
    tvStateRef.current = tvState
  }, [tvState])

  // Static animation effect - no dependencies needed
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
    
    // Use ref to check current state
    if (tvStateRef.current === 'static' || tvStateRef.current === 'booting') {
      animationFrameRef.current = requestAnimationFrame(drawStatic)
    }
  }, [])

  // Initial boot on mount if autoPlay is enabled
  useEffect(() => {
    if (autoPlay && !hasBootedRef.current) {
      console.log('🚀 Auto-starting TV boot sequence')
      hasBootedRef.current = true
      setTvState('booting')
    }
  }, [autoPlay]) // Run only on mount

  // Boot sequence - only runs when booting starts
  useEffect(() => {
    console.log('🎬 Boot effect triggered. Current state:', tvState)
    
    if (tvState === 'booting' && !bootTimerRef.current && !staticTimerRef.current) {
      // Only start timers if they haven't been started yet
      console.log('🔴 TV State: BOOTING')
      console.log('📺 Video source:', videoSrc)
      console.log('🔊 AutoPlay enabled:', autoPlay)
      playSound('startup') // More appropriate for TV boot
      setAmbientGlow(true)
      
      // Boot sequence timing - store in refs
      bootTimerRef.current = setTimeout(() => {
        console.log('🟡 TV State: BOOTING → STATIC')
        setTvState('static')
        drawStatic()
        // Add static sound effect
        playSound('hover') // Repurpose as static noise
      }, 800)

      staticTimerRef.current = setTimeout(() => {
        console.log('⚡ Static timer fired - attempting video play')
        console.log('📺 Video ref exists:', !!videoRef.current)
        console.log('🔊 AutoPlay setting:', autoPlay)
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        
        if (autoPlay && videoRef.current) {
          const video = videoRef.current
          // Force video to be muted for autoplay compliance
          console.log('🔇 Setting video to muted for autoplay')
          video.muted = true
          setIsMuted(true)
          video.load() // Reload the video source
          
          console.log('▶️ Attempting video.play()')
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('✅ Autoplay successful!')
                console.log('🟢 TV State: STATIC → PLAYING')
                setTvState('playing')
                setShowPlayButton(false)
                playSound('select')
              })
              .catch((error) => {
                console.error('Autoplay failed:', error)
                console.log('Error type:', error.name, 'Message:', error.message)
                
                // Try WebM fallback if it's a format issue
                if (error.name === 'NotSupportedError' && tryWebMFallback()) {
                  console.log('Retrying autoplay with WebM')
                  setTimeout(() => {
                    const video = videoRef.current
                    if (video) {
                      video.muted = true
                      const retryPromise = video.play()
                      if (retryPromise !== undefined) {
                        retryPromise
                          .then(() => {
                            console.log('WebM autoplay successful')
                            setTvState('playing')
                            setShowPlayButton(false)
                            playSound('select')
                          })
                          .catch(() => {
                            console.log('WebM autoplay also failed, falling back to manual play')
                            setTvState('paused')
                            setShowPlayButton(true)
                          })
                      }
                    }
                  }, 100)
                } else {
                  console.log('Falling back to manual play')
                  setTvState('paused')
                  setShowPlayButton(true)
                }
                
                // Keep video muted but allow manual play
                const video = videoRef.current
                if (video) {
                  video.muted = true
                }
              })
          }
        } else {
          console.log('⚠️ No autoplay - setting to paused state')
          console.log('🟡 TV State: STATIC → PAUSED')
          setTvState('paused')
          setShowPlayButton(true)
        }
      }, 2000)
    }
  }, [tvState]) // Only depend on tvState, use refs for other values
  
  // Cleanup timers on unmount only
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - cleaning up timers')
      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current)
        bootTimerRef.current = null
      }
      if (staticTimerRef.current) {
        clearTimeout(staticTimerRef.current)
        staticTimerRef.current = null
      }
    }
  }, []) // Empty dependency - only runs on mount/unmount

  // Sync video muted state with sound provider (but respect explicit mute)
  useEffect(() => {
    if (videoRef.current && soundProviderMuted !== isMuted && !isExplicitlyMuted) {
      setIsMuted(soundProviderMuted)
      videoRef.current.muted = soundProviderMuted
    }
  }, [soundProviderMuted, isMuted, isExplicitlyMuted])

  // TV state change callback
  useEffect(() => {
    console.log('📺 TV State changed to:', tvState.toUpperCase())
    console.log('🎮 Current play button state:', showPlayButton ? 'VISIBLE' : 'HIDDEN')
    onStateChange?.(tvState)
  }, [tvState, onStateChange, showPlayButton])

  // Video event handlers
  const handleVideoPlay = () => {
    setShowPlayButton(false)
    setTvState('playing')
    // Dynamic screen glow based on video content
    const updateGlow = () => {
      const colors = ['rgba(0, 255, 255, 0.3)', 'rgba(255, 100, 0, 0.2)', 'rgba(255, 0, 255, 0.3)']
      setScreenGlow(colors[Math.floor(Math.random() * colors.length)])
    }
    const glowInterval = setInterval(updateGlow, 3000)
    return () => clearInterval(glowInterval)
  }

  const handleVideoPause = () => {
    setShowPlayButton(true)
    setTvState('paused')
  }

  // Power button handler
  const handlePowerButton = () => {
    if (tvState === 'off') {
      playSound('startup')
      setTvState('booting')
      setAmbientGlow(true)
      // Reset hasBooted to trigger the boot sequence
      hasBootedRef.current = false
    } else {
      // Power off sequence with retro TV shut-down effect
      playSound('click')
      setTvState('off')
      setAmbientGlow(false)
      setShowPlayButton(true)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Clear any running timers
      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current)
        bootTimerRef.current = null
      }
      if (staticTimerRef.current) {
        clearTimeout(staticTimerRef.current)
        staticTimerRef.current = null
      }
    }
  }

  // Volume knob handler  
  const handleVolumeKnob = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
    const degrees = (angle * 180 / Math.PI + 90 + 360) % 360
    
    setKnobRotations(prev => ({ ...prev, volume: degrees }))
    
    const newVolume = degrees / 360
    const volumeDiff = Math.abs(newVolume - volume)
    
    if (volumeDiff > 0.05) { // Only play sound for significant changes
      setVolume(newVolume)
      
      // Consistently apply volume to video element
      if (videoRef.current) {
        videoRef.current.volume = newVolume
        
        // If volume is being adjusted and user interaction occurred, allow unmuting (unless explicitly muted)
        if (newVolume > 0 && isMuted && !isExplicitlyMuted) {
          setIsMuted(false)
          videoRef.current.muted = false
        }
      }
      
      playSound('click')
      
      // Pulse ambient glow on volume change
      setAmbientGlow(false)
      setTimeout(() => setAmbientGlow(true), 50)
      
      // Easter egg: Max volume gives extra glow
      if (newVolume > 0.95) {
        setScreenGlow('rgba(255, 100, 0, 0.6)')
      }
    }
  }

  // Channel knob handler
  const handleChannelKnob = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
    const degrees = (angle * 180 / Math.PI + 90 + 360) % 360
    
    setKnobRotations(prev => ({ ...prev, channel: degrees }))
    
    const newChannel = Math.floor((degrees / 360) * channels.length)
    if (newChannel !== currentChannel) {
      setCurrentChannel(newChannel)
      playSound('scroll') // Channel switching sound
      
      // Brief static effect when changing channels
      if (tvState === 'playing' || tvState === 'paused') {
        setTvState('static')
        setTimeout(() => {
          drawStatic()
          playSound('hover') // Static sound
        }, 0)
        
        setTimeout(() => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          setTvState('playing')
          playSound('select') // Channel locked
        }, 300)
      }
    }
  }


  // Mute button handler - toggles video audio specifically
  const handleMuteButton = () => {
    playSound('click')
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
      setIsExplicitlyMuted(newMutedState) // Track that user explicitly muted/unmuted
      console.log('Video audio toggled:', newMutedState ? 'MUTED' : 'UNMUTED')
      console.log('Explicitly muted:', newMutedState)
    }
  }


  // Controller interaction handlers
  const handleLeftControllerClick = () => {
    playSound('click')
    
    // Turn on TV if it's off
    if (tvState === 'off') {
      playSound('startup')
      setTvState('booting')
      return
    }
    
    // Handle initial play state or paused state
    if (tvState === 'paused' || tvState === 'static' || showPlayButton) {
      if (videoRef.current) {
        // User interaction allows unmuting (unless explicitly muted)
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
              console.log('✅ Controller play successful')
            })
            .catch((error) => {
              console.error('Controller play failed:', error)
              // Fallback to muted play
              if (videoRef.current) {
                videoRef.current.muted = true
                setIsMuted(true)
                videoRef.current.play().then(() => {
                  setTvState('playing')
                  setShowPlayButton(false)
                  console.log('✅ Controller muted play successful')
                }).catch(() => {
                  console.error('❌ Controller play completely failed')
                  setTvState('paused')
                })
              }
            })
        }
      }
    } else if (tvState === 'playing' && videoRef.current && !videoRef.current.paused) {
      // Pause if currently playing
      videoRef.current.pause()
      setTvState('paused')
      setShowPlayButton(true)
    }
  }

  const handleRightControllerClick = () => {
    playSound('click')
    // Skip to main site
    onSkipToMain?.()
  }


  const getChannelFilter = (): string => {
    switch (channels[currentChannel]) {
      case 'sepia': return 'sepia(100%)'
      case 'invert': return 'invert(100%)'
      case 'blur': return 'blur(2px)'
      case 'contrast': return 'contrast(150%)'
      case 'saturate': return 'saturate(200%)'
      default: return 'none'
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* TV Background Frame */}
      <div className="absolute inset-0">
        <Image
          src="/images/home-tvscreen-min.png"
          alt="Cyberpunk TV"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Ambient Glow */}
      {ambientGlow && (
        <div 
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${screenGlow} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* Video Screen Area - positioned within the TV frame */}
      <div className="absolute inset-0 flex items-center justify-center">

        <div 
          className="relative overflow-hidden crt-screen"
          style={{
            width: '39%',
            aspectRatio: '10 / 6',
            left: '-2%',
            top: '-2%',
            backgroundColor: 'transparent',
            borderRadius: '24px',
            clipPath: 'inset(0 round 18px)',
            filter: tvState === 'off' 
              ? 'brightness(0) contrast(0)' 
              : easterEggActive 
                ? 'brightness(1.2) contrast(1.1) saturate(3)'
                : 'brightness(1)',
            transition: 'filter 0.3s ease',
          }}
        >
          {/* CRT Screen Curvature and Distortion */}
          <div className="absolute inset-0 crt-curvature pointer-events-none" />
          
          {/* Chromatic Aberration Layer */}
          <div className="absolute inset-0 crt-chromatic-aberration pointer-events-none" />
          
          {/* Vignette Effect */}
          <div className="absolute inset-0 crt-vignette pointer-events-none" />
          
          {/* Static Canvas */}
          <canvas
            ref={staticCanvasRef}
            className={`absolute inset-0 w-full h-full ${
              tvState === 'static' || tvState === 'booting' ? 'opacity-100' : 'opacity-0'
            }`}
            width={320}
            height={240}
          />

          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            className={`w-full h-full object-cover ${
              tvState === 'playing' || tvState === 'paused' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              filter: easterEggActive 
                ? `${getChannelFilter()} hue-rotate(${Math.sin(Date.now() / 200) * 30}deg)`
                : getChannelFilter(),
              transition: 'filter 0.3s ease',
              mixBlendMode: 'normal',
              borderRadius: '12px',
            }}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={() => {
              console.log('Video ended - auto-transitioning to homescreen')
              playSound('select')
              onSkipToMain?.()
            }}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can start playing')}
            onLoadedData={() => console.log('Video data loaded')}
            onError={(e) => {
              console.error('Video error:', e.currentTarget.error)
              const error = e.currentTarget.error
              if (error) {
                console.error('Video error details:', {
                  code: error.code,
                  message: error.message,
                  currentSrc: videoSrc
                })
              }
              
              // Try WebM fallback if MP4 fails
              if (!tryWebMFallback()) {
                console.error('All video formats failed')
                setTvState('paused')
                setShowPlayButton(true)
              }
            }}
            muted={isMuted}
            loop={false}
            preload="auto"
            playsInline
            controls={false}
          />

          {/* Screen Reflection - Enhanced */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 w-1/3 h-1/4 bg-gradient-to-br from-cyan-200/30 to-transparent transform rotate-12" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/3 bg-gradient-to-tl from-orange-200/20 to-transparent" />
          </div>

          {/* Enhanced CRT Scanlines */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Fast moving scanlines */}
            <div className="crt-scanlines-fast" />
            
            {/* Slow horizontal drift scanlines */}
            <div className="crt-scanlines-slow" />
            
            {/* Static fine scanlines */}
            <div className="crt-scanlines-static" />
            
            {/* Random flicker line */}
            <div className="crt-flicker-line" />
          </div>
          
          {/* Phosphor Glow Effect */}
          <div className="absolute inset-0 crt-phosphor-glow pointer-events-none" />

          {/* Play Button Overlay - Now invisible but shows text */}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Retro text instruction */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-orange-400 text-sm font-mono animate-pulse text-center">
                {tvState === 'off' ? 'POWER ON' : 'USE THE CONTROLLERS TO PRESS PLAY'}
              </div>
            </div>
          )}

          {/* TV Progress Bar - Shows current time when playing */}
          {tvState === 'playing' && videoRef.current && (
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-orange-500/20 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded transition-all duration-300 animate-pulse" 
                   style={{ 
                     width: videoRef.current.currentTime && videoRef.current.duration 
                       ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
                       : '0%' 
                   }} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          )}
          
          {/* Volume Bar - Shows when adjusting volume */}
          {tvState !== 'off' && tvState !== 'playing' && (
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-orange-500/20 rounded">
              <div 
                className="h-full bg-orange-500 rounded transition-all duration-200"
                style={{ width: `${(volume * 100)}%` }}
              />
            </div>
          )}

        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {/* Power Button - positioned on the right panel */}
        <button
          className="absolute pointer-events-auto z-50 cursor-pointer"
          style={{ 
            top: controlPositions.powerButton.top, 
            right: controlPositions.powerButton.right, 
            width: '45px', 
            height: '45px' 
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Power button clicked!');
            handlePowerButton();
          }}
          title="Power Button"
        >
          <div className={`w-full h-full rounded-full transition-all duration-200 ${
            tvState !== 'off' 
              ? 'bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse' 
              : 'bg-gray-600'
          }`}>
            <Power className="h-full w-full p-1 text-white" />
          </div>
        </button>

        {/* Volume Knob - top knob on right panel */}
        {controlPositions.volumeKnob.visible && (
        <div
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing z-50 hover:bg-gray-500/40 rounded-full transition-all duration-300"
          style={{ 
            top: '37%', 
            right: controlPositions.volumeKnob.right, 
            width: '65px', 
            height: '65px',
            transform: `scale(${controlPositions.volumeKnob.scale})`
          }}
          title="Volume Knob"
          onClick={handleVolumeKnob}
          onMouseDown={(e) => {
            e.preventDefault()
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const target = e.currentTarget as HTMLElement
              if (!target) return
              const rect = target.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2
              const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX)
              const degrees = (angle * 180 / Math.PI + 90 + 360) % 360
              
              setKnobRotations(prev => ({ ...prev, volume: degrees }))
              
              const newVolume = degrees / 360
              setVolume(newVolume)
              
              if (videoRef.current) {
                videoRef.current.volume = newVolume
                if (newVolume > 0 && isMuted && !isExplicitlyMuted) {
                  setIsMuted(false)
                  videoRef.current.muted = false
                }
              }
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
              playSound('click')
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            handleMouseMove(e.nativeEvent)
          }}
        >
          <div 
            className="w-full h-full bg-gray-700 rounded-full border-2 border-orange-400 transform hover:scale-110 transition-transform duration-200"
            style={{ transform: `rotate(${knobRotations.volume}deg)` }}
          >
            <div className="absolute top-1 left-1/2 w-1 h-2 bg-orange-400 transform -translate-x-1/2" />
          </div>
        </div>
        )}

        {/* Channel Knob - bottom knob on right panel */}
        {controlPositions.channelKnob.visible && (
        <div
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing z-50 hover:bg-gray-500/40 rounded-full transition-all duration-300"
          style={{ 
            top: '48%', 
            right: controlPositions.channelKnob.right, 
            width: '65px', 
            height: '65px',
            transform: `scale(${controlPositions.channelKnob.scale})`
          }}
          title="Channel Knob"
          onClick={handleChannelKnob}
          onMouseDown={(e) => {
            e.preventDefault()
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const target = e.currentTarget as HTMLElement
              if (!target) return
              const rect = target.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2
              const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX)
              const degrees = (angle * 180 / Math.PI + 90 + 360) % 360
              
              setKnobRotations(prev => ({ ...prev, channel: degrees }))
              
              const newChannel = Math.floor((degrees / 360) * channels.length)
              if (newChannel !== currentChannel) {
                setCurrentChannel(newChannel)
                playSound('scroll')
                
                // Brief static effect when changing channels
                if (tvState === 'playing' || tvState === 'paused') {
                  setTvState('static')
                  setTimeout(() => {
                    drawStatic()
                    playSound('hover')
                  }, 0)
                  
                  setTimeout(() => {
                    if (animationFrameRef.current) {
                      cancelAnimationFrame(animationFrameRef.current)
                    }
                    setTvState('playing')
                  }, 300)
                }
              }
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            handleMouseMove(e.nativeEvent)
          }}
        >
          <div 
            className="w-full h-full bg-gray-700 rounded-full border-2 border-teal-400 transform hover:scale-110 transition-transform duration-200"
            style={{ transform: `rotate(${knobRotations.channel}deg)` }}
          >
            <div className="absolute top-1 left-1/2 w-1 h-2 bg-teal-400 transform -translate-x-1/2" />
          </div>
        </div>
        )}

        {/* Mute Button - circular button below the knobs */}
        <button
          className="absolute pointer-events-auto z-50 cursor-pointer"
          style={{ 
            top: '64%', 
            right: controlPositions.muteButton.right, 
            width: '40px', 
            height: '40px' 
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mute button clicked!');
            handleMuteButton();
          }}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          <div className={`w-full h-full rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            isMuted 
              ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/50' 
              : 'bg-green-600 border-green-400 shadow-lg shadow-green-500/50'
          }`}>
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </div>
        </button>

        {/* Interactive Controllers on TV Image */}
        {/* Left Controller - Play/Pause */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Left controller clicked!');
            handleLeftControllerClick();
          }}
          onMouseEnter={() => setLeftControllerHover(true)}
          onMouseLeave={() => setLeftControllerHover(false)}
          className="absolute pointer-events-auto group z-50 cursor-pointer"
          style={{ 
            bottom: '7%', 
            left: '41.5%', 
            width: '80px', 
            height: '60px'
          }}
          title="Left Controller - Play/Pause"
        >
          {/* Always visible background and icon */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300 flex items-center justify-center ${
            leftControllerHover 
              ? 'bg-teal-500/90 shadow-lg shadow-teal-400/50 scale-110' 
              : 'bg-teal-600/85 shadow-md shadow-teal-500/30'
          }`}>
            {tvState === 'playing' ? 
              <Pause className="h-5 w-5 text-white drop-shadow-lg" /> : 
              <Play className="h-5 w-5 text-white ml-0.5 drop-shadow-lg" />
            }
          </div>
        </button>

        {/* Right Controller - Skip to Main */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Right controller clicked!');
            handleRightControllerClick();
          }}
          onMouseEnter={() => setRightControllerHover(true)}
          onMouseLeave={() => setRightControllerHover(false)}
          className="absolute pointer-events-auto group z-50 cursor-pointer"
          style={{ 
            bottom: '7.5%', 
            right: '31%', 
            width: '80px', 
            height: '60px'
          }}
          title="Right Controller - Skip to Main"
        >
          {/* Always visible background with skip text */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300 flex items-center justify-center ${
            rightControllerHover 
              ? 'bg-orange-500/90 shadow-lg shadow-orange-400/50 scale-110' 
              : 'bg-orange-600/85 shadow-md shadow-orange-500/30'
          }`}>
            <div className="text-white text-sm font-mono font-black drop-shadow-lg">SKIP</div>
          </div>
        </button>
      </div>



      {/* Channel Display */}
      {tvState !== 'off' && (
        <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded text-orange-400 text-sm border border-orange-500 font-mono">
          CH {currentChannel + 1} - {channelNames[currentChannel]}
          {easterEggActive && <span className="ml-2 animate-pulse">⭐</span>}
        </div>
      )}

      {/* Konami Code Detection - Now handles both Konami code and provides focus for keyboard events */}
      <div 
        className="absolute inset-0 focus:outline-none" 
        tabIndex={0}
        onKeyDown={(e) => {
          const newSequence = [...konamiSequence, e.code].slice(-10)
          setKonamiSequence(newSequence)
          
          if (newSequence.join(',') === konamiCode.join(',')) {
            setEasterEggActive(true)
            playSound('select')
            setScreenGlow('rgba(255, 215, 0, 0.8)')
            setAmbientGlow(true)
            
            // Reset after 5 seconds
            setTimeout(() => {
              setEasterEggActive(false)
              setScreenGlow('rgba(0, 255, 255, 0.3)')
            }, 5000)
          }
        }}
      />
      
      {/* Easter Egg Indicator */}
      {easterEggActive && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded font-bold animate-bounce">
          🎮 KONAMI POWER! 🎮
        </div>
      )}
    </div>
  )
}