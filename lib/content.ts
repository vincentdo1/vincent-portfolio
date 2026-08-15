/**
 * Single source of truth for portfolio content.
 * Every metric here must be real and defensible, and should appear
 * in exactly one place on the page.
 *
 * Figures were verified against resume 12.0 (2026-08). If the résumé
 * changes, update here first — the scroll sequence and the dossier lean on
 * these few numbers heavily.
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

/** Destinations shared by the scroll stages and the dossier. */
const urls = {
  airportDemo: "https://vincentdo1.github.io/airports-paths/",
  airportRepo: "https://github.com/vincentdo1/airports-paths",
  chessDemo: "https://vincentdo1.github.io/playable-chess-AI/",
  chessRepo: "https://github.com/vincentdo1/playable-chess-AI",
  chickensDemo: "https://chickens.rakerman.com",
} as const;

/**
 * The scroll sequence — which is now most of the site.
 *
 * Opens on the arrival cloud, then the roles run reverse-chronologically,
 * closing on the two flagship projects — which carry their own live/source
 * links, since there is no separate projects section.
 */
export type Stage = {
  tag: string;
  title: string;
  body: string;
  /** Quiet personal line, rendered only on the opening stage. */
  hook?: string;
  readout: { label: string; value: string }[];
  links?: { label: string; href: string }[];
};

export const stages: Stage[] = [
  {
    tag: "SYS // 00 — INIT",
    title: "Vincent Do",
    body: "Backend and infrastructure engineer. Production real-time C++ on Linux at Boeing, with the ML systems work to go with it.",
    hook: "Chess National Master — trained to search deep, then commit to the best line.",
    readout: [
      { label: "Base", value: "St. Louis, MO" },
      { label: "Clearance", value: "Secret" },
      { label: "Relocation", value: "Open" },
    ],
  },
  {
    tag: "SYS // 01 — BOEING",
    title: "Real-time delivery",
    body: "Production C++ pushing real-time navigation message streams into embedded display systems. Designed the message protocol and internal SDK, now adopted by 10+ engineers.",
    readout: [
      { label: "Modules", value: "60+" },
      { label: "Streams", value: "6+" },
      { label: "Throughput", value: "1.5×" },
    ],
  },
  {
    tag: "SYS // 02 — EXPEDIA",
    title: "Backend at product scale",
    body: "GraphQL schema changes shipped to production across Kotlin microservices, unblocking new mobile booking flows. Localized search validated with frontend teams before release.",
    readout: [
      { label: "Services", value: "5+" },
      { label: "Locales", value: "16" },
      { label: "Surface", value: "iOS · Android" },
    ],
  },
  {
    tag: "SYS // 03 — RESEARCH",
    title: "Where it started",
    body: "Biomedical research at UW–Madison — recursive traversal over the phenotype hierarchy to isolate Zellweger candidate genes — before a CS and Chemistry degree at Illinois.",
    readout: [
      { label: "Genes", value: "16,813" },
      { label: "Phenotypes", value: "169" },
      { label: "Candidates", value: "25" },
    ],
  },
  {
    tag: "SYS // 04 — CHESS ENGINE",
    title: "Trained architectures",
    body: "A ResNet–LSTM that plays chess in the browser, served with alpha-beta search behind a hardened Flask API. Its CUDA mixed-precision pipeline processed roughly 393M positions.",
    readout: [
      { label: "Params", value: "15.1M" },
      { label: "Speedup", value: "60×" },
      { label: "Stack", value: "PyTorch · CUDA" },
    ],
    links: [
      { label: "Play it", href: urls.chessDemo },
      { label: "Source", href: urls.chessRepo },
    ],
  },
  {
    tag: "SYS // 05 — ROUTING SERVICE",
    title: "Built to hold up",
    body: "A C++20 HTTP/JSON routing service over raw TCP sockets: BFS and Dijkstra search with precomputed centrality, behind a fixed worker pool and a bounded request queue.",
    readout: [
      { label: "Throughput", value: "1,650+ rps" },
      { label: "p99", value: "<120 ms" },
      { label: "Graph", value: "16,379 routes" },
    ],
    links: [
      { label: "Live demo", href: urls.airportDemo },
      { label: "Source", href: urls.airportRepo },
    ],
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  note: string;
};

/**
 * Deliberately one line each: the scroll sequence already told these stories
 * in full, so the dossier only has to make them scannable and dateable.
 */
export const experiences: Experience[] = [
  {
    company: "Boeing",
    role: "Software Engineer",
    period: "Aug 2024 — Present",
    location: "Berkeley, MO",
    current: true,
    note: "Real-time C++ for embedded flight displays. Owns the message protocol, internal SDK, and release readiness for a shared framework 60+ modules depend on. Secret clearance.",
  },
  {
    company: "Expedia Group",
    role: "SDE Intern",
    period: "May — Aug 2023",
    location: "Chicago, IL",
    note: "GraphQL schema changes across Kotlin microservices, VIP Access badges, and localized search across 16 languages.",
  },
  {
    company: "UW–Madison",
    role: "Biomedical Researcher",
    period: "May — Aug 2021",
    location: "Madison, WI",
    note: "Analyzed 16,813 genes across 169 phenotypes in Python and R to surface 25 high-priority candidates.",
  },
];

/**
 * What Vincent is as an engineer, and what he likes doing — the part the 3D
 * sequence can't say. Each card names the few tools that matter to its theme;
 * `techStack` below is the complete reference list.
 *
 * Deliberately qualitative: the hard numbers live in `stages`, once each.
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
    body: "Message streams that have to land on time, on hardware that doesn't get a second try. I like designing the protocol and the SDK around it, so the next team never has to rebuild the plumbing.",
    tools: ["C++20", "TCP/UDP", "Linux", "Docker"],
  },
  {
    code: "02",
    title: "Services under load",
    body: "Worker pools, bounded queues, backpressure — the unglamorous parts that decide whether a service degrades gracefully or falls over at 3am.",
    tools: ["REST", "GraphQL", "Kotlin", "Node.js", "PostgreSQL"],
  },
  {
    code: "03",
    title: "ML systems",
    body: "Training pipelines and served inference rather than notebooks: mixed precision, streaming datasets, and endpoints with real health checks in front of them.",
    tools: ["PyTorch", "CUDA", "Flask", "Hugging Face"],
  },
  {
    code: "04",
    title: "Proving it works",
    body: "A chemistry degree taught me to measure before I claim anything, and I never stopped. Test environments, sanitizers, and CI that runs whether or not anyone is watching.",
    tools: ["CMake/CTest", "ASan/UBSan", "GitHub Actions", "Jenkins"],
  },
];

/**
 * The full tooling list, mirroring the Technical Skills block on resume 12.0.
 *
 * The capability cards name a few tools in context; this is the complete,
 * scannable reference — the thing a recruiter filtering for infrastructure
 * work is actually looking for.
 */
export const techStack = [
  {
    label: "Languages",
    items: [
      "C++20",
      "Python",
      "Java",
      "Kotlin",
      "C#",
      "SQL",
      "R",
      "TypeScript",
      "JavaScript",
    ],
  },
  {
    label: "Backend & data",
    items: [
      "REST APIs",
      "GraphQL",
      "HTTP/1.1",
      "TCP/UDP sockets",
      "Multithreading",
      "Thread pools",
      "Backpressure",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Protocol design",
    ],
  },
  {
    label: "Infrastructure",
    items: [
      "Docker",
      "Linux",
      "CI/CD",
      "Jenkins",
      "GitHub Actions",
      "CMake/CTest",
      "GCP",
      "Fly.io",
      "Cloudflare",
      "Git",
    ],
  },
  {
    label: "Testing & ML",
    items: [
      "Unit / integration",
      "API & load testing",
      "Catch2",
      "ASan/UBSan",
      "Health & readiness checks",
      "PyTorch",
      "CUDA",
    ],
  },
] as const;

export const profile = {
  lead: "I work on the parts of a system that aren't allowed to be wrong — and I like that constraint. Most of what I build is backend, real-time, or the infrastructure that keeps both honest.",
  offClock:
    "Off the clock: National Master chess, cooking, volleyball, and Pokémon.",
  alsoBuilt:
    "Also built Exploding Chickens with a team — a real-time multiplayer card game on async Node.js and MongoDB, 1,600+ games played.",
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
  availability: "Open to backend, infrastructure, and ML systems roles.",
} as const;
