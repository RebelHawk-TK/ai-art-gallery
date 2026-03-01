import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeforeAfter from "@/components/shared/BeforeAfter";
import BuyButton from "@/components/shared/BuyButton";
import ArtworkCard from "@/components/shared/ArtworkCard";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { landmarksBySlug } from "@/data/landmarks";
import { artStylesBySlug } from "@/data/art-styles";
import catalogData from "@/data/catalog.json";
import shopifyLinks from "@/data/shopify-links.json";
import { getRelatedArtworks } from "@/lib/catalog";
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

const allArtworks = withShopifyUrls(catalog.artworks);
const artworkMap = new Map(allArtworks.map((a) => [a.id, a]));

export function generateStaticParams() {
  return allArtworks.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = artworkMap.get(id);
  if (!artwork) {
    return { title: "Artwork Not Found" };
  }

  const landmark = landmarksBySlug[artwork.landmark];
  const style = artStylesBySlug[artwork.style];
  const basePath = getBasePath();

  return {
    title: artwork.title,
    description: artwork.description,
    openGraph: {
      title: `${artwork.title} | AI Art Gallery`,
      description: artwork.description,
      images: [
        {
          url: `${basePath}${artwork.images.medium}`,
          width: 800,
          height: 600,
          alt: artwork.title,
        },
      ],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const basePath = getBasePath();
  const artwork = artworkMap.get(id);

  if (!artwork) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-gallery-text">
              Artwork Not Found
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

  const landmark = landmarksBySlug[artwork.landmark];
  const style = artStylesBySlug[artwork.style];
  const related = getRelatedArtworks(allArtworks, artwork, 6);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    description: artwork.description,
    image: `${basePath}${artwork.images.full || artwork.images.medium}`,
    artform: "Digital Art / Neural Style Transfer",
    artMedium: "AI-generated digital artwork",
    creator: {
      "@type": "Organization",
      name: "AI Art Gallery",
      url: "https://moderndesignconcept.com",
    },
    about: landmark?.name || slugToTitle(artwork.landmark),
    artworkSurface: "Digital",
    keywords: artwork.tags.join(", "),
    ...(artwork.shopifyUrl && {
      offers: {
        "@type": "Offer",
        url: artwork.shopifyUrl,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <div className="border-b border-gallery-border bg-gallery-surface">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gallery-muted">
              <Link
                href={`${basePath}/gallery`}
                className="transition-colors duration-300 hover:text-gallery-accent"
              >
                Gallery
              </Link>
              <span>/</span>
              {landmark && (
                <>
                  <Link
                    href={`${basePath}/landmark/${landmark.slug}`}
                    className="transition-colors duration-300 hover:text-gallery-accent"
                  >
                    {landmark.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gallery-accent">{artwork.title}</span>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Full-size artwork */}
            <div className="overflow-hidden rounded-xl border border-gallery-border">
              <div className="aspect-[4/3]">
                <OptimizedImage
                  src={`${basePath}${artwork.images.full || artwork.images.medium}`}
                  alt={artwork.title}
                  blurDataUrl={artwork.images.blurDataUrl}
                  className="h-full w-full"
                  priority
                />
              </div>
            </div>

            {/* Artwork info */}
            <div>
              <h1 className="font-heading text-3xl font-bold text-gallery-text sm:text-4xl">
                {artwork.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {landmark && (
                  <Link
                    href={`${basePath}/landmark/${landmark.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gallery-border bg-gallery-card px-3 py-1.5 text-sm text-gallery-muted transition-all duration-300 hover:border-gallery-accent/50 hover:text-gallery-text"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
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
                    {landmark.name}, {landmark.country}
                  </Link>
                )}
                {style && (
                  <Link
                    href={`${basePath}/style/${style.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gallery-border bg-gallery-card px-3 py-1.5 text-sm text-gallery-muted transition-all duration-300 hover:border-gallery-accent/50 hover:text-gallery-text"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                      />
                    </svg>
                    {style.name} &middot; {style.artist}
                  </Link>
                )}
              </div>

              <p className="mt-6 text-lg leading-relaxed text-gallery-muted">
                {artwork.description}
              </p>

              {/* Tags */}
              {artwork.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gallery-card px-3 py-1 text-xs text-gallery-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Buy button */}
              <div className="mt-8">
                <BuyButton shopifyUrl={artwork.shopifyUrl} />
              </div>

              {/* Phase badge */}
              <div className="mt-6 text-xs text-gallery-muted">
                Phase {artwork.phase} Collection
              </div>
            </div>
          </div>
        </section>

        {/* Before/After comparison */}
        {artwork.original?.medium && (
          <section className="bg-gallery-surface py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-center font-heading text-2xl font-bold text-gallery-text">
                Before &amp; After
              </h2>
              <div className="overflow-hidden rounded-xl border border-gallery-border">
                <BeforeAfter
                  before={{
                    src: `${basePath}${artwork.original.medium}`,
                    alt: `Original photo of ${landmark?.name || slugToTitle(artwork.landmark)}`,
                    blurDataUrl: artwork.original.blurDataUrl,
                  }}
                  after={{
                    src: `${basePath}${artwork.images.medium}`,
                    alt: artwork.title,
                    blurDataUrl: artwork.images.blurDataUrl,
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Related artworks */}
        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold text-gallery-text">
              Related Artworks
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
              {related.map((relatedArt) => (
                <ArtworkCard key={relatedArt.id} artwork={relatedArt} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
