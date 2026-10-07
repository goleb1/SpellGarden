import "./globals.css";
import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Karla } from 'next/font/google';
import { AuthProvider } from "@/lib/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  // The "DEV" suffix only ever shows in a local dev browser tab, not in the app itself.
  title: process.env.NODE_ENV === 'development' ? 'SpellGarden (DEV)' : 'SpellGarden',
  description: 'A word puzzle game where you find words and watch your vocabulary grow!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${karla.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
