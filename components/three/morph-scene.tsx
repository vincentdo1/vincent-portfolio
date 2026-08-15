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
import { Canvas, useFrame } from "@react-three/fiber";
import { MorphField } from "@/components/three/morph-field";
import { useDeviceProfile } from "@/lib/three/device";

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

function CameraRig({
  progressRef,
  reduced,
}: {
  progressRef: React.RefObject<number>;
  reduced: boolean;
}) {
  const shake = useRef(0);

  useFrame((state, delta) => {
    const camera = state.camera;
    const p = progressRef.current ?? 0;
    // pull back through the sequence so later shapes get room to breathe
    const targetZ = 7.4 + p * 2.6;
    const targetY = Math.sin(p * Math.PI) * 0.8;

    camera.position.z +=
      (targetZ - camera.position.z) * Math.min(1, delta * 2.5);
    camera.position.y +=
      (targetY - camera.position.y) * Math.min(1, delta * 2.5);

    if (!reduced) {
      shake.current += delta;
      camera.position.x = Math.sin(shake.current * 0.24) * 0.45;
    }
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * WebGL is a nice-to-have here, never a dependency: if context creation
 * fails (no WebGL, blocklisted GPU, software rasterizer refused by
 * failIfMajorPerformanceCaveat) the hero simply renders without particles —
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

type Props = {
  progressRef: React.RefObject<number>;
  className?: string;
};

export function MorphScene({ progressRef, className }: Props) {
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

  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // stop rendering entirely when the canvas is scrolled past or the tab is hidden
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let onScreen = true;
    const sync = () =>
      setVisible(onScreen && document.visibilityState === "visible");

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
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

  // No usable GPU: the hero stays a typographic screen — copy, readouts, and
  // grid are plain DOM, so nothing is lost but the particles.
  if (!device.ready || !device.gl)
    return <div ref={hostRef} className={className} />;

  return (
    <div ref={hostRef} className={className}>
      <CanvasBoundary>
        <Canvas
          dpr={dpr}
          gl={glConfig}
          camera={{ position: [0, 0, 7.4], fov: 45, near: 0.1, far: 60 }}
          frameloop={visible ? "always" : "never"}
        >
          <PerfGovernor onDegrade={degrade} />
          <CameraRig progressRef={progressRef} reduced={device.reduced} />
          {/* key remount on degrade so buffers and segment cache start fresh */}
          <MorphField
            key={count}
            progressRef={progressRef}
            count={count}
            offsetX={offsetX}
            offsetY={offsetY}
            fieldScale={fieldScale}
            staticMode={device.reduced}
          />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
