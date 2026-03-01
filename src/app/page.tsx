import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtworkCard from "@/components/shared/ArtworkCard";
import BeforeAfter from "@/components/shared/BeforeAfter";
import { artStyles } from "@/data/art-styles";
import { landmarks } from "@/data/landmarks";
import catalogData from "@/data/catalog.json";
import shopifyLinks from "@/data/shopify-links.json";
import { getFeaturedArtworks } from "@/lib/catalog";
import { getBasePath } from "@/lib/utils";
import type { ArtworkEntry, ArtworkCatalog, ShopifyLinks } from "@/types/artwork";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";

const catalog = catalogData as ArtworkCatalog;
const links = shopifyLinks as ShopifyLinks;

// Merge shopify URLs into artwork entries
function withShopifyUrls(artworks: ArtworkEntry[]): ArtworkEntry[] {
  return artworks.map((art) => ({
    ...art,
    shopifyUrl: links[art.id] ?? art.shopifyUrl,
  }));
}

export default function HomePage() {
  const basePath = getBasePath();
  const allArtworks = withShopifyUrls(catalog.artworks);
  const featured = getFeaturedArtworks(allArtworks, 12);

  // Pick a before/after demo artwork (first one with an original image)
  const demoArtwork = allArtworks.find(
    (a) => a.original?.medium && a.images?.medium
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection basePath={basePath} artwork={allArtworks[0] ?? null} />

        {/* Stats Bar */}
        <StatsBar
          landmarkCount={landmarks.length}
          styleCount={artStyles.length}
          artworkCount={catalog.totalArtworks || 300}
        />

        {/* Art Styles Showcase */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
              Six Iconic Art Styles
            </h2>
            <p className="mt-4 text-gallery-muted">
              Each landmark reimagined through the lens of master painters
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artStyles.map((style) => {
              // Find a sample artwork for this style
              const sample = allArtworks.find((a) => a.style === style.slug);
              return (
                <Link
                  key={style.slug}
                  href={`${basePath}/style/${style.slug}`}
                  className="group overflow-hidden rounded-xl border border-gallery-border bg-gallery-card transition-all duration-300 hover:border-gallery-accent/50 hover:shadow-lg hover:shadow-gallery-accent/10"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {sample ? (
                      <img
                        src={`${basePath}${sample.images.medium}`}
                        alt={`${style.name} style example`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gallery-surface">
                        <span className="text-gallery-muted">
                          {style.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-gallery-text">
                      {style.name}
                    </h3>
                    <p className="mt-1 text-sm text-gallery-accent">
                      {style.artist}, {style.year}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Artworks */}
        {featured.length > 0 && (
          <section className="bg-gallery-surface py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
                  Featured Artworks
                </h2>
                <p className="mt-4 text-gallery-muted">
                  A curated selection from our collection
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featured.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href={`${basePath}/gallery`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gallery-accent px-6 py-3 text-sm font-semibold text-gallery-accent transition-all duration-300 hover:bg-gallery-accent hover:text-gallery-bg"
                >
                  View All Artworks
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
              </div>
            </div>
          </section>
        )}

        {/* Before/After Demo */}
        {demoArtwork && (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
                  The Transformation
                </h2>
                <p className="mt-4 text-lg text-gallery-muted">
                  Slide to see how neural style transfer transforms real
                  photographs into stunning artworks inspired by the world's
                  greatest painters.
                </p>
                <p className="mt-4 text-gallery-muted">
                  Each original photograph captures the essence of a world
                  landmark, then AI applies the brushstrokes, color palette, and
                  compositional style of a master painting to create something
                  entirely new.
                </p>
                <Link
                  href={`${basePath}/about`}
                  className="mt-6 inline-flex items-center gap-2 text-gallery-accent transition-colors duration-300 hover:text-gallery-accent-hover"
                >
                  Learn how it works
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
              </div>
              <div className="overflow-hidden rounded-xl border border-gallery-border">
                <BeforeAfter
                  before={{
                    src: `${basePath}${demoArtwork.original.medium}`,
                    alt: "Original photograph",
                    blurDataUrl: demoArtwork.original.blurDataUrl,
                  }}
                  after={{
                    src: `${basePath}${demoArtwork.images.medium}`,
                    alt: "AI-styled artwork",
                    blurDataUrl: demoArtwork.images.blurDataUrl,
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Shop CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-gallery-gradient-from to-gallery-gradient-to py-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGg0djRoMnY0aC0ydjRoLTR2LTR6bTAtMzBoLTJ2LTRoMlYwaDR2NGgydjRoLTJ2NGgtNFY0ek02IDM0SDR2LTRoMnYtNGg0djRoMnY0SDh2NGgtNHYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-gallery-bg sm:text-4xl">
              Own a Piece of AI Art
            </h2>
            <p className="mt-4 text-lg text-gallery-bg/80">
              Museum-quality prints available as posters, t-shirts, and
              stickers. Transform your space with landmark art.
            </p>
            <a
              href="https://moderndesignconcept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gallery-bg px-8 py-4 text-sm font-bold text-gallery-accent transition-all duration-300 hover:bg-gallery-bg/90"
            >
              Browse the Shop
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
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
