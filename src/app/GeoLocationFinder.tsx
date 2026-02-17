"use client";

import React, { useState, useEffect } from 'react';
import { expandUrl } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Imported modular components
import { Header } from '../components/geo/Header';
import { SearchBar } from '../components/geo/SearchBar';
import { ResultsCard } from '../components/geo/ResultsCard';
import { ProviderGrid } from '../components/geo/ProviderGrid';
import { BackgroundOrbs, SkeletonLoader } from '../components/geo/BackgroundComponents';
import { ParticleExplosion } from '../components/geo/ParticleExplosion';
import { Footer } from '../components/geo/Footer';

import { extractCoordinates, detectSource, getProviderLinks, Coordinates } from '../lib/geo-utils';

const GeoLocationFinder: React.FC = () => {
  const [url, setUrl] = useState('');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Particle Trigger State
  const [triggerParticles, setTriggerParticles] = useState(false);

  useEffect(() => {
    // Force dark mode
    if (typeof window !== 'undefined') {
        document.documentElement.classList.add('dark');
        requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  const performExtraction = (inputUrl: string) => {
    const result = extractCoordinates(inputUrl);
    setCoords(result.coords);
    setError(result.error);
    if (result.coords) {
        setTriggerParticles(true);
        setTimeout(() => setTriggerParticles(false), 2000);
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
    if (!inputUrl) return;
    
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

    if (!finalUrl.includes('goo.gl')) {
         await new Promise(r => setTimeout(r, 600));
    }
    
    performExtraction(finalUrl);
    setIsLoading(false);
  };

  const handleManualFind = () => {
    if (url) processUrl(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setSource(detectSource(text));
        processUrl(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleInputChange = (val: string) => {
    setUrl(val);
    setSource(detectSource(val));
    if (!val) {
        setCoords(null);
        setError('');
        setSource('');
        return;
    }
    // Only auto-extract distinct extended URLs
    if (val.length > 30 && !val.includes('goo.gl') && !val.includes('bit.ly') && !val.includes('maps.apple')) {
        const result = extractCoordinates(val);
        if (result.coords) {
            setCoords(result.coords);
            setError('');
            // Optional: trigger particles on auto-success too
            setTriggerParticles(true);
            setTimeout(() => setTriggerParticles(false), 2000);
        }
    }
  };

  const handleCopy = () => {
    if (coords) {
      const text = `${coords.lat}, ${coords.lng}`; 
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) return null;

  const providers = getProviderLinks(coords);

  return (
    <div className="min-h-screen w-full flex flex-col items-center relative overflow-x-hidden bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <BackgroundOrbs />
      <Header />

      <motion.main 
          layout
          className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl px-4 z-10 py-24 md:py-32 relative"
      >
        <ParticleExplosion trigger={triggerParticles} />

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10 max-w-2xl"
        >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-gray-400">
                Any Map. <br className="md:hidden" /> Any Link. <br/> Instantly.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
                Paste a link from Google Maps, Apple Maps, or Waze to extract precise coordinates.
            </p>
        </motion.div>

        <SearchBar 
            url={url} 
            source={source} 
            isLoading={isLoading} 
            onUrlChange={handleInputChange} 
            onClear={() => { setUrl(''); setCoords(null); setError(''); setSource(''); }}
            onSearch={handleManualFind}
            onPaste={handlePaste}
        />

        <AnimatePresence mode="wait">
            {isLoading && <SkeletonLoader />}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && error && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl text-center font-medium backdrop-blur-sm flex items-center justify-center gap-3">
                 <div className="p-1 bg-red-500/20 rounded-full">
                     <X className="w-4 h-4 text-red-500" />
                 </div>
                 {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isLoading && coords && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
              className="w-full mt-12"
            >
               <div className="w-full mb-8">
                   <ResultsCard coords={coords} copied={copied} onCopy={handleCopy} />
               </div>

               <ProviderGrid providers={providers} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      
      <Footer />
      
    </div>
  );
};

export default GeoLocationFinder;
