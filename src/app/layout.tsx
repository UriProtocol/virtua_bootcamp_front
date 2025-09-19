'use client'
import { NextUIProvider } from '@nextui-org/react';
import "./globals.css";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es-MX">
      <body>
        <header>
          <title>Bootcamp</title>
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
