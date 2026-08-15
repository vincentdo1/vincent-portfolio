"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { MorphScene } from "@/components/three/morph-scene-dynamic";
import { SmoothScroll } from "@/components/three/smooth-scroll-dynamic";
import { useScrollStage } from "@/lib/three/use-scroll-stage";
import { useHydrated } from "@/lib/three/device";
import { stages } from "@/lib/content";

/** Scroll distance each stage gets, in vh. Enough for a real dwell plateau. */
const STAGE_VH = 105;

/**
 * The scroll sequence, which is most of the site: a tall track with a sticky
 * viewport panel. One morphing point field advances through the career and the
 * flagship projects as the visitor scrolls; the copy column, readout panel,
 * and per-stage links swap with it.
 *
 * Progressive enhancement: server HTML is a single plain screen with the
 * stage-0 copy. The tall track, ticks, and scroll cue only appear once the
 * script has actually run — a blocked or failed chunk never leaves the
 * visitor six viewports of dead space.
 */
export function HeroSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { progress, stage } = useScrollStage(trackRef, stages.length);
  const live = useHydrated();

  const active = stages[stage];

  return (
    <div
      ref={trackRef}
      className="relative min-h-dvh"
      style={live ? { height: `${stages.length * STAGE_VH}vh` } : undefined}
    >
      <SmoothScroll />
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* grid backdrop, same texture as the rest of the page */}
        <div
          className="absolute inset-0 grid-lines opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        />

        <MorphScene
          progressRef={progress}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* vignette so type stays readable over the field */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-background)_95%)]"
          aria-hidden="true"
        />

        {/* copy scrim: the field is densest in the opening scatter, exactly
            where the name sits. This darkens the left column so type never
            competes with particles. */}
        <div
          className="absolute inset-y-0 left-0 w-full lg:w-[64%] z-[2] pointer-events-none bg-gradient-to-r from-background via-background/88 to-transparent"
          aria-hidden="true"
        />

        {/* stage copy — beside the field on wide screens, below it on narrow
            ones, matching where MorphScene puts the field */}
        <div className="relative z-20 h-full flex items-end md:items-center px-safe pointer-events-none">
          <div className="mx-auto max-w-7xl w-full pb-20 md:pb-0">
            <div className="max-w-xl">
              <div key={active.tag} className="stage-in">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
                  {active.tag}
                </div>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] tracking-tight [text-shadow:0_2px_24px_var(--color-background)]">
                  {active.title}
                  <span className="text-primary">_</span>
                </h1>
                <p className="mt-5 text-base sm:text-lg text-foreground/80 leading-relaxed [text-shadow:0_1px_16px_var(--color-background)]">
                  {active.body}
                </p>
                {active.hook && (
                  <p className="mt-4 border-l-2 border-primary/60 pl-3 font-mono text-xs sm:text-[0.8125rem] leading-relaxed text-muted-foreground [text-shadow:0_1px_16px_var(--color-background)]">
                    {active.hook}
                  </p>
                )}

                <div className="mt-8 relative inline-block border border-border/60 bg-card/50 backdrop-blur-sm">
                  <CornerBrackets size={10} thickness={1} />
                  <div className="flex divide-x divide-border/60">
                    {active.readout.map((r) => (
                      <div key={r.label} className="px-3 py-3 sm:px-4">
                        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {r.label}
                        </div>
                        <div className="font-display text-base sm:text-lg uppercase text-primary leading-none mt-1.5">
                          {r.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* the project stages carry their own destinations, since
                    there is no projects section to hold them */}
                {active.links && (
                  <div className="mt-5 flex flex-wrap items-center gap-2 pointer-events-auto">
                    {active.links.map((l, i) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 h-11 px-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors tactical-chip ${
                          i === 0
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-border bg-background/60 backdrop-blur-sm text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {l.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span className="sr-only">
                          for {active.title} (opens in new tab)
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* stage ticks — the instrument-panel read of where you are */}
        {live && (
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3"
            aria-hidden="true"
          >
            {stages.map((s, i) => (
              <div key={s.tag} className="flex items-center gap-3 justify-end">
                <span
                  className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    i === stage ? "text-primary" : "text-muted-foreground/40"
                  }`}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <span
                  className={`h-px transition-all duration-300 ${
                    i === stage
                      ? "w-8 bg-primary"
                      : "w-4 bg-muted-foreground/30"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {live && (
          <div className="absolute bottom-6 left-0 right-0 z-20 px-safe">
            <div className="mx-auto max-w-7xl flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span>Scroll to advance</span>
              <span className="text-primary">
                {String(stage + 1).padStart(2, "0")} /{" "}
                {String(stages.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
