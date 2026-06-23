import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      }}
      exit={{
        opacity: 0,
        y: -8,
        transition: { duration: 0.2 },
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
