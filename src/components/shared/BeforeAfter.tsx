"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/shared/OptimizedImage";

interface ImageData {
  src: string;
  alt: string;
  blurDataUrl: string;
}

interface BeforeAfterProps {
  before: ImageData;
  after: ImageData;
  className?: string;
}

export default function BeforeAfter({
  before,
  after,
  className,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  // Keyboard support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + step));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "before-after-slider relative overflow-hidden rounded-lg",
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
    >
      {/* After image (full width, underneath) */}
      <div className="relative aspect-[3/2] w-full">
        <OptimizedImage
          src={after.src}
          alt={after.alt}
          blurDataUrl={after.blurDataUrl}
          className="absolute inset-0 h-full w-full"
          priority
        />
      </div>

      {/* Before image (clipped to position via clip-path) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <OptimizedImage
          src={before.src}
          alt={before.alt}
          blurDataUrl={before.blurDataUrl}
          className="absolute inset-0 h-full w-full"
          priority
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white/80"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Grab handle */}
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-gallery-bg/60 backdrop-blur-sm">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9l-3 3 3 3m8-6l3 3-3 3"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-gallery-bg/70 px-2 py-1 text-xs font-medium text-gallery-text backdrop-blur-sm">
        Original
      </div>
      <div className="absolute bottom-3 right-3 z-10 rounded-md bg-gallery-bg/70 px-2 py-1 text-xs font-medium text-gallery-accent backdrop-blur-sm">
        Styled
      </div>
    </div>
  );
}
