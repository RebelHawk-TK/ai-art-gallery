import type { ArtworkEntry, Region } from "@/types/artwork";

export interface FilterOptions {
  landmark?: string;
  style?: string;
  region?: Region;
  query?: string;
  phase?: 1 | 2;
}

export function filterArtworks(
  artworks: ArtworkEntry[],
  filters: FilterOptions
): ArtworkEntry[] {
  return artworks.filter((art) => {
    if (filters.landmark && art.landmark !== filters.landmark) return false;
    if (filters.style && art.style !== filters.style) return false;
    if (filters.phase && art.phase !== filters.phase) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const searchable = `${art.title} ${art.tags.join(" ")} ${art.landmark} ${art.style}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export function filterByRegion(
  artworks: ArtworkEntry[],
  region: Region,
  landmarksBySlug: Record<string, { region: Region }>
): ArtworkEntry[] {
  return artworks.filter((art) => landmarksBySlug[art.landmark]?.region === region);
}

export function getArtworksForLandmark(
  artworks: ArtworkEntry[],
  landmark: string
): ArtworkEntry[] {
  return artworks.filter((art) => art.landmark === landmark);
}

export function getArtworksForStyle(
  artworks: ArtworkEntry[],
  style: string
): ArtworkEntry[] {
  return artworks.filter((art) => art.style === style);
}

export function getFeaturedArtworks(
  artworks: ArtworkEntry[],
  count: number
): ArtworkEntry[] {
  // One per landmark, spread across styles
  const seen = new Set<string>();
  const featured: ArtworkEntry[] = [];
  const shuffled = [...artworks].sort(() => Math.random() - 0.5);
  for (const art of shuffled) {
    if (seen.has(art.landmark)) continue;
    seen.add(art.landmark);
    featured.push(art);
    if (featured.length >= count) break;
  }
  return featured;
}

export function getRelatedArtworks(
  artworks: ArtworkEntry[],
  current: ArtworkEntry,
  count: number
): ArtworkEntry[] {
  // Same landmark (different style) + same style (different landmark)
  const sameLandmark = artworks.filter(
    (a) => a.landmark === current.landmark && a.id !== current.id
  );
  const sameStyle = artworks.filter(
    (a) => a.style === current.style && a.id !== current.id
  );
  const combined = [...sameLandmark, ...sameStyle];
  const unique = Array.from(new Map(combined.map((a) => [a.id, a])).values());
  return unique.slice(0, count);
}
