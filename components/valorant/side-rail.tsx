"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About" },
  { id: "experience", number: "03", label: "Experience" },
  { id: "projects", number: "04", label: "Projects" },
  { id: "contact", number: "05", label: "Contact" },
];

/**
 * Vertical section indicator on the right side of the viewport — like a
 * Valorant round counter. Always visible, click any number to jump.
 */
export function SideRail() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 pointer-events-none">
      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2 text-right">
        Nav
      </div>
      {sections.map((s) => {
        const active = activeId === s.id;
        return (
          <Link
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center justify-end gap-3 pointer-events-auto"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-200",
                active
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "font-mono text-[10px] tracking-tight transition-colors w-6 text-right",
                active
                  ? "text-primary"
                  : "text-muted-foreground/40 group-hover:text-foreground"
              )}
            >
              {s.number}
            </span>
            <span
              className={cn(
                "h-px transition-all duration-200",
                active
                  ? "w-8 bg-primary"
                  : "w-4 bg-border group-hover:w-6 group-hover:bg-muted-foreground"
              )}
            />
          </Link>
        );
      })}
    </aside>
  );
}
