import type { Metadata, Viewport } from 'next';
import { Orbitron, Press_Start_2P } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

const pressStart = Press_Start_2P({
  variable: '--font-press-start',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00f0ff',
};

export const metadata: Metadata = {
  title: 'ROADSTER RUSH — A Cinematic 3D Flappy Car Adventure',
  description:
    'Take control of the futuristic electric Tesla Roadster. Boost through cyber neon city skylines, dodge laser energy gates, collect plasma orbs, and survive in this high-octane retro arcade flappy game.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ROADSTER RUSH — Cinematic 3D Flappy Car Adventure',
    description: 'Fly the Tesla Roadster with SpaceX cold gas thrusters through a cyberpunk neon gauntlet!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${pressStart.variable} h-full`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="h-full w-full overflow-hidden bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
