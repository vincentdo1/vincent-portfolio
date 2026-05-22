"use client";

import { useEffect, useRef } from "react";
import { GLOBE_CDN } from "@/components/globe/constants";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeInstance = any;
type GlobeFactory = (cfg?: object) => GlobeInstance;
type GlobeWindow = Window & { Globe?: GlobeFactory };

const arcColorFn = (d: ArcDatum) =>
  d.color?.includes("red")
    ? ["#ef4444", "rgba(239,68,68,0.12)"]
    : ["rgba(255,255,255,0.32)", "rgba(255,255,255,0.04)"];

export function AirportGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mounted = true;
    let inView = true;
    let world: GlobeInstance = null;
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

    const setAutoRotate = () => {
      const ctrl = world?.controls?.();
      if (ctrl)
        ctrl.autoRotate = inView && document.visibilityState === "visible";
    };

    const scheduleResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        if (world && mounted) {
          world.width(el.clientWidth).height(el.clientHeight);
        }
      });
    };

    const loadGlobe = () => {
      const win = window as GlobeWindow;
      if (typeof win.Globe === "function") return Promise.resolve(win.Globe);

      return new Promise<GlobeFactory>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[src="${GLOBE_CDN}"]`,
        );
        const onLoad = () => {
          if (typeof win.Globe === "function") resolve(win.Globe);
          else reject(new Error("Globe API did not attach to window"));
        };

        if (existing) {
          existing.addEventListener("load", onLoad, { once: true });
          existing.addEventListener("error", reject, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.src = GLOBE_CDN;
        script.async = true;
        script.crossOrigin = "anonymous";
        script.addEventListener("load", onLoad, { once: true });
        script.addEventListener("error", reject, { once: true });
        document.head.appendChild(script);
      });
    };

    io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
        setAutoRotate();
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", setAutoRotate);

    Promise.all([loadGlobe(), dataPromise])
      .then(([GlobeFn, [rawNodes, rawArcs]]) => {
        if (!mounted) return;

        const nodes = rawNodes.map((n) => ({
          ...n,
          color: TOP_10.has(n.id) ? "#ef4444" : "rgba(255,255,255,0.55)",
          size: TOP_10.has(n.id) ? 0.5 : 0.07,
        }));

        world = GlobeFn({
          rendererConfig: {
            antialias: window.devicePixelRatio <= 1.25,
            alpha: false,
            powerPreference: "high-performance",
          },
        })
          .width(el.clientWidth)
          .height(el.clientHeight)
          .globeImageUrl("/projects/earth-night.jpg")
          .backgroundColor("rgba(3,4,20,1)")
          .atmosphereColor("rgba(239,68,68,0.22)")
          .atmosphereAltitude(0.11)
          .pointsData(nodes)
          .pointColor("color")
          .pointAltitude("size")
          .pointRadius(0.32)
          .pointsMerge(true)
          .arcsData(rawArcs)
          .arcColor(arcColorFn)
          .arcDashLength(0.38)
          .arcDashGap(0.14)
          .arcDashAnimateTime(2400)
          .arcStroke(0.38)(el as Element);

        world
          .renderer?.()
          ?.setPixelRatio?.(Math.min(window.devicePixelRatio || 1, 1.5));

        const ctrl = world.controls();
        ctrl.autoRotateSpeed = 0.38;
        ctrl.enableZoom = false;
        setAutoRotate();
        world.pointOfView({ lat: 26, lng: 80, altitude: 2.05 }, 0);

        ro = new ResizeObserver(scheduleResize);
        ro.observe(el);
      })
      .catch((error) => {
        if (mounted) console.error("[globe] failed to initialize", error);
      });

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", setAutoRotate);
      ro?.disconnect();
      io?.disconnect();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      world?._destructor?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
  );
}
