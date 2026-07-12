import { SectionHeader } from "@/components/valorant/section-header";
import { experiences } from "@/lib/content";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative content-auto py-16 sm:py-24 lg:py-32 border-t border-border/60 px-safe"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="02"
          label="Experience"
          title={
            <>
              Work
              <br />
              <span className="text-primary">History_</span>
            </>
          }
        />

        <ol className="relative mt-12 space-y-12 lg:space-y-14 border-l border-border/60 lg:ml-2">
          {experiences.map((exp, i) => (
            <li
              key={exp.company}
              className="relative pl-8 lg:pl-12"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span
                className={
                  exp.current
                    ? "absolute -left-[5px] top-2 h-[9px] w-[9px] bg-primary"
                    : "absolute -left-[5px] top-2 h-[9px] w-[9px] border border-muted-foreground bg-background"
                }
                aria-hidden="true"
              />

              <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground space-y-1.5">
                  <div className={exp.current ? "text-primary" : undefined}>
                    {exp.period}
                  </div>
                  <div>{exp.location}</div>
                </div>

                <div className="max-w-2xl">
                  <h3 className="font-display text-3xl sm:text-4xl uppercase leading-none">
                    {exp.company}
                  </h3>
                  <div className="mt-1.5 font-mono text-xs text-primary uppercase tracking-[0.2em]">
                    {exp.role}
                  </div>

                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {exp.scope}
                  </p>
                  <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          className="mt-2.5 h-px w-4 shrink-0 bg-primary/60"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {exp.highlight && (
                      <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                        ▸ {exp.highlight}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 bg-secondary/60 border border-border tactical-chip text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
