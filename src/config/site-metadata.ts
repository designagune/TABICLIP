import type {Metadata, Viewport} from 'next';

import {brand} from '@/config/brand';

export const siteMetadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s - ${brand.name}`
  },
  description: brand.description,
  applicationName: brand.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: brand.shortName
  },
  formatDetection: {telephone: false}
};

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5f1e8',
  colorScheme: 'light'
};
