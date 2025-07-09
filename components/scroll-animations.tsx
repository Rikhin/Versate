'use client';

import { ReactNode } from 'react';

// Simple placeholder components for scroll animations
export const BackgroundGradient = ({ children }: { children: ReactNode }) => {
  return <div className="relative">{children}</div>;
};

export const FloatingShapes = () => {
  return null; // Empty component for now
};

export const TextFade = ({ children }: { children: ReactNode }) => {
  return <div className="opacity-100 transition-opacity duration-500">{children}</div>;
};
