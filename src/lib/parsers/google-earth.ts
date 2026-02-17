
import { MapParser, Coordinates } from './types';

export const GoogleEarthParser: MapParser = {
  name: 'Google Earth',
  
  canParse: (url: string) => {
    return url.toLowerCase().includes('earth.google.com');
  },

  parse: (url: string): Coordinates | null => {
    try {
      // Format: /@lat,lng,alt,....
      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
         return {
          lat: parseFloat(atMatch[1]),
          lng: parseFloat(atMatch[2])
        };
      }
      
      // Format: /search/lat,lng
       const searchMatch = url.match(/\/search\/(-?\d+\.\d+)[,%2C\s+]+(-?\d+\.\d+)/);
      if (searchMatch) {
        return {
          lat: parseFloat(searchMatch[1]),
          lng: parseFloat(searchMatch[2])
        };
      }

      return null;
    } catch {
      return null;
    }
  }
};
