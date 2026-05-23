"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, Download } from "lucide-react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";

const sections = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

interface NavProps {
  activeId: string;
}

export function Nav({ activeId }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="bg-background/70 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-7xl px-safe flex items-center justify-between h-14 relative">
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 bg-primary/10 border border-primary/40 flex items-center justify-center tactical-chip">
              <span className="font-display text-lg text-primary leading-none translate-y-px">
                V
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-base uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                Vincent Do
              </span>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                SWE // AI/ML
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className={cn(
                    "relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {active && (
                      <span className="tactical-dot animate-pulse-dot" />
                    )}
                    {s.label}
                  </span>
                  {active && (
                    <span className="absolute -bottom-px left-2 right-2 h-px bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-50 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Online
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 h-8 px-4 tactical-chip border border-primary/40 hover:border-primary text-primary font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <Download className="h-3 w-3" />
              Resume
            </a>

            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <CornerBrackets size={8} thickness={1} />
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col px-safe py-4 gap-1">
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className={cn(
                    "flex items-center gap-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {active ? (
                    <span className="tactical-dot animate-pulse-dot" />
                  ) : (
                    <span className="h-px w-3 bg-border" />
                  )}
                  {s.label}
                </Link>
              );
            })}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-2 h-8 px-4 tactical-chip border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              <Download className="h-3 w-3" />
              Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
