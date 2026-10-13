import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../src/context/AppContext';

export const metadata: Metadata = {
  title: 'UnMute - Assistive Communication Companion',
  description:
    'An assistive communication companion designed for people who stammer or experience difficulty speaking. Communicate faster, easier, and more independently.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="bg-calm-950 text-calm-100 antialiased min-h-screen selection:bg-brand-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
