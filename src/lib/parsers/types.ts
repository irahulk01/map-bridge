
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapParser {
  name: string;
  canParse(url: string): boolean;
  parse(url: string): Coordinates | null;
}

export interface Provider {
  name: string;
  url: string;
  color: string;
}
