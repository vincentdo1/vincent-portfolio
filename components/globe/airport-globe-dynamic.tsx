/**
 * SSR-safe dynamic wrapper for AirportGlobe.
 *
 * webpackPrefetch: true — the browser downloads the three.js / react-globe.gl
 * chunk as an idle background task right after the page finishes loading, so
 * it's already in the browser cache by the time the user clicks Airport Paths.
 */
import dynamic from "next/dynamic";

export const AirportGlobe = dynamic(
  () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "airport-globe" */
      "./airport-globe"
    ).then((mod) => mod.AirportGlobe),
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
