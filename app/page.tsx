"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  MapPin,
  Code2,
  Terminal,
  Cpu,
  Database,
  Send,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { SideRail } from "@/components/valorant/side-rail";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { SectionHeader } from "@/components/valorant/section-header";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";

const skills = [
  {
    category: "Languages",
    icon: <Code2 className="h-4 w-4 text-primary" />,
    items: [
      { name: "C++", proficiency: 95 },
      { name: "Python", proficiency: 92 },
      { name: "TypeScript", proficiency: 88 },
      { name: "JavaScript", proficiency: 88 },
      { name: "Java", proficiency: 75 },
      { name: "C#", proficiency: 70 },
      { name: "Kotlin", proficiency: 72 },
      { name: "SQL", proficiency: 80 },
    ],
  },
  {
    category: "Frameworks",
    icon: <Terminal className="h-4 w-4 text-primary" />,
    items: [
      { name: "React", proficiency: 90 },
      { name: "Next.js", proficiency: 88 },
      { name: "Node.js", proficiency: 85 },
      { name: "Flask", proficiency: 82 },
      { name: "PyTorch", proficiency: 85 },
      { name: "GraphQL", proficiency: 78 },
      { name: "REST APIs", proficiency: 90 },
      { name: "CUDA", proficiency: 70 },
    ],
  },
  {
    category: "Infrastructure",
    icon: <Database className="h-4 w-4 text-primary" />,
    items: [
      { name: "Docker", proficiency: 85 },
      { name: "Jenkins", proficiency: 75 },
      { name: "Git", proficiency: 95 },
      { name: "Linux", proficiency: 88 },
      { name: "PostgreSQL", proficiency: 80 },
      { name: "MongoDB", proficiency: 72 },
      { name: "GCP", proficiency: 70 },
      { name: "Cloudflare", proficiency: 75 },
    ],
  },
];

// Update with your real hobbies + interests
const interests = [
  { code: "01", label: "Chess", description: "Strategy and chess engines" },
  { code: "02", label: "Machine Learning", description: "Deep learning, CV, NLP" },
  { code: "03", label: "Systems", description: "Embedded, real-time, low-level" },
  { code: "04", label: "Gaming", description: "Add your gaming interests" },
  { code: "05", label: "Travel", description: "Add your travel interests" },
  { code: "06", label: "Music", description: "Add your music interests" },
];

const stats = [
  { label: "Years XP", value: "4+" },
  { label: "Languages", value: "8" },
  { label: "Projects", value: "10+" },
  { label: "GPA", value: "3.6" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden relative">
      <Nav />
      <SideRail />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-20 px-safe overflow-hidden"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Faded background hero img with green tint */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.jpg')] before:absolute before:inset-0 before:bg-primary before:mix-blend-color-dodge" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          {/* Left: name + meta */}
          <div>
            {/* Tactical eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-50 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                Available for Hire
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Hello, I&apos;m
              </div>
              <h1 className="font-display text-7xl md:text-9xl lg:text-[10rem] uppercase leading-[0.85] tracking-tight">
                Vincent
                <br />
                <span className="text-primary">Do_</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 max-w-lg space-y-4"
            >
              <p className="text-lg text-foreground/90">
                Software Engineer at{" "}
                <span className="text-primary font-medium">Boeing</span>.
                UIUC CS &amp; Chemistry alum. I build real-time embedded
                systems, full-stack web apps, and ML pipelines.
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                <MapPin className="h-3 w-3 text-primary" />
                Berkeley, MO
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-3 flex-wrap"
            >
              <Link
                href="#experience"
                className="relative inline-flex items-center gap-2 h-12 px-6 tactical-shape bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors group overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  View Work <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-6 tactical-shape border border-primary/40 hover:border-primary text-primary font-mono text-xs uppercase tracking-[0.25em] transition-colors"
              >
                <Send className="h-3 w-3" />
                Get in Touch
              </Link>
              <div className="flex items-center gap-1 ml-2">
                <a
                  href="https://github.com/vincentdo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/vincent-do-uiuc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="mailto:vincentdo306@gmail.com"
                  aria-label="Email"
                  className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: HUD stat panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative border border-border/60 bg-card/40 backdrop-blur-sm p-6">
              <CornerBrackets size={14} thickness={1.5} />

              <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Profile
                </div>
                <div className="font-mono text-[10px] text-primary">
                  ID//0306
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Role
                </div>
                <div className="font-display text-xl uppercase">
                  Software Engineer
                </div>
                <div className="font-mono text-xs text-primary uppercase tracking-wider">
                  Boeing
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative border border-border/60 bg-background/40 p-3"
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="font-display text-3xl text-primary leading-none">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    <span>Focus</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1 bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    <span>Caffeine</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1 bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.2, delay: 1.0 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    <span>Sleep</span>
                    <span>42%</span>
                  </div>
                  <div className="h-1 bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "42%" }}
                      transition={{ duration: 1.2, delay: 1.2 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/60 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>v1.0.0</span>
                <span>Build // Stable</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-primary" />
        </motion.div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="relative py-24 border-t border-border/60 px-safe"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            number="02 // ABOUT"
            label="Background"
            title={
              <>
                About
                <br />
                <span className="text-primary">Me_</span>
              </>
            }
          />

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 mt-12">
            {/* Left: bio */}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                I&apos;m a software engineer at{" "}
                <span className="text-foreground">Boeing</span> in Berkeley,
                MO, working on C++ embedded systems that deliver real-time data
                to flight display hardware. Before that, I interned at Expedia
                building mobile search features in Kotlin and GraphQL.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                I graduated from the{" "}
                <span className="text-foreground">
                  University of Illinois Urbana-Champaign
                </span>{" "}
                with a B.S. in Computer Science &amp; Chemistry. I&apos;m drawn
                to problems at the intersection of performance engineering and
                software correctness — real-time message routing, ML training
                pipelines, distributed backend services.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Outside of work I play{" "}
                <span className="text-foreground">chess</span>, hack on{" "}
                <span className="text-foreground">side projects</span>, and
                read about machine learning and systems programming.
              </motion.p>

              {/* Education card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="relative mt-8 p-5 border border-border/60 bg-card/40"
              >
                <CornerBrackets size={10} thickness={1} />
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Education
                </div>
                <div className="font-display text-2xl uppercase">UIUC</div>
                <div className="text-sm text-primary font-mono uppercase tracking-wider mt-1">
                  B.S. CS &amp; Chemistry
                </div>
                <div className="flex justify-between mt-3 font-mono text-xs text-muted-foreground">
                  <span>2020 — 2024</span>
                  <span>GPA: 3.6</span>
                </div>
              </motion.div>
            </div>

            {/* Right: interests grid */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6 flex items-center gap-3">
                <span className="h-px w-6 bg-primary" />
                Interests
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interests.map((item, i) => (
                  <motion.div
                    key={item.code}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="relative p-4 border border-border/60 bg-card/40 hover:border-primary/60 hover:bg-card transition-colors tactical-chip group cursor-default"
                  >
                    <div className="font-mono text-[10px] tracking-widest text-primary mb-2">
                      {item.code}
                    </div>
                    <div className="font-display text-lg uppercase group-hover:text-primary transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {item.description}
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mt-4 uppercase tracking-widest">
                <span className="text-primary">▸</span> edit interests[] in
                app/page.tsx
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE (interactive agent-select) ─────────────────────────── */}
      <ExperienceSection />

      {/* ── SKILLS / ARSENAL ─────────────────────────────────────────────── */}
      <section
        id="skills"
        className="relative py-24 border-t border-border/60 px-safe"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            number="04 // SKILLS"
            label="Tech Stack"
            title={
              <>
                Tech
                <br />
                <span className="text-primary">Stack_</span>
              </>
            }
            description="From C++ at work to ML pipelines in PyTorch — the tools I reach for daily."
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative border border-border/60 bg-card/40 p-6"
              >
                <CornerBrackets size={10} thickness={1} />

                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
                  {group.icon}
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {group.category}
                  </div>
                  <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                    {group.items.length}
                  </span>
                </div>

                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono uppercase tracking-wider text-foreground/90 group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.proficiency}%
                        </span>
                      </div>
                      <div className="h-[2px] bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2 + i * 0.1,
                            ease: "easeOut",
                          }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS (interactive weapon-select) ──────────────────────────── */}
      <ProjectsSection />

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative py-24 border-t border-border/60 px-safe"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            number="06 // CONTACT"
            label="Get in Touch"
            title={
              <>
                Let&apos;s
                <br />
                <span className="text-primary">Talk_</span>
              </>
            }
            description="Open to opportunities, collaborations, and interesting conversations."
          />

          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            {/* Left: contact links */}
            <div className="space-y-3">
              <a
                href="mailto:vincentdo306@gmail.com"
                className="group relative block border border-border/60 hover:border-primary/60 bg-card/40 hover:bg-card p-5 transition-colors"
              >
                <CornerBrackets size={10} thickness={1} />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 border border-primary/40 bg-primary/5 flex items-center justify-center tactical-chip text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                      Send a Message
                    </div>
                    <div className="font-display text-xl uppercase group-hover:text-primary transition-colors">
                      Email
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      vincentdo306@gmail.com
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </a>

              <a
                href="https://linkedin.com/in/vincent-do-uiuc"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block border border-border/60 hover:border-primary/60 bg-card/40 hover:bg-card p-5 transition-colors"
              >
                <CornerBrackets size={10} thickness={1} />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 border border-primary/40 bg-primary/5 flex items-center justify-center tactical-chip text-primary">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                      Connect
                    </div>
                    <div className="font-display text-xl uppercase group-hover:text-primary transition-colors">
                      LinkedIn
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      linkedin.com/in/vincent-do-uiuc
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </a>

              <a
                href="https://github.com/vincentdo1"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block border border-border/60 hover:border-primary/60 bg-card/40 hover:bg-card p-5 transition-colors"
              >
                <CornerBrackets size={10} thickness={1} />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 border border-primary/40 bg-primary/5 flex items-center justify-center tactical-chip text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                      Open Source
                    </div>
                    <div className="font-display text-xl uppercase group-hover:text-primary transition-colors">
                      GitHub
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      github.com/vincentdo1
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            </div>

            {/* Right: location + CTA */}
            <div className="relative border border-border/60 bg-card/40 p-8 flex flex-col">
              <CornerBrackets size={14} thickness={1.5} />

              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-primary" />
                  Based in
                </div>
                <div className="font-display text-4xl uppercase leading-none mb-2">
                  Berkeley
                </div>
                <div className="text-primary font-mono text-sm uppercase tracking-wider">
                  Missouri // United States
                </div>

                <div className="mt-8 space-y-3 font-mono text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest">Status</span>
                    <span className="text-primary uppercase tracking-widest flex items-center gap-2">
                      <span className="tactical-dot animate-pulse-dot" />
                      Available
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest">Response Time</span>
                    <span className="uppercase tracking-widest">{"< 24h"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest">Open to</span>
                    <span className="uppercase tracking-widest">FT / Contract</span>
                  </div>
                </div>
              </div>

              <a
                href="mailto:vincentdo306@gmail.com?subject=Hello%20Vincent"
                className={cn(
                  "mt-8 relative inline-flex items-center justify-center gap-2 h-12 px-6",
                  "tactical-shape bg-primary text-primary-foreground",
                  "font-mono text-xs uppercase tracking-[0.25em]",
                  "hover:bg-primary/90 transition-colors group overflow-hidden"
                )}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Send className="h-3 w-3" />
                  Send Message
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 py-8 px-safe">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="tactical-dot" />
            <span>© {new Date().getFullYear()} Vincent Do</span>
            <span className="hidden md:inline text-primary/60">›</span>
            <span className="hidden md:inline">All Rights Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <span>v1.0.0</span>
            <Cpu className="h-3 w-3 text-primary" />
          </div>
        </div>
      </footer>
    </div>
  );
}
