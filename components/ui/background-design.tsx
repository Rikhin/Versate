"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BackgroundDesignProps {
  className?: string;
}

export function BackgroundDesign({ className = "" }: BackgroundDesignProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const shapes = container.querySelectorAll(".bg-shape");

    // Subtle scroll-based animations
    shapes.forEach((shape, index) => {
      const delay = index * 0.2;
      const duration = 2 + index * 0.3;
      
      gsap.fromTo(
        shape,
        {
          y: index % 2 === 0 ? -10 : 10,
          opacity: 0.2,
          scale: 0.95,
        },
        {
          y: index % 2 === 0 ? 10 : -10,
          opacity: 0.6,
          scale: 1.05,
          duration,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          delay,
        }
      );
    });

    // Gentle floating animations for specific shapes
    const floatingShapes = container.querySelectorAll(".floating");
    floatingShapes.forEach((shape, index) => {
      gsap.to(shape, {
        y: index % 2 === 0 ? -8 : 8,
        x: index % 3 === 0 ? -5 : 5,
        rotation: index % 2 === 0 ? 2 : -2,
        duration: 6 + index,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // Parallax effect for larger shapes
    const parallaxShapes = container.querySelectorAll(".parallax");
    parallaxShapes.forEach((shape, index) => {
      gsap.to(shape, {
        y: index % 2 === 0 ? -30 : 30,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Top-left thin line */}
      <div className="bg-shape absolute top-0 left-0 w-1/2 h-24 opacity-10">
        <svg viewBox="0 0 400 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="12" x2="400" y2="12" stroke="#bbb" strokeWidth="2" />
        </svg>
      </div>
      {/* Top-right circle */}
      <div className="bg-shape absolute top-0 right-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#eee" />
        </svg>
      </div>
      {/* Bottom-left blob */}
      <div className="bg-shape absolute bottom-0 left-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.2,-48.8C46.8,-42.1,58.4,-33.2,64.8,-21.8C71.2,-10.4,72.4,3.5,71.2,16.8C70,30.1,66.4,42.8,58.8,52.2C51.2,61.6,39.6,67.7,27.2,71.8C14.8,75.9,1.6,78,-10.8,76.8C-23.2,75.6,-35.6,71.1,-45.2,63.2C-54.8,55.3,-61.6,44,-66.4,31.8C-71.2,19.6,-74,6.5,-72.8,-6.2C-71.6,-18.9,-66.4,-31.2,-59.2,-41.2C-52,-51.2,-42.8,-58.8,-32.4,-64.4C-22,-70,-11,-73.6,0.2,-73.9C11.4,-74.2,22.8,-71.2,35.2,-48.8Z" fill="#f5f5f5" />
        </svg>
      </div>
      {/* Center vertical line */}
      <div className="bg-shape absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full opacity-5">
        <svg viewBox="0 0 1 1000" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0" x2="0.5" y2="1000" stroke="#eee" strokeWidth="1" />
        </svg>
      </div>
      {/* Bottom-right overlapping circles */}
      <div className="bg-shape absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="140" r="60" fill="#fafafa" />
          <circle cx="140" cy="140" r="40" fill="#eaeaea" />
        </svg>
      </div>

      {/* Center-right gradient orb */}
      <div className="bg-shape parallax absolute top-1/3 -right-32 w-96 h-96 opacity-10">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="orb1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="60%" stopColor="#ddd" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="url(#orb1)"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Bottom-left flowing wave */}
      <div className="bg-shape floating absolute -bottom-16 -left-16 w-72 h-24 opacity-10">
        <svg
          viewBox="0 0 300 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#bbb" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 Q50,40 100,60 T200,60 T300,60"
            stroke="url(#wave1)"
            strokeWidth="1.5"
            fill="none"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Top-center scattered dots */}
      <div className="bg-shape absolute top-32 left-1/2 transform -translate-x-1/2 w-80 h-40 opacity-10">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="dot1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="25" r="2" fill="url(#dot1)" />
          <circle cx="70" cy="45" r="1.5" fill="url(#dot1)" />
          <circle cx="110" cy="35" r="3" fill="url(#dot1)" />
          <circle cx="150" cy="55" r="2" fill="url(#dot1)" />
          <circle cx="170" cy="30" r="1" fill="url(#dot1)" />
        </svg>
      </div>

      {/* Bottom-right geometric hexagon */}
      <div className="bg-shape floating absolute -bottom-8 -right-8 w-56 h-56 opacity-10">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hex1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#bbb" />
            </linearGradient>
          </defs>
          <polygon
            points="60,10 110,35 110,85 60,110 10,85 10,35"
            fill="url(#hex1)"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Center-left soft pill */}
      <div className="bg-shape parallax absolute top-1/2 -left-8 w-24 h-64 opacity-10">
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pill1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#bbb" />
            </linearGradient>
          </defs>
          <rect
            x="10"
            y="10"
            width="80"
            height="180"
            rx="40"
            fill="url(#pill1)"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Top-right corner accent */}
      <div className="bg-shape floating absolute top-0 right-0 w-40 h-40 opacity-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="corner1" cx="80%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle
            cx="80"
            cy="20"
            r="35"
            fill="url(#corner1)"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Center-bottom subtle line */}
      <div className="bg-shape absolute bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-16 opacity-10">
        <svg
          viewBox="0 0 200 50"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#bbb" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="25"
            x2="200"
            y2="25"
            stroke="url(#line1)"
            strokeWidth="1"
            className="transition-colors duration-1000"
          />
        </svg>
      </div>
    </div>
  );
} 