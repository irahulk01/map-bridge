
import { MapParser, Coordinates } from './types';
import queryString from 'query-string';

export const BingMapsParser: MapParser = {
  name: 'Bing Maps',
  
  canParse: (url: string) => {
    return url.toLowerCase().includes('bing.com/maps');
  },

  parse: (url: string): Coordinates | null => {
    try {
      const parsedUrl = queryString.parseUrl(url);

      // cp parameter: cp=lat~lng
      if (parsedUrl.query.cp) {
        const cp = parsedUrl.query.cp as string;
        const [lat, lng] = cp.split('~').map(parseFloat);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
      
      // sp parameter: point.lat_lng_Name
      if (parsedUrl.query.sp) {
          const sp = parsedUrl.query.sp as string;
          // output format often point.lat_lng_name
          const parts = sp.split('_');
          if (parts.length >= 2) {
             const latPart = parts[0].replace('point.', '');
             const lat = parseFloat(latPart);
             const lng = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
          }
      }

      return null;
    } catch {
      return null;
    }
  }
};

