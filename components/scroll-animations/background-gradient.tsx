"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface BackgroundGradientProps {
  className?: string
  startColor?: string
  endColor?: string
  triggerStart?: string
  triggerEnd?: string
}

export function BackgroundGradient({
  className = "",
  startColor = "from-blue-50",
  endColor = "to-purple-50",
  triggerStart = "top center",
  triggerEnd = "bottom center",
}: BackgroundGradientProps) {
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gradient = gradientRef.current
    if (!gradient) return

    // Create the scroll-triggered animation
    gsap.fromTo(
      gradient,
      {
        opacity: 0,
        scale: 0.8,
        rotation: -5,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gradient,
          start: triggerStart,
          end: triggerEnd,
          scrub: 1,
        },
      }
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [triggerStart, triggerEnd])

  return (
    <div
      ref={gradientRef}
      className={`absolute inset-0 bg-gradient-to-br ${startColor} ${endColor} opacity-0 ${className}`}
      style={{ zIndex: -1 }}
    />
  )
} 