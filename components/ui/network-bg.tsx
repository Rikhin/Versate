import React, { useRef, useEffect } from "react";

interface NetworkBGProps {
  className?: string;
}

const DOT_COUNT = 120;
const LINE_DISTANCE = 120;
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
    dots.current = Array.from({ length: DOT_COUNT }, () => ({
      x: randomBetween(0, w),
      y: randomBetween(0, h),
    }));
    glowIndices.current = Array.from({ length: GLOW_DOT_COUNT }, () => Math.floor(Math.random() * DOT_COUNT));
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
      // Re-randomize dot positions
      dots.current = Array.from({ length: DOT_COUNT }, () => ({
        x: randomBetween(0, w),
        y: randomBetween(0, h),
      }));
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      // Draw lines (subtle)
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const a = dots.current[i];
          const b = dots.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINE_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "#d1d5db"; // Tailwind gray-300
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.28; // slightly more visible
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
          // Animate the glow
          const glow = 0.7 + 0.3 * Math.sin(t / 18 + i);
          const dotRadius = 5 + 10 * glow; // much larger when glowing
          const grad = ctx.createRadialGradient(x, y, 0, x, y, dotRadius * 2.2);
          grad.addColorStop(0, `rgba(168,85,247,${0.85 * glow})`); // purple-500
          grad.addColorStop(0.4, `rgba(34,197,94,${0.7 * glow})`); // green-500
          grad.addColorStop(1, "rgba(168,85,247,0)");
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.shadowColor = "rgba(168,85,247,0.7)";
          ctx.shadowBlur = 32 * glow;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        } else {
          // Subtle gray dot
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = "#6b7280"; // Tailwind gray-500
          ctx.globalAlpha = 0.18; // much subtler
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