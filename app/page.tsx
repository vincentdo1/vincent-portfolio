import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Nav } from "@/components/nav";
import { ProjectImage } from "@/components/project-image";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowRight,
  MapPin,
  Code2,
  Database,
  Cpu,
  Terminal,
} from "lucide-react";
import { Container } from "@/components/zippystarter/container";

const experiences = [
  {
    company: "Boeing Company",
    role: "Software Engineer",
    period: "Aug 2024 – Present",
    location: "Berkeley, MO",
    current: true,
    bullets: [
      "Developed production C++ features delivering real-time message streams to embedded display systems, with automated tests and Dockerized build workflows",
      "Owned integration and release readiness for a shared framework consumed by 60+ dependent modules, resolving compatibility issues to maintain timing accuracy",
      "Identified root cause of a long-standing cross-system defect within two weeks of onboarding, tracing a binary data merge edge case and restoring correct output behavior",
      "Spearheaded month-long evaluation of Lockheed Martin software through custom integration, verifying customer requirements at 1.5× the required message rate",
    ],
  },
  {
    company: "Expedia Group",
    role: "Software Development Engineer Intern",
    period: "May 2023 – Aug 2023",
    location: "Chicago, IL",
    current: false,
    bullets: [
      "Built customer-facing Expedia mobile search features, including VIP Access badges, sort/filter options, and improved error handling to reduce booking search friction",
      "Implemented GraphQL schema changes across multiple Kotlin microservices, enabling new mobile booking flows across backend and client surfaces",
      "Built backend support for localized search components across 16 languages, partnering with frontend and localization teams to validate dynamic rendering",
    ],
  },
  {
    company: "University of Wisconsin–Madison",
    role: "Biomedical Undergraduate Researcher",
    period: "May 2021 – Aug 2021",
    location: "Madison, WI",
    current: false,
    bullets: [
      "Analyzed 16,813 genes across 169 phenotypes using Python/R, graph traversal, and visualization to identify phenotype–gene associations",
      "Reduced search space to 25 high-priority Zellweger candidate genes using frequency thresholds, chromosomal-location filtering, and recursive phenotype hierarchy traversal",
    ],
  },
];

const projects = [
  {
    title: "Playable Chess AI",
    description:
      "Trained a CNN+LSTM legal move-policy model on 4.18M GM/Magnus positions, achieving 71.2% top-5 accuracy on a 390K-position test set. GPU-accelerated training pipeline reduced per-epoch time from 20+ hours to 15–25 minutes.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Stockfish"],
    image: "/project-placeholder-1.jpg",
    link: "https://github.com/vincentdo1/playable-chess-AI",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
  },
  {
    title: "We-Up",
    description:
      "Social accountability app built on Cloudflare Workers with a Hono.js REST API, PostgreSQL/Neon persistence, and Cloudflare Images for authenticated photo upload, storage, and group post retrieval.",
    tags: ["TypeScript", "Hono.js", "Next.js", "PostgreSQL", "Cloudflare"],
    image: "/project-placeholder-2.jpg",
    link: "#",
    repo: "#",
  },
  {
    title: "Airport Path Finder",
    description:
      "BFS, Floyd–Warshall, and betweenness centrality algorithms to analyze connectivity and routing in aviation networks, with WebGL globe rendering of the top 10 most important airports.",
    tags: ["C++", "React", "WebGL"],
    image: "/project-placeholder-3.jpg",
    link: "https://github.com/vincentdo1/airports-global",
    repo: "https://github.com/vincentdo1/airports-global",
  },
];

const skills = [
  {
    category: "Languages",
    icon: <Code2 className="h-8 w-8 mb-2 text-primary" />,
    label: "POLYGLOT",
    items: ["C++", "Python", "TypeScript", "JavaScript", "Java", "C#", "SQL", "Kotlin"],
  },
  {
    category: "Frameworks",
    icon: <Terminal className="h-8 w-8 mb-2 text-primary" />,
    label: "FRAMEWORKS",
    items: ["React", "Next.js", "Node.js", "Flask", "PyTorch", "GraphQL", "REST APIs", "CUDA"],
  },
  {
    category: "Tools & Infra",
    icon: <Database className="h-8 w-8 mb-2 text-primary" />,
    label: "INFRA",
    items: ["Docker", "Jenkins", "Git", "Linux", "PostgreSQL", "MongoDB", "GCP", "Cloudflare"],
  },
];

// Update these with your actual hobbies and interests
const interests = [
  {
    emoji: "♟️",
    label: "Chess",
    description: "Strategy games and chess engines",
  },
  {
    emoji: "🤖",
    label: "Machine Learning",
    description: "Deep learning, CV, and NLP",
  },
  {
    emoji: "⚡",
    label: "Systems Programming",
    description: "Embedded & real-time computing",
  },
  {
    emoji: "🎮",
    label: "Gaming",
    description: "Add your gaming interests here",
  },
  {
    emoji: "🌍",
    label: "Travel",
    description: "Add your travel interests here",
  },
  {
    emoji: "🎵",
    label: "Music",
    description: "Add your music interests here",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Container
        wrapperClassName="relative min-h-screen flex items-center pt-16 overflow-hidden"
        className="mx-auto max-w-7xl flex-1"
      >
        <div className="absolute inset-0 z-0">
          <div className="relative w-[100vw] h-[100vh] bg-background overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.jpg')] before:absolute before:inset-0 before:bg-primary before:mix-blend-color-dodge dark:before:mix-blend-color" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AVAILABLE FOR NEW OPPORTUNITIES
            </div>
            <h1 className="text-6xl md:text-8xl font-display tracking-tighter leading-[0.9]">
              VINCENT
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground">
                DO_
              </span>
            </h1>
            <p className="md:text-xl text-muted-foreground max-w-md leading-relaxed">
              Software Engineer at Boeing. UIUC CS &amp; Chemistry alum. I build
              real-time embedded systems, full-stack web apps, and ML pipelines.
            </p>
            <div className="flex gap-4 pt-4 items-center flex-wrap">
              <Link
                href="#experience"
                className={cn("uppercase", buttonVariants({ size: "lg" }))}
              >
                View Experience <ArrowRight className="size-4" />
              </Link>
              <div className="flex gap-2">
                <a
                  href="https://github.com/vincentdo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/vincent-do-uiuc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:vincentdo306@gmail.com"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div className="hidden md:block relative h-[500px] w-full border border-border/30 bg-card/10 backdrop-blur-sm p-8">
            <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-primary" />

            <div className="h-full w-full flex flex-col justify-between font-mono text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>SYS.STATUS: ONLINE</span>
                <span>ROLE: SWE @ BOEING</span>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>LANGUAGES</span>
                    <span>8</span>
                  </div>
                  <div className="h-1 w-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary w-[80%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>FRAMEWORKS</span>
                    <span>8+</span>
                  </div>
                  <div className="h-1 w-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary w-[70%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>YRS_EXPERIENCE</span>
                    <span>4+</span>
                  </div>
                  <div className="h-1 w-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary w-[40%]" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-right">
                  <span className="block text-4xl font-bold text-foreground">3.6</span>
                  <span>UIUC_GPA // CS + CHEMISTRY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <Container
        id="about"
        component="section"
        wrapperClassName="py-24 border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-4">
              ABOUT
              <br />
              ME_
            </h2>
            <div className="h-1 w-24 bg-primary mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I&apos;m a software engineer currently at Boeing in Berkeley, MO, where I
                work on C++ embedded systems delivering real-time data to flight
                display hardware. Before that, I interned at Expedia building
                mobile search features in Kotlin and GraphQL.
              </p>
              <p>
                I graduated from the University of Illinois Urbana-Champaign
                with a B.S. in Computer Science &amp; Chemistry (GPA 3.6). I&apos;m drawn to
                problems at the intersection of performance engineering and
                software correctness — whether that&apos;s real-time message routing,
                ML training pipelines, or distributed backend services.
              </p>
              <p>
                Outside of work, I enjoy{" "}
                <span className="text-foreground">chess</span>,{" "}
                <span className="text-foreground">building side projects</span>,
                and exploring topics in machine learning and systems programming.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Berkeley, MO
            </div>
          </div>

          <div>
            <h3 className="text-xl font-display tracking-tighter mb-6 uppercase">
              Interests
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {interests.map((item) => (
                <div
                  key={item.label}
                  className="p-4 border border-border bg-card hover:border-primary/50 transition-colors group"
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-mono text-sm font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-4">
              // update interests[] in app/page.tsx with your real hobbies
            </p>
          </div>
        </div>
      </Container>

      {/* ── Experience ───────────────────────────────────────────────────── */}
      <Container
        id="experience"
        component="section"
        wrapperClassName="py-24 bg-secondary/20 border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-4">
          EXPERIENCE_
        </h2>
        <div className="h-1 w-24 bg-primary mb-16" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className="md:pl-10 relative">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-0 top-2 size-2 rounded-full -translate-x-[calc(50%+0.5px)] hidden md:block",
                    exp.current ? "bg-primary ring-4 ring-primary/20" : "bg-border"
                  )}
                />
                <div className="grid md:grid-cols-[1fr_auto] gap-2 mb-3 items-start">
                  <div>
                    <h3 className="text-2xl font-display tracking-tighter">
                      {exp.role}
                    </h3>
                    <div className="text-primary font-mono text-sm mt-1">
                      {exp.company}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground font-mono">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </div>
                    {exp.current && (
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs bg-primary/10 text-primary border border-primary/20"
                      >
                        CURRENT
                      </Badge>
                    )}
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground text-sm leading-relaxed flex gap-3"
                    >
                      <span className="text-primary mt-1.5 shrink-0">▸</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-display tracking-tighter mb-6">
            EDUCATION_
          </h3>
          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
            <div>
              <div className="text-xl font-display">
                University of Illinois Urbana-Champaign
              </div>
              <div className="text-primary font-mono text-sm mt-1">
                B.S. Computer Science &amp; Chemistry
              </div>
              <div className="text-muted-foreground text-sm mt-2">
                Dual degree in CS and Chemistry with a focus on computational methods.
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="font-mono text-xs text-muted-foreground">
                Aug 2020 – May 2024
              </div>
              <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground font-mono">
                <MapPin className="h-3 w-3" />
                Champaign, IL
              </div>
              <div className="font-mono text-sm text-foreground font-bold">
                GPA: 3.6
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <Container
        id="skills"
        component="section"
        wrapperClassName="py-24 border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-4xl font-display tracking-tighter mb-6">
              TECH_STACK
            </h2>
            <p className="text-muted-foreground mb-8">
              From embedded C++ at Boeing to ML pipelines in PyTorch — the
              tools I reach for every day.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border bg-background flex flex-col items-center justify-center aspect-square hover:border-primary transition-colors">
                <Code2 className="h-8 w-8 mb-2 text-primary" />
                <span className="font-mono text-xs">SYSTEMS</span>
              </div>
              <div className="p-4 border border-border bg-background flex flex-col items-center justify-center aspect-square hover:border-primary transition-colors">
                <Terminal className="h-8 w-8 mb-2 text-primary" />
                <span className="font-mono text-xs">FULL_STACK</span>
              </div>
              <div className="p-4 border border-border bg-background flex flex-col items-center justify-center aspect-square hover:border-primary transition-colors">
                <Cpu className="h-8 w-8 mb-2 text-primary" />
                <span className="font-mono text-xs">ML / AI</span>
              </div>
              <div className="p-4 border border-border bg-background flex flex-col items-center justify-center aspect-square hover:border-primary transition-colors">
                <Database className="h-8 w-8 mb-2 text-primary" />
                <span className="font-mono text-xs">DATABASES</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 grid sm:grid-cols-3 gap-8">
            {skills.map((group) => (
              <div key={group.category} className="space-y-6">
                <h3 className="text-xl font-display border-b border-primary/30 pb-2 inline-block">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center justify-between group"
                    >
                      <span className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {skill}
                      </span>
                      <div className="h-[2px] w-8 bg-secondary group-hover:bg-primary transition-colors" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* ── Projects ─────────────────────────────────────────────────────── */}
      <Container
        id="projects"
        component="section"
        wrapperClassName="py-24 bg-secondary/20 border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <div className="grid justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-4">
              SELECTED
              <br />
              WORKS_
            </h2>
            <div className="h-1 w-24 bg-primary" />
          </div>
          <p className="text-muted-foreground max-w-sm">
            A selection of personal projects spanning ML, systems, and full-stack
            development.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] grid-rows-[repeat(3,auto)] gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="pt-0 group bg-card border-border hover:border-primary/50 transition-all duration-300 rounded-none overflow-hidden grid grid-rows-subgrid row-span-3 content-start items-start"
            >
              <ProjectImage src={project.image} alt={project.title} />
              <div className="grid gap-4">
                <CardHeader className="grid gap-4">
                  <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardContent>
              </div>
              <CardFooter className="flex justify-between pt-0">
                {project.link !== "#" ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-display flex items-center hover:text-primary transition-colors gap-2"
                  >
                    LIVE DEMO <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-sm font-display text-muted-foreground">
                    PRIVATE
                  </span>
                )}
                {project.repo !== "#" ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-display flex items-center hover:text-primary transition-colors gap-2"
                  >
                    CODE <Github className="size-3" />
                  </a>
                ) : (
                  <span className="text-sm font-display text-muted-foreground flex items-center gap-2">
                    CODE <Github className="size-3" />
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className={cn("uppercase", buttonVariants({ variant: "outline" }))}
          >
            View All Projects <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>

      {/* ── Blog / Writing (placeholder) ─────────────────────────────────── */}
      <Container
        id="blog"
        component="section"
        wrapperClassName="py-24 border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-4">
              WRITING_
            </h2>
            <div className="h-1 w-24 bg-primary mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              Occasionally I write about things I find interesting — embedded
              systems, ML experiments, and software engineering lessons learned.
              More posts coming soon.
            </p>
            <Link
              href="/blog"
              className={cn("uppercase", buttonVariants({ variant: "outline" }))}
            >
              Visit Blog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              "Coming soon: Lessons from real-time C++ at Boeing",
              "Coming soon: Training a chess engine on GM games",
              "Coming soon: Full-stack on Cloudflare Workers",
            ].map((title, i) => (
              <div key={i} className="p-4 border border-dashed border-border bg-card/30 opacity-60">
                <div className="font-mono text-xs text-muted-foreground mb-1">
                  DRAFT_{String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* ── Contact CTA ──────────────────────────────────────────────────── */}
      <Container
        id="contact"
        component="section"
        wrapperClassName="py-24 bg-card border-t border-border"
        className="mx-auto max-w-7xl"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-4">
            LET&apos;S TALK_
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed mb-10">
            Open to new opportunities, collaborations, and interesting
            conversations. Reach out via email or connect on LinkedIn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:vincentdo306@gmail.com"
              className={cn("uppercase", buttonVariants({ size: "lg" }))}
            >
              <Mail className="size-4" /> Send Email
            </a>
            <Link
              href="/contact"
              className={cn("uppercase", buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Contact Form <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="flex gap-6 justify-center mt-8">
            <a
              href="https://github.com/vincentdo1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" /> github.com/vincentdo1
            </a>
            <a
              href="https://linkedin.com/in/vincent-do-uiuc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </Container>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Container
        component="footer"
        wrapperClassName="py-8 border-t border-border bg-background"
        className="mx-auto max-w-7xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} VINCENT DO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-xs font-mono text-muted-foreground">
            <a
              href="https://github.com/vincentdo1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com/in/vincent-do-uiuc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LINKEDIN
            </a>
            <a
              href="mailto:vincentdo306@gmail.com"
              className="hover:text-primary transition-colors"
            >
              EMAIL
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
