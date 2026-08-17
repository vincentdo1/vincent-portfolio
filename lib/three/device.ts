"use client";

import { useSyncExternalStore } from "react";

/**
 * Device class + motion policy.
 *
 * This used to read once and cache forever behind a no-op subscription, so it
 * was only correct at cold load: turning on Reduce Motion mid-visit, rotating
 * a phone, resizing a window, or zooming to a reflow width all left the page
 * acting on a stale profile. It now subscribes to the media queries that can
 * actually change and re-reads when they fire.
 *
 * `gl` is deliberately *not* re-probed on change — creating a WebGL context is
 * expensive and hardware support does not change during a visit.
 */
export type DeviceProfile = {
  ready: boolean;
  /** Narrow viewport, few cores, or Save-Data: use the low point budget. */
  weak: boolean;
  narrow: boolean;
  reduced: boolean;
  /** The visitor asked for less data; don't pull a decorative 3D chunk. */
  saveData: boolean;
  /** Hardware-accelerated WebGL is actually available. */
  gl: boolean;
};

const SERVER_PROFILE: DeviceProfile = {
  ready: false,
  weak: true,
  narrow: false,
  reduced: false,
  saveData: false,
  gl: false,
};

/**
 * Probe before any <Canvas> mounts.
 *
 * Note what this does and does not buy. `failIfMajorPerformanceCaveat` is a
 * best-effort browser hint, not a guarantee of hardware acceleration and not
 * a deterministic rejection of software rasterizers — SwiftShader passes it.
 * It filters some blocklisted configurations and nothing more. The actual
 * safety net for a slow device is PerfGovernor in morph-scene.tsx, which
 * measures real frame times and degrades the point budget.
 */
function probeWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const attrs = { failIfMajorPerformanceCaveat: true };
    const gl =
      canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs);
    return gl !== null && gl !== undefined;
  } catch {
    return false;
  }
}

let cachedGl: boolean | null = null;
let snapshot: DeviceProfile | null = null;

function readProfile(): DeviceProfile {
  if (snapshot) return snapshot;

  if (cachedGl === null) cachedGl = probeWebgl();

  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true;

  snapshot = {
    ready: true,
    narrow,
    saveData,
    weak: narrow || cores <= 4 || saveData,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    gl: cachedGl,
  };
  return snapshot;
}

/**
 * useSyncExternalStore requires a stable snapshot: returning a fresh object
 * every call is an infinite render loop. `snapshot` is memoised and only
 * cleared when something we subscribe to actually changes.
 */
function invalidate() {
  snapshot = null;
}

function subscribe(onChange: () => void) {
  const notify = () => {
    invalidate();
    onChange();
  };

  const queries = [
    window.matchMedia("(max-width: 767px)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];
  for (const q of queries) q.addEventListener("change", notify);

  const connection = (
    navigator as Navigator & { connection?: EventTarget | undefined }
  ).connection;
  connection?.addEventListener?.("change", notify);

  // orientation change and zoom-to-reflow both surface as a resize
  window.addEventListener("resize", notify);

  return () => {
    for (const q of queries) q.removeEventListener("change", notify);
    connection?.removeEventListener?.("change", notify);
    window.removeEventListener("resize", notify);
  };
}

export function useDeviceProfile(): DeviceProfile {
  return useSyncExternalStore(subscribe, readProfile, () => SERVER_PROFILE);
}

/** False in server HTML and during hydration, true once the script runs. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
