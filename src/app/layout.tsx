import "./globals.css";
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: process.env.NODE_ENV === 'development' ? 'SpellGarden (🤖 DEV)' : 'SpellGarden',
  description: 'A word puzzle game where you find words and watch your vocabulary grow!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
