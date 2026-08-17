"use client";

import { useDeviceProfile } from "@/lib/three/device";
import { MorphScene } from "@/components/three/morph-scene-dynamic";

/**
 * Eligibility gate that sits *outside* the dynamic Three.js import.
 *
 * MorphScene is a `ssr:false` dynamic component, so rendering it at all
 * begins fetching and parsing the ~194 KB (Brotli) Three/R3F chunk. The
 * decision not to draw anything used to live *inside* that component, which
 * meant reduced-motion visitors, Save-Data visitors, and machines with no
 * usable WebGL paid the full download and parse cost to reach a `return null`.
 *
 * Deciding out here means the chunk is never requested for anyone who cannot
 * or should not see it. `lib/three/device.ts` imports no Three.js.
 */
export function FieldBackdrop({ className }: { className?: string }) {
  const device = useDeviceProfile();

  if (!device.ready) return null;
  if (!device.gl) return null;
  if (device.reduced) return null;
  if (device.saveData) return null;

  return <MorphScene className={className} />;
}
