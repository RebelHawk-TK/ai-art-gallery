"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import type { LandmarkInfo, Region } from "@/types/artwork";
import { worldMapPaths } from "@/data/world-map-paths";

interface ExploreClientProps {
  landmarks: LandmarkInfo[];
  landmarkThumbs: Record<string, { thumb: string; blurDataUrl: string }>;
  basePath: string;
}

// Convert lat/lng to SVG coordinates on a simple equirectangular projection
// SVG viewBox: 0 0 1000 500
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

const REGION_COLORS: Record<string, string> = {
  Europe: "#d4a853",
  Asia: "#e8bc5e",
  "North America": "#c07d3a",
  "South America": "#b8963e",
  Africa: "#daa520",
  Oceania: "#cfb770",
  "Middle East": "#d4a853",
};

export default function ExploreClient({
  landmarks,
  landmarkThumbs,
  basePath,
}: ExploreClientProps) {
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = useMemo(() => {
    const regionSet = new Set(landmarks.map((l) => l.region));
    return Array.from(regionSet).sort();
  }, [landmarks]);

  const filteredLandmarks = useMemo(() => {
    if (!selectedRegion) return landmarks;
    return landmarks.filter((l) => l.region === selectedRegion);
  }, [landmarks, selectedRegion]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* World Map SVG */}
      <div className="mb-12 overflow-hidden rounded-xl border border-gallery-border bg-gallery-card p-4">
        <svg
          viewBox="0 0 1000 500"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified world map outlines */}
          <defs>
            <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d4a853" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="1000" height="500" fill="#0a0a0a" rx="8" />

          {/* Country outlines from Natural Earth 50m */}
          {worldMapPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="0.3"
            />
          ))}

          {/* Grid lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const { y } = geoToSvg(lat, 0);
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                y1={y}
                x2="1000"
                y2={y}
                stroke="#1a1a1a"
                strokeWidth="0.3"
                strokeDasharray="4 4"
              />
            );
          })}
          {[-120, -60, 0, 60, 120].map((lng) => {
            const { x } = geoToSvg(0, lng);
            return (
              <line
                key={`lng-${lng}`}
                x1={x}
                y1="0"
                x2={x}
                y2="500"
                stroke="#1a1a1a"
                strokeWidth="0.3"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Landmark dots */}
          {landmarks.map((landmark) => {
            const { x, y } = geoToSvg(landmark.lat, landmark.lng);
            const isHovered = hoveredLandmark === landmark.slug;
            const isFiltered =
              selectedRegion && landmark.region !== selectedRegion;

            return (
              <g key={landmark.slug}>
                {/* Glow effect on hover */}
                {isHovered && (
                  <circle cx={x} cy={y} r="20" fill="url(#dotGlow)" />
                )}
                {/* Main dot */}
                <Link href={`${basePath}/landmark/${landmark.slug}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={
                      isFiltered
                        ? "#333"
                        : REGION_COLORS[landmark.region] || "#d4a853"
                    }
                    stroke={isHovered ? "#fff" : "none"}
                    strokeWidth={isHovered ? 1.5 : 0}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredLandmark(landmark.slug)}
                    onMouseLeave={() => setHoveredLandmark(null)}
                  />
                </Link>
                {/* Label on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + 10}
                      y={y - 16}
                      width={landmark.name.length * 7 + 16}
                      height="22"
                      rx="4"
                      fill="#141414"
                      stroke="#2a2a2a"
                      strokeWidth="0.5"
                    />
                    <text
                      x={x + 18}
                      y={y - 1}
                      fill="#f0f0f0"
                      fontSize="11"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {landmark.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Region filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedRegion(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            !selectedRegion
              ? "bg-gallery-accent text-gallery-bg"
              : "bg-gallery-card text-gallery-muted hover:bg-gallery-surface-hover hover:text-gallery-text"
          }`}
        >
          All Regions
        </button>
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() =>
              setSelectedRegion(selectedRegion === region ? null : region)
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedRegion === region
                ? "bg-gallery-accent text-gallery-bg"
                : "bg-gallery-card text-gallery-muted hover:bg-gallery-surface-hover hover:text-gallery-text"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Landmarks grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredLandmarks.map((landmark) => {
          const thumb = landmarkThumbs[landmark.slug];
          return (
            <Link
              key={landmark.slug}
              href={`${basePath}/landmark/${landmark.slug}`}
              className="group overflow-hidden rounded-xl border border-gallery-border bg-gallery-card transition-all duration-300 hover:border-gallery-accent/50 hover:shadow-lg hover:shadow-gallery-accent/10"
              onMouseEnter={() => setHoveredLandmark(landmark.slug)}
              onMouseLeave={() => setHoveredLandmark(null)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                {thumb ? (
                  <OptimizedImage
                    src={`${basePath}${thumb.thumb}`}
                    alt={landmark.name}
                    blurDataUrl={thumb.blurDataUrl}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gallery-surface">
                    <svg
                      className="h-8 w-8 text-gallery-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="truncate font-heading text-sm font-semibold text-gallery-text">
                  {landmark.name}
                </h3>
                <p className="mt-0.5 text-xs text-gallery-muted">
                  {landmark.country}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
