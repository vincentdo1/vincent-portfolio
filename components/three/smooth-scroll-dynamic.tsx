"use client";

import dynamic from "next/dynamic";

/** ssr:false boundary for lenis — import SmoothScroll from here only. */
export const SmoothScroll = dynamic(
  () => import("@/components/three/smooth-scroll").then((m) => m.SmoothScroll),
  { ssr: false, loading: () => null },
);
