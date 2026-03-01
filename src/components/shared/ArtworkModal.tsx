"use client";

import { useEffect, useCallback, useMemo } from "react";
import { cn, getBasePath, slugToTitle } from "@/lib/utils";
import type { ArtworkEntry } from "@/types/artwork";
import OptimizedImage from "@/components/shared/OptimizedImage";
import BeforeAfter from "@/components/shared/BeforeAfter";
import BuyButton from "@/components/shared/BuyButton";

interface ArtworkModalProps {
  artwork: ArtworkEntry | null;
  allArtworks: ArtworkEntry[];
  onClose: () => void;
}

export default function ArtworkModal({
  artwork,
  allArtworks,
  onClose,
}: ArtworkModalProps) {
  const basePath = getBasePath();

  // Find index and adjacent artworks for navigation
  const currentIndex = useMemo(() => {
    if (!artwork) return -1;
    return allArtworks.findIndex((a) => a.id === artwork.id);
  }, [artwork, allArtworks]);

  const prevArtwork = currentIndex > 0 ? allArtworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex < allArtworks.length - 1
      ? allArtworks[currentIndex + 1]
      : null;

  // Body scroll lock
  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [artwork]);

  // Navigate to a specific artwork by emitting a custom state change
  const navigateTo = useCallback(
    (target: ArtworkEntry | null) => {
      if (!target) return;
      // We trigger a re-render by calling onClose conceptually, but instead
      // we mutate the artwork reference via a custom event
      const event = new CustomEvent("artwork-modal-navigate", {
        detail: target,
      });
      window.dispatchEvent(event);
    },
    []
  );

  // Keyboard handling
  useEffect(() => {
    if (!artwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && prevArtwork) {
        navigateTo(prevArtwork);
      } else if (e.key === "ArrowRight" && nextArtwork) {
        navigateTo(nextArtwork);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [artwork, onClose, prevArtwork, nextArtwork, navigateTo]);

  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gallery-bg/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gallery-surface/80 text-gallery-muted transition-all duration-300 hover:bg-gallery-surface hover:text-gallery-text"
        aria-label="Close modal"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Prev arrow */}
      {prevArtwork && (
        <button
          type="button"
          onClick={() => navigateTo(prevArtwork)}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gallery-surface/80 text-gallery-muted transition-all duration-300 hover:bg-gallery-surface hover:text-gallery-text"
          aria-label="Previous artwork"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {nextArtwork && (
        <button
          type="button"
          onClick={() => navigateTo(nextArtwork)}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gallery-surface/80 text-gallery-muted transition-all duration-300 hover:bg-gallery-surface hover:text-gallery-text"
          aria-label="Next artwork"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-gallery-surface p-6 shadow-2xl sm:p-8">
        {/* Before/After slider */}
        <BeforeAfter
          before={{
            src: `${basePath}${artwork.original.medium}`,
            alt: `Original photo of ${slugToTitle(artwork.landmark)}`,
            blurDataUrl: artwork.original.blurDataUrl,
          }}
          after={{
            src: `${basePath}${artwork.images.medium}`,
            alt: artwork.title,
            blurDataUrl: artwork.images.blurDataUrl,
          }}
          className="w-full"
        />

        {/* Info */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gallery-text">
              {artwork.title}
            </h2>
            <p className="mt-1 text-sm text-gallery-muted">
              {slugToTitle(artwork.landmark)} &middot;{" "}
              {slugToTitle(artwork.style)}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gallery-muted">
              {artwork.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <BuyButton shopifyUrl={artwork.shopifyUrl} />
          </div>
        </div>

        {/* Tags */}
        {artwork.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gallery-card px-3 py-1 text-xs text-gallery-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
