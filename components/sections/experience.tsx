"use client";

import { ArrowUpRight } from "lucide-react";
import { Readout } from "@/components/sections/readout";
import { useFieldSection } from "@/lib/three/use-field-section";
import { experiences, type Experience } from "@/lib/content";
import type { ShapeKey } from "@/lib/three/shapes";

/**
 * Shape per role, positional.
 *
 * Colocated with the presentation rather than sitting in `lib/content.ts`:
 * these are decoration and say nothing about the job. Registering per role is
 * safe here specifically because the list is a single-column `<ol>` — the
 * cards stack at every width, so two of them can never occupy the same
 * vertical band and tie at distance zero the way the side-by-side project
 * cards did. If this list ever becomes multi-column, move the registration up
 * to the section like Featured Work.
 */
const ROLE_SHAPES: ShapeKey[] = ["rocket", "handset", "dna"];

/**
 * Roles, reverse-chronological, in normal flow.
 *
 * These were stages 01–03 of the sticky sequence *and* a separate one-line
 * summary in the dossier below it, so every job was described twice in
 * different words. Each role now appears exactly once, with the fuller copy,
 * its dates, and its readout together in one card a recruiter can scan.
 */
function Role({ role, shape }: { role: Experience; shape: ShapeKey }) {
  const ref = useFieldSection<HTMLElement>(shape);
  const id = role.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <article
      ref={ref}
      id={id}
      className="scroll-mt-20 border border-border/60 bg-card/80 p-6 sm:p-7"
      aria-labelledby={`${id}-heading`}
      data-reveal
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3
          id={`${id}-heading`}
          className="font-display text-2xl sm:text-3xl uppercase leading-none"
        >
          {role.company}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {role.period} · {role.location}
        </p>
      </div>

      <p className="font-mono text-xs uppercase tracking-wider text-primary mt-1.5">
        {role.role}
        {role.current && (
          <>
            {" "}
            <span className="text-muted-foreground">· Current</span>
          </>
        )}
      </p>

      {/* max-w-prose: the cards are full width on desktop and an unbroken
          ~140-character measure is hard to track back to the next line */}
      <p className="text-[15px] text-foreground/90 leading-relaxed mt-4 max-w-prose">
        {role.body}
      </p>

      {role.note && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-prose">
          {role.note}
        </p>
      )}

      {/* Quiet inline treatment, matching the profile links rather than the
          project buttons: this is a citation, not a call to action, and it
          must not compete with the Live demo / Source pair above it. */}
      {role.link && (
        <p className="mt-2">
          <a
            href={role.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-11 py-1 text-sm text-primary hover:underline"
          >
            {role.link.label}
            <ArrowUpRight
              className="inline h-3 w-3 ml-0.5 align-baseline"
              aria-hidden="true"
            />
            <span className="sr-only">
              for {role.company} (opens in new tab)
            </span>
          </a>
        </p>
      )}

      <Readout items={role.readout} className="mt-5 max-w-md" />
    </article>
  );
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative scroll-mt-20 px-safe py-16 sm:py-20 border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2
            id="experience-heading"
            className="font-display text-4xl sm:text-5xl uppercase leading-none"
          >
            Experience
          </h2>
        </div>

        <ol className="grid gap-5">
          {experiences.map((e, i) => (
            <li key={e.company}>
              <Role role={e} shape={ROLE_SHAPES[i] ?? "rocket"} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
