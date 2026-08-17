"use client";

import { SHAPE_ORDER, shapeIndex, type ShapeKey } from "@/lib/three/shapes";

/**
 * The bridge between the page's sections and the one point field behind them.
 *
 * Two rules, both learned the hard way:
 *
 * **Never register two things that can share a vertical band.** The target is
 * whichever registered element is nearest the middle of the viewport, so
 * anything that can occupy the same band ties at distance zero and insertion
 * order silently decides the winner. Both project cards registered once; they
 * share a grid row on desktop, so the chess brain sat behind the Airport
 * Routing card and the globe was unreachable at any scroll position.
 *
 * This is about layout, not granularity. Per-item registration is fine where
 * items stack (the experience roles are a single-column list, so each owns a
 * shape); it is section-level only where they can sit side by side.
 *
 * **The shapes are an abstract progression, not labels.** They do not stand
 * for the content they sit behind, and nothing should be read into which
 * shape appears where. Treating them as semantic is what made a mismatch look
 * like a bug rather than decoration. Every section's meaning lives in its own
 * normal-flow DOM; this layer only has to look alive.
 */

const SEGMENTS = Math.max(1, SHAPE_ORDER.length - 1);

type Entry = { el: HTMLElement; index: number; hero: boolean };

const registry = new Set<Entry>();

export const field = {
  /** Where the morph should settle, 0→1 across SHAPE_ORDER. */
  target: 0,
  /** Animated position, owned by the render loop. */
  progress: 0,
  /** 1 while the intro owns the screen. */
  heroPresence: 1,
  /** Animated pull-back, owned by the render loop. */
  recede: 0,
};

let frame = 0;
let listening = false;

/**
 * Called when `target` actually changes.
 *
 * The canvas runs `frameloop="demand"`, so a new target that nobody asks to
 * render is a target that never appears. The scroll listener that wakes the
 * canvas and the measurement that sets the target are separate callbacks, and
 * a demand frame can consume the old value before measurement writes the new
 * one. Waking explicitly here removes the ordering dependency.
 */
let onTargetChange: (() => void) | null = null;

export function setFieldWaker(fn: (() => void) | null) {
  onTargetChange = fn;
}

function measure() {
  frame = 0;
  if (registry.size === 0) return;

  const vh = window.innerHeight;
  const mid = vh / 2;

  let bestDist = Infinity;
  let bestIndex = 0;

  for (const entry of registry) {
    const r = entry.el.getBoundingClientRect();
    if (r.height === 0) continue;

    const dist =
      r.top > mid ? r.top - mid : r.bottom < mid ? mid - r.bottom : 0;
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = entry.index;
    }

    if (entry.hero) {
      field.heroPresence = Math.max(0, Math.min(1, r.bottom / vh));
    }
  }

  const next = bestIndex / SEGMENTS;
  if (next !== field.target) {
    field.target = next;
    onTargetChange?.();
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  measure();
}

function stop() {
  if (!listening || registry.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/**
 * Register a major section as the owner of a shape. Returns the unregister fn.
 * Safe to call when there is no canvas — the registry is inert without one.
 */
export function registerSection(
  el: HTMLElement,
  shape: ShapeKey,
  hero = false,
): () => void {
  const entry: Entry = { el, index: shapeIndex(shape), hero };
  registry.add(entry);
  start();
  schedule();
  return () => {
    registry.delete(entry);
    stop();
  };
}

/** True once the morph and the pull-back have both stopped moving. */
export function fieldSettled(): boolean {
  // the intro's idle drift never settles, so only the receded state counts
  if (field.recede < 0.9) return false;
  return (
    Math.abs(field.progress - field.target) < 0.0005 &&
    Math.abs(field.recede - (1 - field.heroPresence)) < 0.002
  );
}
