
import { parsers } from './parsers';
import { Coordinates, Provider } from './parsers/types';
export type { Coordinates, Provider } from './parsers/types';

export const extractCoordinates = (inputUrl: string): { coords: Coordinates | null; error: string } => {
  try {
    if (!inputUrl) {
      return { coords: null, error: '' };
    }

    const trimmed = inputUrl.trim();

    // 0. Check for raw coordinates first (e.g., "22.7009146, 88.3412271")
    const rawMatch = trimmed.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
    if (rawMatch) {
      return {
        coords: {
          lat: parseFloat(rawMatch[1]),
          lng: parseFloat(rawMatch[2]),
        },
        error: '',
      };
    }

    // 1. Iterate through parsers
    for (const parser of parsers) {
      if (parser.canParse(trimmed)) {
        const coords = parser.parse(trimmed);
        if (coords) {
          return { coords, error: '' };
        }
      }
    }

    // 2. Fallback: Generic regex if no specific parser matched (optional, but good for safety)
    // Matches generic @lat,lng pattern found in many map URLs
    const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
       return {
        coords: {
          lat: parseFloat(atMatch[1]),
          lng: parseFloat(atMatch[2]),
        },
        error: '',
      };
    }

    return {
      coords: null,
      error: 'Could not extract coordinates. Please ensure it is a valid map URL or Coordinate pair.',
    };
  } catch {
    return { coords: null, error: 'Invalid URL format.' };
  }
};

export const detectSource = (inputUrl: string): string => {
  if (!inputUrl) return '';
  const trimmed = inputUrl.trim();
  
  // Check for raw coordinates
  if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(trimmed)) return 'Raw Coordinates';

  for (const parser of parsers) {
    if (parser.canParse(trimmed)) {
      return parser.name;
    }
  }

  try {
    new URL(inputUrl);
    return 'Unknown Source';
  } catch {
    return '';
  }
};

export const getProviderLinks = (coords: Coordinates | null): Provider[] => {
  if (!coords) return [];
  
  return [
    {
       name: 'Apple Maps',
       url: `http://maps.apple.com/?ll=${coords.lat},${coords.lng}&q=${coords.lat},${coords.lng}&z=16`,
       color: '#000000',
    },
    {
       name: 'Google Earth',
       url: `https://earth.google.com/web/search/${coords.lat},${coords.lng}`,
       color: '#1a73e8',
    },
    {
       name: 'Google Maps',
       url: `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`,
       color: '#34a853',
    },
    {
       name: 'Waze',
       url: `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`,
       color: '#33ccff',
    },
    {
       name: 'OpenStreetMap',
       url: `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`,
       color: '#7ad07a',
    },
    {
       name: 'Bing Maps',
       url: `https://www.bing.com/maps?cp=${coords.lat}~${coords.lng}&lvl=16&sp=point.${coords.lat}_${coords.lng}_Pin`,
       color: '#008374',
    },
    {
       name: 'Yandex Maps',
       url: `https://yandex.com/maps/?pt=${coords.lng},${coords.lat}&z=16&l=map`,
       color: '#fc3f1d',
    },
    {
       name: 'Here WeGo',
       url: `https://wego.here.com/search/${coords.lat},${coords.lng}`,
       color: '#00afaa',
    }
  ];
};
