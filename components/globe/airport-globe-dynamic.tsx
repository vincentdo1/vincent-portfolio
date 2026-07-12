"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { GlobeFallback } from "./globe-fallback";

const GlobeInner = dynamic(
  () => import("./airport-globe").then((mod) => mod.AirportGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(3,4,20,1)]">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground animate-pulse">
          Rendering globe...
        </span>
      </div>
    ),
  },
);

/* If the globe chunk itself fails to load, fall back to the static image
   instead of crashing the section. */
class GlobeBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <GlobeFallback /> : this.props.children;
  }
}

export function AirportGlobe() {
  return (
    <GlobeBoundary>
      <GlobeInner />
    </GlobeBoundary>
  );
}
