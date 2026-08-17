"use client";

import { useEffect } from "react";
import { registerSection } from "@/lib/three/field";
import type { ShapeKey } from "@/lib/three/shapes";

/**
 * Registers an existing section, by id, as the owner of a field shape.
 *
 * Lets a server component take part in the decorative field without becoming
 * a client component itself: drop this anywhere inside the section and point
 * it at the section's own id. Renders nothing.
 *
 * The alternative — a ref — would force the whole section to be a client
 * component just to hold it, which is a poor trade for decoration.
 */
export function FieldRegion({
  targetId,
  shape,
}: {
  targetId: string;
  shape: ShapeKey;
}) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    return registerSection(el, shape);
  }, [targetId, shape]);

  return null;
}
