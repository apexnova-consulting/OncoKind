'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Children, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once: _once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  className,
  stagger = 0.08,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * stagger, ease: easeOutExpo }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
