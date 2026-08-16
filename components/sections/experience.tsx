"use client";

import { Readout } from "@/components/sections/readout";
import { useFieldSection } from "@/lib/three/use-field-section";
import { experiences, type Experience } from "@/lib/content";

/**
 * Roles, reverse-chronological, in normal flow.
 *
 * These were stages 01–03 of the sticky sequence *and* a separate one-line
 * summary in the dossier below it, so every job was described twice in
 * different words. Each role now appears exactly once, with the fuller copy,
 * its dates, and its readout together in one card a recruiter can scan.
 */
function Role({ role }: { role: Experience }) {
  const ref = useFieldSection<HTMLElement>(role.shape);
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

      <p className="text-[15px] text-foreground/90 leading-relaxed mt-4">
        {role.body}
      </p>

      {role.note && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          {role.note}
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
          {experiences.map((e) => (
            <li key={e.company}>
              <Role role={e} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
