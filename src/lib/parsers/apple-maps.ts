
import { MapParser, Coordinates } from './types';
import coordinateParser from 'coordinate-parser';
import queryString from 'query-string';

export const AppleMapsParser: MapParser = {
  name: 'Apple Maps',
  
  canParse: (url: string) => {
    const lower = url.toLowerCase();
    return lower.includes('maps.apple.com') || lower.includes('maps.apple');
  },

  parse: (url: string): Coordinates | null => {
    try {
      const parsedUrl = queryString.parseUrl(url);
      
      // ll parameter: ll=lat,lng
      if (parsedUrl.query.ll) {
        const ll = parsedUrl.query.ll as string;
        const [lat, lng] = ll.split(',').map(parseFloat);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }

      // q parameter fallback if it contains coordinates
      if (parsedUrl.query.q) {
         try {
             // Try to parse q as coordinates
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
