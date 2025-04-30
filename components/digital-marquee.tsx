"use client"

import { useEffect, useRef } from "react"

interface DigitalMarqueeProps {
  text: string
  speed?: number
}

export function DigitalMarquee({ text, speed = 25 }: DigitalMarqueeProps) {
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

  // Make sure we have enough copies for smooth looping
  // The key is to have identical copies for seamless transitions
  const repeatedText = `${text} • `;

  return (
    <div className="marquee-container">
      <div className="digital-marquee" ref={marqueeRef}>
        <span data-text={repeatedText}>{repeatedText}</span>
        <span data-text={repeatedText}>{repeatedText}</span>
        <span data-text={repeatedText}>{repeatedText}</span>
      </div>
    </div>
  )
}
