"use client";

import { useEffect } from "react";

/**
 * Scroll reveal for [data-reveal] elements.
 *
 * Server HTML is visible by default. Hiding only activates once this script
 * has stamped `reveal-ready` on <html>, so a failed or blocked chunk can never
 * leave content invisible.
 *
 * Two failure modes this guards against, both of which strand keyboard users
 * on content they cannot see:
 *
 * 1. `IntersectionObserver` missing or throwing. The class that does the
 *    hiding is added only after the observer exists and has been wired to at
 *    least one element, so there is no window where content is hidden with
 *    nothing able to reveal it.
 * 2. Focus entering an unrevealed block. CSS keeps anything with
 *    `:focus-within` painted, and the `focusin` handler below marks it
 *    revealed permanently so it does not flicker back out on blur.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    let io: IntersectionObserver;
    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
    } catch {
      // no observer, so never hide anything
      return;
    }

    for (const el of targets) io.observe(el);

    // Only now is it safe to let the stylesheet hide unrevealed blocks.
    document.documentElement.classList.add("reveal-ready");

    // Tab can land inside a block the observer has not reached yet.
    const onFocusIn = (event: FocusEvent) => {
      const el = (event.target as Element | null)?.closest?.("[data-reveal]");
      if (el && !el.classList.contains("in-view")) {
        el.classList.add("in-view");
        io.unobserve(el);
      }
    };
    document.addEventListener("focusin", onFocusIn);

    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
