"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TextFadeProps {
  children: React.ReactNode
  className?: string
  triggerStart?: string
  triggerEnd?: string
  stagger?: number
}

export function TextFade({
  children,
  className = "",
  triggerStart = "top 80%",
  triggerEnd = "bottom 20%",
  stagger = 0.1,
}: TextFadeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const textElements = container.querySelectorAll(".text-fade-element")

    // Animate text elements with stagger
    gsap.fromTo(
      textElements,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: triggerStart,
          end: triggerEnd,
          scrub: false,
        },
      }
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [triggerStart, triggerEnd, stagger])

  return (
    <div ref={containerRef} className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div key={index} className="text-fade-element">
            {child}
          </div>
        ))
      ) : (
        <div className="text-fade-element">{children}</div>
      )}
    </div>
  )
} 