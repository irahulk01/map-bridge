
import { MapParser, Coordinates } from './types';
import queryString from 'query-string';

export const OpenStreetMapParser: MapParser = {
  name: 'OpenStreetMap',
  
  canParse: (url: string) => {
    return url.toLowerCase().includes('openstreetmap.org');
  },

  parse: (url: string): Coordinates | null => {
    try {
      const parsedUrl = queryString.parseUrl(url);

      // mlat & mlon parameters
      if (parsedUrl.query.mlat && parsedUrl.query.mlon) {
        const lat = parseFloat(parsedUrl.query.mlat as string);
        const lng = parseFloat(parsedUrl.query.mlon as string);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }

      // Hash parameters: #map=zoom/lat/lng
      const hash = parsedUrl.url.split('#')[1];
      if (hash && hash.startsWith('map=')) {
        const parts = hash.replace('map=', '').split('/');
        if (parts.length >= 3) {
           const lat = parseFloat(parts[1]);
           const lng = parseFloat(parts[2]);
           if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
      }

      return null;
    } catch {
      return null;
    }
  }
};
