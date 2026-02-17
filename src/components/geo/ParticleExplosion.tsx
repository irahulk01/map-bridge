"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const ParticleExplosion = ({ trigger }: { trigger: boolean }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start(() => ({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        opacity: [1, 0],
        scale: [0, 1.5, 0],
        transition: { duration: 1.5, ease: "easeOut" }
      }));
    }
  }, [trigger, controls]);

  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={controls}
          className="absolute w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
        />
      ))}
       {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sub-${i}`}
          custom={i}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={controls}
          transition={{ delay: 0.1 }}
          className="absolute w-1 h-1 rounded-full bg-indigo-400"
        />
      ))}
    </div>
  );
};
