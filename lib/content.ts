import type { ShapeKey } from "@/lib/three/shapes";

/**
 * Single source of truth for portfolio content.
 * Every metric here must be real and defensible, and should appear
 * in exactly one place on the page.
 *
 * Figures were verified against resume 12.0 (2026-08). If the résumé
 * changes, update here first — the intro, the project cards, and the role
 * cards all lean on these few numbers.
 *
 * Voice: first person, plain, specific. No em-dash appositives, no closing
 * aphorisms, no rule-of-three lists. If a sentence could sit on any engineer's
 * site, it does not belong on this one.
 */

export const site = {
  name: "Vincent Do",
  role: "Software Engineer",
  focusAreas: "Backend / Infrastructure / ML",
  location: "St. Louis, MO",
  email: "vincentdo306@gmail.com",
  github: "https://github.com/vincentdo1",
  githubHandle: "vincentdo1",
  linkedin: "https://linkedin.com/in/vincent-do-uiuc",
  linkedinHandle: "vincent-do-uiuc",
  chesscom: "https://www.chess.com/member/vmd306",
  chesscomHandle: "vmd306",
  resume: "/resume.pdf",
} as const;

/** Outbound project destinations. */
const urls = {
  airportDemo: "https://vincentdo1.github.io/airports-paths/",
  airportRepo: "https://github.com/vincentdo1/airports-paths",
  chessDemo: "https://vincentdo1.github.io/playable-chess-AI/",
  chessRepo: "https://github.com/vincentdo1/playable-chess-AI",
  chickensDemo: "https://chickens.rakerman.com",
} as const;

/** A three-value instrument readout, rendered as a <dl> grid. */
export type Readout = { label: string; value: string };

/**
 * The opening screen. One stable <h1> for the whole page.
 *
 * This used to be stage 00 of a six-stage sticky sequence that consumed ~630vh
 * before any normal-flow content. The sequence is gone: everything below is
 * ordinary anchored sections, and this is the single animated screen that
 * survives from it.
 */
export const intro = {
  title: "Vincent Do",
  body: "I write backend and infrastructure code. Right now that means real-time C++ on Linux at Boeing; before that, Kotlin services at Expedia and ML training pipelines at school.",
  hook: "National Master at chess. That's four hours a game of not playing the first move that looks right.",
  readout: [
    { label: "Base", value: "St. Louis, MO" },
    { label: "Clearance", value: "Secret" },
    { label: "Relocation", value: "Open" },
  ] as Readout[],
} as const;

/**
 * Flagship projects, first thing after the intro.
 *
 * These carry their own destinations and `id` anchors so a recruiter can be
 * linked straight to one. They live above `experiences` deliberately: the
 * projects are the part interviewers actually bring up.
 *
 * `shape` names the point-field shape this section morphs to when it scrolls
 * into view. It is presentation only, and nothing here depends on WebGL
 * existing — see `lib/three/shapes.ts`.
 */
export type Project = {
  id: string;
  name: string;
  kicker: string;
  body: string;
  readout: Readout[];
  links: { label: string; href: string }[];
  shape: ShapeKey;
};

export const projects: Project[] = [
  {
    id: "chess-engine",
    name: "Neural network",
    kicker: "Playable chess AI",
    body: "A ResNet–LSTM that plays chess in the browser, served with alpha-beta search behind a hardened Flask API. Its CUDA mixed-precision pipeline processed roughly 393M positions.",
    readout: [
      { label: "Params", value: "15.1M" },
      { label: "Speedup", value: "60×" },
      { label: "Stack", value: "PyTorch · CUDA" },
    ],
    links: [
      { label: "Live demo", href: urls.chessDemo },
      { label: "Source", href: urls.chessRepo },
    ],
    shape: "brain",
  },
  {
    id: "airport-routing",
    name: "Airports routing",
    kicker: "C++20 routing service",
    body: "A C++20 HTTP/JSON routing service over raw TCP sockets. BFS and Dijkstra search with precomputed centrality with a fixed worker pool and a bounded request queue.",
    readout: [
      { label: "Throughput", value: "1,650+ rps" },
      { label: "p99", value: "<120 ms" },
      { label: "Graph", value: "16,379 routes" },
    ],
    links: [
      { label: "Live demo", href: urls.airportDemo },
      { label: "Source", href: urls.airportRepo },
    ],
    shape: "globe",
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  /** Headline for the role, previously the sticky stage title. */
  title: string;
  body: string;
  /** Second line, where it carries facts `body` does not. */
  note?: string;
  readout: Readout[];
  shape: ShapeKey;
};

/**
 * Reverse-chronological roles, in normal flow.
 *
 * `body` and `readout` came from the old sticky stages; `note` is the
 * one-liner the dossier used to carry separately. Keeping both was the fix for
 * a real duplication problem: the stage and the dossier row used to say the
 * same thing twice. Now each role appears once, and `note` is only present
 * where it adds facts the body does not (SDK ownership, VIP Access badges).
 */
export const experiences: Experience[] = [
  {
    company: "Boeing",
    role: "Software Engineer",
    period: "Aug 2024 — Present",
    location: "Berkeley, MO",
    current: true,
    title: "Real-time delivery",
    body: "Production C++ that moves real-time navigation streams into embedded flight displays. I test the throughput and latency of radars and sensors. I research ways to modernize our system.",
    note: "I own the message protocol, the internal SDK, and release readiness for a shared framework that 60+ modules depend on.",
    readout: [
      { label: "Modules", value: "60+" },
      { label: "Streams", value: "6+" },
      { label: "Throughput", value: "1.5×" },
    ],
    shape: "rocket",
  },
  {
    company: "Expedia Group",
    role: "SDE Intern",
    period: "May — Aug 2023",
    location: "Chicago, IL",
    title: "Backend at product scale",
    body: "GraphQL schema changes shipped to production across Kotlin microservices, unblocking new mobile booking flows. Localized search validated with frontend teams before release.",
    note: "Also shipped VIP Access badges.",
    readout: [
      { label: "Services", value: "5+" },
      { label: "Locales", value: "16" },
      { label: "Surface", value: "iOS · Android" },
    ],
    shape: "handset",
  },
  {
    company: "UW–Madison",
    role: "Biomedical Researcher",
    period: "May — Aug 2021",
    location: "Madison, WI",
    title: "Solving medicine through code",
    body: "Biomedical research at UW–Madison. Extracted 2,893 papers out of AMELIE, Stanford's biomedical literature engine, before AI. Recursive traversal over the phenotype hierarchy to isolate Zellweger candidate genes.",
    readout: [
      { label: "Genes", value: "16,813" },
      { label: "Phenotypes", value: "169" },
      { label: "Candidates", value: "25" },
    ],
    shape: "dna",
  },
];

/**
 * What I am as an engineer, and what I like doing. Each card names the few
 * tools that matter to its theme; `techStack` below is the curated list.
 *
 * Deliberately qualitative: the hard numbers live on the project and role
 * cards, once each.
 */
export type Capability = {
  code: string;
  title: string;
  body: string;
  tools: string[];
};

export const capabilities: Capability[] = [
  {
    code: "01",
    title: "Real-time systems",
    body: "Embedded and real-time work, where a late message counts as a wrong one. I spend most of my time a layer below the feature: the wire format, the SDK, the parts other teams shouldn't have to think about.",
    tools: ["C++20", "TCP/UDP", "Linux", "Docker"],
  },
  {
    code: "02",
    title: "Services under load",
    body: "Worker pools, bounded queues, backpressure. The failure behavior interests me more than the happy path, so I tend to start by asking what happens when the queue fills up.",
    tools: ["REST", "GraphQL", "Kotlin", "Node.js", "PostgreSQL"],
  },
  {
    code: "03",
    title: "ML systems",
    body: "The pipeline and the serving side more than the modeling. Streaming datasets, mixed precision, checkpoints that survive a crash, and an endpoint that answers /health honestly.",
    tools: ["PyTorch", "CUDA", "Flask", "Hugging Face"],
  },
  {
    code: "04",
    title: "Proving it works",
    body: "Chemistry taught me to measure before claiming anything and I never really stopped. Sanitizers, test rigs, load tests, and CI that runs whether or not anyone is watching.",
    tools: ["CMake/CTest", "ASan/UBSan", "GitHub Actions", "Jenkins"],
  },
];

/**
 * A curated stack, not an inventory.
 *
 * This was 37 chips across four columns, which reads as keyword stuffing and
 * flattens everything to equal weight. It is now the ~18 that are load-bearing
 * for backend / infrastructure / ML roles; the résumé stays the exhaustive
 * list, and the capability cards and projects show these tools in context.
 *
 * Dropped from the rendered set (still on the résumé): Java, C#, JavaScript,
 * HTTP/1.1, Thread pools, Backpressure, MongoDB, Protocol design, Jenkins,
 * CMake/CTest, GCP, Fly.io, Git, Catch2, unit/integration testing, API & load
 * testing, health & readiness checks.
 */
export const techStack = [
  {
    label: "Languages",
    items: ["C++20", "Python", "Kotlin", "TypeScript", "SQL"],
  },
  {
    label: "Backend",
    items: [
      "REST APIs",
      "GraphQL",
      "TCP/UDP sockets",
      "Multithreading",
      "Node.js",
      "PostgreSQL",
    ],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Linux", "CI/CD", "GitHub Actions", "Cloudflare"],
  },
  {
    label: "ML & testing",
    items: ["PyTorch", "CUDA", "ASan/UBSan"],
  },
] as const;

export const profile = {
  lead: "I work on the parts of a system that aren't allowed to be wrong, where every detail matters. Most of what I build is backend, real-time, or the infrastructure that keeps both honest.",
  offClock:
    "Away from work: chess, cooking, volleyball, and a questionable amount of time on Pokémon.",
  alsoBuilt:
    "Built Exploding Chickens with a few friends, a real-time multiplayer card game on async Node.js and MongoDB. People have played 1,600+ games of it, which still surprises me.",
  alsoBuiltHref: urls.chickensDemo,
} as const;

export const education = {
  school: "University of Illinois Urbana-Champaign",
  short: "UIUC",
  degree: "B.S. Computer Science & Chemistry",
  years: "2020 — 2024",
} as const;

// Helium Hydride Visualizer — built and verified, held back until Vincent
// wants to showcase it. Media still lives in /public/projects (heh-*).
// Reviving it means either a stage in `stages` (a molecule shape) or a line
// alongside `profile.alsoBuilt`:
//   https://helium-hydride-visualizer.vercel.app
//   https://github.com/vincentdo1/helium-hydride-visualizer

export const contact = {
  availability: "I'm looking for backend, infrastructure, or ML systems work.",
} as const;
