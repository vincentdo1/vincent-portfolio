"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MorphField } from "@/components/three/morph-field";
import { useDeviceProfile } from "@/lib/three/device";
import { field } from "@/lib/three/field";

/**
 * Watches real frame times and fires `onDegrade` once if the device
 * demonstrably can't hold the budget: two consecutive 1.5s windows where
 * over 40% of frames run slower than 28fps.
 */
function PerfGovernor({ onDegrade }: { onDegrade: () => void }) {
  const warmup = useRef(0);
  const win = useRef({ time: 0, frames: 0, slow: 0, badWindows: 0 });
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) return;
    // huge deltas are tab switches / frameloop resumes, not real frames
    if (delta > 0.5) return;

    // let shader compile and first paints settle before judging
    if (warmup.current < 2.5) {
      warmup.current += delta;
      return;
    }

    const w = win.current;
    w.time += delta;
    w.frames += 1;
    if (delta > 1 / 28) w.slow += 1;

    if (w.time >= 1.5) {
      const slowShare = w.slow / Math.max(1, w.frames);
      w.badWindows = slowShare > 0.4 ? w.badWindows + 1 : 0;
      w.time = 0;
      w.frames = 0;
      w.slow = 0;
      if (w.badWindows >= 2) {
        done.current = true;
        onDegrade();
      }
    }
  });

  return null;
}

function CameraRig() {
  const shake = useRef(0);

  useFrame((state, delta) => {
    const camera = state.camera;
    const p = field.progress;
    // pull back through the shapes so later ones get room to breathe, then
    // further still below the intro so the field reads as distance
    const targetZ = 7.4 + p * 2.6 + field.recede * 1.6;
    const targetY = Math.sin(p * Math.PI) * 0.8;

    camera.position.z +=
      (targetZ - camera.position.z) * Math.min(1, delta * 2.5);
    camera.position.y +=
      (targetY - camera.position.y) * Math.min(1, delta * 2.5);

    shake.current += delta;
    camera.position.x = Math.sin(shake.current * 0.24) * 0.45;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Wakes the demand-driven loop.
 *
 * `frameloop="demand"` means nothing renders unless something asks. Scrolling
 * is the only input that can change what the field should look like, so it is
 * the only thing that needs to wake it; MorphField then keeps the loop alive
 * frame by frame until the morph and the pull-back have both settled, and the
 * canvas goes quiet again. Below the intro the field is a static texture, and
 * a static texture should not cost a redraw every 16ms.
 */
function FrameWaker() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [invalidate]);

  return null;
}

/**
 * WebGL is a nice-to-have here, never a dependency: if context creation
 * fails (no WebGL, blocklisted GPU, software rasterizer refused by
 * failIfMajorPerformanceCaveat) the page simply renders without particles —
 * the copy, readouts, and grid are plain DOM and unaffected.
 */
class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The point field, fixed behind the entire document.
 *
 * Purely decorative. Every section owns its own copy in normal-flow DOM and
 * registers a shape for the field to morph to (`lib/three/field.ts`); nothing
 * on the page depends on this rendering, or on WebGL existing at all.
 *
 * Exactly one WebGL context, and zero downloaded assets — the geometry is
 * math (`lib/three/shapes.ts`).
 *
 * Not rendered at all for `prefers-reduced-motion`. A frozen point cloud is
 * still a large moving-looking object behind text, and the sections read
 * perfectly well without it, so the honest reduced-motion answer is no canvas
 * rather than a static one.
 */
export function MorphScene({ className }: { className?: string }) {
  const device = useDeviceProfile();

  // One-way ratchet: hardwareConcurrency misses plenty of slow machines
  // (locked-down corporate laptops, thermally throttled phones), so if real
  // frames come in slow the field drops to the weak budget instead of
  // stuttering for the rest of the visit.
  const [degraded, setDegraded] = useState(false);
  const degrade = useCallback(() => setDegraded(true), []);

  const weak = device.weak || degraded;
  const count = weak ? 6000 : 22000;
  const dpr: [number, number] = weak ? [1, 1.25] : [1, 1.75];

  // Wide screens put the field beside the copy. Narrow ones stack them, so
  // the field lifts and shrinks into the space above the text instead of
  // sitting behind it — legibility first, and the art reads better uncrowded.
  const offsetX = device.narrow ? 0 : 1.7;
  const offsetY = device.narrow ? 1.35 : 0;
  const fieldScale = device.narrow ? 0.72 : 1;

  // The canvas is fixed and always on screen now, so an IntersectionObserver
  // has nothing left to tell us. Tab visibility is the gate that still matters.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const glConfig = useMemo(
    () => ({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance" as const,
      stencil: false,
      depth: true,
      // a software-rasterized context would guarantee jank; better to show
      // no particles at all (CanvasBoundary handles the resulting throw)
      failIfMajorPerformanceCaveat: true,
    }),
    [],
  );

  // No usable GPU, or the visitor asked for reduced motion: no canvas. Every
  // section is plain DOM, so nothing is lost but the decoration.
  if (!device.ready || !device.gl || device.reduced) return null;

  return (
    <div className={className} aria-hidden="true">
      <CanvasBoundary>
        <Canvas
          dpr={dpr}
          gl={glConfig}
          camera={{ position: [0, 0, 7.4], fov: 45, near: 0.1, far: 60 }}
          // demand, not always: below the intro the field is a static texture
          // and should cost nothing. FrameWaker wakes it on scroll, MorphField
          // keeps it alive until the morph settles.
          frameloop={visible ? "demand" : "never"}
        >
          <PerfGovernor onDegrade={degrade} />
          <FrameWaker />
          <CameraRig />
          {/* key remount on degrade so buffers and segment cache start fresh */}
          <MorphField
            key={count}
            count={count}
            offsetX={offsetX}
            offsetY={offsetY}
            fieldScale={fieldScale}
          />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
