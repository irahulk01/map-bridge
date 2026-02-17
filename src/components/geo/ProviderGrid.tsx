"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrandIcon } from '../BrandIcon';

interface ProviderGridProps {
  providers: { name: string; url: string; color: string }[];
}

export const ProviderGrid: React.FC<ProviderGridProps> = ({ providers }) => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
    >
         <h3 className="text-center md:text-left text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Open with Provider</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {providers.map((p, i) => (
                 <motion.a
                     key={p.name}
                     href={p.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     initial={{ opacity: 0, y: 20, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ 
                         delay: 0.4 + (i * 0.05),
                         type: "spring",
                         stiffness: 100
                     }}
                     whileHover={{ 
                         scale: 1.05, 
                         y: -5,
                         backgroundColor: "rgba(255, 255, 255, 0.03)",
                         borderColor: "rgba(255, 255, 255, 0.1)"
                     }}
                     whileTap={{ scale: 0.95 }}
                     className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0a0a0a]/40 border border-white/5 hover:shadow-xl hover:shadow-blue-500/5 transition-colors cursor-pointer group h-32 relative overflow-hidden"
                 >
                     <motion.div 
                        className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        initial={false} 
                     />
                     <BrandIcon name={p.name} className="w-8 h-8 mb-3 text-gray-500 group-hover:text-blue-400 transition-colors duration-300 transform group-hover:scale-110" />
                     <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-wider text-center transition-colors duration-300">{p.name}</span>
                 </motion.a>
             ))}
         </div>
    </motion.div>
  );
};
