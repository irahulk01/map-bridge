
import { MapParser, Coordinates } from './types';
import coordinateParser from 'coordinate-parser';
import queryString from 'query-string';

export const GoogleMapsParser: MapParser = {
  name: 'Google Maps',
  
  canParse: (url: string) => {
    const lower = url.toLowerCase();
    return lower.includes('google.com/maps') || lower.includes('goo.gl') || lower.includes('maps.app.goo.gl');
  },

  parse: (url: string): Coordinates | null => {
    try {
      // 1. Direct Search with coordinates: /search/lat,lng
      const searchMatch = url.match(/\/search\/(-?\d+\.\d+)[,%2C\s+]+(-?\d+\.\d+)/);
      if (searchMatch) {
        return {
          lat: parseFloat(searchMatch[1]),
          lng: parseFloat(searchMatch[2])
        };
      }

      // 2. Center param: center=lat,lng
      const parsedUrl = queryString.parseUrl(url);
      if (parsedUrl.query.center) {
        const center = parsedUrl.query.center as string;
        const [lat, lng] = center.split(',').map(parseFloat);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
      
      // 3. Query param: q=lat,lng
      if (parsedUrl.query.q) {
        const q = parsedUrl.query.q as string;
        // Check if q looks like coordinates
        if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(q)) {
             const [lat, lng] = q.split(',').map(parseFloat);
             if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
      }

      // 4. @lat,lng param (common in URL path)
      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
         return {
          lat: parseFloat(atMatch[1]),
          lng: parseFloat(atMatch[2])
        };
      }

      // 5. !3dlat!4dlng (data param style)
      const latMatch = url.match(/!3d(-?\d+\.\d+)/);
      const lngMatch = url.match(/!4d(-?\d+\.\d+)/);
      if (latMatch && lngMatch) {
        return {
          lat: parseFloat(latMatch[1]),
          lng: parseFloat(lngMatch[1])
        };
      }
      
      // 6. Provide ability to parse raw coordinates in q param even if not strictly formatted
      // e.g. q=22.5, 88.5
      if (parsedUrl.query.q) {
         try {
             const position = new coordinateParser(parsedUrl.query.q as string);
             return {
                 lat: position.getLatitude(),
                 lng: position.getLongitude()
             }
         } catch {
             // ignore
         }
      }

      return null;
    } catch {
      return null;
    }
  }
};
