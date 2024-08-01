import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Mi Timbre',
  description: 'Comunicate por QR',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
