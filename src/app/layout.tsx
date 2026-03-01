import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Art Gallery — Neural Style Transfer Landmark Art",
    template: "%s | AI Art Gallery",
  },
  description:
    "Explore 300 stunning artworks featuring 50 world landmarks transformed through 6 classic art styles using neural style transfer. Available as museum-quality prints.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Art Gallery",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-gallery-bg text-gallery-text`}
      >
        {children}
      </body>
    </html>
  );
}
