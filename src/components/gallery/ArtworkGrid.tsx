"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ArtworkEntry } from "@/types/artwork";
import ArtworkCard from "@/components/shared/ArtworkCard";
import ArtworkModal from "@/components/shared/ArtworkModal";

interface ArtworkGridProps {
  artworks: ArtworkEntry[];
  pageSize?: number;
}

export default function ArtworkGrid({
  artworks,
  pageSize = 48,
}: ArtworkGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkEntry | null>(
    null
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count when artworks change (e.g. filter change)
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [artworks, pageSize]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + pageSize, artworks.length)
          );
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [artworks.length, pageSize]);

  // Listen for modal navigation events
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<ArtworkEntry>;
      setSelectedArtwork(customEvent.detail);
    };
    window.addEventListener("artwork-modal-navigate", handleNavigate);
    return () =>
      window.removeEventListener("artwork-modal-navigate", handleNavigate);
  }, []);

  const visibleArtworks = artworks.slice(0, visibleCount);
  const hasMore = visibleCount < artworks.length;

  const handleClose = useCallback(() => setSelectedArtwork(null), []);

  return (
    <div>
      {/* Counter */}
      <p className="mb-6 text-sm text-gallery-muted">
        Showing{" "}
        <span className="font-medium text-gallery-text">
          {visibleArtworks.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gallery-text">
          {artworks.length}
        </span>{" "}
        artworks
      </p>

      {/* Grid */}
      {artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gallery-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p className="text-lg font-medium text-gallery-text">
            No artworks found
          </p>
          <p className="mt-1 text-sm text-gallery-muted">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleArtworks.map((artwork, i) => (
            <div
              key={artwork.id}
              onClick={(e) => {
                // Prevent link navigation; open modal instead
                e.preventDefault();
                setSelectedArtwork(artwork);
              }}
            >
              <ArtworkCard artwork={artwork} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gallery-border border-t-gallery-accent" />
        </div>
      )}

      {/* Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        allArtworks={artworks}
        onClose={handleClose}
      />
    </div>
  );
}
