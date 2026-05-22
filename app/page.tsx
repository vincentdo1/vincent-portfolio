"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  MapPin,
  Cpu,
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
import { ContactDialog } from "@/components/sections/contact-dialog";

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
    description: "National Master Title and ML/AI",
    link: "https://www.chess.com/member/vmd306",
    linkLabel: "chess.com/vmd306",
  },
  { code: "02", label: "Cooking", description: "Anything but baking" },
  { code: "03", label: "Coding", description: "Building passionate projects" },
  { code: "04", label: "Gaming", description: "Pokémon and Valorant" },
  { code: "05", label: "Volleyball", description: "On the court when I can" },
  { code: "06", label: "Music", description: "K-pop and piano" },
];

const stats = [
  { label: "Years XP", value: "2" },
  { label: "Languages", value: "5" },
  { label: "Projects", value: "5+" },
  { label: "Companies", value: "3" },
];

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden relative">
      <Nav />
      <SideRail />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />

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
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url(/hero-bg.jpg)] before:absolute before:inset-0 before:bg-primary before:mix-blend-color-dodge" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
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
                systems, full-stack web apps, and ML pipelines and products.
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                <MapPin className="h-3 w-3 text-primary" />
                St. Louis, MO
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
              <button
                type="button"
                onClick={() => setContactOpen(true)}
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
                  onClick={() => setContactOpen(true)}
                  aria-label="Email"
                  className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary text-muted-foreground transition-colors tactical-chip"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>

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
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                I&apos;m a software engineer at{" "}
                <span className="text-foreground">Boeing</span>, based in St.
                Louis, working on C++ embedded systems that deliver real-time
                data to flight display hardware. Before that, I interned at
                Expedia building mobile search features in Kotlin and GraphQL.
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
                software correctness — distributed backend services, ML training
                pipelines, delivering final products.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Outside of work I participate in{" "}
                <span className="text-foreground">volleyball</span> tournaments, hack on{" "}
                <span className="text-foreground">side projects</span>, and
                keep myself up to date on modern technology. I also enjoy thinking about the intersection
                between software and chemistry.
              </motion.p>

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
                <div className="mt-3 font-mono text-xs text-muted-foreground">
                  2020 — 2024
                </div>
              </motion.div>
            </div>

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
                  </motion.div>
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
        className="relative py-24 border-t border-border/60 px-safe"
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
            description="Open to opportunities, collaborations, and interesting conversations."
          />

          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
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
                    <span className="uppercase tracking-widest">Response Time</span>
                    <span className="uppercase tracking-widest">{"< 24h"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest">Open to</span>
                    <span className="uppercase tracking-widest">All FT Software Roles</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setContactOpen(true)}
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
  );
}
