"use client"

import { useEffect, useRef } from "react"

interface DigitalMarqueeProps {
  text: string
  speed?: number
}

export function DigitalMarquee({ text, speed = 15 }: DigitalMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure the animation restarts when text changes
    if (marqueeRef.current) {
      const element = marqueeRef.current
      element.style.animation = "none"
      // Force reflow
      void element.offsetWidth
      element.style.animation = `marquee-scroll ${speed}s linear infinite`
    }
  }, [text, speed])

  // Add flickering effect to random characters
  const renderTextWithFlicker = (text: string) => {
    return text.split("").map((char, index) => {
      // Randomly apply flickering to some characters (about 30% of them)
      const shouldFlicker = Math.random() > 0.7
      return shouldFlicker ? (
        <span key={index} className="flicker">
          {char}
        </span>
      ) : (
        <span key={index}>{char}</span>
      )
    })
  }

  return (
    <div className="marquee-container">
      <div className="digital-marquee" ref={marqueeRef}>
        <span data-text={text}>{renderTextWithFlicker(text)}</span>
        <span data-text={text}>{renderTextWithFlicker(text)}</span>
      </div>
    </div>
  )
}
