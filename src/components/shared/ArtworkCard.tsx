"use client";

import Link from "next/link";
import { cn, getBasePath, slugToTitle } from "@/lib/utils";
import type { ArtworkEntry } from "@/types/artwork";
import OptimizedImage from "@/components/shared/OptimizedImage";

interface ArtworkCardProps {
  artwork: ArtworkEntry;
  index?: number;
}

export default function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const basePath = getBasePath();

  return (
    <Link
      href={`${basePath}/artwork/${artwork.id}`}
      className="group relative block overflow-hidden rounded-lg bg-gallery-card transition-all duration-300 hover:shadow-xl hover:shadow-gallery-accent/5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image container with 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <OptimizedImage
          src={`${basePath}${artwork.images.thumb}`}
          alt={artwork.title}
          blurDataUrl={artwork.images.blurDataUrl}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-gallery-bg/90 via-gallery-bg/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="font-heading text-base font-semibold text-gallery-text line-clamp-2">
            {artwork.title}
          </h3>
          <p className="mt-1 text-sm text-gallery-accent">
            {slugToTitle(artwork.style)}
          </p>
        </div>
      </div>
    </Link>
  );
}
