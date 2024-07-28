import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ourFileRouter } from './api/uploadthing/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StyleStride - Find Your Perfect Shoe Match',
  description: `StyleStride is your ultimate shoe destination.
 Discover a curated selection of footwear to complement every outfit and occasion. With our easy-to-use platform, you can find the perfect pair in just a few clicks. Explore trendy styles, classic designs, and top brands. Step up your shoe game with StyleStride.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  );
}
