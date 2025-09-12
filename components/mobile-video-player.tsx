"use client"

import { useRef, useEffect, useState } from "react"
import { useSound } from "@/components/sound-provider"

interface MobileVideoPlayerProps {
  videoSrc: string
  className?: string
  onVideoStart?: () => void
  onVideoEnd?: () => void
  autoplay?: boolean
}

export function MobileVideoPlayer({ 
  videoSrc, 
  className = "", 
  onVideoStart,
  onVideoEnd,
  autoplay = false
}: MobileVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)

  const handleVideoClick = () => {
    playSound("click")
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
        if (onVideoStart) {
          onVideoStart()
        }
      }
    }
  }

  // Autoplay functionality - triggered when autoplay prop becomes true
  useEffect(() => {
    if (!autoplay || hasAutoPlayed) return

    // Start playing when autoplay prop becomes true
    if (videoRef.current && !hasAutoPlayed) {
      videoRef.current.play().then(() => {
        setHasAutoPlayed(true)
      }).catch((error) => {
        console.log("Autoplay failed:", error)
        // Autoplay might be blocked, that's okay
      })
    }
  }, [autoplay, hasAutoPlayed])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (onVideoStart) {
        onVideoStart()
      }
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onVideoEnd) {
        onVideoEnd()
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onVideoStart, onVideoEnd])

  return (
    <div ref={containerRef} className={`mobile-phone-container ${className}`}>
      {/* Phone Frame */}
      <div className="phone-frame">
        {/* Phone Screen */}
        <div className="phone-screen">
          <video
            ref={videoRef}
            src={videoSrc}
            className="video-player"
            controls={false}
            playsInline
            muted={false}
            onClick={handleVideoClick}
          />
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="video-overlay" onClick={handleVideoClick}>
              <div className="play-button">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Phone Details */}
        <div className="phone-speaker"></div>
        <div className="phone-home-button"></div>
      </div>
    </div>
  )
}