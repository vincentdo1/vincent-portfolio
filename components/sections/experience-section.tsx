"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/valorant/section-header";
import { CornerBrackets } from "@/components/valorant/corner-brackets";

const experiences = [
  {
    company: "Boeing",
    role: "Software Engineer",
    period: "Aug 2024 — Present",
    location: "Berkeley, MO",
    code: "BCA",
    current: true,
    tags: ["C++", "Embedded", "Real-time", "Docker"],
    summary:
      "Real-time C++ and Ada features for data processing and embedded display systems. Own integration and release readiness for a framework consumed by 60+ modules.",
  },
  {
    company: "Expedia Group",
    role: "SDE Intern",
    period: "May 2023 — Aug 2023",
    location: "Chicago, IL",
    code: "EXP",
    current: false,
    tags: ["Kotlin", "GraphQL", "Microservices"],
    summary:
      "Shipped customer-facing mobile search features in Kotlin and GraphQL across multiple microservices. Localized components for 16 languages.",
  },
  {
    company: "UW–Madison",
    role: "Biomedical Researcher",
    period: "May 2021 — Aug 2021",
    location: "Madison, WI",
    code: "UWM",
    current: false,
    tags: ["Python", "R", "Graph Algos"],
    summary:
      "Computational genomics — analyzed 16,813 genes across 169 phenotypes with Python/R and graph traversal to surface rare-disease candidates.",
  },
];

export function ExperienceSection() {
  const [selected, setSelected] = useState(0);
  const current = experiences[selected];

  return (
    <section
      id="experience"
      className="relative py-24 border-t border-border/60 px-safe"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="03 // EXPERIENCE"
          label="Work History"
          title={
            <>
              Work
              <br />
              <span className="text-primary">History_</span>
            </>
          }
          description="Roles across embedded systems, full-stack web, and computational research."
        />

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 mt-12">
          {/* Left rail: role select */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              Select Role
            </div>
            {experiences.map((exp, i) => {
              const isActive = i === selected;
              return (
                <motion.button
                  key={exp.code}
                  onClick={() => setSelected(i)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "w-full text-left relative p-4 border transition-all duration-200 tactical-chip",
                    isActive
                      ? "bg-primary/10 border-primary glow-primary"
                      : "bg-card/40 border-border/60 hover:border-primary/40 hover:bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "font-mono text-[10px] tracking-widest",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {exp.code}
                        </span>
                        {exp.current && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-primary text-primary-foreground uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "font-display text-xl uppercase leading-tight",
                          isActive ? "text-foreground" : "text-foreground/80"
                        )}
                      >
                        {exp.company}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {exp.role}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "font-mono text-[9px] tracking-widest transition-opacity",
                        isActive ? "text-primary opacity-100" : "opacity-0"
                      )}
                    >
                      ►
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: detail panel */}
          <div className="relative border border-border/60 bg-card/30 p-6 lg:p-8">
            <CornerBrackets size={14} thickness={1.5} />

            {/* HUD header strip */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-primary" />
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Role // {current.code}
                </div>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {String(selected + 1).padStart(2, "0")} /{" "}
                {String(experiences.length).padStart(2, "0")}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="font-mono text-[11px] text-primary uppercase tracking-[0.25em] mb-2">
                    {current.role}
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl uppercase leading-none">
                    {current.company}
                  </h3>
                  <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
                    {current.summary}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {current.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {current.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-secondary/60 border border-border tactical-chip text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
