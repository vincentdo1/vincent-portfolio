"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * Tracks how far a tall section has scrolled through the viewport.
 *
 * Returns a ref (read by the render loop every frame, never triggers React)
 * and a stage index (drives the DOM copy, only re-renders when it changes).
 */
export function useScrollStage(
  targetRef: React.RefObject<HTMLElement | null>,
  stageCount: number,
) {
  const progress = useRef(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = targetRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // finish the sequence before the sticky panel releases, so the last
      // shape gets a real plateau instead of scrolling away mid-morph
      const travel = (rect.height - window.innerHeight) * 0.86;
      const p = travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1);
      progress.current = p;

      const next = clamp(Math.round(p * (stageCount - 1)), 0, stageCount - 1);
      setStage((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef, stageCount]);

  return { progress, stage };
}
