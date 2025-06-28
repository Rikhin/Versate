"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface FloatingShapesProps {
  className?: string
  count?: number
  triggerStart?: string
  triggerEnd?: string
}

export function FloatingShapes({
  className = "",
  count = 3,
  triggerStart = "top center",
  triggerEnd = "bottom center",
}: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const shapes = container.querySelectorAll(".floating-shape")

    // Animate each shape with different delays and movements
    shapes.forEach((shape, index) => {
      gsap.fromTo(
        shape,
        {
          opacity: 0,
          y: 50,
          rotation: -15,
          scale: 0.5,
        },
        {
          opacity: 0.1,
          y: -20,
          rotation: 15,
          scale: 1,
          duration: 2,
          delay: index * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            end: triggerEnd,
            scrub: 1,
          },
        }
      )
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [triggerStart, triggerEnd])

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: -1 }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="floating-shape absolute opacity-0"
          style={{
            left: `${20 + index * 25}%`,
            top: `${30 + index * 20}%`,
            width: `${40 + index * 10}px`,
            height: `${40 + index * 10}px`,
          }}
        >
          {index % 2 === 0 ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-sm" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-lg blur-sm transform rotate-45" />
          )}
        </div>
      ))}
    </div>
  )
} 