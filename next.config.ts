import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/ai-art-gallery" : "",
  assetPrefix: isProd ? "/ai-art-gallery/" : "",
  trailingSlash: true,
};

export default nextConfig;
