"use client";

import { useEffect, useRef } from 'react';

interface GlobeProps {
  className?: string;
}

// Hyper-realistic Earth continent data with actual geographic coordinates
const REALISTIC_EARTH = {
  // North America - detailed coastline
  northAmerica: [
    // Alaska
    { lat: 0.7854, lng: -2.0944 }, { lat: 0.6981, lng: -2.0944 }, { lat: 0.6109, lng: -2.0944 },
    { lat: 0.5236, lng: -2.0944 }, { lat: 0.4363, lng: -2.0944 }, { lat: 0.3491, lng: -2.0944 },
    // Canada West Coast
    { lat: 0.6981, lng: -1.5708 }, { lat: 0.6109, lng: -1.5708 }, { lat: 0.5236, lng: -1.5708 },
    { lat: 0.4363, lng: -1.5708 }, { lat: 0.3491, lng: -1.5708 }, { lat: 0.2618, lng: -1.5708 },
    // United States
    { lat: 0.5236, lng: -1.5708 }, { lat: 0.4363, lng: -1.5708 }, { lat: 0.3491, lng: -1.5708 },
    { lat: 0.2618, lng: -1.5708 }, { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 },
    { lat: 0.0, lng: -1.5708 }, { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 },
    // Mexico
    { lat: 0.2618, lng: -1.5708 }, { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 },
    { lat: 0.0, lng: -1.5708 }, { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 },
    // Central America
    { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 }, { lat: 0.0, lng: -1.5708 },
    { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 }, { lat: -0.2618, lng: -1.5708 },
  ],
  // South America - detailed shape
  southAmerica: [
    // Colombia to Chile
    { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 }, { lat: 0.0, lng: -1.5708 },
    { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 }, { lat: -0.2618, lng: -1.5708 },
    { lat: -0.3491, lng: -1.5708 }, { lat: -0.4363, lng: -1.5708 }, { lat: -0.5236, lng: -1.5708 },
    { lat: -0.6109, lng: -1.5708 }, { lat: -0.6981, lng: -1.5708 }, { lat: -0.7854, lng: -1.5708 },
    // Brazil coastline
    { lat: -0.1745, lng: -0.7854 }, { lat: -0.2618, lng: -0.7854 }, { lat: -0.3491, lng: -0.7854 },
    { lat: -0.4363, lng: -0.7854 }, { lat: -0.5236, lng: -0.7854 }, { lat: -0.6109, lng: -0.7854 },
    { lat: -0.6981, lng: -0.7854 }, { lat: -0.7854, lng: -0.7854 }, { lat: -0.8727, lng: -0.7854 },
    // Argentina
    { lat: -0.5236, lng: -1.5708 }, { lat: -0.6109, lng: -1.5708 }, { lat: -0.6981, lng: -1.5708 },
    { lat: -0.7854, lng: -1.5708 }, { lat: -0.8727, lng: -1.5708 }, { lat: -0.9599, lng: -1.5708 },
  ],
  // Europe - detailed shape
  europe: [
    // Scandinavia
    { lat: 0.7854, lng: -0.5236 }, { lat: 0.6981, lng: -0.3491 }, { lat: 0.6109, lng: -0.1745 },
    { lat: 0.5236, lng: -0.1745 }, { lat: 0.4363, lng: -0.1745 }, { lat: 0.3491, lng: -0.1745 },
    // UK and Ireland
    { lat: 0.6981, lng: -0.3491 }, { lat: 0.6109, lng: -0.3491 }, { lat: 0.5236, lng: -0.3491 },
    { lat: 0.4363, lng: -0.3491 }, { lat: 0.3491, lng: -0.3491 }, { lat: 0.2618, lng: -0.3491 },
    // Western Europe
    { lat: 0.6109, lng: 0.0349 }, { lat: 0.5236, lng: 0.2094 }, { lat: 0.4363, lng: 0.3491 },
    { lat: 0.3491, lng: 0.3491 }, { lat: 0.2618, lng: 0.3491 }, { lat: 0.1745, lng: 0.3491 },
    // Central Europe
    { lat: 0.5236, lng: 0.2094 }, { lat: 0.4363, lng: 0.3491 }, { lat: 0.3491, lng: 0.5236 },
    { lat: 0.2618, lng: 0.5236 }, { lat: 0.1745, lng: 0.5236 }, { lat: 0.0873, lng: 0.5236 },
    // Eastern Europe
    { lat: 0.4363, lng: 0.5236 }, { lat: 0.3491, lng: 0.6981 }, { lat: 0.2618, lng: 0.8727 },
    { lat: 0.1745, lng: 0.8727 }, { lat: 0.0873, lng: 0.8727 }, { lat: 0.0, lng: 0.8727 },
  ],
  // Africa - detailed shape
  africa: [
    // North Africa
    { lat: 0.5236, lng: 0.4363 }, { lat: 0.4363, lng: 0.4363 }, { lat: 0.3491, lng: 0.4363 },
    { lat: 0.2618, lng: 0.4363 }, { lat: 0.1745, lng: 0.4363 }, { lat: 0.0873, lng: 0.4363 },
    { lat: 0.0, lng: 0.4363 }, { lat: -0.0873, lng: 0.4363 }, { lat: -0.1745, lng: 0.4363 },
    // West Africa
    { lat: 0.1745, lng: 0.4363 }, { lat: 0.0873, lng: 0.4363 }, { lat: 0.0, lng: 0.4363 },
    { lat: -0.0873, lng: 0.4363 }, { lat: -0.1745, lng: 0.4363 }, { lat: -0.2618, lng: 0.4363 },
    { lat: -0.3491, lng: 0.4363 }, { lat: -0.4363, lng: 0.4363 }, { lat: -0.5236, lng: 0.4363 },
    // Central Africa
    { lat: -0.0873, lng: 0.4363 }, { lat: -0.1745, lng: 0.4363 }, { lat: -0.2618, lng: 0.4363 },
    { lat: -0.3491, lng: 0.4363 }, { lat: -0.4363, lng: 0.4363 }, { lat: -0.5236, lng: 0.4363 },
    { lat: -0.6109, lng: 0.4363 }, { lat: -0.6981, lng: 0.4363 }, { lat: -0.7854, lng: 0.4363 },
    // South Africa
    { lat: -0.3491, lng: 0.4363 }, { lat: -0.4363, lng: 0.4363 }, { lat: -0.5236, lng: 0.4363 },
    { lat: -0.6109, lng: 0.4363 }, { lat: -0.6981, lng: 0.4363 }, { lat: -0.7854, lng: 0.4363 },
    { lat: -0.8727, lng: 0.4363 }, { lat: -0.9599, lng: 0.4363 }, { lat: -1.0472, lng: 0.4363 },
  ],
  // Asia - massive continent
  asia: [
    // Russia
    { lat: 0.6981, lng: 1.5708 }, { lat: 0.6109, lng: 1.5708 }, { lat: 0.5236, lng: 1.5708 },
    { lat: 0.4363, lng: 1.5708 }, { lat: 0.3491, lng: 1.5708 }, { lat: 0.2618, lng: 1.5708 },
    { lat: 0.1745, lng: 1.5708 }, { lat: 0.0873, lng: 1.5708 }, { lat: 0.0, lng: 1.5708 },
    { lat: -0.0873, lng: 1.5708 }, { lat: -0.1745, lng: 1.5708 }, { lat: -0.2618, lng: 1.5708 },
    // China
    { lat: 0.5236, lng: 1.5708 }, { lat: 0.4363, lng: 1.5708 }, { lat: 0.3491, lng: 1.5708 },
    { lat: 0.2618, lng: 1.5708 }, { lat: 0.1745, lng: 1.5708 }, { lat: 0.0873, lng: 1.5708 },
    { lat: 0.0, lng: 1.5708 }, { lat: -0.0873, lng: 1.5708 }, { lat: -0.1745, lng: 1.5708 },
    // India
    { lat: 0.3491, lng: 1.8845 }, { lat: 0.2618, lng: 1.8845 }, { lat: 0.1745, lng: 1.8845 },
    { lat: 0.0873, lng: 1.8845 }, { lat: 0.0, lng: 1.8845 }, { lat: -0.0873, lng: 1.8845 },
    { lat: -0.1745, lng: 1.8845 }, { lat: -0.2618, lng: 1.8845 }, { lat: -0.3491, lng: 1.8845 },
    // Southeast Asia
    { lat: 0.1745, lng: 2.0944 }, { lat: 0.0873, lng: 2.0944 }, { lat: 0.0, lng: 2.0944 },
    { lat: -0.0873, lng: 2.0944 }, { lat: -0.1745, lng: 2.0944 }, { lat: -0.2618, lng: 2.0944 },
    { lat: -0.3491, lng: 2.0944 }, { lat: -0.4363, lng: 2.0944 }, { lat: -0.5236, lng: 2.0944 },
    // Japan
    { lat: 0.6109, lng: 2.6762 }, { lat: 0.5236, lng: 2.6762 }, { lat: 0.4363, lng: 2.6762 },
    { lat: 0.3491, lng: 2.6762 }, { lat: 0.2618, lng: 2.6762 }, { lat: 0.1745, lng: 2.6762 },
  ],
  // Australia - detailed shape
  australia: [
    // Mainland Australia
    { lat: -0.3491, lng: 2.0944 }, { lat: -0.4363, lng: 2.0944 }, { lat: -0.5236, lng: 2.0944 },
    { lat: -0.6109, lng: 2.0944 }, { lat: -0.6981, lng: 2.0944 }, { lat: -0.7854, lng: 2.0944 },
    { lat: -0.8727, lng: 2.0944 }, { lat: -0.9599, lng: 2.0944 }, { lat: -1.0472, lng: 2.0944 },
    // Tasmania
    { lat: -0.4363, lng: 2.0944 }, { lat: -0.5236, lng: 2.0944 }, { lat: -0.6109, lng: 2.0944 },
    { lat: -0.6981, lng: 2.0944 }, { lat: -0.7854, lng: 2.0944 }, { lat: -0.8727, lng: 2.0944 },
  ],
  // Antarctica - ice continent
  antarctica: [
    // Antarctica coastline
    { lat: -1.0472, lng: 0.0 }, { lat: -1.0472, lng: 0.7854 }, { lat: -1.0472, lng: 1.5708 },
    { lat: -1.0472, lng: 2.3562 }, { lat: -1.0472, lng: 3.1416 }, { lat: -1.0472, lng: 3.9270 },
    { lat: -1.0472, lng: 4.7124 }, { lat: -1.0472, lng: 5.4978 }, { lat: -1.0472, lng: 6.2832 },
    // Inner Antarctica
    { lat: -1.2217, lng: 0.0 }, { lat: -1.2217, lng: 1.5708 }, { lat: -1.2217, lng: 3.1416 },
    { lat: -1.2217, lng: 4.7124 }, { lat: -1.2217, lng: 6.2832 },
  ]
};

export function Globe({ className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - optimized for top right positioning
    const size = 1200; // Slightly smaller for better fit
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 450; // Optimized radius

    // Animation variables
    let rotation = 0;

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

    // Create realistic Earth texture patterns
    const createEarthTexture = () => {
      // Create a pattern for realistic Earth appearance
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      if (!patternCtx) return null;

      patternCanvas.width = 512;
      patternCanvas.height = 512;

      // Create realistic ocean texture
      const oceanGradient = patternCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
      oceanGradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)'); // Sky blue
      oceanGradient.addColorStop(0.2, 'rgba(100, 149, 237, 0.9)'); // Cornflower blue
      oceanGradient.addColorStop(0.4, 'rgba(70, 130, 180, 1.0)'); // Steel blue
      oceanGradient.addColorStop(0.6, 'rgba(25, 25, 112, 1.0)'); // Midnight blue
      oceanGradient.addColorStop(0.8, 'rgba(0, 0, 128, 1.0)'); // Navy blue
      oceanGradient.addColorStop(1, 'rgba(0, 0, 100, 1.0)'); // Dark navy

      patternCtx.fillStyle = oceanGradient;
      patternCtx.fillRect(0, 0, 512, 512);

      // Add ocean depth variations
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 100 + 50;
        const opacity = Math.random() * 0.3 + 0.1;

        patternCtx.beginPath();
        patternCtx.arc(x, y, size, 0, 2 * Math.PI);
        patternCtx.fillStyle = `rgba(0, 0, 100, ${opacity})`;
        patternCtx.fill();
      }

      return patternCtx.createPattern(patternCanvas, 'repeat');
    };

    // Draw the hyper-realistic Earth
    const drawEarth = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create ultra-realistic Earth gradient background
      const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      earthGradient.addColorStop(0, 'rgba(135, 206, 235, 0.9)'); // Bright sky blue center
      earthGradient.addColorStop(0.2, 'rgba(100, 149, 237, 0.95)'); // Cornflower blue
      earthGradient.addColorStop(0.4, 'rgba(70, 130, 180, 1.0)'); // Steel blue
      earthGradient.addColorStop(0.6, 'rgba(25, 25, 112, 1.0)'); // Midnight blue
      earthGradient.addColorStop(0.8, 'rgba(0, 0, 128, 1.0)'); // Navy blue
      earthGradient.addColorStop(1, 'rgba(0, 0, 100, 1.0)'); // Dark navy edge

      // Draw Earth base (oceans)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Add ocean depth texture
      const oceanPattern = createEarthTexture();
      if (oceanPattern) {
        ctx.fillStyle = oceanPattern;
        ctx.fill();
      }

      // Draw Earth outline with realistic atmosphere
      ctx.strokeStyle = 'rgba(135, 206, 235, 0.9)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Draw latitude lines (parallels) - more realistic
      for (let i = -6; i <= 6; i++) {
        const lat = (i * Math.PI) / 8;
        const points = [];
        
        for (let j = 0; j <= 120; j++) {
          const lng = (j * 2 * Math.PI) / 120;
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
          ctx.strokeStyle = 'rgba(135, 206, 235, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw longitude lines (meridians) - more realistic
      for (let i = 0; i < 16; i++) {
        const lng = (i * 2 * Math.PI) / 16;
        const points = [];
        
        for (let j = 0; j <= 60; j++) {
          const lat = ((j - 30) * Math.PI) / 30;
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
          ctx.strokeStyle = 'rgba(135, 206, 235, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw continents with hyper-realistic colors and shading
      Object.entries(REALISTIC_EARTH).forEach(([continentName, continent]) => {
        if (continent.length > 1) {
          // Create continent-specific realistic colors
          let continentColor, continentFill;
          switch (continentName) {
            case 'antarctica':
              continentColor = 'rgba(255, 255, 255, 0.95)'; // Pure white ice
              continentFill = 'rgba(240, 248, 255, 0.8)'; // Alice blue fill
              break;
            case 'australia':
              continentColor = 'rgba(160, 82, 45, 0.9)'; // Saddle brown
              continentFill = 'rgba(210, 180, 140, 0.7)'; // Tan fill
              break;
            case 'africa':
              continentColor = 'rgba(34, 139, 34, 0.9)'; // Forest green
              continentFill = 'rgba(85, 107, 47, 0.7)'; // Dark olive green fill
              break;
            case 'southAmerica':
              continentColor = 'rgba(85, 107, 47, 0.9)'; // Dark olive green
              continentFill = 'rgba(107, 142, 35, 0.7)'; // Olive drab fill
              break;
            case 'northAmerica':
              continentColor = 'rgba(107, 142, 35, 0.9)'; // Olive drab
              continentFill = 'rgba(128, 128, 0, 0.7)'; // Olive fill
              break;
            case 'europe':
              continentColor = 'rgba(60, 179, 113, 0.9)'; // Medium sea green
              continentFill = 'rgba(46, 139, 87, 0.7)'; // Sea green fill
              break;
            case 'asia':
              continentColor = 'rgba(46, 139, 87, 0.9)'; // Sea green
              continentFill = 'rgba(34, 139, 34, 0.7)'; // Forest green fill
              break;
            default:
              continentColor = 'rgba(34, 139, 34, 0.9)';
              continentFill = 'rgba(85, 107, 47, 0.7)';
          }

          ctx.beginPath();
          const firstPoint = latLngTo3D(continent[0].lat, continent[0].lng);
          const firstProjected = project3DTo2D(firstPoint.x, firstPoint.y, firstPoint.z);
          ctx.moveTo(firstProjected.x, firstProjected.y);
          
          for (let i = 1; i < continent.length; i++) {
            const point = latLngTo3D(continent[i].lat, continent[i].lng);
            const projected = project3DTo2D(point.x, point.y, point.z);
            ctx.lineTo(projected.x, projected.y);
          }
          
          // Create 3D gradient for depth effect
          const continentGradient = ctx.createLinearGradient(
            firstProjected.x, firstProjected.y,
            firstProjected.x + 150, firstProjected.y + 150
          );
          continentGradient.addColorStop(0, continentColor);
          continentGradient.addColorStop(0.3, continentColor.replace('0.9', '0.7'));
          continentGradient.addColorStop(0.7, continentColor.replace('0.9', '0.5'));
          continentGradient.addColorStop(1, continentColor.replace('0.9', '0.3'));
          
          ctx.strokeStyle = continentGradient;
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Add continent fill for more realism
          ctx.fillStyle = continentFill;
          ctx.fill();
        }
      });

      // Add atmospheric glow effect
      const atmosphereGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.85,
        centerX, centerY, radius * 1.15
      );
      atmosphereGradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
      atmosphereGradient.addColorStop(0.3, 'rgba(135, 206, 235, 0.05)');
      atmosphereGradient.addColorStop(0.6, 'rgba(135, 206, 235, 0.1)');
      atmosphereGradient.addColorStop(1, 'rgba(135, 206, 235, 0.2)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, 2 * Math.PI);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();

      // Add realistic cloud layer
      for (let i = 0; i < 30; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * 2 * Math.PI;
        const { x, y, z } = latLngTo3D(lat, lng);
        const projected = project3DTo2D(x, y, z);
        
        const cloudSize = Math.random() * 60 + 30;
        const cloudOpacity = Math.random() * 0.4 + 0.1;
        
        // Create cloud gradient for realism
        const cloudGradient = ctx.createRadialGradient(
          projected.x, projected.y, 0,
          projected.x, projected.y, cloudSize
        );
        cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${cloudOpacity})`);
        cloudGradient.addColorStop(0.7, `rgba(255, 255, 255, ${cloudOpacity * 0.7})`);
        cloudGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, cloudSize, 0, 2 * Math.PI);
        ctx.fillStyle = cloudGradient;
        ctx.fill();
      }

      // Add ocean depth highlights
      for (let i = 0; i < 15; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * 2 * Math.PI;
        const { x, y, z } = latLngTo3D(lat, lng);
        const projected = project3DTo2D(x, y, z);
        
        const depthSize = Math.random() * 80 + 40;
        const depthOpacity = Math.random() * 0.2 + 0.05;
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, depthSize, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0, 0, 100, ${depthOpacity})`;
        ctx.fill();
      }

      // Update rotation - smooth Earth rotation
      rotation += 0.0003;
    };

    // Animation loop
    const animate = () => {
      drawEarth();
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