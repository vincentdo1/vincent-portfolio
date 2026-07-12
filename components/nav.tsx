"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "@/lib/use-active-section";
import { site } from "@/lib/content";

const sections = [
  { label: "Work", href: "#work", id: "work" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "About", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const sectionIds = ["hero", "work", "experience", "about", "contact"];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Close if the viewport crosses into the desktop layout.
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onResize);
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="bg-background/70 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-7xl px-safe flex items-center justify-between h-14">
          <Link
            href="#hero"
            aria-label={`${site.name} — back to top`}
            className="flex items-center gap-3 group py-2"
          >
            <div className="h-8 w-8 bg-primary/10 border border-primary/40 flex items-center justify-center tactical-chip">
              <span className="font-display text-lg text-primary leading-none translate-y-px">
                V
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-none gap-1">
              <span className="font-display text-base uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                {site.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">
                SWE // AI/ML
              </span>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1"
          >
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "relative px-3 py-4 font-mono text-xs uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                  {active && (
                    <span className="absolute bottom-2.5 left-3 right-3 h-px bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            ref={toggleRef}
            className="md:hidden flex h-11 w-11 items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-b border-border bg-background/95 backdrop-blur-md"
        >
          <nav
            aria-label="Primary"
            className="flex flex-col px-safe py-4 gap-1"
          >
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-3 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {active ? (
                    <span className="tactical-dot" />
                  ) : (
                    <span className="h-px w-3 bg-border" />
                  )}
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
