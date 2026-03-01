"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  blurDataUrl: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  blurDataUrl,
  width,
  height,
  className,
  sizes,
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load via IntersectionObserver unless priority
  useEffect(() => {
    if (priority) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: `url(${blurDataUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
