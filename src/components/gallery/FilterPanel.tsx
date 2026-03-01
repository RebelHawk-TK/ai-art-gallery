"use client";

import { useCallback } from "react";
import { cn, slugToTitle } from "@/lib/utils";
import type { LandmarkInfo, Region } from "@/types/artwork";
import type { FilterOptions } from "@/lib/catalog";
import { artStyles } from "@/data/art-styles";

interface FilterPanelProps {
  landmarks: LandmarkInfo[];
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

// Group landmarks by region
function groupByRegion(
  landmarks: LandmarkInfo[]
): Record<string, LandmarkInfo[]> {
  return landmarks.reduce(
    (acc, lm) => {
      (acc[lm.region] ??= []).push(lm);
      return acc;
    },
    {} as Record<string, LandmarkInfo[]>
  );
}

const REGION_ORDER: Region[] = [
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Africa",
  "Oceania",
  "Middle East",
];

export default function FilterPanel({
  landmarks,
  onFilterChange,
  currentFilters,
}: FilterPanelProps) {
  const regionGroups = groupByRegion(landmarks);

  const updateFilter = useCallback(
    (key: keyof FilterOptions, value: string | undefined) => {
      onFilterChange({ ...currentFilters, [key]: value });
    },
    [currentFilters, onFilterChange]
  );

  const clearAll = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  const hasActiveFilters =
    currentFilters.query ||
    currentFilters.landmark ||
    currentFilters.style ||
    currentFilters.region;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gallery-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search artworks..."
          value={currentFilters.query || ""}
          onChange={(e) =>
            updateFilter("query", e.target.value || undefined)
          }
          className="w-full rounded-lg border border-gallery-border bg-gallery-card py-2.5 pl-10 pr-4 text-sm text-gallery-text placeholder-gallery-muted outline-none transition-all duration-300 focus:border-gallery-accent focus:ring-1 focus:ring-gallery-accent"
        />
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-gallery-accent transition-colors duration-300 hover:text-gallery-accent-hover"
        >
          Clear all filters
        </button>
      )}

      {/* Art style pills */}
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-gallery-text">
          Art Styles
        </h3>
        <div className="flex flex-wrap gap-2">
          {artStyles.map((style) => (
            <button
              key={style.slug}
              type="button"
              onClick={() =>
                updateFilter(
                  "style",
                  currentFilters.style === style.slug ? undefined : style.slug
                )
              }
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300",
                currentFilters.style === style.slug
                  ? "bg-gallery-accent text-gallery-bg"
                  : "bg-gallery-card text-gallery-muted hover:bg-gallery-surface-hover hover:text-gallery-text"
              )}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Region groups with landmark pills */}
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-gallery-text">
          Landmarks by Region
        </h3>
        <div className="space-y-4">
          {REGION_ORDER.filter((r) => regionGroups[r]?.length).map((region) => (
            <div key={region}>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gallery-muted">
                {region}
              </h4>
              <div className="flex flex-wrap gap-2">
                {regionGroups[region].map((lm) => (
                  <button
                    key={lm.slug}
                    type="button"
                    onClick={() =>
                      updateFilter(
                        "landmark",
                        currentFilters.landmark === lm.slug
                          ? undefined
                          : lm.slug
                      )
                    }
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300",
                      currentFilters.landmark === lm.slug
                        ? "bg-gallery-accent text-gallery-bg"
                        : "bg-gallery-card text-gallery-muted hover:bg-gallery-surface-hover hover:text-gallery-text"
                    )}
                  >
                    {lm.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
