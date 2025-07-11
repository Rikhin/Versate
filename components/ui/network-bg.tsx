"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface NetworkBGProps {
  className?: string;
  opacity?: number;
  dotCount?: number;
  edgeCount?: number;
}

// Node color palette (blue, purple, pink shades)
const NODE_COLORS = ["#7b61ff", "#5ad1ff", "#a78bfa", "#818cf8", "#6366f1", "#a5b4fc"];

// 3D node structure
interface Dot3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
}

type Edge = [number, number];

/**
 * Generate a random number between a and b
 */
function randomBetween(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

/**
 * Project 3D coordinates to 2D with perspective
 */
function project3D(
  dot: { x: number; y: number; z: number },
  w: number,
  h: number,
  fov: number = 1800
): { x: number; y: number; scale: number } {
  const scale = fov / (fov + dot.z);
  return {
    x: w / 2 + dot.x * scale,
    y: h / 2 + dot.y * scale,
    scale,
  };
}

/**
 * Rotate a 3D point around X and Z axes
 */
function rotate3D(
  dot: { x: number; y: number; z: number },
  rotX: number,
  rotZ: number
): { x: number; y: number; z: number } {
  // Rotate around X axis
  let y = dot.y * Math.cos(rotX) - dot.z * Math.sin(rotX);
  const z = dot.y * Math.sin(rotX) + dot.z * Math.cos(rotX);
  // Rotate around Z axis
  const x = dot.x * Math.cos(rotZ) - y * Math.sin(rotZ);
  y = dot.x * Math.sin(rotZ) + y * Math.cos(rotZ);
  return { x, y, z };
}

export const NetworkBG = ({
  className = "",
  opacity = 0.7,
  dotCount = 80,
  edgeCount = 4,
}: NetworkBGProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot3D[]>([]);
  const edges = useRef<Edge[]>([]);
  const animationRef = useRef<number>(0);
  const rotX = useRef(0);
  const rotZ = useRef(0);
  const lastTimestamp = useRef(0);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Generate initial dots
  const generateDots = useCallback((w: number, h: number): Dot3D[] => {
    return Array.from({ length: dotCount }, (_, i) => ({
      x: randomBetween(-w * 0.4, w * 0.4),
      y: randomBetween(-h * 0.4, h * 0.4),
      z: randomBetween(-w * 0.4, w * 0.4),
      vx: randomBetween(-0.1, 0.1),
      vy: randomBetween(-0.1, 0.1),
      vz: randomBetween(-0.1, 0.1),
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      size: i % 13 === 0 ? 18 : [6, 10][Math.floor(Math.random() * 2)],
    }));
  }, [dotCount]);

  // Generate edges between dots
  const generateEdges = useCallback((dots: Dot3D[]): Edge[] => {
    const edgeSet = new Set<string>();
    
    for (let i = 0; i < dots.length; i++) {
      // Calculate distances to all other dots
      const distances = dots.map((d, j) => ({
        j,
        dist: Math.hypot(
          d.x - dots[i].x,
          d.y - dots[i].y,
          d.z - dots[i].z
        ),
      }));
      
      // Sort by distance and connect to nearest neighbors
      distances.sort((a, b) => a.dist - b.dist);
      
      // Connect to nearest edgeCount neighbors
      for (let k = 1; k <= Math.min(edgeCount, distances.length - 1); k++) {
        const j = distances[k].j;
        const key = i < j ? `${i},${j}` : `${j},${i}`;
        edgeSet.add(key);
      }
    }
    
    return Array.from(edgeSet).map(key => 
      key.split(',').map(Number) as [number, number]
    );
  }, [edgeCount]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    // Update dot positions
    for (let i = 0; i < dots.current.length; i++) {
      const d = dots.current[i];
      d.x += d.vx;
      d.y += d.vy;
      d.z += d.vz;
      
      // Bounce off boundaries
      const boundary = Math.max(w, h) * 0.4;
      if (Math.abs(d.x) > boundary) d.vx *= -1;
      if (Math.abs(d.y) > boundary) d.vy *= -1;
      if (Math.abs(d.z) > boundary) d.vz *= -1;
    }

    // Update rotation
    if (lastTimestamp.current) {
      const delta = timestamp - lastTimestamp.current;
      rotX.current += 0.00005 * delta;
      rotZ.current += 0.00004 * delta;
    }
    lastTimestamp.current = timestamp;

    // Draw edges
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 0.7;
    
    for (const [i, j] of edges.current) {
      const a = rotate3D(dots.current[i], rotX.current, rotZ.current);
      const b = rotate3D(dots.current[j], rotX.current, rotZ.current);
      const pa = project3D(a, w, h);
      const pb = project3D(b, w, h);
      
      // Only draw edges that are facing the camera (z > 0)
      if (a.z > -900 && b.z > -900) {
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Draw dots
    for (let i = 0; i < dots.current.length; i++) {
      const d = rotate3D(dots.current[i], rotX.current, rotZ.current);
      const p = project3D(d, w, h);
      
      // Only draw dots that are in front of the camera
      if (d.z > -900) {
        ctx.save();
        ctx.fillStyle = dots.current[i].color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dots.current[i].size * p.scale * 0.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  }, [dpr]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas styles
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = opacity.toString();
    
    // Handle window resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Update canvas size
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      
      // Regenerate dots and edges for new dimensions
      dots.current = generateDots(w, h);
      edges.current = generateEdges(dots.current);
    };
    
    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dpr, opacity, animate, generateDots, generateEdges]);

  return (
    <div className={cn("fixed inset-0 w-full h-full overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
};
