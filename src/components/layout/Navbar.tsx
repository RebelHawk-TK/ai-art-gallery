"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn, getBasePath } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = getBasePath();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-gallery-bg/90 backdrop-blur-md border-b border-gallery-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`${basePath}/`}
            className="font-heading text-xl font-bold text-gallery-text transition-colors duration-300 hover:text-gallery-accent"
            onClick={closeMobile}
          >
            AI Art Gallery
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`${basePath}${link.href}`}
                className="text-sm font-medium text-gallery-muted transition-colors duration-300 hover:text-gallery-text"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://moderndesignconcept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gallery-accent px-4 py-2 text-sm font-semibold text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover"
            >
              Shop Prints
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gallery-muted transition-colors duration-300 hover:text-gallery-text md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-gallery-border bg-gallery-bg/95 backdrop-blur-md px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`${basePath}${link.href}`}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-gallery-muted transition-colors duration-300 hover:bg-gallery-surface hover:text-gallery-text"
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://moderndesignconcept.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-lg bg-gallery-accent px-3 py-2.5 text-center text-base font-semibold text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover"
            onClick={closeMobile}
          >
            Shop Prints
          </a>
        </div>
      </div>
    </nav>
  );
}
