"use client";

import { useEffect, useRef, useState } from "react";

interface StatsBarProps {
  landmarkCount: number;
  styleCount: number;
  artworkCount: number;
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, target, duration]);

  return { count, ref };
}

export function StatsBar({
  landmarkCount,
  styleCount,
  artworkCount,
}: StatsBarProps) {
  const landmarks = useCountUp(landmarkCount);
  const styles = useCountUp(styleCount);
  const artworks = useCountUp(artworkCount);

  return (
    <section className="border-y border-gallery-border bg-gallery-surface">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div ref={landmarks.ref}>
            <div className="font-heading text-3xl font-bold text-gallery-accent sm:text-4xl">
              {landmarks.count}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wider text-gallery-muted">
              Landmarks
            </div>
          </div>
          <div ref={styles.ref}>
            <div className="font-heading text-3xl font-bold text-gallery-accent sm:text-4xl">
              {styles.count}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wider text-gallery-muted">
              Art Styles
            </div>
          </div>
          <div ref={artworks.ref}>
            <div className="font-heading text-3xl font-bold text-gallery-accent sm:text-4xl">
              {artworks.count}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wider text-gallery-muted">
              Artworks
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
