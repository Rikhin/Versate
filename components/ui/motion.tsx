"use client";

import { motion, AnimatePresence as MotionAnimatePresence } from 'framer-motion';
import { ComponentProps } from 'react';

// Export motion.div with proper typing
export const MotionDiv = motion.div;

// Export AnimatePresence with proper typing
export const AnimatePresence = MotionAnimatePresence;

// Export motion for direct usage when needed
export { motion };

// Export types for props
export type MotionDivProps = ComponentProps<typeof MotionDiv>;
