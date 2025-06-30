"use client";

import { useEffect, useRef } from 'react';

interface GlobeProps {
  className?: string;
}

export function Globe({ className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - larger
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 75;

    // Animation variables
    let rotation = 0;
    let connectionLines: Array<{
      start: { lat: number; lng: number };
      end: { lat: number; lng: number };
      progress: number;
      speed: number;
      opacity: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
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
        speed: 0.005 + Math.random() * 0.01, // Much slower
        opacity: 1,
        trail: []
      });
    };

    // Initialize some connections
    for (let i = 0; i < 5; i++) {
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
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)'); // Blue center
      gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.08)'); // Green middle
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.15)'); // Purple edge

      // Draw globe base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw globe outline
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
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
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1;
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
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw connection lines with trails
      connectionLines.forEach((line, index) => {
        const start3D = latLngTo3D(line.start.lat, line.start.lng);
        const end3D = latLngTo3D(line.end.lat, line.end.lng);
        
        const start2D = project3DTo2D(start3D.x, start3D.y, start3D.z);
        const end2D = project3DTo2D(end3D.x, end3D.y, end3D.z);

        // Calculate current position based on progress
        const progress = line.progress;
        const currentX = start2D.x + (end2D.x - start2D.x) * progress;
        const currentY = start2D.y + (end2D.y - start2D.y) * progress;

        // Add current position to trail
        line.trail.push({ x: currentX, y: currentY, opacity: 1 });

        // Limit trail length
        if (line.trail.length > 20) {
          line.trail.shift();
        }

        // Draw trail with fading opacity
        line.trail.forEach((point, trailIndex) => {
          const trailOpacity = (trailIndex / line.trail.length) * line.opacity;
          
          // Create gradient for trail segment
          const trailGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 8
          );
          trailGradient.addColorStop(0, `rgba(59, 130, 246, ${trailOpacity * 0.8})`); // Blue
          trailGradient.addColorStop(0.5, `rgba(34, 197, 94, ${trailOpacity * 0.6})`); // Green
          trailGradient.addColorStop(1, `rgba(147, 51, 234, ${trailOpacity * 0.8})`); // Purple

          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = trailGradient;
          ctx.fill();
        });

        // Draw main connection line
        ctx.beginPath();
        ctx.moveTo(start2D.x, start2D.y);
        ctx.lineTo(currentX, currentY);
        
        // Create gradient for the main line
        const lineGradient = ctx.createLinearGradient(start2D.x, start2D.y, currentX, currentY);
        lineGradient.addColorStop(0, `rgba(59, 130, 246, ${line.opacity * 0.9})`); // Blue
        lineGradient.addColorStop(0.5, `rgba(34, 197, 94, ${line.opacity * 0.7})`); // Green
        lineGradient.addColorStop(1, `rgba(147, 51, 234, ${line.opacity * 0.9})`); // Purple
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw pinpoints at start and end
        ctx.beginPath();
        ctx.arc(start2D.x, start2D.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(59, 130, 246, ${line.opacity * 0.9})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(end2D.x, end2D.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(147, 51, 234, ${line.opacity * 0.9})`;
        ctx.fill();

        // Update progress and opacity
        line.progress += line.speed;
        if (line.progress >= 1) {
          line.opacity -= 0.02; // Fade out
        }
        
        // Remove completed lines and generate new ones
        if (line.opacity <= 0) {
          connectionLines.splice(index, 1);
          if (Math.random() < 0.4) {
            generateConnection();
          }
        }
      });

      // Draw some additional connection points
      for (let i = 0; i < 12; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * 2 * Math.PI;
        const { x, y, z } = latLngTo3D(lat, lng);
        const projected = project3DTo2D(x, y, z);
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.fill();
      }

      // Update rotation - much slower
      rotation += 0.003;
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
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="transition-all duration-300 ease-in-out"
      />
    </div>
  );
} 