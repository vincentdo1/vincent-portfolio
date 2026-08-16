import { ArrowUp, Github, Linkedin } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { MorphScene } from "@/components/three/morph-scene-dynamic";
import { Intro } from "@/components/sections/intro";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ExperienceSection } from "@/components/sections/experience";
import { ProfileSection } from "@/components/profile/profile-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactProvider } from "@/components/contact/contact-provider";
import { projects, site } from "@/lib/content";

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
    <div
      id="top"
      // overflow-x-CLIP, never -hidden: hidden makes this div the sticky
      // containing scrollport and silently un-pins anything sticky inside
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-clip relative"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* One canvas for the whole document, fixed at z-0 behind every section.
          Purely decorative: every section owns its copy in normal-flow DOM and
          only registers a shape for the field to morph to. */}
      <MorphScene className="fixed inset-0 z-0 pointer-events-none" />

      <ContactProvider>
        <TopBar />
        <ScrollReveal />

        {/* tabIndex={-1} so the skip link actually moves focus here; without
            it the browser scrolls but focus stays on the link, and the next
            Tab returns to the header. */}
        <main id="main-content" tabIndex={-1} className="relative z-10">
          <Intro />
          <FeaturedWork />
          <ExperienceSection />
          <ProfileSection />
        </main>

        <footer className="relative z-10 border-t border-border/60 py-8 px-safe">
          {/* DOM order matches visual order at every breakpoint — no
              `order-first`, which used to make the tab sequence disagree with
              what a sighted keyboard user sees. */}
          <div className="mx-auto max-w-7xl flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              © {new Date().getFullYear()} {site.name}
            </p>

            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-1"
            >
              <a
                href="#top"
                className="inline-flex items-center gap-2 h-11 px-4 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors font-mono text-[11px] uppercase tracking-[0.2em]"
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                Back to top
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in new tab)"
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in new tab)"
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </footer>
      </ContactProvider>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...personJsonLd,
            // the flagship projects, so they are discoverable outside the page
            subjectOf: projects.map((p) => ({
              "@type": "CreativeWork",
              name: p.name,
              url: p.links[0]?.href,
            })),
          }),
        }}
      />
    </div>
  );
}
