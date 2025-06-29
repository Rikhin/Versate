"use client"

import { useEffect, useRef } from "react"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import Lenis to avoid SSR issues
    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default
        
        // Initialize Lenis smooth scrolling
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })

        // RAF for smooth scrolling
        function raf(time: number) {
          lenisRef.current?.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      } catch (error) {
        console.warn("Failed to initialize Lenis smooth scrolling:", error)
      }
    }

    initLenis()

    // Cleanup
    return () => {
      if (lenisRef.current?.destroy) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  return <>{children}</>
} 