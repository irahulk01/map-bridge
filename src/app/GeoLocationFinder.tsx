"use client";

import React, { useState } from 'react';
import { expandUrl } from './actions';
import {
  MapPin,
  Copy,
  ExternalLink,
  Check,
  Globe,
  Search,
  Navigation,
  Clipboard as ClipboardIcon,
  X,
} from 'lucide-react';
import './GeoLocationFinder.css';

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

  // Extract Logic
  const extractCoordinates = (inputUrl: string) => {
    try {
      if (!inputUrl) {
        setCoords(null);
        setError('');
        return;
      }

      // Check for !3d and !4d pattern (marker)
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

      // Check for @lat,lng pattern
      const atMatch = inputUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        setCoords({
          lat: parseFloat(atMatch[1]),
          lng: parseFloat(atMatch[2]),
        });
        setError('');
        return;
      }

      // Check for ?q=lat,lng pattern
      const qMatch = inputUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        setCoords({
          lat: parseFloat(qMatch[1]),
          lng: parseFloat(qMatch[2]),
        });
        setError('');
        return;
      }

      // Check for center=lat,lng pattern
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

  // Providers List with Custom Branding
  const providers = [
    {
       name: 'Apple Maps',
       url: `http://maps.apple.com/?ll=${coords?.lat},${coords?.lng}&z=16`,
       color: '#000000', // Apple Black
    },
    {
       name: 'Google Earth',
       url: `https://earth.google.com/web/@${coords?.lat},${coords?.lng},100a,35y,0h,0t,0r`,
       color: '#1a73e8', // Google Blue
    },
    {
       name: 'Google Maps',
       url: `https://www.google.com/maps/search/?api=1&query=${coords?.lat},${coords?.lng}`,
       color: '#34a853', // Google Green
    },
    {
       name: 'Waze',
       url: `https://waze.com/ul?ll=${coords?.lat},${coords?.lng}&navigate=yes`,
       color: '#33ccff', // Waze Blue
    },
    {
       name: 'OpenStreetMap',
       url: `https://www.openstreetmap.org/?mlat=${coords?.lat}&mlon=${coords?.lng}#map=16/${coords?.lat}/${coords?.lng}`,
       color: '#7ad07a', // OSM Greenish
    },
    {
       name: 'Bing Maps',
       url: `https://www.bing.com/maps?cp=${coords?.lat}~${coords?.lng}&lvl=16`,
       color: '#008374', // Bing Teal
    },
    {
       name: 'Yandex Maps',
       url: `https://yandex.com/maps/?ll=${coords?.lng},${coords?.lat}&z=16`,
       color: '#fc3f1d', // Yandex Red
    },
    {
       name: 'Here WeGo',
       url: `https://wego.here.com/?map=${coords?.lat},${coords?.lng},16,normal`,
       color: '#00afaa', // Here Teal
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

  return (
    <div className="finder-container">
      <div className="finder-card">
        <div className="finder-header">
          <div className="logo-section">
            <div className="icon-wrapper">
              <Globe size={32} />
            </div>
            <h1>Nav Bridge</h1>
          </div>
          <p className="subtitle">
            Extract precise coordinates from Google Maps links and bridge to any
            provider.
          </p>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Paste Google Maps URL here..."
              value={url}
              onChange={handleInputChange}
              className="url-input"
              onKeyDown={(e) => e.key === 'Enter' && handleManualFind()}
            />
            {url ? (
               <button
                className="action-btn clear"
                onClick={() => {
                  setUrl('');
                  setCoords(null);
                  setError('');
                }}
                title="Clear"
              >
                <X size={20} />
              </button>
            ) : (
              <button
                className="action-btn paste"
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
                          // If it is a short URL, trigger process
                          processUrl(text);
                      }
                    }
                  } catch (err) {
                    console.error('Failed to read clipboard', err);
                  }
                }}
                title="Paste from Clipboard"
              >
                <ClipboardIcon size={20} />
              </button>
            )}
            <button
              className="find-btn"
              onClick={handleManualFind}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
          {url && source && (
            <div className="url-source">
              <Navigation size={14} /> Source: {source}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {coords && (
          <div className="result-section">
            <div className="coordinates-card">
              <div className="coord-row">
                <div className="coord-item">
                  <span className="label">Latitude</span>
                  <span className="value">{coords.lat}</span>
                </div>
                <div className="coord-item">
                  <span className="label">Longitude</span>
                  <span className="value">{coords.lng}</span>
                </div>
              </div>
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Copy Coordinates"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="providers-section">
              <h3>Bridge To</h3>
              <div className="providers-grid">
                {providers.map((p) => (
                   <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="provider-link"
                    style={{ '--hover-color': p.color } as React.CSSProperties}
                  >
                    <BrandIcon name={p.name} className="w-6 h-6 mb-1" />
                    <span>{p.name}</span>
                    <ExternalLink size={12} className="ml-1 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoLocationFinder;
