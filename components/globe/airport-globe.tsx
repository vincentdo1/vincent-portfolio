"use client";

import Globe from "react-globe.gl";
import { useRef, useEffect, useState, useCallback } from "react";
import type { GlobeMethods } from "react-globe.gl";
// Bundled at build time — zero fetch round-trips on mount
import rawNodes from "../../public/projects/airport-nodes.json";
import rawArcs from "../../public/projects/airport-arcs-preview.json";

/* ─── types ─────────────────────────────────────────────────────────── */
type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
};

/* ─── data — computed once when the module is first loaded ───────────── */
const TOP_10 = new Set([
  "PEK", "IST", "SVO", "DEL", "URC", "ICN", "DXB", "KUL", "CCU", "YYZ",
]);

const NODES = rawNodes.map((n) => ({
  ...n,
  color: TOP_10.has(n.id) ? "#ef4444" : "rgba(255,255,255,0.55)",
  size:  TOP_10.has(n.id) ? 0.5       : 0.07,
}));

const ARCS = rawArcs as unknown as ArcDatum[];

/* ─── arc color helper ───────────────────────────────────────────────── */
const arcColor = (d: object) => {
  const arc = d as ArcDatum;
  return arc.color?.includes("red")
    ? ["#ef4444", "rgba(239,68,68,0.12)"]
    : ["rgba(255,255,255,0.32)", "rgba(255,255,255,0.04)"];
};

/* ─── component ──────────────────────────────────────────────────────── */
export function AirportGlobe() {
  const globeEl      = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* measure once on mount, then track resizes */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();                          // synchronous — sets size before first paint
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* configure globe after WebGL context is ready */
  const onGlobeReady = useCallback(() => {
    const ctrl = globeEl.current?.controls();
    if (ctrl) {
      ctrl.autoRotate      = true;
      ctrl.autoRotateSpeed = 0.38;
      ctrl.enableZoom      = false;
    }
    // Center on South/Central Asia — where most top-10 hubs cluster
    globeEl.current?.pointOfView({ lat: 26, lng: 80, altitude: 2.05 }, 0);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {size.w > 0 && (
        <Globe
          ref={globeEl}
          width={size.w}
          height={size.h}
          /* local texture — no CDN round-trip */
          globeImageUrl="/projects/earth-night.jpg"
          backgroundColor="rgba(3,4,20,1)"
          atmosphereColor="rgba(239,68,68,0.22)"
          atmosphereAltitude={0.11}
          /* airport dots */
          pointsData={NODES}
          pointColor="color"
          pointAltitude="size"
          pointRadius={0.32}
          pointsMerge
          /* animated routes */
          arcsData={ARCS}
          arcColor={arcColor}
          arcDashLength={0.38}
          arcDashGap={0.14}
          arcDashAnimateTime={2400}
          arcStroke={0.38}
          onGlobeReady={onGlobeReady}
        />
      )}
    </div>
  );
}
