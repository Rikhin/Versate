"use client";

import { useEffect, useRef, useState } from 'react';

interface GlobeProps {
  className?: string;
}

export function Globe({ className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 120;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 45;

    // Animation variables
    let rotation = 0;
    let connectionLines: Array<{
      start: { lat: number; lng: number };
      end: { lat: number; lng: number };
      progress: number;
      speed: number;
    }> = [];

    // Generate random connection lines
    const generateConnection = () => {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLng = Math.random() * 2 * Math.PI;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLng = Math.random() * 2 * Math.PI;
      
      connectionLines.push({
        start: { lat: startLat, lng: startLng },
        end: { lat: endLat, lng: endLng },
        progress: 0,
        speed: 0.02 + Math.random() * 0.03
      });
    };

    // Initialize some connections
    for (let i = 0; i < 3; i++) {
      generateConnection();
    }

    // Convert lat/lng to 3D coordinates
    const latLngTo3D = (lat: number, lng: number) => {
      const x = Math.cos(lat) * Math.cos(lng + rotation);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.sin(lng + rotation);
      return { x, y, z };
    };

    // Project 3D point to 2D
    const project3DTo2D = (x: number, y: number, z: number) => {
      const scale = 200 / (200 + z);
      return {
        x: centerX + x * scale * radius,
        y: centerY + y * scale * radius
      };
    };

    // Draw the globe
    const drawGlobe = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create gradient background for globe
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)'); // Blue center
      gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.05)'); // Green middle
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)'); // Purple edge

      // Draw globe base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw globe outline
      ctx.strokeStyle = isHovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Draw latitude lines
      for (let i = -2; i <= 2; i++) {
        const lat = (i * Math.PI) / 4;
        const points = [];
        
        for (let j = 0; j <= 50; j++) {
          const lng = (j * 2 * Math.PI) / 50;
          const { x, y, z } = latLngTo3D(lat, lng);
          const projected = project3DTo2D(x, y, z);
          points.push(projected);
        }

        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let k = 1; k < points.length; k++) {
            ctx.lineTo(points[k].x, points[k].y);
          }
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw longitude lines
      for (let i = 0; i < 8; i++) {
        const lng = (i * 2 * Math.PI) / 8;
        const points = [];
        
        for (let j = 0; j <= 25; j++) {
          const lat = ((j - 12.5) * Math.PI) / 12.5;
          const { x, y, z } = latLngTo3D(lat, lng);
          const projected = project3DTo2D(x, y, z);
          points.push(projected);
        }

        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let k = 1; k < points.length; k++) {
            ctx.lineTo(points[k].x, points[k].y);
          }
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw connection lines
      connectionLines.forEach((line, index) => {
        const start3D = latLngTo3D(line.start.lat, line.start.lng);
        const end3D = latLngTo3D(line.end.lat, line.end.lng);
        
        const start2D = project3DTo2D(start3D.x, start3D.y, start3D.z);
        const end2D = project3DTo2D(end3D.x, end3D.y, end3D.z);

        // Calculate intermediate point based on progress
        const progress = line.progress;
        const midX = start2D.x + (end2D.x - start2D.x) * progress;
        const midY = start2D.y + (end2D.y - start2D.y) * progress;

        // Draw the connection line
        ctx.beginPath();
        ctx.moveTo(start2D.x, start2D.y);
        ctx.lineTo(midX, midY);
        
        // Create gradient for the line
        const lineGradient = ctx.createLinearGradient(start2D.x, start2D.y, midX, midY);
        lineGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Blue
        lineGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.6)'); // Green
        lineGradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)'); // Purple
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Update progress
        line.progress += line.speed * (isHovered ? 1.5 : 1);
        
        // Remove completed lines and generate new ones
        if (line.progress >= 1) {
          connectionLines.splice(index, 1);
          if (Math.random() < 0.3) {
            generateConnection();
          }
        }
      });

      // Draw some connection points
      for (let i = 0; i < 8; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * 2 * Math.PI;
        const { x, y, z } = latLngTo3D(lat, lng);
        const projected = project3DTo2D(x, y, z);
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, isHovered ? 3 : 2, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)';
        ctx.fill();
      }

      // Update rotation
      rotation += (isHovered ? 0.02 : 0.01);
    };

    // Animation loop
    const animate = () => {
      drawGlobe();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="transition-all duration-300 ease-in-out"
        style={{
          filter: isHovered ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' : 'none'
        }}
      />
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full opacity-0 animate-in fade-in duration-200">
            Global Connections
          </div>
        </div>
      )}
    </div>
  );
} 