"use client";

import { SHAPE_ORDER, shapeIndex, type ShapeKey } from "@/lib/three/shapes";

/**
 * The bridge between the page's sections and the one point field behind them.
 *
 * The field used to be driven by a 630vh sticky track that gated all the
 * content behind scroll position. It is now driven by *reading position*:
 * every section registers the shape it wants, and the field morphs to
 * whichever section is nearest the middle of the viewport. Sections are
 * ordinary normal-flow elements, so Find, Page Down, anchors, and keyboard
 * navigation all behave the way a visitor expects, and the field is purely
 * decorative on top of that.
 *
 * A module singleton rather than React context on purpose: there is exactly
 * one field, the values change on every scroll frame, and nothing on the page
 * should re-render when they do.
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

    // distance from the section's midpoint to the viewport's midpoint,
    // clamped so a very tall section still counts as "here" while you are
    // anywhere inside it
    const top = r.top;
    const bottom = r.bottom;
    const dist = top > mid ? top - mid : bottom < mid ? mid - bottom : 0;

    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = entry.index;
    }

    if (entry.hero) {
      // 1 while the intro fills the screen, ramping to 0 as it leaves
      field.heroPresence = Math.max(0, Math.min(1, bottom / vh));
    }
  }

  field.target = bestIndex / SEGMENTS;
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
 * Register a section as the owner of a shape. Returns the unregister fn.
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
