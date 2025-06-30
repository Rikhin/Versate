"use client";

import { useEffect, useRef } from 'react';

interface GlobeProps {
  className?: string;
}

// Real world locations for connections
const WORLD_LOCATIONS = [
  { name: "New York", lat: 0.7102, lng: -1.2915 }, // 40.7128°N, 74.0060°W
  { name: "London", lat: 0.8983, lng: -0.1276 }, // 51.5074°N, 0.1278°W
  { name: "Tokyo", lat: 0.6109, lng: 2.6762 }, // 35.6762°N, 139.6503°E
  { name: "Sydney", lat: -0.5934, lng: 2.7019 }, // 33.8688°S, 151.2093°E
  { name: "São Paulo", lat: -0.4363, lng: -0.7854 }, // 23.5505°S, 46.6333°W
  { name: "Mumbai", lat: 0.3491, lng: 1.8845 }, // 19.0760°N, 72.8777°E
  { name: "Cairo", lat: 0.5994, lng: 0.4363 }, // 30.0444°N, 31.2357°E
  { name: "Moscow", lat: 0.8727, lng: 0.4189 }, // 55.7558°N, 37.6176°E
  { name: "Singapore", lat: 0.1572, lng: 2.1045 }, // 1.3521°N, 103.8198°E
  { name: "Los Angeles", lat: 0.5925, lng: -2.1276 }, // 34.0522°N, 118.2437°W
  { name: "Paris", lat: 0.8727, lng: 0.0349 }, // 48.8566°N, 2.3522°E
  { name: "Berlin", lat: 0.7854, lng: 0.2094 }, // 52.5200°N, 13.4050°E
  { name: "Seoul", lat: 0.6109, lng: 2.5133 }, // 37.5665°N, 126.9780°E
  { name: "Mexico City", lat: 0.5236, lng: -1.5708 }, // 19.4326°N, 99.1332°W
  { name: "Bangkok", lat: 0.2618, lng: 2.0944 }, // 13.7563°N, 100.5018°E
];

// Simplified continent outlines (major coastal points)
const CONTINENTS = {
  northAmerica: [
    { lat: 0.7854, lng: -2.0944 }, // Alaska
    { lat: 0.6981, lng: -1.5708 }, // Canada
    { lat: 0.5236, lng: -1.5708 }, // Mexico
    { lat: 0.3491, lng: -1.5708 }, // Central America
    { lat: 0.2618, lng: -1.5708 }, // Panama
  ],
  southAmerica: [
    { lat: 0.1745, lng: -1.5708 }, // Colombia
    { lat: 0.0873, lng: -1.5708 }, // Ecuador
    { lat: -0.1745, lng: -1.5708 }, // Peru
    { lat: -0.4363, lng: -0.7854 }, // Brazil
    { lat: -0.6981, lng: -0.7854 }, // Argentina
  ],
  europe: [
    { lat: 0.7854, lng: -0.5236 }, // Norway
    { lat: 0.6981, lng: -0.3491 }, // UK
    { lat: 0.6109, lng: 0.0349 }, // France
    { lat: 0.5236, lng: 0.2094 }, // Germany
    { lat: 0.4363, lng: 0.5236 }, // Poland
  ],
  africa: [
    { lat: 0.5236, lng: 0.4363 }, // Morocco
    { lat: 0.3491, lng: 0.4363 }, // Algeria
    { lat: 0.1745, lng: 0.4363 }, // Nigeria
    { lat: -0.0873, lng: 0.4363 }, // Congo
    { lat: -0.3491, lng: 0.4363 }, // South Africa
  ],
  asia: [
    { lat: 0.6981, lng: 1.5708 }, // Russia
    { lat: 0.5236, lng: 1.5708 }, // China
    { lat: 0.3491, lng: 1.8845 }, // India
    { lat: 0.1745, lng: 2.0944 }, // Thailand
    { lat: 0.0873, lng: 2.0944 }, // Indonesia
  ],
  australia: [
    { lat: -0.3491, lng: 2.0944 }, // Australia
    { lat: -0.4363, lng: 2.0944 }, // Tasmania
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

    // Set canvas size - 3x larger
    const size = 600;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 225; // 3x larger radius

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

    // Generate connection between real locations
    const generateConnection = () => {
      const startIndex = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      let endIndex = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      while (endIndex === startIndex) {
        endIndex = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      }
      
      const start = WORLD_LOCATIONS[startIndex];
      const end = WORLD_LOCATIONS[endIndex];
      
      connectionLines.push({
        start: { lat: start.lat, lng: start.lng },
        end: { lat: end.lat, lng: end.lng },
        progress: 0,
        speed: 0.001 + Math.random() * 0.002, // Much slower movement
        opacity: 1,
        trail: []
      });
    };

    // Initialize only 1-2 connections
    for (let i = 0; i < 1; i++) {
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

    // Calculate great circle path between two points
    const getGreatCirclePath = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, steps: number = 50) => {
      const path = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start.lat + (end.lat - start.lat) * t;
        const lng = start.lng + (end.lng - start.lng) * t;
        path.push({ lat, lng });
      }
      return path;
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
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw continents
      Object.values(CONTINENTS).forEach(continent => {
        if (continent.length > 1) {
          ctx.beginPath();
          const firstPoint = latLngTo3D(continent[0].lat, continent[0].lng);
          const firstProjected = project3DTo2D(firstPoint.x, firstPoint.y, firstPoint.z);
          ctx.moveTo(firstProjected.x, firstProjected.y);
          
          for (let i = 1; i < continent.length; i++) {
            const point = latLngTo3D(continent[i].lat, continent[i].lng);
            const projected = project3DTo2D(point.x, point.y, point.z);
            ctx.lineTo(projected.x, projected.y);
          }
          
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'; // Green continents
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

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

      // Draw connection lines with curved paths
      connectionLines.forEach((line, index) => {
        const start3D = latLngTo3D(line.start.lat, line.start.lng);
        const end3D = latLngTo3D(line.end.lat, line.end.lng);
        
        const start2D = project3DTo2D(start3D.x, start3D.y, start3D.z);
        const end2D = project3DTo2D(end3D.x, end3D.y, end3D.z);

        // Get great circle path
        const path = getGreatCirclePath(line.start, line.end);
        
        // Calculate current position along the curved path
        const pathIndex = Math.floor(line.progress * (path.length - 1));
        const currentPathPoint = path[Math.min(pathIndex, path.length - 1)];
        const current3D = latLngTo3D(currentPathPoint.lat, currentPathPoint.lng);
        const current2D = project3DTo2D(current3D.x, current3D.y, current3D.z);

        // Add current position to trail
        line.trail.push({ x: current2D.x, y: current2D.y, opacity: 1 });

        // Limit trail length
        if (line.trail.length > 15) {
          line.trail.shift();
        }

        // Draw trail with fading opacity
        line.trail.forEach((point, trailIndex) => {
          const trailOpacity = (trailIndex / line.trail.length) * line.opacity;
          
          // Create gradient for trail segment
          const trailGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 12
          );
          trailGradient.addColorStop(0, `rgba(59, 130, 246, ${trailOpacity * 0.8})`); // Blue
          trailGradient.addColorStop(0.5, `rgba(34, 197, 94, ${trailOpacity * 0.6})`); // Green
          trailGradient.addColorStop(1, `rgba(147, 51, 234, ${trailOpacity * 0.8})`); // Purple

          ctx.beginPath();
          ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = trailGradient;
          ctx.fill();
        });

        // Draw curved connection line
        ctx.beginPath();
        ctx.moveTo(start2D.x, start2D.y);
        
        // Draw curved path following great circle
        for (let i = 0; i <= pathIndex; i++) {
          const pathPoint = path[i];
          const path3D = latLngTo3D(pathPoint.lat, pathPoint.lng);
          const path2D = project3DTo2D(path3D.x, path3D.y, path3D.z);
          ctx.lineTo(path2D.x, path2D.y);
        }
        
        // Create gradient for the curved line
        const lineGradient = ctx.createLinearGradient(start2D.x, start2D.y, current2D.x, current2D.y);
        lineGradient.addColorStop(0, `rgba(59, 130, 246, ${line.opacity * 0.9})`); // Blue
        lineGradient.addColorStop(0.5, `rgba(34, 197, 94, ${line.opacity * 0.7})`); // Green
        lineGradient.addColorStop(1, `rgba(147, 51, 234, ${line.opacity * 0.9})`); // Purple
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw pinpoints at start and end
        ctx.beginPath();
        ctx.arc(start2D.x, start2D.y, 9, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(59, 130, 246, ${line.opacity * 0.9})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(end2D.x, end2D.y, 9, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(147, 51, 234, ${line.opacity * 0.9})`;
        ctx.fill();

        // Update progress and opacity
        line.progress += line.speed;
        if (line.progress >= 1) {
          line.opacity -= 0.01; // Slower fade out
        }
        
        // Remove completed lines and generate new ones
        if (line.opacity <= 0) {
          connectionLines.splice(index, 1);
          if (Math.random() < 0.3) { // Lower chance to generate new connection
            generateConnection();
          }
        }
      });

      // Draw fewer location dots (only 6 instead of 12)
      for (let i = 0; i < 6; i++) {
        const location = WORLD_LOCATIONS[i];
        const { x, y, z } = latLngTo3D(location.lat, location.lng);
        const projected = project3DTo2D(x, y, z);
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.fill();
      }

      // Update rotation - much slower
      rotation += 0.001;
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