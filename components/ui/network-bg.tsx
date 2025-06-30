import React, { useRef, useEffect } from "react";

interface NetworkBGProps {
  className?: string;
}

// Responsive dot count and line distance for mobile
const getDotCount = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 40 : 120; // Fewer dots on mobile
  }
  return 120;
};

const getLineDistance = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 80 : 120; // Shorter lines on mobile
  }
  return 120;
};

const GLOW_DOT_COUNT = 10;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export const NetworkBG: React.FC<NetworkBGProps> = (props) => {
  const className = props.className || "";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dots = useRef<{ x: number; y: number }[]>([]);
  const glowIndices = useRef<number[]>([]);

  // Initialize dots and glow indices
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dotCount = getDotCount();
    dots.current = Array.from({ length: dotCount }, () => ({
      x: randomBetween(0, w),
      y: randomBetween(0, h),
    }));
    glowIndices.current = Array.from({ length: GLOW_DOT_COUNT }, () => Math.floor(Math.random() * dotCount));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Responsive resize
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // Re-randomize dot positions with responsive counts
      const dotCount = getDotCount();
      dots.current = Array.from({ length: dotCount }, () => ({
        x: randomBetween(0, w),
        y: randomBetween(0, h),
      }));
      glowIndices.current = Array.from({ length: GLOW_DOT_COUNT }, () => Math.floor(Math.random() * dotCount));
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const isMobile = w < 768;
    
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      
      const lineDistance = getLineDistance();
      
      // Draw lines (subtle)
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const a = dots.current[i];
          const b = dots.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < lineDistance) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "#d1d5db"; // Tailwind gray-300
            ctx.lineWidth = isMobile ? 0.8 : 1.2; // Thinner lines on mobile
            ctx.globalAlpha = isMobile ? 0.15 : 0.28; // Less visible on mobile
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Draw dots
      for (let i = 0; i < dots.current.length; i++) {
        const { x, y } = dots.current[i];
        // Glowing dots
        if (glowIndices.current.includes(i)) {
          // Slower animation on mobile
          const animationSpeed = isMobile ? 30 : 18;
          const glow = 0.7 + 0.3 * Math.sin(t / animationSpeed + i);
          const dotRadius = isMobile ? (3 + 6 * glow) : (5 + 10 * glow); // Smaller on mobile
          const grad = ctx.createRadialGradient(x, y, 0, x, y, dotRadius * 2.2);
          grad.addColorStop(0, `rgba(168,85,247,${0.85 * glow})`); // purple-500
          grad.addColorStop(0.4, `rgba(34,197,94,${0.7 * glow})`); // green-500
          grad.addColorStop(1, "rgba(168,85,247,0)");
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.shadowColor = "rgba(168,85,247,0.7)";
          ctx.shadowBlur = isMobile ? (16 * glow) : (32 * glow); // Less blur on mobile
          ctx.globalAlpha = isMobile ? 0.6 : 0.85; // Less opacity on mobile
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        } else {
          // Subtle gray dot
          ctx.beginPath();
          ctx.arc(x, y, isMobile ? 2 : 3, 0, 2 * Math.PI); // Smaller dots on mobile
          ctx.fillStyle = "#6b7280"; // Tailwind gray-500
          ctx.globalAlpha = isMobile ? 0.12 : 0.18; // Less visible on mobile
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      t++;
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none ${className}`}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}; 