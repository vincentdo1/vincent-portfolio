/**
 * SSR-safe dynamic wrapper for AirportGlobe.
 * react-globe.gl uses three.js which requires browser APIs — this ensures it
 * is never evaluated during Next.js server rendering.
 */
import dynamic from "next/dynamic";

export const AirportGlobe = dynamic(
  () => import("./airport-globe").then((mod) => mod.AirportGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(3,4,20,1)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground animate-pulse">
          Rendering globe...
        </span>
      </div>
    ),
  }
);
