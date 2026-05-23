"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  MapPin,
  Cpu,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { SectionHeader } from "@/components/valorant/section-header";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { useActiveSection } from "@/lib/use-active-section";

const contactDialogLoader = () =>
  import("@/components/sections/contact-dialog").then(
    (mod) => mod.ContactDialog,
  );

const ContactDialog = dynamic(contactDialogLoader, { ssr: false });

function preloadContactDialog() {
  void contactDialogLoader();
}

const sectionIds = ["hero", "about", "experience", "projects", "contact"];

type Interest = {
  code: string;
  label: string;
  description: string;
  link?: string;
  linkLabel?: string;
};

const interests: Interest[] = [
  {
    code: "01",
    label: "Chess",
    description: "National Master; Congress Recognition",
    link: "https://www.chess.com/member/vmd306",
    linkLabel: "chess.com/vmd306",
  },
  {
    code: "02",
    label: "Cooking",
    description: "Process, taste, and quick iteration",
  },
  {
    code: "03",
    label: "Volleyball",
    description: "Competitive reps away from the keyboard",
  },
  {
    code: "04",
    label: "Gaming",
    description: "Pokémon enthusiast and sharp shooter in Valorant",
  },
];

const trajectory = [
  { tag: "Now", company: "Boeing", note: "SWE" },
  { tag: "2023", company: "Expedia", note: "SDE Intern" },
  { tag: "Edu", company: "UIUC", note: "CS + Chem" },
];

const stack = [
  { label: "Lang", items: "C++ · Python · TypeScript · Kotlin" },
  { label: "ML/AI", items: "PyTorch · CUDA · CNN" },
  { label: "Web", items: "React · Node.js · GraphQL · PostgreSQL" },
  { label: "Infra", items: "Docker · Jenkins · Cloudflare · Linux" },
];

const impact = [
  { value: "60+", label: "Modules on shared framework" },
  { value: "4.18M", label: "Positions trained · CNN+LSTM" },
  { value: "16", label: "Languages shipped at Expedia" },
];

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);
  const openContact = () => {
    preloadContactDialog();
    setContactOpen(true);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden relative">
        <Nav activeId={activeId} />
        {contactOpen && (
          <ContactDialog
            open={contactOpen}
            onClose={() => setContactOpen(false)}
          />
        )}

        <section
          id="hero"
          className="relative min-h-screen flex items-center pt-20 px-safe overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute inset-0">
              <Image
                src="/hero-bg.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                quality={75}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-primary mix-blend-color-dodge" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div>
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Hello, I&apos;m
                </div>
                <h1 className="font-display text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-[0.85] tracking-tight break-words">
                  Vincent
                  <br />
                  <span className="text-primary">Do_</span>
                </h1>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 max-w-lg space-y-4"
              >
                <p className="text-lg text-foreground/90">
                  Software engineer focused on backend systems, AI/ML, and
                  full-stack product engineering. Current SWE at{" "}
                  <span className="text-primary font-medium">Boeing</span>,
                  former Expedia SDE intern, UIUC CS &amp; Chemistry alum.
                </p>
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  <MapPin className="h-3 w-3 text-primary" />
                  St. Louis, MO
                </div>
              </m.div>

              <m.div
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
                <button
                  type="button"
                  onPointerEnter={preloadContactDialog}
                  onFocus={preloadContactDialog}
                  onClick={openContact}
                  className="inline-flex items-center gap-2 h-12 px-6 tactical-shape border border-primary/40 hover:border-primary text-primary font-mono text-xs uppercase tracking-[0.25em] transition-colors"
                >
                  <Send className="h-3 w-3" />
                  Get in Touch
                </button>
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
                  <button
                    type="button"
                    onPointerEnter={preloadContactDialog}
                    onFocus={preloadContactDialog}
                    onClick={openContact}
                    aria-label="Email"
                    className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </m.div>
            </div>

            <m.div
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
                    ID//306
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
                    Backend // AI/ML // Full-Stack
                  </div>
                </div>

                <div className="mb-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" />
                    Trajectory
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {trajectory.map((item, i) => {
                      const isNow = i === 0;
                      return (
                        <div
                          key={item.company}
                          className={cn(
                            "relative border p-2.5",
                            isNow
                              ? "border-primary/50 bg-primary/5"
                              : "border-border/60 bg-background/40",
                          )}
                        >
                          <div
                            className={cn(
                              "font-mono text-[9px] uppercase tracking-widest mb-1",
                              isNow ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {item.tag}
                          </div>
                          <div className="font-display text-base uppercase leading-none">
                            {item.company}
                          </div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mt-1">
                            {item.note}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" />
                    Stack
                  </div>
                  <div className="border border-border/60 bg-background/40 divide-y divide-border/60">
                    {stack.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-widest text-primary w-12 shrink-0">
                          {row.label}
                        </span>
                        <span className="font-mono text-[11px] text-foreground/85 leading-snug">
                          {row.items}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" />
                    Impact
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {impact.map((item, i) => (
                      <m.div
                        key={item.value}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                        className="relative border border-border/60 bg-background/40 p-2.5"
                      >
                        <div className="font-display text-2xl text-primary leading-none">
                          {item.value}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5 leading-tight">
                          {item.label}
                        </div>
                      </m.div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>v1.0.0</span>
                  <span className="flex items-center gap-2 text-primary">
                    <span className="tactical-dot animate-pulse-dot" />
                    Open // SWE Roles
                  </span>
                </div>
              </div>
            </m.div>
          </div>

        </section>

        <section
          id="about"
          className="relative content-auto py-24 border-t border-border/60 px-safe"
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
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  I&apos;m a software engineer building production software
                  across backend systems, ML/AI pipelines, and full-stack
                  product surfaces. At{" "}
                  <span className="text-foreground">Boeing</span>, I work on
                  real-time C++ and Ada features with automated tests,
                  Dockerized builds, and release ownership for shared systems.
                </m.p>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  I graduated from the{" "}
                  <span className="text-foreground">
                    University of Illinois Urbana-Champaign
                  </span>{" "}
                  with a B.S. in Computer Science &amp; Chemistry. Before my
                  current role, I shipped customer-facing Expedia mobile search
                  features across Kotlin microservices, GraphQL APIs, and
                  localized frontend flows.
                </m.p>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  I like work where correctness, performance, and user impact
                  all matter: APIs that scale, model pipelines that can be
                  trusted, and interfaces that make complex systems feel clear.
                </m.p>

                <m.div
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
                  <div className="mt-3 font-mono text-xs text-muted-foreground">
                    2020 - 2024
                  </div>
                </m.div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-primary" />
                  Beyond Code
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {interests.map((item, i) => (
                    <m.div
                      key={item.code}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="relative p-4 border border-border/60 bg-card/40 hover:border-primary/60 hover:bg-card transition-colors tactical-chip group"
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
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                        >
                          → {item.linkLabel ?? "Visit"}
                        </a>
                      )}
                    </m.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ExperienceSection />

        <ProjectsSection />

        <section
          id="contact"
          className="relative content-auto py-24 border-t border-border/60 px-safe"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="05 // CONTACT"
              label="Get in Touch"
              title={
                <>
                  Let&apos;s
                  <br />
                  <span className="text-primary">Talk_</span>
                </>
              }
              description="Open to backend, AI/ML, GenAI, frontend, and full-stack SWE roles."
            />

            <div className="grid lg:grid-cols-2 gap-6 mt-12">
              <div className="space-y-3">
                <button
                  type="button"
                  onPointerEnter={preloadContactDialog}
                  onFocus={preloadContactDialog}
                  onClick={openContact}
                  className="group relative block w-full text-left border border-border/60 hover:border-primary/60 bg-card/40 hover:bg-card p-5 transition-colors"
                >
                  <CornerBrackets size={10} thickness={1} />
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 border border-primary/40 bg-primary/5 flex items-center justify-center tactical-chip text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                        Quick Message
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
                </button>

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

              <div className="relative border border-border/60 bg-card/40 p-8 flex flex-col">
                <CornerBrackets size={14} thickness={1.5} />

                <div className="flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-3">
                    <span className="h-px w-6 bg-primary" />
                    Based in
                  </div>
                  <div className="font-display text-4xl uppercase leading-none mb-2">
                    St. Louis
                  </div>
                  <div className="text-primary font-mono text-sm uppercase tracking-wider">
                    Missouri // United States
                  </div>

                  <div className="mt-8 space-y-3 font-mono text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span className="uppercase tracking-widest">Status</span>
                      <span className="text-primary uppercase tracking-widest flex items-center gap-2">
                        <span className="tactical-dot animate-pulse-dot" />
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-widest">
                        Response Time
                      </span>
                      <span className="uppercase tracking-widest">
                        {"< 24h"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-widest">Open to</span>
                      <span className="uppercase tracking-widest">
                        Backend / AI / Full-Stack
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onPointerEnter={preloadContactDialog}
                  onFocus={preloadContactDialog}
                  onClick={openContact}
                  className={cn(
                    "mt-8 relative inline-flex items-center justify-center gap-2 h-12 px-6",
                    "tactical-shape bg-primary text-primary-foreground",
                    "font-mono text-xs uppercase tracking-[0.25em]",
                    "hover:bg-primary/90 transition-colors group overflow-hidden",
                  )}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Send className="h-3 w-3" />
                    Send Message
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

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
    </LazyMotion>
  );
}
