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

export const metadata: Metadata = {
  title: "ZAYFINDS",
  description: "Curated rep fashion finds — no gatekeeping",
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
