import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { site } from "@/lib/content";

/**
 * Persistent conversion bar.
 *
 * Two layout problems drove the current rules:
 *
 * - At 320px the row overflowed and clipped the Email action off-screen. The
 *   brand now truncates to initials below `xs` (360px) and Résumé goes
 *   icon-only, which is what buys the room.
 * - GitHub and LinkedIn used to show their labels from `sm` (640px) up, which
 *   is still narrow enough to overflow once Work and About are in the row.
 *   Labels now wait for `md`.
 *
 * Every control carries an explicit aria-label, because a label hidden with
 * `display: none` is hidden from screen readers too — the icon-only states
 * would otherwise have no accessible name at all.
 */

const SECTION_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#profile" },
];

const EXTERNAL_LINKS = [
  { label: "Résumé", href: site.resume, icon: FileText, alwaysVisible: true },
  { label: "GitHub", href: site.github, icon: Github, alwaysVisible: false },
  {
    label: "LinkedIn",
    href: site.linkedin,
    icon: Linkedin,
    alwaysVisible: false,
  },
];

export function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-safe h-14 flex items-center justify-between gap-2">
        <a
          href="#top"
          aria-label="Vincent Do, back to top"
          className="inline-flex items-center h-11 font-display text-lg uppercase tracking-wide hover:text-primary transition-colors shrink-0"
        >
          {/* full name once there is room for it; initials at 320px */}
          <span className="hidden xs:inline">Vincent Do</span>
          <span className="xs:hidden" aria-hidden="true">
            VD
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="flex items-center gap-0.5 sm:gap-1 min-w-0"
        >
          {SECTION_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hidden md:inline-flex items-center px-3 h-11 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}

          {EXTERNAL_LINKS.map(({ label, href, icon: Icon, alwaysVisible }) => (
            <a
              key={label}
              href={href}
              aria-label={`${label} (opens in new tab)`}
              target="_blank"
              rel="noopener noreferrer"
              // one display class only: `hidden` and `inline-flex` are the same
              // Tailwind property group, so listing both leaves the winner up
              // to stylesheet order rather than class order
              className={`group items-center gap-2 px-2.5 sm:px-3 h-11 border border-transparent hover:border-primary/50 hover:bg-primary/5 transition-colors tactical-chip ${
                alwaysVisible ? "inline-flex" : "hidden sm:inline-flex"
              }`}
            >
              <Icon
                className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                aria-hidden="true"
              />
              {/* lg, not md: at md the three section links are already in the
                  row, and adding three more labels overflows an 844px-wide
                  landscape phone and clips the Message action off the edge */}
              <span
                className="hidden lg:inline font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors"
                aria-hidden="true"
              >
                {label}
              </span>
            </a>
          ))}

          {/* "Message", not "Email": this opens an in-page form. */}
          <ContactTrigger
            aria-label="Send Vincent a message"
            className="inline-flex items-center gap-2 px-3 h-11 bg-primary text-primary-foreground tactical-chip hover:bg-primary/90 transition-colors shrink-0"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span
              className="font-mono text-xs uppercase tracking-[0.2em]"
              aria-hidden="true"
            >
              Message
            </span>
          </ContactTrigger>
        </nav>
      </div>
    </header>
  );
}
