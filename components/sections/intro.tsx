"use client";

import { ArrowDown, FileText, Mail } from "lucide-react";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Readout } from "@/components/sections/readout";
import { useFieldSection } from "@/lib/three/use-field-section";
import { intro, site } from "@/lib/content";

/**
 * The opening screen, and the only animated one.
 *
 * This replaces a six-stage sticky sequence that ran ~630vh before any
 * normal-flow content and kept exactly one stage in the DOM at a time. It is
 * now a single screen carrying the page's one stable `<h1>`; everything else
 * is ordinary anchored sections below.
 *
 * Height rules matter more than they look:
 *
 * - `min-h` is gated on `min-height: 700px`, so a landscape phone (844x390)
 *   gets ordinary flow instead of a full-viewport panel it cannot fit in.
 * - No `overflow-hidden`. The old panel clipped its own CTAs on short screens.
 * - `pt-24` clears the fixed 56px header, which used to sit on top of the
 *   heading at short heights.
 */
export function Intro() {
  const ref = useFieldSection<HTMLElement>("scatter", true);

  return (
    <section
      ref={ref}
      aria-labelledby="intro-heading"
      className="relative px-safe pt-24 pb-14 sm:pb-16 [@media(min-height:700px)]:min-h-dvh [@media(min-height:700px)]:flex [@media(min-height:700px)]:items-center"
    >
      {/* Background treatment for the field behind this screen, so the copy
          stays readable without loading the type up with text shadows: a
          vignette to pull the edges down, and a scrim over the copy column
          where the point cloud is densest. */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)_92%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[62%] pointer-events-none bg-gradient-to-r from-background via-background/85 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
            {site.role} · {site.focusAreas}
          </p>

          <h1
            id="intro-heading"
            className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] tracking-tight"
          >
            {intro.title}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-foreground/90 leading-relaxed">
            {intro.body}
          </p>

          <p className="mt-4 border-l-2 border-primary/60 pl-3 font-mono text-xs sm:text-[0.8125rem] leading-relaxed text-muted-foreground">
            {intro.hook}
          </p>

          <Readout items={intro.readout} className="mt-7 max-w-lg" />

          {/* Work first: the projects are what interviewers bring up, and the
              old page gave no way to reach them but scrolling five screens. */}
          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.25em]"
            >
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              View work
            </a>
            <ContactTrigger className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-mono text-[11px] uppercase tracking-[0.25em]">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Message
            </ContactTrigger>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-border-strong text-muted-foreground hover:border-primary hover:text-primary transition-colors font-mono text-[11px] uppercase tracking-[0.25em]"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Résumé
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
