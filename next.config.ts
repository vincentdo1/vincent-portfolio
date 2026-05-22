import type { NextConfig } from "next";

const immutableCacheHeader = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      { source: "/projects/:path*", headers: [immutableCacheHeader] },
      { source: "/hero-bg.jpg", headers: [immutableCacheHeader] },
      { source: "/og.jpg", headers: [immutableCacheHeader] },
      { source: "/project-placeholder-1.jpg", headers: [immutableCacheHeader] },
      { source: "/project-placeholder-2.jpg", headers: [immutableCacheHeader] },
      { source: "/project-placeholder-3.jpg", headers: [immutableCacheHeader] },
      { source: "/resume.pdf", headers: [immutableCacheHeader] },
    ];
  },
};

export default nextConfig;
