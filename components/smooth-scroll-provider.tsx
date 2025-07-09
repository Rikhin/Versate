"use client";

import { useEffect, useRef } from "react";

// Define the Lenis type interface based on the library's API
interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
  // Add other Lenis methods as needed
}

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  // Add other Lenis options as needed
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  options?: LenisOptions;
  debug?: boolean;
}

export function SmoothScrollProvider({ 
  children, 
  options = {}, 
  debug = false 
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Default easing function
  const defaultEasing = (t: number): number => 
    Math.min(1, 1.001 - Math.pow(2, -10 * t));

  useEffect(() => {
    let isMounted = true;
    
    const initLenis = async () => {
      if (!isMounted) return;
      
      try {
        // Dynamically import Lenis to avoid SSR issues
        const Lenis = (await import("lenis")).default;
        
        if (!Lenis) {
          throw new Error("Failed to load Lenis module");
        }
        
        // Initialize Lenis with provided options or defaults
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: defaultEasing,
          ...options,
        }) as unknown as LenisInstance;
        
        if (debug) {
          console.log("Lenis initialized successfully");
        }

        // Animation frame function
        const raf = (time: number) => {
          if (!isMounted) return;
          
          try {
            lenisRef.current?.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
          } catch (error) {
            console.error("Error in Lenis RAF:", error);
            // Attempt to recover by cleaning up and reinitializing
            if (lenisRef.current?.destroy) {
              lenisRef.current.destroy();
            }
            lenisRef.current = null;
            initLenis().catch(console.error);
          }
        };

        // Start the animation loop
        rafIdRef.current = requestAnimationFrame(raf);
        
      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
        // Fallback to native scroll if Lenis fails
        if (debug) {
          console.warn("Falling back to native scroll behavior");
        }
      }
    };

    // Only initialize on client-side
    if (typeof window !== "undefined") {
      initLenis();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      // Clean up Lenis instance
      if (lenisRef.current?.destroy) {
        try {
          lenisRef.current.destroy();
          if (debug) {
            console.log("Lenis instance destroyed");
          }
        } catch (error) {
          console.error("Error destroying Lenis:", error);
        } finally {
          lenisRef.current = null;
        }
      }
    };
  }, [options, debug]);

  // Just render children - Lenis works with the DOM directly
  return <>{children}</>;
}

// Utility function to get the Lenis instance if needed elsewhere
export function useLenis() {
  // In a real implementation, you would use React context to access the Lenis instance
  // For simplicity, we're just returning null here
  return null;
}
