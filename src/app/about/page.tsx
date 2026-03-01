import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { artStyles } from "@/data/art-styles";
import { landmarks } from "@/data/landmarks";
import { getBasePath } from "@/lib/utils";
import catalogData from "@/data/catalog.json";
import type { ArtworkCatalog } from "@/types/artwork";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how AI Art Gallery uses neural style transfer to transform photographs of 50 world landmarks into stunning artworks inspired by master painters.",
  openGraph: {
    title: "About | AI Art Gallery",
    description:
      "Where AI meets art: neural style transfer transforms landmark photography into masterpiece-inspired artwork.",
  },
};

const catalog = catalogData as ArtworkCatalog;

export default function AboutPage() {
  const basePath = getBasePath();
  const uniqueCountries = new Set(landmarks.map((l) => l.country)).size;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="border-b border-gallery-border bg-gallery-surface">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl font-bold text-gallery-text sm:text-5xl">
              Where AI Meets Art
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gallery-muted">
              AI Art Gallery is a collection of 300 artworks born from the
              intersection of technology and classic art. Using neural style
              transfer, we transform photographs of the world&apos;s most iconic
              landmarks into stunning pieces inspired by master painters.
            </p>
          </div>
        </section>

        {/* Process section */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-gallery-text">
              How It Works
            </h2>
            <p className="mt-4 text-gallery-muted">
              Neural style transfer in three steps
            </p>
          </div>

          {/* Visual process diagram */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1: Content Image */}
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gallery-accent/10">
                <svg
                  className="h-8 w-8 text-gallery-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gallery-accent">
                Step 1
              </div>
              <h3 className="font-heading text-xl font-semibold text-gallery-text">
                Content Image
              </h3>
              <p className="mt-3 text-sm text-gallery-muted">
                A high-quality photograph of a world landmark captures the
                structure, composition, and spatial relationships of the scene.
              </p>
            </div>

            {/* Step 2: Style Image */}
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gallery-accent/10">
                <svg
                  className="h-8 w-8 text-gallery-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                  />
                </svg>
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gallery-accent">
                Step 2
              </div>
              <h3 className="font-heading text-xl font-semibold text-gallery-text">
                Style Reference
              </h3>
              <p className="mt-3 text-sm text-gallery-muted">
                A masterwork painting provides the artistic style -- brushwork
                texture, color palette, and compositional patterns that define
                the artist&apos;s unique vision.
              </p>
            </div>

            {/* Step 3: Result */}
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gallery-accent/10">
                <svg
                  className="h-8 w-8 text-gallery-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gallery-accent">
                Step 3
              </div>
              <h3 className="font-heading text-xl font-semibold text-gallery-text">
                AI-Styled Artwork
              </h3>
              <p className="mt-3 text-sm text-gallery-muted">
                A neural network merges content and style, preserving the
                landmark&apos;s structure while applying the artist&apos;s
                distinctive visual language to create something entirely new.
              </p>
            </div>
          </div>

          {/* Arrow connectors (visible on md+) */}
          <div className="mt-6 hidden items-center justify-center gap-4 text-gallery-muted md:flex">
            <span className="text-sm">Content</span>
            <span className="text-xl">+</span>
            <span className="text-sm">Style</span>
            <span className="text-xl">=</span>
            <span className="text-sm font-semibold text-gallery-accent">
              Masterpiece
            </span>
          </div>
        </section>

        {/* The Styles */}
        <section className="bg-gallery-surface py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-gallery-text">
                The Art Styles
              </h2>
              <p className="mt-4 text-gallery-muted">
                Six masterworks that define our artistic palette
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artStyles.map((style) => (
                <Link
                  key={style.slug}
                  href={`${basePath}/style/${style.slug}`}
                  className="group rounded-xl border border-gallery-border bg-gallery-card p-6 transition-all duration-300 hover:border-gallery-accent/50"
                >
                  <h3 className="font-heading text-lg font-semibold text-gallery-text transition-colors duration-300 group-hover:text-gallery-accent">
                    {style.name}
                  </h3>
                  <p className="mt-1 text-sm text-gallery-accent">
                    {style.artist}, {style.year}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gallery-muted">
                    {style.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* The Landmarks */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-gallery-text">
            The Landmarks
          </h2>
          <p className="mt-4 text-lg text-gallery-muted">
            {landmarks.length} iconic landmarks across {uniqueCountries}{" "}
            countries, spanning every inhabited continent.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
              <div className="font-heading text-3xl font-bold text-gallery-accent">
                {landmarks.length}
              </div>
              <div className="mt-1 text-sm text-gallery-muted">Landmarks</div>
            </div>
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
              <div className="font-heading text-3xl font-bold text-gallery-accent">
                {uniqueCountries}
              </div>
              <div className="mt-1 text-sm text-gallery-muted">Countries</div>
            </div>
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
              <div className="font-heading text-3xl font-bold text-gallery-accent">
                {new Set(landmarks.map((l) => l.region)).size}
              </div>
              <div className="mt-1 text-sm text-gallery-muted">Regions</div>
            </div>
            <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
              <div className="font-heading text-3xl font-bold text-gallery-accent">
                2
              </div>
              <div className="mt-1 text-sm text-gallery-muted">Phases</div>
            </div>
          </div>
          <Link
            href={`${basePath}/explore`}
            className="mt-8 inline-flex items-center gap-2 text-gallery-accent transition-colors duration-300 hover:text-gallery-accent-hover"
          >
            Explore all landmarks on the map
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
        </section>

        {/* Tech section */}
        <section className="border-t border-gallery-border bg-gallery-surface py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-gallery-text">
                Built With
              </h2>
              <p className="mt-4 text-gallery-muted">
                The technology behind the gallery
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
                <h3 className="font-heading text-lg font-semibold text-gallery-text">
                  Neural Style Transfer
                </h3>
                <p className="mt-2 text-sm text-gallery-muted">
                  Deep learning algorithms that separate and recombine content
                  and style representations from images, originally developed by
                  Gatys et al. (2015).
                </p>
              </div>
              <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
                <h3 className="font-heading text-lg font-semibold text-gallery-text">
                  Next.js + React
                </h3>
                <p className="mt-2 text-sm text-gallery-muted">
                  Static site generation with Next.js for fast loading, SEO
                  optimization, and a smooth browsing experience across all
                  devices.
                </p>
              </div>
              <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
                <h3 className="font-heading text-lg font-semibold text-gallery-text">
                  Tailwind CSS
                </h3>
                <p className="mt-2 text-sm text-gallery-muted">
                  A custom dark gallery theme with gold accents, designed to let
                  the artwork take center stage while providing an elegant
                  browsing experience.
                </p>
              </div>
              <div className="rounded-xl border border-gallery-border bg-gallery-card p-6">
                <h3 className="font-heading text-lg font-semibold text-gallery-text">
                  Museum-Quality Prints
                </h3>
                <p className="mt-2 text-sm text-gallery-muted">
                  Available as posters, t-shirts, and stickers through our
                  Shopify store, printed on demand with archival-quality
                  materials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-gallery-text">
            Ready to Explore?
          </h2>
          <p className="mt-4 text-gallery-muted">
            Browse the complete collection or shop museum-quality prints
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`${basePath}/gallery`}
              className="inline-flex items-center gap-2 rounded-lg bg-gallery-accent px-8 py-4 text-sm font-bold text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover"
            >
              Browse Gallery
            </Link>
            <a
              href="https://moderndesignconcept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gallery-border px-8 py-4 text-sm font-semibold text-gallery-text transition-all duration-300 hover:border-gallery-accent/50 hover:text-gallery-accent"
            >
              Shop Prints
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
