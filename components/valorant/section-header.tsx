"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({
  number,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", className)}>
      <m.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-4 mb-4"
      >
        <div className="font-mono text-xs text-primary">{number}</div>
        <div className="h-px w-12 bg-primary" />
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
      </m.div>
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-none"
      >
        {title}
      </m.h2>
      {description && (
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-muted-foreground max-w-lg mt-4"
        >
          {description}
        </m.p>
      )}
    </div>
  );
}
