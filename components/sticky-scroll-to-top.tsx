"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

export function StickyScrollToTop() {
  const { playSound } = useSound()
  const [isVisible, setIsVisible] = useState(false)
  const throttleRef = useRef<boolean>(false)

  const handleHover = () => {
    playSound("hover")
  }

  const handleScrollToTop = () => {
    playSound("click")
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // Throttled scroll handler for performance
  const handleScroll = useCallback(() => {
    if (!throttleRef.current) {
      throttleRef.current = true
      requestAnimationFrame(() => {
        setIsVisible(window.pageYOffset > 300)
        throttleRef.current = false
      })
    }
  }, [])

  // Intersection Observer for modern scroll detection
  useEffect(() => {
    // Create intersection sentinel element
    const sentinel = document.createElement('div')
    sentinel.className = 'sticky-intersection-sentinel'
    sentinel.style.position = 'absolute'
    sentinel.style.top = '300px'
    sentinel.style.height = '1px'
    sentinel.style.width = '1px'
    document.body.appendChild(sentinel)

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { rootMargin: '0px 0px 0px 0px' }
    )

    observer.observe(sentinel)

    // Fallback to throttled scroll for older browsers
    const supportsIntersectionObserver = 'IntersectionObserver' in window
    if (!supportsIntersectionObserver) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      observer.disconnect()
      document.body.removeChild(sentinel)
      if (!supportsIntersectionObserver) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div
      className={`fixed bottom-6 right-6 sticky-nav-optimized transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ zIndex: 50 }}
    >
      <Button
        variant="outline"
        size="icon"
        className="scroll-up-button border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent sticky-nav-accessible"
        onClick={handleScrollToTop}
        onMouseEnter={handleHover}
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </div>
  )
}