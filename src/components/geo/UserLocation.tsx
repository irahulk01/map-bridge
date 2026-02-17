import React, { useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserLocationProps {
  onLocationFound: (coords: string) => void;
}

export const UserLocation: React.FC<UserLocationProps> = ({ onLocationFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    setActive(true);

    if (!navigator.geolocation) {
      setError('Not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordsString = `${latitude.toFixed(7)}, ${longitude.toFixed(7)}`;
        onLocationFound(coordsString);
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === 1) {
            setError('Permission denied');
        } else if (err.code === 2) {
            setError('Position unavailable');
        } else {
            setError('Error locating');
        }
        setLoading(false);
        setTimeout(() => {
            setActive(false);
            setError(null);
        }, 3000);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleGetLocation}
      disabled={loading}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full 
        backdrop-blur-md border transition-all duration-300
        ${active 
            ? error 
                ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
          </motion.div>
        ) : error ? (
           <motion.div
            key="error"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <MapPin className="w-3 h-3" />
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Navigation className={`w-3 h-3 ${active ? 'fill-current' : ''}`} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="text-xs font-medium tracking-wide">
        {loading ? 'Locating...' : error ? error : 'Use my location'}
      </span>
    </motion.button>
  );
};
