"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterPanel from "@/components/gallery/FilterPanel";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import { landmarks } from "@/data/landmarks";
import { filterArtworks, filterByRegion } from "@/lib/catalog";
import { landmarksBySlug } from "@/data/landmarks";
import type { ArtworkEntry, Region } from "@/types/artwork";
import type { FilterOptions } from "@/lib/catalog";

interface GalleryClientProps {
  artworks: ArtworkEntry[];
}

export default function GalleryClient({ artworks }: GalleryClientProps) {
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterOptions>(() => ({
    landmark: searchParams.get("landmark") || undefined,
    style: searchParams.get("style") || undefined,
    region: (searchParams.get("region") as Region) || undefined,
    query: searchParams.get("q") || undefined,
  }));

  const [showFilters, setShowFilters] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.landmark) params.set("landmark", filters.landmark);
    if (filters.style) params.set("style", filters.style);
    if (filters.region) params.set("region", filters.region);
    if (filters.query) params.set("q", filters.query);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // Apply filters
  const filteredArtworks = useMemo(() => {
    let result = filterArtworks(artworks, filters);
    if (filters.region) {
      result = filterByRegion(result, filters.region, landmarksBySlug);
    }
    return result;
  }, [artworks, filters]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile filter toggle */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-lg border border-gallery-border bg-gallery-card px-4 py-2.5 text-sm font-medium text-gallery-text transition-colors duration-300 hover:border-gallery-accent/50"
        >
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
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={`w-full shrink-0 lg:block lg:w-72 ${
            showFilters ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-24 rounded-xl border border-gallery-border bg-gallery-card p-6">
            <FilterPanel
              landmarks={landmarks}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </div>
        </aside>

        {/* Artwork grid */}
        <div className="min-w-0 flex-1">
          <ArtworkGrid artworks={filteredArtworks} />
        </div>
      </div>
    </div>
  );
}
