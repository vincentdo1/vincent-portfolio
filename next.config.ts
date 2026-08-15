import type { NextConfig } from "next";

// Report-only CSP with no report endpoint configured: violations surface in
// the browser console only, so validation is manual. Before promoting to an
// enforced Content-Security-Policy, add a report destination (or accept
// manual checks), decide the Cloudflare RUM script's fate, and add
// upgrade-insecure-requests (ignored in report-only mode).
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

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
      { source: "/(.*)", headers: securityHeaders },
      {
        // Project media reuses stable filenames (the WIP video will be
        // replaced in place), so it must not be cached as immutable.
        source: "/projects/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        // Résumé changes under a stable filename — never cache it as
        // immutable or recruiters can see a year-stale version.
        source: "/resume.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
