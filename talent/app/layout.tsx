import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600", "700"],
});
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talent.eevolvv.com"),
  title: "eevolvv/talent — Skilled work, placed right",
  description:
    "We match talent to scope. No feed. No résumé wall. One name when the fit is real.",
  openGraph: {
    title: "eevolvv/talent — Skilled work, placed right",
    description:
      "We match talent to scope. No feed. No résumé wall. One name when the fit is real.",
    url: "https://talent.eevolvv.com",
    siteName: "eevolvv/talent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
