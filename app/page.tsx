import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Nav } from "@/components/nav";
import { ChessTree } from "@/components/hero/chess-tree";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactLauncher } from "@/components/contact/contact-launcher";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { SectionHeader } from "@/components/valorant/section-header";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { site, hero, about, interests, contact } from "@/lib/content";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: "https://vmd306.com",
  worksFor: { "@type": "Organization", name: "Boeing" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Illinois Urbana-Champaign",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    addressCountry: "US",
  },
  sameAs: [site.github, site.linkedin, site.chesscom],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden relative">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <ScrollReveal />

      <main id="main-content">
        <section
          id="hero"
          className="relative flex min-h-[100svh] items-center overflow-hidden px-safe pt-24 pb-16"
        >
          <div
            className="absolute inset-0 grid-lines opacity-[0.035] pointer-events-none [mask-image:linear-gradient(to_bottom,black_20%,transparent_95%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <p
                className="hero-rise font-mono text-xs uppercase tracking-[0.18em] sm:tracking-[0.3em] text-muted-foreground mb-3"
                style={{ "--rise-delay": "0s" } as React.CSSProperties}
              >
                {hero.eyebrow}
              </p>
              <h1
                className="hero-rise font-display text-6xl sm:text-7xl md:text-9xl lg:text-[9.5rem] uppercase leading-[0.85] tracking-tight break-words"
                style={{ "--rise-delay": "0.08s" } as React.CSSProperties}
              >
                Vincent
                <br />
                <span className="text-primary">Do_</span>
              </h1>

              <div
                className="hero-rise mt-7 max-w-lg space-y-4"
                style={{ "--rise-delay": "0.2s" } as React.CSSProperties}
              >
                <p className="text-xl text-foreground/95">{hero.lead}</p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {hero.supporting}
                </p>
              </div>

              <div
                className="hero-rise mt-9 flex items-center gap-3 flex-wrap"
                style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
              >
                <Link
                  href="#work"
                  className="inline-flex items-center gap-2 h-12 px-6 tactical-shape bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors group"
                >
                  Explore selected work
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 tactical-shape border border-primary/40 hover:border-primary text-primary font-mono text-xs uppercase tracking-[0.25em] transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Résumé
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>

              <div
                className="hero-rise mt-10 max-w-lg space-y-2 border-l-2 border-primary/60 pl-4 font-mono text-[0.8125rem] leading-relaxed text-muted-foreground"
                style={{ "--rise-delay": "0.44s" } as React.CSSProperties}
              >
                <p>{hero.proof}</p>
                <p className="lg:hidden">{hero.hook}</p>
              </div>
            </div>

            <div
              className="hero-rise hidden lg:block"
              style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
            >
              <ChessTree />
            </div>
          </div>
        </section>

        <ProjectsSection />

        <ExperienceSection />

        <section
          id="about"
          className="relative content-auto py-16 sm:py-24 lg:py-32 border-t border-border/60 px-safe"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              label="Background"
              title={
                <>
                  About
                  <br />
                  <span className="text-primary">Me_</span>
                </>
              }
            />

            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 mt-12">
              <div
                className="space-y-5 text-muted-foreground leading-relaxed max-w-xl"
                data-reveal
              >
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
                <p className="flex items-center gap-3 pt-2 font-mono text-xs uppercase tracking-[0.18em]">
                  <span className="h-px w-4 bg-primary" aria-hidden="true" />
                  {about.education.school.includes("Illinois")
                    ? "UIUC"
                    : about.education.school}{" "}
                  · {about.education.degree} · {about.education.years}
                </p>
              </div>

              <div
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              >
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-primary" />
                  Beyond code
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((item) => (
                    <div
                      key={item.code}
                      className="p-5 border border-border/60 bg-card/40 tactical-chip"
                    >
                      <div className="font-mono text-xs tracking-widest text-primary mb-2">
                        {item.code}
                      </div>
                      <div className="font-display text-xl uppercase">
                        {item.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 leading-snug">
                        {item.description}
                      </div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                        >
                          → {item.linkLabel ?? "Visit"}
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative content-auto py-16 sm:py-24 lg:py-32 border-t border-border/60 px-safe"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="04"
              label="Get in touch"
              title={
                <>
                  Let&apos;s
                  <br />
                  <span className="text-primary">Build_</span>
                </>
              }
              description={contact.availability}
            />

            <div className="grid lg:grid-cols-2 gap-10 mt-12">
              <div
                className="divide-y divide-border/60 border-y border-border/60"
                data-reveal
              >
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-4 py-5 transition-colors"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-border bg-card/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors tactical-chip shrink-0">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-xl uppercase group-hover:text-primary transition-colors">
                      Email
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono truncate">
                      {site.email}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </a>

                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-5 transition-colors"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-border bg-card/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors tactical-chip shrink-0">
                    <Linkedin className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-xl uppercase group-hover:text-primary transition-colors">
                      LinkedIn
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono truncate">
                      linkedin.com/in/{site.linkedinHandle}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>

                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-5 transition-colors"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-border bg-card/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors tactical-chip shrink-0">
                    <Github className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-xl uppercase group-hover:text-primary transition-colors">
                      GitHub
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono truncate">
                      github.com/{site.githubHandle}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>

                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-5 transition-colors"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-border bg-card/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors tactical-chip shrink-0">
                    <Download className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-xl uppercase group-hover:text-primary transition-colors">
                      Résumé
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono truncate">
                      PDF · latest version
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>

              <div
                className="relative border border-border/60 bg-card/40 p-8 flex flex-col"
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              >
                <CornerBrackets size={14} thickness={1.5} />

                <div className="flex-1">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-3">
                    <span className="h-px w-6 bg-primary" />
                    Based in
                  </div>
                  <div className="font-display text-4xl uppercase leading-none mb-2">
                    St. Louis
                  </div>
                  <div className="text-primary font-mono text-sm uppercase tracking-wider">
                    Missouri // United States
                  </div>

                  <p className="mt-8 text-sm text-muted-foreground leading-relaxed max-w-sm">
                    The fastest way to reach me is a short note about your team
                    and what you&apos;re building.
                  </p>
                </div>

                <ContactLauncher label="Send message" className="mt-8 w-full" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 px-safe">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} {site.name}
          </div>
          <div className="flex items-center gap-1">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in new tab)"
              className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in new tab)"
              className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </div>
  );
}
