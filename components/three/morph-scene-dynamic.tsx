"use client";

import dynamic from "next/dynamic";

/**
 * Single entry point for the 3D layer.
 *
 * Every three.js import lives behind this ssr:false boundary so the library
 * never enters the server render path — which is also what keeps it out of the
 * OpenNext Cloudflare Worker bundle. Import MorphScene from here, never
 * directly from morph-scene.tsx.
 */
export const MorphScene = dynamic(
  () => import("@/components/three/morph-scene").then((m) => m.MorphScene),
  {
    ssr: false,
    loading: () => null,
  },
);
