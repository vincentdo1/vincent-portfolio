import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { site } from "@/lib/content";

/**
 * Persistent conversion bar.
 *
 * The scroll sequence is most of the page, so without this a recruiter would
 * have to scroll six screens to find any way to reach Vincent. This never
 * scrolls away.
 *
 * On a phone there is no room for four labelled actions, so the two that
 * actually convert — résumé and email — keep their labels, and GitHub and
 * LinkedIn drop off (both are still in the profile section and the footer).
 * Every control carries an explicit aria-label: a label hidden with
 * `display: none` is hidden from screen readers too, which would leave the
 * icon-only state with no accessible name at all.
 */

const CONTACT_LINKS = [
  {
    label: "Résumé",
    href: site.resume,
    icon: FileText,
    external: true,
    mobile: true,
  },
  {
    label: "GitHub",
    href: site.github,
    icon: Github,
    external: true,
    mobile: false,
  },
  {
    label: "LinkedIn",
    href: site.linkedin,
    icon: Linkedin,
    external: true,
    mobile: false,
  },
];

export function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-safe h-14 flex items-center justify-between gap-3">
        <a
          href="#top"
          className="inline-flex items-center h-11 font-display text-lg uppercase tracking-wide hover:text-primary transition-colors shrink-0"
        >
          Vincent Do
          <span className="text-primary">_</span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <a
            href="#profile"
            className="hidden lg:inline-flex items-center px-3 h-11 mr-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>

          {CONTACT_LINKS.map(
            ({ label, href, icon: Icon, external, mobile }) => (
              <a
                key={label}
                href={href}
                aria-label={external ? `${label} (opens in new tab)` : label}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                // display class is set once, never both: `hidden` and
                // `inline-flex` are the same Tailwind property group, so
                // listing both leaves the winner up to stylesheet order
                className={`group items-center gap-2 px-2.5 sm:px-3 h-11 border border-transparent hover:border-primary/50 hover:bg-primary/5 transition-colors tactical-chip ${
                  mobile ? "inline-flex" : "hidden sm:inline-flex"
                }`}
              >
                <Icon
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
                <span
                  className={`font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors ${
                    mobile ? "" : "hidden sm:inline"
                  }`}
                  aria-hidden="true"
                >
                  {label}
                </span>
              </a>
            ),
          )}

          <ContactTrigger
            aria-label="Email Vincent"
            className="inline-flex items-center gap-2 px-3 h-11 bg-primary text-primary-foreground tactical-chip hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span
              className="font-mono text-xs uppercase tracking-[0.2em]"
              aria-hidden="true"
            >
              Email
            </span>
          </ContactTrigger>
        </nav>
      </div>
    </header>
  );
}
