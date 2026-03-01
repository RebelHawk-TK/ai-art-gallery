import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtworkCard from "@/components/shared/ArtworkCard";
import { artStyles, artStylesBySlug } from "@/data/art-styles";
import { landmarksBySlug } from "@/data/landmarks";
import catalogData from "@/data/catalog.json";
import shopifyLinks from "@/data/shopify-links.json";
import { getArtworksForStyle } from "@/lib/catalog";
import { getBasePath, slugToTitle } from "@/lib/utils";
import type { ArtworkEntry, ArtworkCatalog, ShopifyLinks } from "@/types/artwork";

const catalog = catalogData as ArtworkCatalog;
const links = shopifyLinks as ShopifyLinks;

function withShopifyUrls(artworks: ArtworkEntry[]): ArtworkEntry[] {
  return artworks.map((art) => ({
    ...art,
    shopifyUrl: links[art.id] ?? art.shopifyUrl,
  }));
}

export function generateStaticParams() {
  return artStyles.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const style = artStylesBySlug[slug];
  if (!style) {
    return { title: "Style Not Found" };
  }

  return {
    title: `${style.name} Style`,
    description: `${style.description} Explore 50 world landmarks reimagined in the style of ${style.artist}'s ${style.name} (${style.year}).`,
    openGraph: {
      title: `${style.name} Style | AI Art Gallery`,
      description: `50 landmarks reimagined in the style of ${style.artist}.`,
    },
  };
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const basePath = getBasePath();
  const style = artStylesBySlug[slug];

  if (!style) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-gallery-text">
              Style Not Found
            </h1>
            <Link
              href={`${basePath}/gallery`}
              className="mt-4 inline-block text-gallery-accent hover:text-gallery-accent-hover"
            >
              Browse the gallery
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const allArtworks = withShopifyUrls(catalog.artworks);
  const styleArtworks = getArtworksForStyle(allArtworks, style.slug);

  // Find a hero artwork for this style
  const heroArtwork = styleArtworks[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gallery-border">
          {/* Background image */}
          {heroArtwork && (
            <div className="absolute inset-0">
              <img
                src={`${basePath}${heroArtwork.images.medium}`}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gallery-bg via-gallery-bg/90 to-gallery-bg/60" />
            </div>
          )}

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <Link
                  href={`${basePath}/`}
                  className="text-sm text-gallery-muted transition-colors duration-300 hover:text-gallery-accent"
                >
                  Home
                </Link>
                <span className="text-gallery-muted">/</span>
                <span className="text-sm text-gallery-accent">
                  {style.name}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-bold text-gallery-text sm:text-5xl">
                {style.name}
              </h1>
              <p className="mt-3 text-lg text-gallery-accent">
                {style.artist}, {style.year}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gallery-muted">
                {style.description}
              </p>
              <p className="mt-6 text-sm text-gallery-muted">
                {styleArtworks.length} artworks in this style
              </p>
            </div>
          </div>
        </section>

        {/* Artworks grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-heading text-2xl font-bold text-gallery-text">
            All {style.name} Artworks
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {styleArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>

        {/* Other styles navigation */}
        <section className="border-t border-gallery-border bg-gallery-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold text-gallery-text">
              Explore Other Styles
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {artStyles
                .filter((s) => s.slug !== style.slug)
                .map((otherStyle) => {
                  const sample = allArtworks.find(
                    (a) => a.style === otherStyle.slug
                  );
                  return (
                    <Link
                      key={otherStyle.slug}
                      href={`${basePath}/style/${otherStyle.slug}`}
                      className="group overflow-hidden rounded-xl border border-gallery-border bg-gallery-card transition-all duration-300 hover:border-gallery-accent/50"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        {sample ? (
                          <img
                            src={`${basePath}${sample.images.thumb}`}
                            alt={`${otherStyle.name} style`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gallery-surface">
                            <span className="text-gallery-muted">
                              {otherStyle.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="truncate font-heading text-sm font-semibold text-gallery-text">
                          {otherStyle.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-gallery-muted">
                          {otherStyle.artist}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
