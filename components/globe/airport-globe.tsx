"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { loadGlobe, type GlobeApi } from "./load-globe";
import { GlobeFallback } from "./globe-fallback";

const TOP_10 = new Set([
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
]);

type RawNode = { id: string; lat: number; lng: number };
type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
};

const HOME_POV = { lat: 26, lng: 80, altitude: 2.05 };

// Cyan for the busiest hubs — red stays reserved for errors/warnings.
const arcColorFn = (d: ArcDatum) =>
  d.color?.includes("red")
    ? ["#22d3ee", "rgba(34,211,238,0.12)"]
    : ["rgba(255,255,255,0.32)", "rgba(255,255,255,0.04)"];

export function AirportGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<GlobeApi | null>(null);
  const rotateRef = useRef(true);
  const inViewRef = useRef(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [rotating, setRotating] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rotateRef.current = !reducedMotion;
    setRotating(!reducedMotion);

    let mounted = true;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let resizeFrame = 0;

    const dataPromise = Promise.all([
      fetch("/projects/airport-nodes.json", { cache: "force-cache" }).then(
        (r) => r.json() as Promise<RawNode[]>,
      ),
      fetch("/projects/airport-arcs-preview.json", {
        cache: "force-cache",
      }).then((r) => r.json() as Promise<ArcDatum[]>),
    ]);

    // Offscreen or hidden tab: stop the renderer entirely, not just the
    // camera rotation, so the GPU goes idle.
    const applyActivity = () => {
      const world = worldRef.current;
      if (!world) return;
      const active =
        inViewRef.current && document.visibilityState === "visible";
      if (active) {
        world.resumeAnimation();
        const ctrl = world.controls?.();
        if (ctrl) ctrl.autoRotate = rotateRef.current;
      } else {
        world.pauseAnimation();
      }
    };

    const scheduleResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        if (worldRef.current && mounted) {
          worldRef.current.width(el.clientWidth).height(el.clientHeight);
        }
      });
    };

    io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry?.isIntersecting ?? true;
        applyActivity();
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", applyActivity);

    Promise.all([loadGlobe(), dataPromise])
      .then(([Globe, [rawNodes, rawArcs]]) => {
        if (!mounted) return;

        const nodes = rawNodes.map((n) => ({
          ...n,
          color: TOP_10.has(n.id) ? "#22d3ee" : "rgba(255,255,255,0.55)",
          size: TOP_10.has(n.id) ? 0.5 : 0.07,
        }));

        const world = new Globe(el, {
          rendererConfig: {
            antialias: window.devicePixelRatio <= 1.25,
            alpha: false,
            powerPreference: "high-performance",
          },
        });
        worldRef.current = world;

        world
          .width(el.clientWidth)
          .height(el.clientHeight)
          .globeImageUrl("/projects/earth-night.jpg")
          .backgroundColor("rgba(3,4,20,1)")
          .atmosphereColor("rgba(34,211,238,0.2)")
          .atmosphereAltitude(0.11)
          .pointsData(nodes)
          .pointColor("color")
          .pointAltitude("size")
          .pointRadius(0.32)
          .pointsMerge(true)
          .arcsData(rawArcs)
          .arcColor((d: object) => arcColorFn(d as ArcDatum))
          .arcDashLength(0.38)
          .arcDashGap(0.14)
          .arcDashAnimateTime(2400)
          .arcStroke(0.38);

        world
          .renderer?.()
          ?.setPixelRatio?.(Math.min(window.devicePixelRatio || 1, 1.5));

        const ctrl = world.controls();
        ctrl.autoRotateSpeed = 0.38;
        ctrl.enableZoom = false;
        applyActivity();
        world.pointOfView(HOME_POV, 0);

        ro = new ResizeObserver(scheduleResize);
        ro.observe(el);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setFailed(true);
      });

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", applyActivity);
      ro?.disconnect();
      io?.disconnect();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      worldRef.current?._destructor?.();
      worldRef.current = null;
    };
  }, []);

  const toggleRotation = () => {
    rotateRef.current = !rotateRef.current;
    setRotating(rotateRef.current);
    const ctrl = worldRef.current?.controls?.();
    if (ctrl) ctrl.autoRotate = rotateRef.current;
  };

  const resetView = () => {
    worldRef.current?.pointOfView(HOME_POV, 600);
  };

  if (failed) return <GlobeFallback />;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      {ready && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleRotation}
            aria-label={
              rotating ? "Pause globe rotation" : "Resume globe rotation"
            }
            className="flex h-11 w-11 items-center justify-center border border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary"
          >
            {rotating ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset globe view"
            className="flex h-11 w-11 items-center justify-center border border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
