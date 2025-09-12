import "./figma.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "./_features/ReduxProvider";
import Body from "./body";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UHD ACM",
  description: "Home page of UHD ACM",
  icons: {
    icon: 'favicon_io/favicon-32x32.png',
    shortcut: 'favicon_io/favicon-32x32.png',
    apple: 'favicon_io/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="favicon_io/site.webmanifest" />
      <ReduxProvider>
        <Analytics />
        <Body className={`${inter.variable} antialiased`}>
          {children}
        </Body>
      </ReduxProvider>
    </html>
  );
}
