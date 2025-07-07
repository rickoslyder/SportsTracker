import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '../components/layout/header';
import { FooterEnhanced } from '../components/layout/footer-enhanced';
import { ScrollToTop } from '../components/common/scroll-to-top';
import { AnnouncementBanner } from '../components/common/announcement-banner';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sports Event Tracker',
  description: 'Track your favorite sports events across F1, MotoGP, UFC, and more',
  keywords: ['sports', 'events', 'F1', 'Formula 1', 'MotoGP', 'UFC', 'football', 'racing'],
  authors: [{ name: 'Sports Event Tracker Team' }],
  creator: 'Sports Event Tracker',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Sports Event Tracker',
    description: 'Track your favorite sports events across F1, MotoGP, UFC, and more',
    siteName: 'Sports Event Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Event Tracker',
    description: 'Track your favorite sports events across F1, MotoGP, UFC, and more',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AnnouncementBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <FooterEnhanced />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}