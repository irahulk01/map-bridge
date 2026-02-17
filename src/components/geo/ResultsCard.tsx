"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Sparkles, Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";
import { Coordinates } from "../../lib/geo-utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = "",
  style,
}) => {
  const letters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", ...style }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

interface ResultsCardProps {
  coords: Coordinates;
  copied: boolean;
  onCopy: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  coords,
  copied,
  onCopy,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
      }}
      className="
        bg-gradient-to-br from-[#111] to-[#0a0a0a]
        border border-white/5
        p-6 sm:p-8
        rounded-3xl
        flex flex-col justify-center
        shadow-xl relative overflow-hidden
        group w-full
      "
    >
      <div className="absolute top-0 right-0 p-[120px] sm:p-[200px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />

      {/* MAIN CONTENT */}
      <div className="flex flex-col gap-8 relative z-10 w-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Detailed Location
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"
            />
          </div>

          {/* COORDINATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
            <div className="min-w-0">
              <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">
                Latitude
              </span>

              <AnimatedText
                text={coords.lat.toFixed(6)}
                className="
                  font-mono font-bold text-white tracking-tight
                  leading-none whitespace-nowrap
                "
                style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}
              />
            </div>

            <div className="min-w-0">
              <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">
                Longitude
              </span>

              <AnimatedText
                text={coords.lng.toFixed(6)}
                className="
                  font-mono font-bold text-white tracking-tight
                  leading-none whitespace-nowrap
                "
                style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}
              />
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className={cn(
            `
            w-fit
            self-center
            px-6 py-4 sm:px-8 sm:py-5
            rounded-2xl
            flex items-center justify-center gap-3
            font-semibold transition-all duration-300
            text-xs sm:text-sm
            tracking-wide uppercase
            cursor-pointer
            `,
            copied
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Copied</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Copy Coordinates</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};
