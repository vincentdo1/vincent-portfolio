import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Prevent three.js and react-globe.gl from being bundled into the Cloudflare
   * Workers server function. The globe component is `ssr: false` so these
   * packages are never executed server-side — they only belong in the client
   * chunk. Without this, the server handler blows past the 10 MiB Workers limit.
   */
  serverExternalPackages: [
    "react-globe.gl",
    "three",
    "three-globe",
    "satellite.js",
    "kdbush",
    "supercluster",
  ],
};

export default nextConfig;
