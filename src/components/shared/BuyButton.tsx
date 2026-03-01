import { cn } from "@/lib/utils";

interface BuyButtonProps {
  shopifyUrl?: string;
  className?: string;
}

export default function BuyButton({ shopifyUrl, className }: BuyButtonProps) {
  const href = shopifyUrl || "https://moderndesignconcept.com";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-gallery-accent px-6 py-3 text-sm font-semibold text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover hover:shadow-lg",
        className
      )}
    >
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
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      Buy Print &mdash; $19.99
    </a>
  );
}
