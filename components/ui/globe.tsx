"use client";

import { useEffect, useRef } from 'react';

interface GlobeProps {
  className?: string;
}

// Realistic Earth continent data (simplified but accurate)
const EARTH_CONTINENTS = {
  northAmerica: [
    // Alaska and Canada
    { lat: 0.7854, lng: -2.0944 }, { lat: 0.6981, lng: -1.5708 }, { lat: 0.6109, lng: -1.5708 },
    { lat: 0.5236, lng: -1.5708 }, { lat: 0.4363, lng: -1.5708 }, { lat: 0.3491, lng: -1.5708 },
    // United States
    { lat: 0.5236, lng: -1.5708 }, { lat: 0.4363, lng: -1.5708 }, { lat: 0.3491, lng: -1.5708 },
    { lat: 0.2618, lng: -1.5708 }, { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 },
    // Mexico and Central America
    { lat: 0.2618, lng: -1.5708 }, { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 },
    { lat: 0.0, lng: -1.5708 }, { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 },
  ],
  southAmerica: [
    // Colombia to Argentina
    { lat: 0.1745, lng: -1.5708 }, { lat: 0.0873, lng: -1.5708 }, { lat: 0.0, lng: -1.5708 },
    { lat: -0.0873, lng: -1.5708 }, { lat: -0.1745, lng: -1.5708 }, { lat: -0.2618, lng: -1.5708 },
    { lat: -0.3491, lng: -1.5708 }, { lat: -0.4363, lng: -1.5708 }, { lat: -0.5236, lng: -1.5708 },
    { lat: -0.6109, lng: -1.5708 }, { lat: -0.6981, lng: -1.5708 }, { lat: -0.7854, lng: -1.5708 },
    // Brazil coastline
    { lat: -0.1745, lng: -0.7854 }, { lat: -0.2618, lng: -0.7854 }, { lat: -0.3491, lng: -0.7854 },
    { lat: -0.4363, lng: -0.7854 }, { lat: -0.5236, lng: -0.7854 }, { lat: -0.6109, lng: -0.7854 },
  ],
  europe: [
    // Scandinavia
    { lat: 0.7854, lng: -0.5236 }, { lat: 0.6981, lng: -0.3491 }, { lat: 0.6109, lng: -0.1745 },
    // UK and Ireland
    { lat: 0.6981, lng: -0.3491 }, { lat: 0.6109, lng: -0.3491 }, { lat: 0.5236, lng: -0.3491 },
    // Western Europe
    { lat: 0.6109, lng: 0.0349 }, { lat: 0.5236, lng: 0.2094 }, { lat: 0.4363, lng: 0.3491 },
    // Central Europe
    { lat: 0.5236, lng: 0.2094 }, { lat: 0.4363, lng: 0.3491 }, { lat: 0.3491, lng: 0.5236 },
    // Eastern Europe
    { lat: 0.4363, lng: 0.5236 }, { lat: 0.3491, lng: 0.6981 }, { lat: 0.2618, lng: 0.8727 },
  ],
  africa: [
    // North Africa
    { lat: 0.5236, lng: 0.4363 }, { lat: 0.4363, lng: 0.4363 }, { lat: 0.3491, lng: 0.4363 },
    { lat: 0.2618, lng: 0.4363 }, { lat: 0.1745, lng: 0.4363 }, { lat: 0.0873, lng: 0.4363 },
    // West Africa
    { lat: 0.1745, lng: 0.4363 }, { lat: 0.0873, lng: 0.4363 }, { lat: 0.0, lng: 0.4363 },
    { lat: -0.0873, lng: 0.4363 }, { lat: -0.1745, lng: 0.4363 }, { lat: -0.2618, lng: 0.4363 },
    // Central Africa
    { lat: -0.0873, lng: 0.4363 }, { lat: -0.1745, lng: 0.4363 }, { lat: -0.2618, lng: 0.4363 },
    { lat: -0.3491, lng: 0.4363 }, { lat: -0.4363, lng: 0.4363 }, { lat: -0.5236, lng: 0.4363 },
    // South Africa
    { lat: -0.3491, lng: 0.4363 }, { lat: -0.4363, lng: 0.4363 }, { lat: -0.5236, lng: 0.4363 },
    { lat: -0.6109, lng: 0.4363 }, { lat: -0.6981, lng: 0.4363 }, { lat: -0.7854, lng: 0.4363 },
  ],
  asia: [
    // Russia
    { lat: 0.6981, lng: 1.5708 }, { lat: 0.6109, lng: 1.5708 }, { lat: 0.5236, lng: 1.5708 },
    { lat: 0.4363, lng: 1.5708 }, { lat: 0.3491, lng: 1.5708 }, { lat: 0.2618, lng: 1.5708 },
    // China
    { lat: 0.5236, lng: 1.5708 }, { lat: 0.4363, lng: 1.5708 }, { lat: 0.3491, lng: 1.5708 },
    { lat: 0.2618, lng: 1.5708 }, { lat: 0.1745, lng: 1.5708 }, { lat: 0.0873, lng: 1.5708 },
    // India
    { lat: 0.3491, lng: 1.8845 }, { lat: 0.2618, lng: 1.8845 }, { lat: 0.1745, lng: 1.8845 },
    { lat: 0.0873, lng: 1.8845 }, { lat: 0.0, lng: 1.8845 }, { lat: -0.0873, lng: 1.8845 },
    // Southeast Asia
    { lat: 0.1745, lng: 2.0944 }, { lat: 0.0873, lng: 2.0944 }, { lat: 0.0, lng: 2.0944 },
    { lat: -0.0873, lng: 2.0944 }, { lat: -0.1745, lng: 2.0944 }, { lat: -0.2618, lng: 2.0944 },
    // Japan
    { lat: 0.6109, lng: 2.6762 }, { lat: 0.5236, lng: 2.6762 }, { lat: 0.4363, lng: 2.6762 },
  ],
  australia: [
    // Australia
    { lat: -0.3491, lng: 2.0944 }, { lat: -0.4363, lng: 2.0944 }, { lat: -0.5236, lng: 2.0944 },
    { lat: -0.6109, lng: 2.0944 }, { lat: -0.6981, lng: 2.0944 }, { lat: -0.7854, lng: 2.0944 },
    // Tasmania
    { lat: -0.4363, lng: 2.0944 }, { lat: -0.5236, lng: 2.0944 }, { lat: -0.6109, lng: 2.0944 },
  ],
  antarctica: [
    // Antarctica (simplified)
    { lat: -1.0472, lng: 0.0 }, { lat: -1.0472, lng: 0.7854 }, { lat: -1.0472, lng: 1.5708 },
    { lat: -1.0472, lng: 2.3562 }, { lat: -1.0472, lng: 3.1416 }, { lat: -1.0472, lng: 3.9270 },
    { lat: -1.0472, lng: 4.7124 }, { lat: -1.0472, lng: 5.4978 }, { lat: -1.0472, lng: 6.2832 },
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

    // Set canvas size - 3x bigger (1800px)
    const size = 1800;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 675; // 3x larger radius

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

    // Draw the hyper-realistic Earth
    const drawEarth = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create realistic Earth gradient background
      const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      earthGradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)'); // Sky blue center
      earthGradient.addColorStop(0.3, 'rgba(100, 149, 237, 0.4)'); // Cornflower blue
      earthGradient.addColorStop(0.6, 'rgba(70, 130, 180, 0.5)'); // Steel blue
      earthGradient.addColorStop(0.8, 'rgba(25, 25, 112, 0.6)'); // Midnight blue
      earthGradient.addColorStop(1, 'rgba(0, 0, 128, 0.7)'); // Navy blue edge

      // Draw Earth base (oceans)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Draw Earth outline with realistic atmosphere
      ctx.strokeStyle = 'rgba(135, 206, 235, 0.8)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Draw latitude lines (parallels)
      for (let i = -4; i <= 4; i++) {
        const lat = (i * Math.PI) / 6;
        const points = [];
        
        for (let j = 0; j <= 100; j++) {
          const lng = (j * 2 * Math.PI) / 100;
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
          ctx.strokeStyle = 'rgba(135, 206, 235, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw longitude lines (meridians)
      for (let i = 0; i < 12; i++) {
        const lng = (i * 2 * Math.PI) / 12;
        const points = [];
        
        for (let j = 0; j <= 50; j++) {
          const lat = ((j - 25) * Math.PI) / 25;
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
          ctx.strokeStyle = 'rgba(135, 206, 235, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw continents with realistic colors and shading
      Object.entries(EARTH_CONTINENTS).forEach(([continentName, continent]) => {
        if (continent.length > 1) {
          // Create continent gradient based on type
          let continentColor;
          switch (continentName) {
            case 'antarctica':
              continentColor = 'rgba(255, 255, 255, 0.9)'; // White for ice
              break;
            case 'australia':
              continentColor = 'rgba(139, 69, 19, 0.8)'; // Brown for desert
              break;
            case 'africa':
              continentColor = 'rgba(34, 139, 34, 0.8)'; // Forest green
              break;
            case 'southAmerica':
              continentColor = 'rgba(85, 107, 47, 0.8)'; // Dark olive green
              break;
            case 'northAmerica':
              continentColor = 'rgba(107, 142, 35, 0.8)'; // Olive drab
              break;
            case 'europe':
              continentColor = 'rgba(60, 179, 113, 0.8)'; // Medium sea green
              break;
            case 'asia':
              continentColor = 'rgba(46, 139, 87, 0.8)'; // Sea green
              break;
            default:
              continentColor = 'rgba(34, 139, 34, 0.8)'; // Default green
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
          
          // Create continent gradient for 3D effect
          const continentGradient = ctx.createLinearGradient(
            firstProjected.x, firstProjected.y,
            firstProjected.x + 100, firstProjected.y + 100
          );
          continentGradient.addColorStop(0, continentColor);
          continentGradient.addColorStop(0.5, continentColor.replace('0.8', '0.6'));
          continentGradient.addColorStop(1, continentColor.replace('0.8', '0.4'));
          
          ctx.strokeStyle = continentGradient;
          ctx.lineWidth = 12;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Add continent fill for more realism
          ctx.fillStyle = continentColor.replace('0.8', '0.3');
          ctx.fill();
        }
      });

      // Add atmospheric glow effect
      const atmosphereGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.8,
        centerX, centerY, radius * 1.1
      );
      atmosphereGradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
      atmosphereGradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.1)');
      atmosphereGradient.addColorStop(1, 'rgba(135, 206, 235, 0.3)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, 2 * Math.PI);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();

      // Add cloud layer effect
      for (let i = 0; i < 20; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lng = Math.random() * 2 * Math.PI;
        const { x, y, z } = latLngTo3D(lat, lng);
        const projected = project3DTo2D(x, y, z);
        
        const cloudSize = Math.random() * 40 + 20;
        const cloudOpacity = Math.random() * 0.3 + 0.1;
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, cloudSize, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${cloudOpacity})`;
        ctx.fill();
      }

      // Update rotation - very slow for realistic Earth rotation
      rotation += 0.0005;
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