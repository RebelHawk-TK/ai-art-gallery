"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ArtworkEntry } from "@/types/artwork";

interface HeroSectionProps {
  basePath: string;
  artwork: ArtworkEntry | null;
}

export function HeroSection({ basePath, artwork }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      {artwork && (
        <div className="absolute inset-0">
          <img
            src={`${basePath}${artwork.images.full || artwork.images.medium}`}
            alt="Gallery hero background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gallery-bg/70 via-gallery-bg/50 to-gallery-bg" />
        </div>
      )}

      {/* Fallback gradient when no artwork */}
      {!artwork && (
        <div className="absolute inset-0 bg-gradient-to-br from-gallery-bg via-gallery-surface to-gallery-bg" />
      )}

      {/* Content */}
      <div
        className={`relative z-10 mx-auto max-w-4xl px-4 text-center transition-all duration-1000 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <h1 className="font-heading text-5xl font-bold leading-tight text-gallery-text sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-gallery-gradient-from to-gallery-gradient-to bg-clip-text text-transparent">
            AI Art Gallery
          </span>
        </h1>
        <p className="mt-6 text-xl text-gallery-muted sm:text-2xl">
          50 Landmarks. 6 Art Styles. 300 Masterpieces.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-gallery-muted">
          World-famous landmarks reimagined through neural style transfer,
          blending photography with the brushstrokes of master painters.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`${basePath}/gallery`}
            className="inline-flex items-center gap-2 rounded-lg bg-gallery-accent px-8 py-4 text-sm font-bold text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover hover:shadow-lg hover:shadow-gallery-accent/25"
          >
            Explore Gallery
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href={`${basePath}/explore`}
            className="inline-flex items-center gap-2 rounded-lg border border-gallery-border px-8 py-4 text-sm font-semibold text-gallery-text transition-all duration-300 hover:border-gallery-accent/50 hover:text-gallery-accent"
          >
            View World Map
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-gallery-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
}
