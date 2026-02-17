
import { MapParser } from './types';
import { GoogleMapsParser } from './google-maps';
import { AppleMapsParser } from './apple-maps';
import { BingMapsParser } from './bing-maps';
import { WazeParser } from './waze';
import { GoogleEarthParser } from './google-earth';
import { OpenStreetMapParser } from './open-street-map';
import { GeoUriParser } from './geo-uri';

export const parsers: MapParser[] = [
  GoogleMapsParser,
  AppleMapsParser,
  BingMapsParser,
  WazeParser,
  GoogleEarthParser,
  OpenStreetMapParser,
  GeoUriParser
];
