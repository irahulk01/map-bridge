"use client";

import React, { useState, useEffect } from 'react';
import { expandUrl } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  Copy,
  Check,
  Globe,
  Search,
  Navigation,
  Clipboard as ClipboardIcon,
  X,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { extractCoordinates, detectSource, getProviderLinks, Coordinates } from '../lib/geo-utils';

const GeoLocationFinder: React.FC = () => {
  const [url, setUrl] = useState('');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Theme State: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from system preference
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check local storage or system pref
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      root.classList.remove('light', 'dark');
      
      if (t === 'system') {
        if (isDark) root.classList.add('dark');
      } else {
        root.classList.add(t);
      }
      localStorage.setItem('theme', t);
    };

    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
            const newIsDark = e.matches;
            root.classList.remove('light', 'dark');
            if (newIsDark) root.classList.add('dark');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

  }, [theme, mounted]);

  const performExtraction = (inputUrl: string) => {
    const result = extractCoordinates(inputUrl);
    setCoords(result.coords);
    setError(result.error);
  };

  const expandShortUrl = async (shortUrl: string): Promise<string> => {
    try {
      const result = await expandUrl(shortUrl);
      if (result.success && result.expandedUrl) {
          return result.expandedUrl;
      }
      return shortUrl;
    } catch (e) {
      console.error('Error expanding URL:', e);
      return shortUrl;
    }
  };

  const processUrl = async (inputUrl: string) => {
    setError('');
    setCoords(null);
    setIsLoading(true);

    let finalUrl = inputUrl;

    if (inputUrl.includes('goo.gl') || inputUrl.includes('maps.app.goo.gl') || inputUrl.includes('bit.ly') || inputUrl.includes('maps.apple.com') || inputUrl.includes('maps.apple')) {
      const expanded = await expandShortUrl(inputUrl);
      if (expanded !== inputUrl) {
         finalUrl = expanded;
         if (!expanded.includes('error')) {
             setUrl(finalUrl); 
         }
      }
    }

    performExtraction(finalUrl);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    setSource(detectSource(val));
    if (!val.includes('goo.gl')) {
      performExtraction(val);
    }
  };

  const handleManualFind = () => {
    processUrl(url);
  };

  const providers = getProviderLinks(coords);

  const handleCopy = () => {
    if (coords) {
      const text = `${coords.lat}, ${coords.lng}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-6 px-4 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      
      {/* Theme Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 flex items-center gap-1 p-1 bg-[var(--input-bg)] rounded-full border border-[var(--card-border)] shadow-sm"
      >
        <button 
          onClick={() => setTheme('light')}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === 'light' ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-sm' : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
          )}
        >
          <Sun size={18} />
        </button>
        <button 
          onClick={() => setTheme('system')}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === 'system' ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-sm' : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
          )}
        >
          <Laptop size={18} />
        </button>
        <button 
          onClick={() => setTheme('dark')}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === 'dark' ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-sm' : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
          )}
        >
          <Moon size={18} />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="matte-card w-full max-w-[550px] p-8 md:p-10 z-10 rounded-2xl relative overflow-hidden"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4 mb-4"
          >
            <div className="p-3.5 rounded-2xl bg-linear-to-br from-(--input-bg) to-(--card-bg) text-(--accent) border border-(--card-border) shadow-sm">
              <Globe size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-foreground to-(--secondary) pb-1">
              Nav Bridge
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-(--secondary) text-base font-medium leading-relaxed max-w-[90%] mx-auto"
          >
            Extract precise coordinates from <span className="text-foreground font-semibold">Google Maps</span>. <br className="hidden md:block" />
            Bridge to any provider instantly.
          </motion.p>
        </div>

        <div className="mb-8 relative z-10">
          <div className="matte-input flex items-center gap-3 p-1.5 pl-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 focus-within:ring-2 ring-(--accent)/20">
            <input
              type="text"
              placeholder="Paste Google Maps URL here..."
              value={url}
              onChange={handleInputChange}
              className="flex-1 bg-transparent border-none outline-none text-base text-[var(--foreground)] placeholder:text-[var(--secondary)] font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleManualFind()}
            />
            <AnimatePresence mode="wait">
              {url ? (
                 <motion.button
                  key="clear"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--card-border)] text-[var(--secondary)] hover:text-red-500"
                  onClick={() => { setUrl(''); setCoords(null); setError(''); }}
                  title="Clear"
                >
                  <X size={18} />
                </motion.button>
              ) : (
                <motion.button
                  key="paste"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all text-[var(--accent)] hover:bg-[var(--input-bg)]"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) {
                        setUrl(text);
                        setSource(detectSource(text));
                        if (
                          !text.includes('goo.gl') &&
                          !text.includes('maps.app.goo.gl') &&
                          !text.includes('bit.ly') && 
                          !text.includes('maps.apple')
                        ) {
                          performExtraction(text);
                        } else {
                            processUrl(text);
                        }
                      }
                    } catch (err) {
                      console.error('Failed to read clipboard', err);
                    }
                  }}
                  title="Paste from Clipboard"
                >
                  <ClipboardIcon size={18} />
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-10 px-5 rounded-lg bg-[var(--accent)] text-white font-semibold flex items-center justify-center transition-all shadow-lg shadow-(--accent)/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              onClick={handleManualFind}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Search size={18} />
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {url && source && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-3 ml-2 text-xs font-bold uppercase tracking-wider text-[var(--secondary)] flex items-center gap-1.5 opacity-90"
              >
                <Navigation size={12} /> Source: {source}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-red-500/5 text-red-500 px-4 py-3 rounded-lg mb-8 text-sm font-medium flex items-center justify-center border border-red-500/20">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {coords && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="matte-card p-6 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-[var(--card-border)] bg-(--card-bg)/50 backdrop-blur-sm">
                <div className="flex gap-10 justify-center w-full md:w-auto md:justify-start">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-[var(--secondary)]">Latitude</span>
                    <span className="font-mono text-xl font-semibold text-[var(--foreground)] tracking-tight">{coords.lat}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-[var(--secondary)]">Longitude</span>
                    <span className="font-mono text-xl font-semibold text-[var(--foreground)] tracking-tight">{coords.lng}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full md:w-auto px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all border",
                    copied 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-[var(--input-bg)] text-[var(--foreground)] border-transparent hover:border-[var(--card-border)] hover:bg-[var(--card-border)]'
                  )}
                  onClick={handleCopy}
                  title="Copy Coordinates"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.button>
              </div>

              <div className="w-full">
                <h3 className="text-center text-xs text-[var(--secondary)] uppercase tracking-widest font-bold mb-4 opacity-70">Bridge To Provider</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {providers.map((p, i) => (
                     <motion.a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--input-bg)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--card-bg)] hover:shadow-md transition-all duration-200 cursor-pointer"
                      style={{ '--hover-color': p.color } as React.CSSProperties}
                    >
                      <BrandIcon name={p.name} className="w-6 h-6 mb-3 text-[var(--secondary)] transition-all duration-300 group-hover:text-[var(--hover-color)] group-hover:scale-110" />
                      <span className="text-xs font-semibold text-[var(--foreground)]">{p.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GeoLocationFinder;
