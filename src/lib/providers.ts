export const providers = [
  {
     name: 'Apple Maps',
     // Apple Maps link format
     url: (lat: number, lng: number) => `http://maps.apple.com/?ll=${lat},${lng}&z=16`,
     color: '#000000', // Apple Black
  },
  {
     name: 'Google Earth',
     // Google Earth link format
     url: (lat: number, lng: number) => `https://earth.google.com/web/@${lat},${lng},100a,35y,0h,0t,0r`,
     color: '#1a73e8', // Google Blue
  },
  {
     name: 'Google Maps',
     // Google Maps search query
     url: (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
     color: '#34a853', // Google Green
  },
  {
     name: 'Waze',
     // Waze navigation link
     url: (lat: number, lng: number) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
     color: '#33ccff', // Waze Blue
  },
  {
     name: 'OpenStreetMap',
     // OSM link format
     url: (lat: number, lng: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
     color: '#7ad07a', // OSM Greenish
  },
  {
     name: 'Bing Maps',
     // Bing Maps link format
     url: (lat: number, lng: number) => `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=16`,
     color: '#008374', // Bing Teal
  },
  {
     name: 'Yandex Maps',
     // Yandex Maps link format
     url: (lat: number, lng: number) => `https://yandex.com/maps/?ll=${lng},${lat}&z=16`,
     color: '#fc3f1d', // Yandex Red
  },
  {
     name: 'Here WeGo',
     // Here WeGo link format
     url: (lat: number, lng: number) => `https://wego.here.com/?map=${lat},${lng},16,normal`,
     color: '#00afaa', // Here Teal
  }
];
