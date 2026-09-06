import './globals.css';
import styles from './layout.module.css';
import StoreProvider from '@/store/Provider';
import type { Metadata, Viewport } from 'next';
import { themeScript } from '@/store/slices/utils';
import { ChildrenProps } from '@/store/slices/interface';
import Header from '@/components/composite/header/Header';
import Sidebar from '@/components/composite/sidebar/Sidebar';

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
          <div className={styles.wrapper}>
            <Sidebar />
            <div className={styles.container}>
              <Header />
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
};