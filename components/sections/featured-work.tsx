"use client";

import { ArrowUpRight } from "lucide-react";
import { Readout } from "@/components/sections/readout";
import { useFieldSection } from "@/lib/three/use-field-section";
import { projects, type Project } from "@/lib/content";

/**
 * The flagship projects, in normal flow, above the roles.
 *
 * These used to be stages 04 and 05 of the sticky sequence, which meant their
 * headings, evidence, and links only existed in the DOM at one exact scroll
 * position. A recruiter could not Find them, tab to them, link to them, or
 * compare them. Now both are always present, each with its own `id`, and the
 * links are ordinary anchors that never unmount.
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      id={project.id}
      // scroll-mt clears the fixed header when linked to directly
      className="scroll-mt-20 flex flex-col border border-border/60 bg-card/80 p-6 sm:p-7"
      aria-labelledby={`${project.id}-heading`}
      data-reveal
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
        {project.kicker}
      </p>
      <h3
        id={`${project.id}-heading`}
        className="font-display text-3xl sm:text-4xl uppercase leading-none mt-2"
      >
        {project.name}
      </h3>

      <p className="text-[15px] sm:text-base text-foreground/90 leading-relaxed mt-4">
        {project.body}
      </p>

      <Readout items={project.readout} className="mt-6" />

      {/* mt-auto so the action rows line up across cards of unequal copy */}
      <div className="mt-auto pt-6 flex flex-wrap gap-2">
        {project.links.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 h-11 px-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
              i === 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border-strong text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {l.label}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">
              for {project.name} (opens in new tab)
            </span>
          </a>
        ))}
      </div>
    </article>
  );
}

export function FeaturedWork() {
  // one registration for the section: the two cards share a grid row on
  // desktop, so registering each would tie on vertical distance and let
  // insertion order pick the shape
  const ref = useFieldSection<HTMLElement>("brain");

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-heading"
      className="relative scroll-mt-20 px-safe py-16 sm:py-20 border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2
            id="work-heading"
            className="font-display text-4xl sm:text-5xl uppercase leading-none"
          >
            Featured work
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
