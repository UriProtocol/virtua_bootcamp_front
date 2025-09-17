'use client'
import localFont from "next/font/local";
import { NextUIProvider } from '@nextui-org/react';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es-MX">
      <body>
        <header>
          <title>Virtua project template</title>
        </header>
        <main>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </main>
      </body>
    </html>
  );
}
