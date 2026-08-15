import { ArrowUp, Github, Linkedin } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { HeroSequence } from "@/components/three/hero-sequence";
import { ProfileSection } from "@/components/profile/profile-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactProvider } from "@/components/contact/contact-provider";
import { site } from "@/lib/content";

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
      // containing scrollport and silently un-pins the sequence's sticky panel
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-clip relative"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <ContactProvider>
        <TopBar />
        <ScrollReveal />

        <main id="main-content">
          <HeroSequence />
          <ProfileSection />
        </main>

        <footer className="border-t border-border/60 py-8 px-safe">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              © {new Date().getFullYear()} {site.name}
            </div>

            {/* The page is several screens tall; nobody should have to scroll
                all the way back for the résumé and email in the top bar. */}
            <a
              href="#top"
              className="order-first sm:order-none inline-flex items-center gap-2 h-11 px-4 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.2em]"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Back to top
            </a>

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
      </ContactProvider>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </div>
  );
}
