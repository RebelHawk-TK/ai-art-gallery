export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugToTitle(slug: string): string {
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return n.toString();
}

export function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/ai-art-gallery" : "";
}
