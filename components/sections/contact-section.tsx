import { FileText, Mail } from "lucide-react";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { FieldRegion } from "@/components/three/field-region";
import { contact, site } from "@/lib/content";

/**
 * The closing action, as its own landmark.
 *
 * This was a bare `<div id="contact">` holding an `<h2>` inside the profile
 * region, so landmark navigation exposed no separately named Contact area —
 * a screen-reader user jumping by region had no way to land on it. It is a
 * peer `<section>` with an accessible name now.
 *
 * Also carries the field's last shape target. Without a registration here the
 * previous section's shape persisted through everything below it.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 scroll-mt-20 px-safe py-14 sm:py-16 border-t border-border/60"
    >
      <FieldRegion targetId="contact" shape="globe" />

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="contact-heading"
            className="font-display text-3xl sm:text-4xl uppercase leading-none"
          >
            Your move
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            {contact.availability} Based in {site.location}, open to relocation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {/* the notch is reserved for the single filled primary action */}
          <ContactTrigger className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors tactical-chip font-mono text-[11px] uppercase tracking-[0.25em]">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Message
          </ContactTrigger>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-mono text-[11px] uppercase tracking-[0.25em]"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Résumé
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
