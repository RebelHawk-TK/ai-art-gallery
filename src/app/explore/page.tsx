import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { landmarks } from "@/data/landmarks";
import { getBasePath } from "@/lib/utils";
import catalogData from "@/data/catalog.json";
import type { ArtworkCatalog } from "@/types/artwork";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore 50 world landmarks on an interactive map. Each landmark has been transformed through 6 art styles using neural style transfer.",
  openGraph: {
    title: "Explore the World | AI Art Gallery",
    description:
      "Interactive world map showcasing 50 landmarks reimagined through classic art styles.",
  },
};

const catalog = catalogData as ArtworkCatalog;

export default function ExplorePage() {
  const basePath = getBasePath();

  // Build a thumbnail map: landmark slug -> first artwork thumb
  const landmarkThumbs: Record<string, { thumb: string; blurDataUrl: string }> =
    {};
  for (const art of catalog.artworks) {
    if (!landmarkThumbs[art.landmark]) {
      landmarkThumbs[art.landmark] = {
        thumb: art.images.thumb,
        blurDataUrl: art.images.blurDataUrl,
      };
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <div className="border-b border-gallery-border bg-gallery-surface">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
              Explore the World
            </h1>
            <p className="mt-2 text-gallery-muted">
              50 landmarks across {new Set(landmarks.map((l) => l.country)).size}{" "}
              countries, reimagined through art
            </p>
          </div>
        </div>

        <ExploreClient
          landmarks={landmarks}
          landmarkThumbs={landmarkThumbs}
          basePath={basePath}
        />
      </main>
      <Footer />
    </>
  );
}
