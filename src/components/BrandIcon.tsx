
import React from 'react';
import { MapPin } from 'lucide-react';

interface BrandIconProps {
  name: string;
  className?: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ name, className }) => {
  switch (name) {
    case 'Apple Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.4-1.44 1.1-2.2.93-3.08-.4C5.45 15.25 5.68 7.63 11 7.35c1.4.08 2.53.82 3.35.82.78 0 1.98-.82 3.32-.82 1.34.03 2.6.58 3.38 1.48-2.6 1.43-2.18 5.6.55 6.75-.43 1.13-1.08 2.25-1.95 3.48-.9 1.28-1.83 2.55-2.6 2.22zM12.98 5.25C12.3 2.15 15.65.68 18 .95c.23 2.95-3.15 4.88-5.02 4.3z" />
        </svg>
      );
    case 'Google Earth':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'Google Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      );
    case 'Bing Maps':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M4 3.2v16.1l14.1-3.6v-8.3l-2.1 2.3-3.6-1.5-3.3 1.3v-4.2l-3.3-2.1zm2 3.1l1.5 1v5.1l3.5-1.4 3.6 1.5 2-2.2v6.4l-10.6 2.7V6.3z" />
        </svg>
      );
    case 'OpenStreetMap':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      );
    case 'Waze':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.54 9.17c-.36-.08-1.58-.28-3.08-.28-3.16 0-5.71 2.55-5.71 5.71 0 1.95.96 3.67 2.44 4.74h-4.3l-1.68 1.68v-1.68h-1.4c-1.89 0-3.41-1.52-3.41-3.41 0-1.89 1.52-3.41 3.41-3.41.37 0 .54-.25.54-.53 0-.05-.01-.09-.03-.13-.77-1.39-.46-3.12.75-4.14 1.29-1.07 3.16-1 4.3.16.19.19.49.21.71.04.81-.62 1.83-.98 2.87-1 .15 0 .28.05.35.13.08.08.09.21.04.31-.22.46-.5 1.13-.8 1.81zm-2.04 7.43c-1.16 0-2.1-.94-2.1-2.1s.94-2.1 2.1-2.1 2.1.94 2.1 2.1-.94 2.1-2.1 2.1z" />
        </svg>
      );
    default:
      return <MapPin className={className} />;
  }
};
