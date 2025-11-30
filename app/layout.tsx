/**
 * Root Layout for zayfinds
 *
 * Defines the HTML structure, fonts, and metadata for the entire application.
 *
 * Typography System:
 * - Display font (Syne): Used for headings, logo, section titles
 * - Body font (Geist): Used for body text, buttons, descriptions
 * - Mono font (Geist Mono): Used for code, IDs, technical text
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import "./globals.css";

/**
 * Display Font: Syne
 * A modern, geometric display typeface with character.
 * Used for: Logo, hero headings, section titles.
 */
const syneDisplay = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Body Font: Geist Sans
 * Clean, neutral sans-serif for readability.
 * Used for: Body text, descriptions, product names, prices.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Mono Font: Geist Mono
 * Monospace for technical/code elements.
 * Used for: Product IDs, prices, technical metadata.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Site Metadata
 *
 * Includes Open Graph and Twitter Card tags for rich link previews
 * on social media platforms (Twitter, Facebook, Discord, LinkedIn, etc.)
 */
export const metadata: Metadata = {
  // Base URL for resolving relative image paths
  metadataBase: new URL("https://zayfinds.com"),

  // Basic metadata
  title: {
    default: "ZAYFINDS",
    template: "%s | ZAYFINDS",
  },
  description:
    "Curated rep fashion finds — no gatekeeping. Browse hand-picked pieces and tap through to buy directly from trusted sellers.",
  keywords: [
    "rep fashion",
    "replica",
    "fashion finds",
    "curated",
    "streetwear",
    "designer",
    "affordable fashion",
  ],
  authors: [{ name: "ZAYFINDS" }],
  creator: "ZAYFINDS",

  // Open Graph metadata (Facebook, LinkedIn, Discord, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zayfinds.com",
    siteName: "ZAYFINDS",
    title: "ZAYFINDS — Curated Rep Fashion Finds",
    description:
      "We do not gatekeep over here. Browse hand-picked rep fashion pieces and tap through to buy directly from trusted sellers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZAYFINDS — Curated Rep Fashion Finds",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "ZAYFINDS — Curated Rep Fashion Finds",
    description:
      "We do not gatekeep over here. Browse hand-picked rep fashion pieces and tap through to buy directly from trusted sellers.",
    images: ["/og-image.png"],
    creator: "@zayfinds",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${syneDisplay.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-surface-base
          text-text-primary
        `}
      >
        {children}
      </body>
    </html>
  );
}
