"use client";

/**
 * AirportGlobe — loads globe.gl from CDN at runtime so three.js never
 * enters the Next.js / Cloudflare Workers server bundle.
 */
import { useEffect, useRef } from "react";

const GLOBE_CDN =
  "https://unpkg.com/globe.gl@2.46.1/dist/globe.gl.min.js";

const TOP_10 = new Set([
  "PEK", "IST", "SVO", "DEL", "URC", "ICN", "DXB", "KUL", "CCU", "YYZ",
]);

type RawNode  = { id: string; lat: number; lng: number };
type ArcDatum = { startLat: number; startLng: number; endLat: number; endLng: number; color: string[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeInstance = any;

const arcColorFn = (d: ArcDatum) =>
  d.color?.includes("red")
    ? ["#ef4444", "rgba(239,68,68,0.12)"]
    : ["rgba(255,255,255,0.32)", "rgba(255,255,255,0.04)"];

export function AirportGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mounted   = true;
    let world: GlobeInstance = null;
    let ro: ResizeObserver | null = null;

    function initGlobe(GlobeFn: (cfg?: object) => GlobeInstance) {
      if (!el) return;
      Promise.all([
        fetch("/projects/airport-nodes.json").then((r) => r.json()),
        fetch("/projects/airport-arcs-preview.json").then((r) => r.json()),
      ]).then(([rawNodes, rawArcs]: [RawNode[], ArcDatum[]]) => {
        if (!mounted || !el) return;

        const nodes = rawNodes.map((n: RawNode) => ({
          ...n,
          color: TOP_10.has(n.id) ? "#ef4444" : "rgba(255,255,255,0.55)",
          size:  TOP_10.has(n.id) ? 0.5       : 0.07,
        }));

        const container = el as Element;
        world = GlobeFn({ rendererConfig: { antialias: true, alpha: false } })
          .width(container.clientWidth)
          .height(container.clientHeight)
          .globeImageUrl("/projects/earth-night.jpg")
          .backgroundColor("rgba(3,4,20,1)")
          .atmosphereColor("rgba(239,68,68,0.22)")
          .atmosphereAltitude(0.11)
          /* airport dots */
          .pointsData(nodes)
          .pointColor("color")
          .pointAltitude("size")
          .pointRadius(0.32)
          .pointsMerge(true)
          /* animated routes */
          .arcsData(rawArcs)
          .arcColor(arcColorFn)
          .arcDashLength(0.38)
          .arcDashGap(0.14)
          .arcDashAnimateTime(2400)
          .arcStroke(0.38)
          (container);                            // mount to DOM

        /* auto-rotate, no zoom in the card */
        const ctrl = world.controls();
        ctrl.autoRotate      = true;
        ctrl.autoRotateSpeed = 0.38;
        ctrl.enableZoom      = false;
        world.pointOfView({ lat: 26, lng: 80, altitude: 2.05 }, 0);

        /* keep globe sized to the card */
        ro = new ResizeObserver(() => {
          if (world && mounted && el) {
            world.width(el.clientWidth).height(el.clientHeight);
          }
        });
        ro.observe(el);
      });
    }

    /* re-use the already-loaded library if present */
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.Globe === "function") {
      initGlobe(w.Globe as (cfg?: object) => GlobeInstance);
    } else {
      const script = document.createElement("script");
      script.src   = GLOBE_CDN;
      script.async = true;
      script.onload = () => {
        if (mounted) initGlobe(w.Globe as (cfg?: object) => GlobeInstance);
      };
      document.head.appendChild(script);
    }

    return () => {
      mounted = false;
      ro?.disconnect();
      world?._destructor?.();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />;
}
