"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

export const Header = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus(); // initial check

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);
  return (
    <header
      className="
      fixed top-0 left-0 w-full z-50
      px-6 py-4 md:px-8 md:py-6
      flex items-center justify-between
      
      bg-gradient-to-b from-black/60 via-black/30 to-transparent
      backdrop-blur-xl
      "
    >
      <motion.div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => window.location.reload()}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 rounded-full"></div>
          <div className="relative p-2 bg-gradient-to-br from-blue-600/80 to-indigo-700/80 backdrop-blur-md rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
            <Globe2 className="text-white w-5 h-5 animate-pulse-slow" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white leading-none">
            Nav Bridge
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-semibold mt-0.5">
            Universal Map Tool
          </span>
        </div>
      </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md"
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline
            ? "bg-emerald-400 animate-pulse"
            : "bg-red-500"
        }`}
      ></div>

      <span
        className={`text-xs font-medium ${
          isOnline ? "text-emerald-300" : "text-red-400"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </motion.div>
    </header>
  );
};
