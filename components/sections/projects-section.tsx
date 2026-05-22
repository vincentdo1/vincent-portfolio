"use client";

import { useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/valorant/section-header";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { AirportGlobe } from "@/components/globe/airport-globe-dynamic";
import { GLOBE_CDN } from "@/components/globe/constants";

type Project = {
  title: string;
  code: string;
  classification: string;
  description: string;
  tags: string[];
  image: string;
  video?: string;
  globe?: boolean;
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
      "Trained a CNN+LSTM legal move-policy model on 4.18M GM/Magnus Carlsen positions. GPU-accelerated PyTorch training pipeline reducing per-epoch time from 20+ hours on CPU to 15–25 minutes on GPU.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Stockfish"],
    image: "/projects/chess-network-poster.png",
    video: "/projects/chess-network.mp4",
    link: "https://vincentdo1.github.io/playable-chess-AI/",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
    stats: [
      { label: "Architecture", value: "CNN/LSTM" },
      { label: "Train Set", value: "4.18M" },
      { label: "Optimization", value: "60x" },
    ],
  },
  {
    title: "Exploding Chickens",
    code: "GM-002",
    classification: "GAMES // MULTIPLAYER",
    description:
      "First personal project. Real-time multiplayer card game. Built a Node.js backend with asynchronous game logic and persistent session state via MongoDB, keeping gameplay consistent across concurrent players. 1600+ games played.",
    tags: ["Node.js", "MongoDB", "Real-time"],
    image: "/project-placeholder-2.jpg",
    link: "https://chickens.rakerman.com",
    repo: "#",
    stats: [
      { label: "Games", value: "1600+" },
      { label: "Backend", value: "Node.js" },
      { label: "Storage", value: "MongoDB" },
    ],
  },
  {
    title: "Volleyball Motion Tracker",
    code: "CV-003",
    classification: "COMPUTER VISION // SPORTS",
    description:
      "In-progress: computer-vision pipeline for volleyball footage — tracking player position, ball trajectory, and spike performance. Preview clip shows live attack analysis.",
    tags: ["Python", "OpenCV", "Computer Vision"],
    image: "/project-placeholder-3.jpg",
    video: "/projects/volleyball-tracker.mp4",
    link: "#",
    repo: "#",
    upcoming: true,
    stats: [
      { label: "Status", value: "WIP" },
      { label: "Stack", value: "Python" },
      { label: "Type", value: "CV" },
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
    globe: true,
    link: "https://vincentdo1.github.io/airports-paths/",
    repo: "#",
    stats: [
      { label: "Airports", value: "14110" },
      { label: "Paths", value: "37595" },
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

function preloadGlobe() {
  void import("@/components/globe/airport-globe");
  [
    { as: "script", href: GLOBE_CDN },
    { as: "image", href: "/projects/earth-night.jpg" },
    { as: "fetch", href: "/projects/airport-nodes.json" },
    { as: "fetch", href: "/projects/airport-arcs-preview.json" },
  ].forEach(({ as, href }) => {
    const exists = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]'),
    ).some((link) => link.getAttribute("href") === href);
    if (exists) return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = as;
    link.href = href;
    if (as === "fetch") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

let globePreloaded = false;
function onGlobeButtonHover() {
  if (globePreloaded) return;
  globePreloaded = true;
  preloadGlobe();
}

export function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const current = projects[selected];

  return (
    <section
      id="projects"
      className="relative content-auto py-24 border-t border-border/60 px-safe"
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
          <div className="relative border border-border/60 bg-card/30 overflow-hidden">
            <CornerBrackets size={14} thickness={1.5} />

            <AnimatePresence mode="wait">
              <m.div
                key={current.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid"
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60 bg-secondary">
                  {current.globe ? (
                    <AirportGlobe />
                  ) : current.video ? (
                    <video
                      key={current.code}
                      src={current.video}
                      poster={current.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      sizes="(min-width: 1280px) 860px, (min-width: 1024px) calc(100vw - 380px), calc(100vw - 2rem)"
                      quality={75}
                      className="object-cover grayscale opacity-50"
                    />
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 pointer-events-none",
                      current.globe
                        ? "bg-gradient-to-tr from-background/60 via-background/10 to-transparent"
                        : "bg-gradient-to-tr from-background via-background/40 to-transparent",
                    )}
                  />

                  {current.globe && (
                    <div className="absolute bottom-[5.5rem] right-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-primary/50 pointer-events-none select-none">
                      <RotateCcw className="h-2.5 w-2.5" />
                      Drag to rotate
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                    <span className="tactical-dot animate-pulse-dot" />
                    {current.classification}
                  </div>

                  {current.upcoming && (
                    <div className="absolute top-4 right-32 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-1 bg-primary/10 border border-primary/40 text-primary">
                      <Clock className="h-3 w-3" />
                      In Development
                    </div>
                  )}

                  <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {current.code}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-display text-4xl md:text-6xl uppercase leading-none text-foreground">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 lg:p-8 grid gap-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {current.description}
                  </p>

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
              </m.div>
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              All Projects
            </div>
            {projects.map((p, i) => {
              const isActive = i === selected;
              return (
                <m.button
                  key={p.code}
                  onClick={() => setSelected(i)}
                  onMouseEnter={p.globe ? onGlobeButtonHover : undefined}
                  onFocus={p.globe ? onGlobeButtonHover : undefined}
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "w-full text-left relative p-4 border transition-all duration-200 tactical-chip",
                    isActive
                      ? "bg-primary/10 border-primary glow-primary"
                      : p.upcoming
                        ? "bg-card/20 border-dashed border-border/60 hover:border-primary/40"
                        : "bg-card/40 border-border/60 hover:border-primary/40 hover:bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "font-mono text-[10px] tracking-widest",
                            isActive ? "text-primary" : "text-muted-foreground",
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
                              : "text-foreground/80",
                        )}
                      >
                        {p.title}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
                        {p.classification}
                      </div>
                    </div>
                  </div>
                </m.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
