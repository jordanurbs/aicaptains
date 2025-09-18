"use client"

import { useEffect, useState } from "react"

export function RetrowaveSvgBackground() {
  const [scrollY, setScrollY] = useState(0)
  const uniqueId = useState(() => Math.random().toString(36).substr(2, 9))[0]

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="absolute inset-0 z-[1]">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Animated Gradient */}
          <linearGradient id={`retroGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a0033">
              <animate
                attributeName="stop-color"
                values="#1a0033;#330066;#000022;#1a0033"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#330066">
              <animate
                attributeName="stop-color"
                values="#330066;#000022;#1a0033;#330066"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#000022">
              <animate
                attributeName="stop-color"
                values="#000022;#1a0033;#330066;#000022"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id={`neonGlow-${uniqueId}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid Pattern */}
          <pattern id={`retroGrid-${uniqueId}`} width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(0, 255, 255, 0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background Gradient */}
        <rect width="100%" height="100%" fill={`url(#retroGradient-${uniqueId})`} opacity="0.8" />

        {/* Grid Overlay */}
        <rect width="100%" height="100%" fill={`url(#retroGrid-${uniqueId})`} opacity="0.5" />

        {/* Perspective Grid - Bottom Half */}
        <g
          transform={`translate(600, 800) scale(2, 1)`}
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Horizontal Lines */}
          <g stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" fill="none">
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="-600"
                y1={-i * 20}
                x2="600"
                y2={-i * 20}
                opacity={1 - i * 0.04}
              />
            ))}
          </g>

          {/* Vertical/Perspective Lines */}
          <g stroke="rgba(255, 0, 255, 0.2)" strokeWidth="1" fill="none">
            {Array.from({ length: 25 }, (_, i) => {
              const x = (i - 12) * 50
              return (
                <line
                  key={`v-${i}`}
                  x1={x}
                  y1="0"
                  x2={x * 0.6}
                  y2="-400"
                  opacity={0.6 - Math.abs(i - 12) * 0.02}
                />
              )
            })}
          </g>
        </g>

        {/* Floating Geometric Shapes */}
        <g opacity="0.3">
          {/* Triangle */}
          <polygon
            points="100,150 120,100 140,150"
            fill="rgba(255, 0, 255, 0.5)"
            filter={`url(#neonGlow-${uniqueId})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 120 125;360 120 125"
              dur="20s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="4s"
              repeatCount="indefinite"
            />
          </polygon>

          {/* Diamond */}
          <polygon
            points="1000,100 1020,80 1040,100 1020,120"
            fill="rgba(255, 204, 0, 0.5)"
            filter={`url(#neonGlow-${uniqueId})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 1020 100;-360 1020 100"
              dur="25s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="5s"
              repeatCount="indefinite"
            />
          </polygon>

          {/* Circle */}
          <circle cx="200" cy="600" r="15" fill="rgba(0, 255, 255, 0.4)" filter={`url(#neonGlow-${uniqueId})`}>
            <animate attributeName="cy" values="600;550;600" dur="6s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0.4;0.7;0.4"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Square */}
          <rect
            x="900"
            y="500"
            width="30"
            height="30"
            fill="rgba(255, 0, 64, 0.4)"
            filter={`url(#neonGlow-${uniqueId})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 915 515;360 915 515"
              dur="15s"
              repeatCount="indefinite"
            />
            <animate attributeName="y" values="500;480;500" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Subtle Sun/Moon Orb */}
        <circle cx="600" cy="200" r="60" fill={`url(#retroGradient-${uniqueId})`} opacity="0.2">
          <animate attributeName="r" values="60;65;60" dur="8s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.2;0.3;0.2"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  )
}