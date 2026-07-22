import type {ReactNode} from 'react';

import {siteMetadata, siteViewport} from '@/config/site-metadata';

import '../globals.css';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RedirectRootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
