import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AuraSync",
  description: "Медитации и дневник эмоций",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        <TelegramProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
