
import { MapParser, Coordinates } from './types';

export const GeoUriParser: MapParser = {
  name: 'Geo URI',
  
  canParse: (url: string) => {
    return url.toLowerCase().startsWith('geo:');
  },

  parse: (url: string): Coordinates | null => {
    try {
      // geo:lat,lng
      // geo:37.781,-122.417?z=10
      const content = url.replace(/^geo:/i, '');
      const [coordsPart] = content.split('?');
      const [latStr, lngStr] = coordsPart.split(',');
      
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }

      return null;
    } catch {
      return null;
    }
  }
};
