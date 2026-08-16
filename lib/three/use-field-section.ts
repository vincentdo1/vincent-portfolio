"use client";

import { useEffect, useRef } from "react";
import { registerSection } from "@/lib/three/field";
import type { ShapeKey } from "@/lib/three/shapes";

/**
 * Marks a section as the owner of a point-field shape.
 *
 * Attach the returned ref to the section element. While that section is the
 * one nearest the middle of the viewport, the field morphs to `shape`.
 *
 * Decorative only, and deliberately cheap to remove: if the canvas never
 * mounts (no WebGL, reduced motion, no JS) the registration is inert and the
 * section renders exactly the same.
 */
export function useFieldSection<T extends HTMLElement = HTMLElement>(
  shape: ShapeKey,
  hero = false,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerSection(el, shape, hero);
  }, [shape, hero]);

  return ref;
}
