import Link from "next/link";
import { getBasePath } from "@/lib/utils";

const FOOTER_LINKS = [
  { label: "Gallery", href: "/gallery" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
] as const;

export default function Footer() {
  const basePath = getBasePath();

  return (
    <footer className="border-t border-gallery-border bg-gallery-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link
              href={`${basePath}/`}
              className="font-heading text-lg font-bold text-gallery-text transition-colors duration-300 hover:text-gallery-accent"
            >
              AI Art Gallery
            </Link>
            <p className="mt-1 text-sm text-gallery-muted">
              Powered by Neural Style Transfer
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`${basePath}${link.href}`}
                className="text-sm text-gallery-muted transition-colors duration-300 hover:text-gallery-text"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://moderndesignconcept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gallery-accent transition-colors duration-300 hover:text-gallery-accent-hover"
            >
              Shop
            </a>
          </nav>
        </div>

        {/* Divider and copyright */}
        <div className="mt-8 border-t border-gallery-border pt-8 text-center">
          <p className="text-sm text-gallery-muted">
            &copy; 2026 Modern Design Concept. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
