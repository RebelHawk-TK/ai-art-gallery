import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import catalogData from "@/data/catalog.json";
import shopifyLinks from "@/data/shopify-links.json";
import type { ArtworkEntry, ArtworkCatalog, ShopifyLinks } from "@/types/artwork";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse all 300 AI-generated artworks featuring 50 world landmarks transformed through 6 classic art styles using neural style transfer.",
  openGraph: {
    title: "Gallery | AI Art Gallery",
    description:
      "Browse all 300 AI-generated artworks featuring 50 world landmarks transformed through 6 classic art styles.",
  },
};

const catalog = catalogData as ArtworkCatalog;
const links = shopifyLinks as ShopifyLinks;

function withShopifyUrls(artworks: ArtworkEntry[]): ArtworkEntry[] {
  return artworks.map((art) => ({
    ...art,
    shopifyUrl: links[art.id] ?? art.shopifyUrl,
  }));
}

export default function GalleryPage() {
  const allArtworks = withShopifyUrls(catalog.artworks);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <div className="border-b border-gallery-border bg-gallery-surface">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
              Gallery
            </h1>
            <p className="mt-2 text-gallery-muted">
              Explore our complete collection of AI-styled landmark artworks
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gallery-border border-t-gallery-accent" />
            </div>
          }
        >
          <GalleryClient artworks={allArtworks} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
