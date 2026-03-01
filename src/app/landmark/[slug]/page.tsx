import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeforeAfter from "@/components/shared/BeforeAfter";
import BuyButton from "@/components/shared/BuyButton";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { landmarks, landmarksBySlug } from "@/data/landmarks";
import { artStylesBySlug } from "@/data/art-styles";
import catalogData from "@/data/catalog.json";
import shopifyLinks from "@/data/shopify-links.json";
import { getArtworksForLandmark } from "@/lib/catalog";
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
  return landmarks.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landmark = landmarksBySlug[slug];
  if (!landmark) {
    return { title: "Landmark Not Found" };
  }

  return {
    title: landmark.name,
    description: `Explore ${landmark.name} in ${landmark.country} reimagined through 6 classic art styles using neural style transfer. Available as museum-quality prints.`,
    openGraph: {
      title: `${landmark.name} | AI Art Gallery`,
      description: `${landmark.name} in ${landmark.country} transformed through the styles of master painters.`,
    },
  };
}

export default async function LandmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const basePath = getBasePath();
  const landmark = landmarksBySlug[slug];

  if (!landmark) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-gallery-text">
              Landmark Not Found
            </h1>
            <Link
              href={`${basePath}/explore`}
              className="mt-4 inline-block text-gallery-accent hover:text-gallery-accent-hover"
            >
              Explore all landmarks
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const allArtworks = withShopifyUrls(catalog.artworks);
  const landmarkArtworks = getArtworksForLandmark(allArtworks, landmark.slug);

  // Pick the first artwork for the before/after slider
  const demoArtwork = landmarkArtworks.find(
    (a) => a.original?.medium && a.images?.medium
  );

  // Find adjacent landmarks for navigation
  const currentIndex = landmarks.findIndex((l) => l.slug === landmark.slug);
  const prevLandmark = currentIndex > 0 ? landmarks[currentIndex - 1] : null;
  const nextLandmark =
    currentIndex < landmarks.length - 1 ? landmarks[currentIndex + 1] : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gallery-border bg-gallery-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Landmark info */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Link
                    href={`${basePath}/explore`}
                    className="text-sm text-gallery-muted transition-colors duration-300 hover:text-gallery-accent"
                  >
                    Explore
                  </Link>
                  <span className="text-gallery-muted">/</span>
                  <span className="text-sm text-gallery-accent">
                    {landmark.name}
                  </span>
                </div>
                <h1 className="font-heading text-4xl font-bold text-gallery-text sm:text-5xl">
                  {landmark.name}
                </h1>
                <p className="mt-3 text-lg text-gallery-muted">
                  {landmark.country} &middot; {landmark.region}
                </p>
                <p className="mt-4 text-gallery-muted">
                  {landmarkArtworks.length} artworks featuring {landmark.name}{" "}
                  reimagined through the world&apos;s most iconic art styles.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {landmarkArtworks.map((art) => {
                    const style = artStylesBySlug[art.style];
                    return (
                      <Link
                        key={art.id}
                        href={`${basePath}/artwork/${art.id}`}
                        className="rounded-full border border-gallery-border bg-gallery-card px-3 py-1.5 text-xs font-medium text-gallery-muted transition-all duration-300 hover:border-gallery-accent/50 hover:text-gallery-text"
                      >
                        {style?.name || slugToTitle(art.style)}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Original photo */}
              {demoArtwork && (
                <div className="overflow-hidden rounded-xl border border-gallery-border">
                  <div className="aspect-[4/3]">
                    <OptimizedImage
                      src={`${basePath}${demoArtwork.original.medium}`}
                      alt={`Original photo of ${landmark.name}`}
                      blurDataUrl={demoArtwork.original.blurDataUrl}
                      className="h-full w-full"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Before/After */}
        {demoArtwork && (
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-gallery-text">
              Original vs. Styled
            </h2>
            <div className="overflow-hidden rounded-xl border border-gallery-border">
              <BeforeAfter
                before={{
                  src: `${basePath}${demoArtwork.original.medium}`,
                  alt: `Original photo of ${landmark.name}`,
                  blurDataUrl: demoArtwork.original.blurDataUrl,
                }}
                after={{
                  src: `${basePath}${demoArtwork.images.medium}`,
                  alt: demoArtwork.title,
                  blurDataUrl: demoArtwork.images.blurDataUrl,
                }}
              />
            </div>
          </section>
        )}

        {/* Style variations grid */}
        <section className="bg-gallery-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold text-gallery-text">
              Style Variations
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landmarkArtworks.map((artwork) => {
                const style = artStylesBySlug[artwork.style];
                return (
                  <div
                    key={artwork.id}
                    className="overflow-hidden rounded-xl border border-gallery-border bg-gallery-card transition-all duration-300 hover:border-gallery-accent/50"
                  >
                    <Link href={`${basePath}/artwork/${artwork.id}`}>
                      <div className="aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          src={`${basePath}${artwork.images.medium}`}
                          alt={artwork.title}
                          blurDataUrl={artwork.images.blurDataUrl}
                          className="h-full w-full transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-5">
                      <Link href={`${basePath}/artwork/${artwork.id}`}>
                        <h3 className="font-heading text-base font-semibold text-gallery-text transition-colors duration-300 hover:text-gallery-accent">
                          {style?.name || slugToTitle(artwork.style)}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-gallery-muted">
                        {style?.artist}, {style?.year}
                      </p>
                      <div className="mt-4">
                        <BuyButton shopifyUrl={artwork.shopifyUrl} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Navigation to adjacent landmarks */}
        <section className="border-t border-gallery-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
            {prevLandmark ? (
              <Link
                href={`${basePath}/landmark/${prevLandmark.slug}`}
                className="group flex items-center gap-3 text-gallery-muted transition-colors duration-300 hover:text-gallery-text"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                <div>
                  <div className="text-xs text-gallery-muted">Previous</div>
                  <div className="text-sm font-medium">{prevLandmark.name}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextLandmark ? (
              <Link
                href={`${basePath}/landmark/${nextLandmark.slug}`}
                className="group flex items-center gap-3 text-right text-gallery-muted transition-colors duration-300 hover:text-gallery-text"
              >
                <div>
                  <div className="text-xs text-gallery-muted">Next</div>
                  <div className="text-sm font-medium">{nextLandmark.name}</div>
                </div>
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
