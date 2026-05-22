/**
 * SSR-safe wrapper. globe.gl loads from CDN at runtime (no npm install),
 * so the three.js bundle never enters the Cloudflare Workers server function.
 *
 * webpackPrefetch causes the browser to fetch the component JS chunk as an
 * idle background task right after page load.
 */
import dynamic from "next/dynamic";

export const GLOBE_CDN =
  "https://unpkg.com/globe.gl@2.46.1/dist/globe.gl.min.js";

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
