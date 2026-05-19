"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/valorant/section-header";
import { CornerBrackets } from "@/components/valorant/corner-brackets";

type Project = {
  title: string;
  code: string;
  classification: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  repo: string;
  stats: { label: string; value: string }[];
  upcoming?: boolean;
};

const projects: Project[] = [
  {
    title: "Playable Chess AI",
    code: "AI-001",
    classification: "ML // GAMES",
    description:
      "Trained a CNN+LSTM legal move-policy model on 4.18M GM/Magnus Carlsen positions, achieving 71.2% top-5 accuracy on a 390K-position held-out test set. GPU-accelerated PyTorch training pipeline with mixed precision and custom IterableDataset reduced per-epoch time from 20+ hours on CPU to 15–25 minutes on GPU.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Stockfish"],
    image: "/project-placeholder-1.jpg",
    link: "https://vincentdo1.github.io/playable-chess-AI/",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
    stats: [
      { label: "Top-5 Acc", value: "71.2%" },
      { label: "Train Set", value: "4.18M" },
      { label: "Speedup", value: "60x" },
    ],
  },
  {
    title: "Exploding Chickens",
    code: "GM-002",
    classification: "GAMES // MULTIPLAYER",
    description:
      "Real-time multiplayer card game inspired by Exploding Kittens. Built a Node.js backend with asynchronous game logic and persistent session state via MongoDB, keeping gameplay consistent across concurrent players. 1000+ games played.",
    tags: ["Node.js", "MongoDB", "Real-time"],
    image: "/project-placeholder-2.jpg",
    link: "https://chickens.rakerman.com",
    repo: "#",
    stats: [
      { label: "Games", value: "1000+" },
      { label: "Backend", value: "Node.js" },
      { label: "Storage", value: "MongoDB" },
    ],
  },
  {
    title: "Volleyball Motion Tracker",
    code: "CV-003",
    classification: "COMPUTER VISION // SPORTS",
    // TODO: replace with real description, tags, stats, and links
    description:
      "TBD — computer-vision motion tracking for volleyball footage. Add what you track (player position, ball trajectory, play classification) and the techniques you used.",
    tags: ["Python", "OpenCV", "TBD"],
    image: "/project-placeholder-3.jpg",
    link: "#",
    repo: "#",
    stats: [
      { label: "FPS", value: "TBD" },
      { label: "Model", value: "TBD" },
      { label: "Output", value: "TBD" },
    ],
  },
  {
    title: "Airport Paths",
    code: "GR-004",
    classification: "GRAPH // VISUALIZATION",
    description:
      "BFS, Floyd–Warshall, and betweenness centrality applied to aviation networks. Identifies the top 10 most-connected airports and renders the routes on a WebGL globe.",
    tags: ["C++", "React", "WebGL"],
    image: "/project-placeholder-3.jpg",
    link: "https://vincentdo1.github.io/airports-paths/",
    repo: "#",
    stats: [
      { label: "Algos", value: "3" },
      { label: "Top", value: "10" },
      { label: "Render", value: "WebGL" },
    ],
  },
  {
    title: "Helium Hydride Visualizer",
    code: "CHM-005",
    classification: "CHEMISTRY // 3D",
    description:
      "Upcoming: a 3D visualization of the helium hydride molecule (HeH⁺) — the first molecule believed to have formed in the early universe. Plans for interactive orbital rendering and bonding visualization.",
    tags: ["Three.js", "WebGL", "Chemistry"],
    image: "/project-placeholder-1.jpg",
    link: "#",
    repo: "#",
    upcoming: true,
    stats: [
      { label: "Status", value: "Planning" },
      { label: "Stack", value: "TBD" },
      { label: "Type", value: "3D" },
    ],
  },
];

export function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const current = projects[selected];

  return (
    <section
      id="projects"
      className="relative py-24 border-t border-border/60 px-safe"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="04 // PROJECTS"
          label="Featured"
          title={
            <>
              Selected
              <br />
              <span className="text-primary">Works_</span>
            </>
          }
          description="Personal projects spanning ML, systems, computer vision, and chemistry visualization."
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

                  {/* Upcoming badge */}
                  {current.upcoming && (
                    <div className="absolute top-4 right-32 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-1 bg-primary/10 border border-primary/40 text-primary">
                      <Clock className="h-3 w-3" />
                      In Development
                    </div>
                  )}

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
                      {current.upcoming ? (
                        <span className="inline-flex items-center gap-2 h-9 px-4 tactical-chip border border-dashed border-primary/40 text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                          <Clock className="h-3 w-3" />
                          Coming Soon
                        </span>
                      ) : current.link !== "#" ? (
                        <a
                          href={current.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 h-9 px-4 tactical-chip bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                        >
                          Visit Site <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 h-9 px-4 tactical-chip border border-dashed border-border text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                          <Clock className="h-3 w-3" />
                          Not Deployed
                        </span>
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
              All Projects
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
                      : p.upcoming
                        ? "bg-card/20 border-dashed border-border/60 hover:border-primary/40"
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
                        {p.upcoming && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/80">
                            <Clock className="h-2.5 w-2.5 inline" /> Soon
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "font-display text-lg uppercase leading-tight",
                          isActive
                            ? "text-foreground"
                            : p.upcoming
                              ? "text-foreground/60"
                              : "text-foreground/80"
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
          </div>
        </div>
      </div>
    </section>
  );
}
