// Loads the vendored globe.gl browser build (public/vendor/) via a script
// tag. The npm package must never be imported from application code: OpenNext
// would bundle globe/Three into the Cloudflare Worker and blow the 3 MiB
// compressed script limit (see CLOUDFLARE_BUILD_SIZE_NOTES.txt). Types below
// cover only the surface the globe component uses.

export interface GlobeControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
}

export interface GlobeApi {
  width(v: number): GlobeApi;
  height(v: number): GlobeApi;
  globeImageUrl(v: string): GlobeApi;
  backgroundColor(v: string): GlobeApi;
  atmosphereColor(v: string): GlobeApi;
  atmosphereAltitude(v: number): GlobeApi;
  pointsData(v: object[]): GlobeApi;
  pointColor(v: string): GlobeApi;
  pointAltitude(v: string): GlobeApi;
  pointRadius(v: number): GlobeApi;
  pointsMerge(v: boolean): GlobeApi;
  arcsData(v: object[]): GlobeApi;
  arcColor(v: (d: object) => string[]): GlobeApi;
  arcDashLength(v: number): GlobeApi;
  arcDashGap(v: number): GlobeApi;
  arcDashAnimateTime(v: number): GlobeApi;
  arcStroke(v: number): GlobeApi;
  renderer(): { setPixelRatio?: (r: number) => void } | undefined;
  controls(): GlobeControls;
  pointOfView(
    pov: { lat: number; lng: number; altitude: number },
    ms?: number,
  ): GlobeApi;
  pauseAnimation(): GlobeApi;
  resumeAnimation(): GlobeApi;
  _destructor?: () => void;
}

export type GlobeCtor = new (
  el: HTMLElement,
  config?: { rendererConfig?: Record<string, unknown> },
) => GlobeApi;

const GLOBE_SRC = "/vendor/globe.gl-2.46.1.min.js";

let loading: Promise<GlobeCtor> | null = null;

export function loadGlobe(): Promise<GlobeCtor> {
  const w = window as Window & { Globe?: GlobeCtor };
  if (w.Globe) return Promise.resolve(w.Globe);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GLOBE_SRC;
      script.async = true;
      script.onload = () =>
        w.Globe
          ? resolve(w.Globe)
          : reject(new Error("globe.gl global missing"));
      script.onerror = () => {
        // Allow a later selection to retry with a fresh script tag.
        loading = null;
        script.remove();
        reject(new Error("globe.gl script failed"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}
