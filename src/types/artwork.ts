export interface ArtworkEntry {
  id: string; // e.g. "angkor_wat_starry_night"
  landmark: string; // e.g. "angkor_wat"
  style: string; // e.g. "starry_night"
  title: string;
  description: string;
  tags: string[];
  images: {
    thumb: string; // 400px WebP
    medium: string; // 800px WebP
    full: string; // 1600px WebP
    blurDataUrl: string; // base64 16px placeholder
  };
  original: {
    thumb: string; // original photo 400px
    medium: string; // original photo 800px
    blurDataUrl: string;
  };
  shopifyUrl?: string;
  phase: 1 | 2;
}

export interface LandmarkInfo {
  slug: string;
  name: string;
  country: string;
  region: Region;
  lat: number;
  lng: number;
  phase: 1 | 2;
}

export interface StyleInfo {
  slug: string;
  name: string;
  artist: string;
  year: string;
  description: string;
}

export type Region =
  | "Europe"
  | "Asia"
  | "Africa"
  | "North America"
  | "South America"
  | "Oceania"
  | "Middle East";

export interface ArtworkCatalog {
  generatedAt: string;
  totalArtworks: number;
  totalLandmarks: number;
  totalStyles: number;
  artworks: ArtworkEntry[];
}

export interface ShopifyLinks {
  [artworkId: string]: string;
}
