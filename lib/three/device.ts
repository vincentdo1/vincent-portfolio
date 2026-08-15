"use client";

import { useSyncExternalStore } from "react";

/**
 * Device class + motion policy, read once per visit.
 *
 * useSyncExternalStore instead of set-state-in-effect: the server snapshot
 * is a conservative "not ready" profile and the first client render swaps in
 * the real one, with no cascading effect render.
 */
export type DeviceProfile = {
  ready: boolean;
  /** Narrow viewport, few cores, or Save-Data: use the low point budget. */
  weak: boolean;
  narrow: boolean;
  reduced: boolean;
  /** Hardware-accelerated WebGL is actually available. */
  gl: boolean;
};

const SERVER_PROFILE: DeviceProfile = {
  ready: false,
  weak: true,
  narrow: false,
  reduced: false,
  gl: false,
};

let cached: DeviceProfile | null = null;

const subscribe = () => () => {};

/**
 * Probe before any <Canvas> mounts: an error boundary can't reliably catch
 * r3f's context-creation failure, and failIfMajorPerformanceCaveat means a
 * software rasterizer must count as "no WebGL" so fallbacks kick in
 * deterministically instead of janking.
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

function readProfile(): DeviceProfile {
  if (!cached) {
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    cached = {
      ready: true,
      narrow,
      weak: narrow || cores <= 4 || saveData,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      gl: probeWebgl(),
    };
  }
  return cached;
}

export function useDeviceProfile(): DeviceProfile {
  return useSyncExternalStore(subscribe, readProfile, () => SERVER_PROFILE);
}

/** False in server HTML and during hydration, true once the script runs. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
