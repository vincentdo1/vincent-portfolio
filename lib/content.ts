/**
 * Single source of truth for portfolio content.
 * Every metric here must be real and defensible, and should appear
 * in exactly one place on the page.
 */

export const site = {
  name: "Vincent Do",
  role: "Software Engineer",
  focusAreas: "Backend / ML / Product",
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

export const hero = {
  eyebrow: "Software Engineer · Backend / ML / Product",
  lead: "I build dependable systems for complex problems.",
  supporting:
    "Boeing software engineer and former Expedia SDE intern working across real-time systems, ML acceleration, and full-stack products.",
  // One memorable proof point; the rest live next to their stories.
  proof: "Shared Boeing systems I help ship are consumed by 60+ modules.",
  // Shown on mobile where the chess tree is hidden.
  hook: "Chess National Master — trained to search deep, then commit to the best line.",
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  scope: string;
  bullets: string[];
  highlight?: string;
  tech: string[];
};

export const experiences: Experience[] = [
  {
    company: "Boeing",
    role: "Software Engineer",
    period: "Aug 2024 — Present",
    location: "Berkeley, MO",
    current: true,
    scope: "Real-time systems and integration ownership for shared software.",
    bullets: [
      "Ship production C++ features delivering 6+ real-time navigation message streams to embedded display systems.",
      "Designed the message protocol and internal SDK for a shared real-time messaging framework.",
      "Own integration and release readiness, backed by automated tests and Dockerized builds.",
    ],
    highlight: "Secret security clearance",
    tech: ["C++", "Real-time", "Docker", "Jenkins"],
  },
  {
    company: "Expedia Group",
    role: "SDE Intern",
    period: "May 2023 — Aug 2023",
    location: "Chicago, IL",
    scope: "Cross-stack delivery for customer-facing mobile search.",
    bullets: [
      "Shipped search features across Kotlin microservices, GraphQL APIs, and localized frontend flows.",
    ],
    highlight: "Localized for 16 languages",
    tech: ["Kotlin", "GraphQL", "Microservices"],
  },
  {
    company: "UW–Madison",
    role: "Biomedical Researcher",
    period: "May 2021 — Aug 2021",
    location: "Madison, WI",
    scope:
      "Computational genomics and graph analysis for rare-disease research.",
    bullets: [
      "Analyzed 16,813 genes across 169 phenotypes with Python, R, and graph traversal to surface candidate genes.",
    ],
    tech: ["Python", "R", "Graph algorithms"],
  },
];

export type Project = {
  slug: string;
  title: string;
  code: string;
  classification: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  video?: { webm?: string; mp4: string };
  globe?: boolean;
  link?: string;
  repo?: string;
  stats: { label: string; value: string }[];
  upcoming?: boolean;
};

export const projects: Project[] = [
  {
    slug: "playable-chess-ai",
    title: "Playable Chess AI",
    code: "AI-001",
    classification: "ML // GAMES",
    description:
      "An imitation-learning chess engine you can play in the browser. I built the 7.2M-parameter ResNet+LSTM engine from scratch and a CUDA mixed-precision training pipeline that cut an epoch from 20+ hours to about 20 minutes.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Stockfish"],
    image: "/projects/chess-network-poster.png",
    imageAlt: "Neural network visualization of the chess move-prediction model",
    video: {
      webm: "/projects/chess-network.webm",
      mp4: "/projects/chess-network.mp4",
    },
    link: "https://vincentdo1.github.io/playable-chess-AI/",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
    stats: [
      { label: "Training positions", value: "3.8M" },
      { label: "Top-5 accuracy", value: "71.2%" },
    ],
  },
  {
    slug: "exploding-chickens",
    title: "Exploding Chickens",
    code: "GM-002",
    classification: "REAL-TIME // MULTIPLAYER",
    description:
      "A team-built real-time multiplayer card game — Exploding Kittens, reimagined with chickens. Asynchronous Node.js game logic keeps concurrent lobbies consistent, with session state persisted in MongoDB.",
    tags: ["Node.js", "MongoDB", "Socket.io"],
    image: "/projects/exploding-chickens.jpg",
    imageAlt:
      "In-game view of Exploding Chickens showing five players and the card table",
    link: "https://chickens.rakerman.com",
    repo: "https://github.com/jeffuntalan/exploding-chickens",
    stats: [{ label: "Games played", value: "2,100+" }],
  },
  {
    slug: "airport-paths",
    title: "Airport Paths",
    code: "GR-003",
    classification: "GRAPH // VISUALIZATION",
    description:
      "I implemented BFS, Floyd–Warshall, and betweenness centrality over the OpenFlights aviation graph, validated with C++ unit tests and rendered as an interactive WebGL globe. Drag to rotate; the busiest hubs are highlighted.",
    tags: ["C++", "React", "WebGL"],
    image: "/projects/airport-globe-fallback.jpg",
    imageAlt: "Globe visualization of global flight routes",
    globe: true,
    link: "https://vincentdo1.github.io/airports-paths/",
    repo: "https://github.com/vincentdo1/airports-paths",
    stats: [
      { label: "Airports mapped", value: "1,000+" },
      { label: "Hubs ranked", value: "Top 10" },
    ],
  },
  // Helium Hydride Visualizer — ready to publish, held back until Vincent
  // wants to showcase it. Media already lives in /public/projects (heh-*).
  // {
  //   slug: "helium-hydride-visualizer",
  //   title: "Helium Hydride Visualizer",
  //   code: "QM-005",
  //   classification: "CHEMISTRY // WEBGL",
  //   description:
  //     "An interactive 3D look at HeH⁺, the first molecule the universe ever made — my chemistry degree meeting WebGL. Ray-marched electron density, rendered from first-principles data. Full story soon.",
  //   tags: ["Next.js", "TypeScript", "WebGL", "Python"],
  //   image: "/projects/heh-poster.jpg",
  //   imageAlt:
  //     "Volumetric render of the HeH+ electron density as a glowing point cloud",
  //   video: {
  //     webm: "/projects/heh-molecule.webm",
  //     mp4: "/projects/heh-molecule.mp4",
  //   },
  //   link: "https://helium-hydride-visualizer.vercel.app",
  //   repo: "https://github.com/vincentdo1/helium-hydride-visualizer",
  //   stats: [],
  // },
  {
    slug: "volleyball-motion-tracker",
    title: "Volleyball Motion Tracker",
    code: "CV-004",
    classification: "COMPUTER VISION // SPORTS",
    description:
      "An in-progress computer-vision pipeline I'm building for volleyball footage: MediaPipe pose tracking fused with YOLOv8 ball detection extracts spike mechanics from real game video.",
    tags: ["Python", "MediaPipe", "YOLOv8", "OpenCV"],
    image: "/projects/volleyball-spike.jpg",
    imageAlt:
      "Volleyball spike analysis frame with player and ball tracking overlays",
    video: { mp4: "/projects/volleyball-tracker.mp4" },
    repo: "https://github.com/vincentdo1/volleyball-motion-tracker",
    upcoming: true,
    stats: [],
  },
];

export type Interest = {
  code: string;
  label: string;
  description: string;
  link?: string;
  linkLabel?: string;
};

export const interests: Interest[] = [
  {
    code: "01",
    label: "Chess",
    description: "National Master; Congress Recognition",
    link: site.chesscom,
    linkLabel: `chess.com/${site.chesscomHandle}`,
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

export const about = {
  paragraphs: [
    "I'm a software engineer building production software across backend systems, ML/AI pipelines, and full-stack products. At Boeing I work on real-time C++ features with release ownership for shared systems; before that I shipped customer-facing search features at Expedia.",
    "Competitive chess taught me disciplined search and decision-making under pressure; a chemistry degree taught me scientific rigor. Engineering is where I apply both — to APIs that scale, model pipelines that can be trusted, and interfaces that make complex systems feel clear.",
  ],
  education: {
    school: "University of Illinois Urbana-Champaign",
    degree: "B.S. Computer Science & Chemistry",
    years: "2020 — 2024",
  },
} as const;

export const contact = {
  availability: "Open to backend, AI/ML, and full-stack SWE roles.",
} as const;
