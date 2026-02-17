"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
        }}
        transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut" 
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
        }}
        transition={{ 
            duration: 18, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[150px] rounded-full" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
);
  
export const SkeletonLoader = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full mt-12 space-y-8"
    >
       {/* Coordinates Card Skeleton */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#0a0a0a]/50 border border-white/5 p-6 rounded-2xl h-[160px] relative overflow-hidden backdrop-blur-md">
             <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
             />
             <div className="h-3 w-32 bg-white/10 rounded-full mb-6" />
             <div className="flex gap-12 mb-6">
                  <div>
                      <div className="h-2 w-16 bg-white/10 rounded-full mb-3" />
                      <div className="h-8 w-28 bg-white/10 rounded-lg" />
                  </div>
                  <div>
                       <div className="h-2 w-16 bg-white/10 rounded-full mb-3" />
                       <div className="h-8 w-28 bg-white/10 rounded-lg" />
                  </div>
             </div>
             <div className="h-10 w-40 bg-white/10 rounded-lg" />
         </div>
       </div>
  
       {/* Provider Grid Skeleton */}
       <div>
           <div className="h-3 w-40 bg-white/10 rounded-full mb-6" />
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                  <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="h-32 bg-[#0a0a0a]/50 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 backdrop-blur-sm"
                  >
                      <motion.div 
                         className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
                         animate={{ x: ['-100%', '100%'] }}
                         transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.1 }}
                      />
                      <div className="w-10 h-10 rounded-xl bg-white/10 mb-4" />
                      <div className="h-3 w-20 bg-white/10 rounded-full" />
                  </motion.div>
              ))}
           </div>
       </div>
    </motion.div>
);
