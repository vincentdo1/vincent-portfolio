"use client";

import dynamic from "next/dynamic";

// Three.js + R3F are heavy, so the preview is client-only and code-split: the
// chunk only loads when this component actually mounts (i.e. when the CHM-005
// card is selected, or on the dedicated /projects/helium-hydride route).
export const HehPreview = dynamic(
  () => import("./heh-preview").then((mod) => mod.HehPreview),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[oklch(0.1_0.02_145)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground animate-pulse">
          Rendering molecule...
        </span>
      </div>
    ),
  },
);
