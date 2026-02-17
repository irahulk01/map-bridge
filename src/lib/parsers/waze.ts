
import { MapParser, Coordinates } from './types';
import queryString from 'query-string';

export const WazeParser: MapParser = {
  name: 'Waze',
  
  canParse: (url: string) => {
    return url.toLowerCase().includes('waze.com');
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
      
      return null;
    } catch {
      return null;
    }
  }
};
