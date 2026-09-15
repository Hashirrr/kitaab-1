import './globals.css';
import AppLayout from './AppLayout';
import StoreProvider from '@/store/Provider';
import type { Metadata, Viewport } from 'next';
import { themeScript } from '@/store/slices/utils';
import { ChildrenProps } from '@/store/slices/interface';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#3c3c3c' },
    { media: '(prefers-color-scheme: light)', color: '#f0f0f0' }
  ],
};

export const metadata: Metadata = {
  title: 'Kitaab',
  description: 'Track your deeds, reflect, grow, and improve every day — with Kitaab.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Kitaab',
    description: 'Track your deeds, reflect, grow, and improve every day — with Kitaab.',
    url: 'https://www.kitaab.me',
    siteName: 'Kitaab',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Kitaab Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Kitaab',
    description: 'Track your deeds, reflect, grow, and improve every day — with Kitaab.',
    images: ['/icons/icon-512x512.png']
  },
};

export default function RootLayout({ children }: Readonly<ChildrenProps>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreProvider>
          <AppLayout>{children}</AppLayout>
        </StoreProvider>
      </body>
    </html>
  );
};