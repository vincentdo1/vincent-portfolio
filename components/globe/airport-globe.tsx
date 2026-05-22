"use client";

import Globe from "react-globe.gl";
import { useRef, useEffect, useState, useCallback } from "react";
import type { GlobeMethods } from "react-globe.gl";

const TOP_10 = [
  "PEK",
  "IST",
  "SVO",
  "DEL",
  "URC",
  "ICN",
  "DXB",
  "KUL",
  "CCU",
  "YYZ",
];

type RawNode = { id: string; lat: number; lng: number };
type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
};
type NodeDatum = RawNode & { color: string; size: number };

export function AirportGlobe() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [nodes, setNodes] = useState<NodeDatum[]>([]);
  const [arcs, setArcs] = useState<ArcDatum[]>([]);

  /* ── size tracking ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: Math.round(width), h: Math.round(height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── data fetch ── */
  useEffect(() => {
    Promise.all([
      fetch("/projects/airport-nodes.json").then((r) => r.json()),
      fetch("/projects/airport-arcs-preview.json").then((r) => r.json()),
    ]).then(([rawNodes, rawArcs]: [RawNode[], ArcDatum[]]) => {
      setNodes(
        rawNodes.map((n) => ({
          ...n,
          color: TOP_10.includes(n.id) ? "#ef4444" : "rgba(255,255,255,0.55)",
          size: TOP_10.includes(n.id) ? 0.5 : 0.07,
        }))
      );
      setArcs(rawArcs);
    });
  }, []);

  /* ── initial camera + auto-rotate ── */
  const onGlobeReady = useCallback(() => {
    const ctrl = globeEl.current?.controls();
    if (ctrl) {
      ctrl.autoRotate = true;
      ctrl.autoRotateSpeed = 0.38;
      ctrl.enableZoom = false;
    }
    // Center on the South/Central Asia hub where most top-10 airports cluster
    globeEl.current?.pointOfView({ lat: 26, lng: 80, altitude: 2.05 }, 0);
  }, []);

  /* ── arc color: gradient from portfolio red → transparent ── */
  const arcColorFn = useCallback((d: object) => {
    const arc = d as ArcDatum;
    return Array.isArray(arc.color) && arc.color.includes("red")
      ? (["#ef4444", "rgba(239,68,68,0.12)"] as [string, string])
      : (["rgba(255,255,255,0.32)", "rgba(255,255,255,0.04)"] as [
          string,
          string,
        ]);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {size.w > 0 && (
        <Globe
          ref={globeEl}
          width={size.w}
          height={size.h}
          /* globe texture */
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(3,4,20,1)"
          atmosphereColor="rgba(239,68,68,0.22)"
          atmosphereAltitude={0.11}
          /* airport dots */
          pointsData={nodes}
          pointColor="color"
          pointAltitude="size"
          pointRadius={0.32}
          pointsMerge
          /* animated route arcs */
          arcsData={arcs}
          arcColor={arcColorFn}
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
