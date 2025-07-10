'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedWrapperProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'typewriter';
  duration?: number;
  once?: boolean;
};

export function AnimatedWrapper({
  children,
  delay = 0,
  className = '',
  type = 'fade',
  duration = 0.6,
  once = true,
}: AnimatedWrapperProps) {
  const variants: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    slide: {
      hidden: { opacity: 0, x: 0, y: 0 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    typewriter: {
      hidden: { opacity: 0, width: '0%' },
      visible: {
        opacity: 1,
        width: '100%',
        transition: {
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[type]}
      className={className}
      viewport={{ once }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}
