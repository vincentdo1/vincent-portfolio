import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { CapabilityRail } from "@/components/profile/capability-rail";
import {
  contact,
  education,
  experiences,
  profile,
  site,
  techStack,
} from "@/lib/content";

/**
 * Everything that isn't the scroll sequence, in one section.
 *
 * The sequence already walked the visitor through the roles and the projects,
 * so this does not repeat them: it says what Vincent is as an engineer (the
 * scroll-driven capability rail), gives the dates and school a recruiter wants
 * to scan, and gets out of the way. It is also the page's only substantial
 * indexable text — a page made of WebGL points has nothing to read.
 */
export function ProfileSection() {
  return (
    // no content-visibility here: the rail measures its own track on mount,
    // and a skipped subtree reports zero-sized boxes
    // scroll-mt clears the fixed top bar: without it, jumping to #profile
    // parks the heading underneath the header
    <section
      id="profile"
      className="relative scroll-mt-14 border-t border-border/60 pb-20 lg:pb-24"
    >
      {/* same grid texture as the sequence, so the page doesn't feel like it
          hands off to a different site when the canvas releases */}
      <div
        className="absolute inset-0 grid-lines opacity-[0.03] pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative">
        {/* The heading rides inside the pinned view, so the whole screen —
            title, lead, and moving cards — reads as one chapter. */}
        <CapabilityRail>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
            SYS // 06 — PROFILE
          </div>
          <h2 className="font-display text-4xl sm:text-5xl uppercase leading-none">
            What I build
            <span className="text-primary">_</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-foreground/90">
            {profile.lead}
          </p>
        </CapabilityRail>

        {/* The complete tooling list — the cards name tools in context, this
            is what someone filtering for infrastructure work scans for. */}
        <div className="mx-auto max-w-7xl px-safe mt-16" data-reveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5 flex items-center gap-3">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            Tech stack
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((group) => (
              <div key={group.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-2.5">
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 bg-secondary/50 border border-border/70 tactical-chip text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto max-w-7xl px-safe mt-16 grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2" data-reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" aria-hidden="true" />
              Where
            </div>
            <ol className="space-y-3">
              {experiences.map((e) => (
                <li
                  key={e.company}
                  className="relative border border-border/60 bg-card/40 p-4"
                >
                  <CornerBrackets size={9} thickness={1} />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-xl uppercase">
                      {e.company}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {e.period} · {e.location}
                    </span>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-primary mt-0.5">
                    {e.role}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {e.note}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="space-y-6"
            data-reveal
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            <div className="relative border border-border/60 bg-card/40 p-4">
              <CornerBrackets size={9} thickness={1} />
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Education
              </div>
              <div className="font-display text-xl uppercase mt-1">
                {education.short}
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-primary mt-0.5">
                {education.degree}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground mt-2">
                {education.years}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.alsoBuilt}{" "}
              <a
                href={profile.alsoBuiltHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline whitespace-nowrap"
              >
                Play it
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 align-baseline" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.offClock}{" "}
              <a
                href={site.chesscom}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline whitespace-nowrap"
              >
                chess.com/{site.chesscomHandle}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 align-baseline" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </p>
          </div>
        </div>

        {/* Closing band. Kept to one line and two actions: the top bar carries
            résumé, GitHub, LinkedIn, and email at every scroll position, so a
            full contact panel here would only be a second copy of it. */}
        <div
          id="contact"
          className="mx-auto max-w-7xl px-safe mt-16 scroll-mt-20 border-t border-border/60 pt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          data-reveal
        >
          <div>
            <h3 className="font-display text-3xl sm:text-4xl uppercase leading-none">
              Let&apos;s build
              <span className="text-primary">_</span>
            </h3>
            <p className="mt-3 text-muted-foreground max-w-md">
              {contact.availability} Based in St. Louis, open to relocation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <ContactTrigger className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors tactical-shape font-mono text-[11px] uppercase tracking-[0.25em]">
              <Mail className="h-3.5 w-3.5" />
              Send message
            </ContactTrigger>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              // tactical-chip, not tactical-shape: the larger chamfer clips
              // through a 1px border and leaves the outline visibly broken
              className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-primary/50 text-primary hover:bg-primary/10 transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.25em]"
            >
              <FileText className="h-3.5 w-3.5" />
              Résumé
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
