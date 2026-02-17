"use client";

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Navigation, Clipboard as ClipboardIcon } from 'lucide-react';
import { UserLocation } from './UserLocation';

interface SearchBarProps {
  url: string;
  source: string;
  isLoading: boolean;
  onUrlChange: (val: string) => void;
  onClear: () => void;
  onSearch: () => void;
  onPaste: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  url, 
  source, 
  isLoading, 
  onUrlChange, 
  onClear, 
  onSearch, 
  onPaste 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <motion.div 
        layout
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        className="w-full relative group perspective-1000 z-30"
    >
        <div className={`
            relative
            flex items-center gap-4 p-4 md:p-6 rounded-3xl 
            bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10
            shadow-2xl shadow-blue-900/10 
            transition-all duration-500 ease-out
            group-hover:border-blue-500/30 group-hover:shadow-blue-500/20
            focus-within:border-blue-500 focus-within:shadow-blue-500/30 focus-within:bg-[#0a0a0a]
            active:scale-[0.99]
        `}>
            <Search className="w-6 h-6 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300 shrink-0" />
            
            <input
                ref={inputRef}
                type="text"
                placeholder="Paste your map link here..."
                className="flex-1 bg-transparent border-none outline-none text-lg md:text-2xl font-medium placeholder:text-gray-600 text-white w-full min-w-0"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                autoFocus
            />

            <div className="flex items-center gap-2 shrink-0">
                <AnimatePresence mode="wait">
                    {url ? (
                            <motion.div className="flex items-center gap-2">
                            <motion.button
                                key="clear"
                                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClear}
                                className="p-2 rounded-full transition-colors text-gray-400 hover:text-white"
                                title="Clear"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                key="search"
                                initial={{ scale: 0, x: 20, opacity: 0 }}
                                animate={{ scale: 1, x: 0, opacity: 1 }}
                                exit={{ scale: 0, x: 20, opacity: 0 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onSearch}
                                className="p-3 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer"
                                title="Search"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5" />
                                )}
                            </motion.button>
                            </motion.div>
                        ) : (
                        <motion.button
                            key="paste"
                            initial={{ scale: 0, rotate: 45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -45 }}
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onPaste}
                            className="p-2 rounded-full transition-colors text-gray-400 hover:text-blue-400 cursor-pointer"
                            title="Paste from Clipboard"
                        >
                            <ClipboardIcon className="w-6 h-6" />
                        </motion.button>
                        )}
                </AnimatePresence>
            </div>
        </div>
        
        {/* Source Badge */}
        <AnimatePresence>
            {source && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute right-6 top-[-40px] flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md"
                >
                    <Navigation className="w-3 h-3 text-blue-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300 shadow-blue-500/10">{source}</span>
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* User Location */}
        <div className="absolute left-6 top-[-40px] z-40">
            <UserLocation onLocationFound={(coords) => {
                onUrlChange(coords);
            }} />
        </div>
    </motion.div>
  );
};
