import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import {
  capabilities,
  contact,
  education,
  profile,
  site,
  techStack,
} from "@/lib/content";

/**
 * How I work, the stack, education, and the closing action.
 *
 * The four capability cards used to sit on a pinned horizontal rail driven by
 * vertical scroll, with each card tilting and fading by distance from the
 * viewport centre. That was a second unusual scroll model immediately after a
 * six-screen one, off-centre cards dropped to 50% opacity on body text that
 * was already muted, and the fixed 22rem card height could not fit alongside
 * the heading on a short screen.
 *
 * It is a plain responsive grid now. Every card is fully legible at all times,
 * nothing moves, and the section is a normal-flow, server-rendered block with
 * no client JavaScript at all.
 */
export function ProfileSection() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative z-10 scroll-mt-20 px-safe py-16 sm:py-20 border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h2
            id="profile-heading"
            className="font-display text-4xl sm:text-5xl uppercase leading-none"
          >
            How I work
          </h2>
        </div>

        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-foreground/90">
          {profile.lead}
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li
              key={c.code}
              className="flex flex-col border border-border/60 bg-card/80 p-6"
              data-reveal
            >
              <p className="font-mono text-[11px] tracking-[0.25em] text-primary">
                {c.code}
              </p>
              <h3 className="font-display text-2xl uppercase leading-none mt-2">
                {c.title}
              </h3>
              <p className="text-[15px] text-foreground/90 leading-relaxed mt-3">
                {c.body}
              </p>
              <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                {c.tools.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 bg-secondary/60 border border-border text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {/* Curated, not exhaustive — the résumé is the full inventory. */}
        <div className="mt-14" data-reveal>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
            Core stack
          </h3>
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
                      className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 bg-secondary/50 border border-border/70 text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3" data-reveal>
          <div className="border border-border/60 bg-card/80 p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Education
            </h3>
            <p className="font-display text-xl uppercase mt-1">
              {education.short}
            </p>
            <p className="font-mono text-xs uppercase tracking-wider text-primary mt-0.5">
              {education.degree}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground mt-2">
              {education.years}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed lg:col-span-1">
            {profile.alsoBuilt}{" "}
            <a
              href={profile.alsoBuiltHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline whitespace-nowrap"
            >
              Live demo
              <ArrowUpRight
                className="inline h-3 w-3 ml-0.5 align-baseline"
                aria-hidden="true"
              />
              <span className="sr-only">
                for Exploding Chickens (opens in new tab)
              </span>
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
              <ArrowUpRight
                className="inline h-3 w-3 ml-0.5 align-baseline"
                aria-hidden="true"
              />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </p>
        </div>

        {/* Closing action. One line, two controls — the header carries the
            same actions at every scroll position. */}
        <div
          id="contact"
          className="mt-16 scroll-mt-20 border-t border-border/60 pt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          data-reveal
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase leading-none">
              Your move
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              {contact.availability} Based in {site.location}, open to
              relocation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <ContactTrigger className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.25em]">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Message
            </ContactTrigger>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-primary/50 text-primary hover:bg-primary/10 transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.25em]"
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
