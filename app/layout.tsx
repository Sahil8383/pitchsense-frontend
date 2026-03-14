import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans-variable',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PitchSense',
  description: 'AI-powered sales pitch practice and evaluation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
