"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { useDeviceProfile, useHydrated } from "@/lib/three/device";
import { capabilities } from "@/lib/content";

/**
 * The capability cards, advanced by scroll.
 *
 * The section pins and scroll position drives one transform on the rail, with
 * each card tilting and dimming by its distance from the centre of the
 * viewport. Same idea as the scroll sequence above it — scroll stays 1:1 with
 * the native scrollbar, nothing is intercepted or snapped.
 *
 * Deliberately NOT a horizontal scroll container: nested scrollbars are a
 * well-documented accessibility trap (they need their own tab stop, ARIA name,
 * and keyboard handling, and still strand screen-reader users). Nothing inside
 * the rail is focusable, every card is present in DOM order for assistive
 * tech, and narrow viewports, reduced-motion visitors, and anyone without JS
 * get the same content as a plain stacked grid in normal flow.
 */

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/** Scroll distance per pixel of horizontal travel. >1 slows the rail down. */
const PACE = 1.15;

export function CapabilityRail({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const device = useDeviceProfile();
  const live = useHydrated();

  const pinned = live && !device.narrow && !device.reduced;

  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    const cards = Array.from(rail.children) as HTMLElement[];
    let distance = 0;
    let centers: number[] = [];
    let frame = 0;

    /** Layout reads happen here only — never inside the scroll loop. */
    const measure = () => {
      rail.style.transform = "none";
      track.style.height = "auto";

      const gutter = Math.max(0, rail.getBoundingClientRect().left);
      const last = cards[cards.length - 1];
      distance = last
        ? Math.max(
            0,
            last.getBoundingClientRect().right - (window.innerWidth - gutter),
          )
        : 0;

      centers = cards.map((c) => {
        const b = c.getBoundingClientRect();
        return b.left + b.width / 2;
      });

      // The track is exactly as tall as the travel needs it to be, so the rail
      // never crawls on a wide screen or races on a narrow one.
      track.style.height = `${window.innerHeight + distance * PACE}px`;
    };

    const paint = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1);
      const x = -p * distance;

      rail.style.transform = `translate3d(${x}px,0,0)`;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;

      const mid = window.innerWidth / 2;
      for (let i = 0; i < cards.length; i++) {
        const d = clamp((centers[i] + x - mid) / window.innerWidth, -1, 1);
        cards[i].style.transform =
          `perspective(1400px) rotateY(${-d * 13}deg) scale(${1 - Math.abs(d) * 0.07})`;
        cards[i].style.opacity = String(1 - Math.abs(d) * 0.5);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      paint();
    };

    measure();
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      track.style.height = "";
      rail.style.transform = "";
      for (const c of cards) {
        c.style.transform = "";
        c.style.opacity = "";
      }
    };
  }, [pinned]);

  return (
    <div ref={trackRef} className="relative">
      <div
        className={
          pinned
            ? "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden py-16"
            : undefined
        }
      >
        <div className="mx-auto w-full max-w-7xl px-safe">{children}</div>

        <div className="mx-auto w-full max-w-7xl px-safe">
          <ul
            ref={railRef}
            className={
              pinned
                ? "mt-10 flex w-max gap-5 will-change-transform"
                : "mt-10 grid gap-4 sm:grid-cols-2"
            }
          >
            {capabilities.map((c) => (
              <li
                key={c.code}
                className={`relative flex flex-col border border-border/60 bg-card/40 p-6 sm:p-7 ${
                  pinned
                    ? "min-h-[22rem] w-[clamp(280px,31vw,440px)] shrink-0 will-change-transform"
                    : ""
                }`}
                {...(pinned ? {} : { "data-reveal": true })}
              >
                <CornerBrackets size={10} thickness={1} />
                <div className="font-mono text-[11px] tracking-[0.25em] text-primary">
                  {c.code}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase leading-none mt-2">
                  {c.title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-4">
                  {c.body}
                </p>
                <div className="mt-auto pt-6 flex flex-wrap gap-2">
                  {c.tools.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 bg-secondary/60 border border-border tactical-chip text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {pinned && (
          <div className="mx-auto w-full max-w-7xl px-safe mt-10" aria-hidden>
            <div className="relative h-px w-full bg-border/60">
              <div
                ref={barRef}
                className="absolute inset-y-0 left-0 bg-primary"
                style={{ width: 0 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
