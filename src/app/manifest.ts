import type {MetadataRoute} from 'next';

import {brand} from '@/config/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: brand.name,
    short_name: brand.shortName,
    description: brand.description,
    start_url: '/ja/app',
    scope: '/',
    display: 'standalone',
    background_color: '#f5f1e8',
    theme_color: '#f5f1e8',
    orientation: 'portrait-primary',
    icons: [
      {src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any'},
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {src: '/apple-icon', sizes: '180x180', type: 'image/png'}
    ]
  };
}
