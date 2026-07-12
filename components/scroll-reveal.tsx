"use client";

import { useEffect } from "react";

/**
 * Scroll reveal for [data-reveal] elements. Server HTML is visible by
 * default; hiding only activates once this script stamps `reveal-ready`
 * on <html> (see globals.css), so failed JS never hides content.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
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

    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
