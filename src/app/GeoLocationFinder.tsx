"use client";

import React, { useState, useEffect } from 'react';
import { expandUrl } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  MapPin,
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

// SVG Logos for Brand Authenticity
const BrandIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Apple Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.4-1.44 1.1-2.2.93-3.08-.4C5.45 15.25 5.68 7.63 11 7.35c1.4.08 2.53.82 3.35.82.78 0 1.98-.82 3.32-.82 1.34.03 2.6.58 3.38 1.48-2.6 1.43-2.18 5.6.55 6.75-.43 1.13-1.08 2.25-1.95 3.48-.9 1.28-1.83 2.55-2.6 2.22zM12.98 5.25C12.3 2.15 15.65.68 18 .95c.23 2.95-3.15 4.88-5.02 4.3z" />
        </svg>
      );
    case 'Google Earth':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'Google Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      );
    case 'Bing Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M4 3.2v16.1l14.1-3.6v-8.3l-2.1 2.3-3.6-1.5-3.3 1.3v-4.2l-3.3-2.1zm2 3.1l1.5 1v5.1l3.5-1.4 3.6 1.5 2-2.2v6.4l-10.6 2.7V6.3z" />
        </svg>
      );
    case 'OpenStreetMap':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      );
    case 'Waze':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.54 9.17c-.36-.08-1.58-.28-3.08-.28-3.16 0-5.71 2.55-5.71 5.71 0 1.95.96 3.67 2.44 4.74h-4.3l-1.68 1.68v-1.68h-1.4c-1.89 0-3.41-1.52-3.41-3.41 0-1.89 1.52-3.41 3.41-3.41.37 0 .54-.25.54-.53 0-.05-.01-.09-.03-.13-.77-1.39-.46-3.12.75-4.14 1.29-1.07 3.16-1 4.3.16.19.19.49.21.71.04.81-.62 1.83-.98 2.87-1 .15 0 .28.05.35.13.08.08.09.21.04.31-.22.46-.5 1.13-.8 1.81zm-2.04 7.43c-1.16 0-2.1-.94-2.1-2.1s.94-2.1 2.1-2.1 2.1.94 2.1 2.1-.94 2.1-2.1 2.1z" />
        </svg>
      );
    default:
      return <MapPin className={className} />;
  }
};

interface Coordinates {
  lat: number;
  lng: number;
}

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check local storage or system pref
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Extract Logic
  const extractCoordinates = (inputUrl: string) => {
    try {
      if (!inputUrl) {
        setCoords(null);
        setError('');
        return;
      }

      const atMatch = inputUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        setCoords({
          lat: parseFloat(atMatch[1]),
          lng: parseFloat(atMatch[2]),
        });
        setError('');
        return;
      }

      const latMatch = inputUrl.match(/!3d(-?\d+\.\d+)/);
      const lngMatch = inputUrl.match(/!4d(-?\d+\.\d+)/);

      if (latMatch && lngMatch) {
        setCoords({
          lat: parseFloat(latMatch[1]),
          lng: parseFloat(lngMatch[1]),
        });
        setError('');
        return;
      }

      const qMatch = inputUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        setCoords({
          lat: parseFloat(qMatch[1]),
          lng: parseFloat(qMatch[2]),
        });
        setError('');
        return;
      }

      const centerMatch = inputUrl.match(/[?&]center=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/);
      if (centerMatch) {
         setCoords({
          lat: parseFloat(centerMatch[1]),
          lng: parseFloat(centerMatch[2]),
        });
        setError('');
        return;
      }

      setError(
        'Could not extract coordinates. Please ensure it is a valid Google Maps URL.'
      );
      setCoords(null);
    } catch {
      setError('Invalid URL format.');
      setCoords(null);
    }
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

    if (inputUrl.includes('goo.gl') || inputUrl.includes('maps.app.goo.gl') || inputUrl.includes('bit.ly')) {
      const expanded = await expandShortUrl(inputUrl);
      if (expanded !== inputUrl) {
         finalUrl = expanded;
         if (!expanded.includes('error')) {
             setUrl(finalUrl); 
         }
      }
    }

    extractCoordinates(finalUrl);
    setIsLoading(false);
  };

  const detectSource = (inputUrl: string) => {
    if (!inputUrl) return '';
    const lower = inputUrl.toLowerCase();

    if ((lower.includes('google') && lower.includes('/maps')) || lower.includes('goo.gl')) return 'Google Maps';
    if (lower.includes('maps.apple.com')) return 'Apple Maps';
    if (lower.includes('openstreetmap.org')) return 'OpenStreetMap';
    if (lower.includes('bing.com/maps')) return 'Bing Maps';
    if (lower.includes('yandex.com/maps')) return 'Yandex Maps';
    if (lower.includes('wego.here.com')) return 'Here WeGo';
    if (lower.includes('waze.com')) return 'Waze';

    try {
      new URL(inputUrl);
      return 'Unknown Source';
    } catch {
      return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    setSource(detectSource(val));
    if (!val.includes('goo.gl')) {
      extractCoordinates(val);
    }
  };

  const handleManualFind = () => {
    processUrl(url);
  };

  const providers = [
    {
       name: 'Apple Maps',
       url: `http://maps.apple.com/?ll=${coords?.lat},${coords?.lng}&z=16`,
       color: '#000000',
    },
    {
       name: 'Google Earth',
       url: `https://earth.google.com/web/@${coords?.lat},${coords?.lng},100a,35y,0h,0t,0r`,
       color: '#1a73e8',
    },
    {
       name: 'Google Maps',
       url: `https://www.google.com/maps/search/?api=1&query=${coords?.lat},${coords?.lng}`,
       color: '#34a853',
    },
    {
       name: 'Waze',
       url: `https://waze.com/ul?ll=${coords?.lat},${coords?.lng}&navigate=yes`,
       color: '#33ccff',
    },
    {
       name: 'OpenStreetMap',
       url: `https://www.openstreetmap.org/?mlat=${coords?.lat}&mlon=${coords?.lng}#map=16/${coords?.lat}/${coords?.lng}`,
       color: '#7ad07a',
    },
    {
       name: 'Bing Maps',
       url: `https://www.bing.com/maps?cp=${coords?.lat}~${coords?.lng}&lvl=16`,
       color: '#008374',
    },
    {
       name: 'Yandex Maps',
       url: `https://yandex.com/maps/?ll=${coords?.lng},${coords?.lat}&z=16`,
       color: '#fc3f1d',
    },
    {
       name: 'Here WeGo',
       url: `https://wego.here.com/?map=${coords?.lat},${coords?.lng},16,normal`,
       color: '#00afaa',
    }
  ];

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
                          !text.includes('maps.app.goo.gl')
                        ) {
                          extractCoordinates(text);
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
