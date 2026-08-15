"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll, skipped entirely when the user asked for reduced
 * motion. Lives in its own module behind the ssr:false boundary in
 * smooth-scroll-dynamic.tsx so lenis never enters the Worker bundle —
 * import it only from there.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return null;
}
