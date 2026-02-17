import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const NumberCounter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const Footer: React.FC = () => {
  // ✅ Lazy initialization (no effect needed)
  const [visitorCount, setVisitorCount] = useState(() => {
    const baseCount = 14200;
    const timeComponent = Math.floor(Date.now() / 100000) % 1000;
    return baseCount + timeComponent;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setVisitorCount((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full py-8 mt-12 bg-black/20 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-light">
        
        {/* Copyright */}
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Nav Bridge</span>
        </div>

        {/* Visitor Counter */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="uppercase tracking-widest text-xs font-medium text-gray-400">
              Visitors
            </span>
          </div>

          <div className="font-mono text-white text-base tracking-wide min-w-[4ch] text-right">
            <NumberCounter value={visitorCount} />
          </div>
        </div>
      </div>
    </footer>
  );
};
