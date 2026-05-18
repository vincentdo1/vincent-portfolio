"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/valorant/section-header";
import { CornerBrackets } from "@/components/valorant/corner-brackets";

const projects = [
  {
    title: "Playable Chess AI",
    code: "AI-001",
    classification: "ML // GAMES",
    description:
      "Trained a CNN+LSTM legal move-policy model on 4.18M GM/Magnus Carlsen positions, achieving 71.2% top-5 accuracy on a 390K-position held-out test set. GPU-accelerated PyTorch training pipeline with mixed precision and custom IterableDataset reduced per-epoch time from 20+ hours on CPU to 15–25 minutes on GPU.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Stockfish"],
    image: "/project-placeholder-1.jpg",
    link: "https://github.com/vincentdo1/playable-chess-AI",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
    stats: [
      { label: "Top-5 Acc", value: "71.2%" },
      { label: "Train Set", value: "4.18M" },
      { label: "Speedup", value: "60x" },
    ],
  },
  {
    title: "We-Up",
    code: "FS-002",
    classification: "FULL-STACK // SOCIAL",
    description:
      "Social accountability app where groups post daily photo check-ins to shared prompts. Built a Hono.js REST API on Cloudflare Workers with PostgreSQL/Neon persistence, with Cloudflare Images for authenticated photo upload, storage, and retrieval.",
    tags: ["TypeScript", "Hono.js", "Next.js", "PostgreSQL", "Cloudflare"],
    image: "/project-placeholder-2.jpg",
    link: "#",
    repo: "#",
    stats: [
      { label: "Stack", value: "Edge" },
      { label: "Auth", value: "Auth0" },
      { label: "DB", value: "Neon" },
    ],
  },
  {
    title: "Airport Path Finder",
    code: "GR-003",
    classification: "GRAPH // VISUALIZATION",
    description:
      "Graph algorithms applied to global aviation networks. Implemented BFS, Floyd–Warshall, and betweenness centrality to analyze connectivity and routing patterns, with WebGL-based globe rendering of the top 10 most-connected airports.",
    tags: ["C++", "React", "WebGL"],
    image: "/project-placeholder-3.jpg",
    link: "https://github.com/vincentdo1/airports-global",
    repo: "https://github.com/vincentdo1/airports-global",
    stats: [
      { label: "Algos", value: "3" },
      { label: "Nodes", value: "3K+" },
      { label: "Render", value: "WebGL" },
    ],
  },
];

export function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const current = projects[selected];

  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 border-t border-border/60 px-safe"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="05 // PROJECTS"
          label="Loadout"
          title={
            <>
              Selected
              <br />
              <span className="text-primary">Works_</span>
            </>
          }
          description="Personal projects spanning ML, systems, and full-stack engineering."
        />

        <div className="grid lg:grid-cols-[1fr_300px] gap-6 mt-12">
          {/* Left: featured preview */}
          <div className="relative border border-border/60 bg-card/30 overflow-hidden">
            <CornerBrackets size={14} thickness={1.5} />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid"
              >
                {/* Image area with diagonal cuts */}
                <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60 bg-secondary">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover grayscale opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/40 to-transparent" />

                  {/* Classification badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                    <span className="tactical-dot animate-pulse-dot" />
                    {current.classification}
                  </div>

                  {/* Code label */}
                  <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {current.code}
                  </div>

                  {/* Big title overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-display text-4xl md:text-6xl uppercase leading-none text-foreground">
                      {current.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 grid gap-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {current.description}
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 border-y border-border/60 py-4">
                    {current.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                          {stat.label}
                        </div>
                        <div className="font-display text-2xl text-primary">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags + actions */}
                  <div className="flex items-end justify-between gap-4 flex-wrap">
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
                    <div className="flex items-center gap-3">
                      {current.repo !== "#" ? (
                        <a
                          href={current.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 h-9 px-4 tactical-chip border border-primary/40 hover:border-primary text-primary font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                        >
                          <Github className="h-3 w-3" />
                          Source
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 h-9 px-4 tactical-chip border border-border text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                          <Lock className="h-3 w-3" />
                          Private
                        </span>
                      )}
                      {current.link !== "#" && (
                        <a
                          href={current.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 h-9 px-4 tactical-chip bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                        >
                          Deploy <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: project list */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              Arsenal
            </div>
            {projects.map((p, i) => {
              const isActive = i === selected;
              return (
                <motion.button
                  key={p.code}
                  onClick={() => setSelected(i)}
                  whileHover={{ x: -4 }}
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
                          {p.code}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "font-display text-lg uppercase leading-tight",
                          isActive ? "text-foreground" : "text-foreground/80"
                        )}
                      >
                        {p.title}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
                        {p.classification}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* Future slot */}
            <div className="p-4 border border-dashed border-border/60 bg-card/20 opacity-50 tactical-chip">
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-1">
                SLOT_04
              </div>
              <div className="font-display text-lg uppercase leading-tight text-muted-foreground">
                Empty
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                Add next project
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
