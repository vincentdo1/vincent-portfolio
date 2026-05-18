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
import { Container } from "@/components/zippystarter/container";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";

const projects = [
  {
    title: "Playable Chess AI",
    description:
      "Trained a CNN+LSTM legal move-policy model on 4.18M GM/Magnus Carlsen positions, achieving 71.2% top-5 accuracy on a 390K-position held-out test set. Engineered a GPU-accelerated PyTorch training pipeline with mixed precision and a custom IterableDataset, reducing per-epoch training time from 20+ hours on CPU to 15–25 minutes on GPU. Built a PGN preprocessing pipeline for zipped datasets with deduplication, centipawn-loss metadata, legal-move mask generation, and compressed chunk output.",
    tags: ["Python", "PyTorch", "CUDA", "Flask", "Pygame", "Stockfish"],
    image: "/project-placeholder-1.jpg",
    link: "https://github.com/vincentdo1/playable-chess-AI",
    repo: "https://github.com/vincentdo1/playable-chess-AI",
    status: "complete",
  },
  {
    title: "We-Up",
    description:
      "Social accountability app where groups post daily photo check-ins to shared prompts. Built a Hono.js REST API on Cloudflare Workers with PostgreSQL/Neon persistence, supporting users, groups, prompts, and photo submissions. Integrated Cloudflare Images for authenticated photo upload, storage, and retrieval.",
    tags: ["TypeScript", "Hono.js", "Next.js", "PostgreSQL", "Neon", "Auth0", "Cloudflare"],
    image: "/project-placeholder-2.jpg",
    link: "#",
    repo: "#",
    status: "complete",
  },
  {
    title: "Airport Path Finder",
    description:
      "Graph algorithms applied to global aviation networks. Implemented BFS, Floyd–Warshall, and betweenness centrality to analyze connectivity and routing patterns, with a WebGL-based globe rendering the top 10 most-connected airports.",
    tags: ["C++", "React", "WebGL"],
    image: "/project-placeholder-3.jpg",
    link: "https://github.com/vincentdo1/airports-global",
    repo: "https://github.com/vincentdo1/airports-global",
    status: "complete",
  },
];

// Add future projects here
const comingSoon = [
  {
    title: "Project Slot 4",
    description: "Add your next project here.",
    tags: ["Coming Soon"],
  },
  {
    title: "Project Slot 5",
    description: "Add your next project here.",
    tags: ["Coming Soon"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />

      <Container
        wrapperClassName="pt-32 pb-24"
        className="mx-auto max-w-7xl"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "font-mono text-xs mb-10 -ml-2 inline-flex gap-2"
          )}
        >
          <ArrowLeft className="h-3 w-3" /> BACK
        </Link>

        <h1 className="text-5xl md:text-7xl font-display tracking-tighter mb-4 leading-none">
          ALL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground">
            PROJECTS_
          </span>
        </h1>
        <div className="h-1 w-24 bg-primary mb-4" />
        <p className="text-muted-foreground max-w-lg mb-16">
          Personal projects spanning machine learning, systems programming, and
          full-stack web development.
        </p>

        {/* Live projects */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] grid-rows-[repeat(3,auto)] gap-6 mb-12">
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

        {/* Coming soon placeholders */}
        <div className="border-t border-dashed border-border pt-10">
          <div className="font-mono text-xs text-muted-foreground mb-6">
            // COMING_SOON — add new projects to app/projects/page.tsx
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6">
            {comingSoon.map((project, i) => (
              <div
                key={i}
                className="border border-dashed border-border bg-card/30 p-6 opacity-50"
              >
                <div className="font-mono text-xs text-muted-foreground mb-3">
                  SLOT_{String(i + 4).padStart(2, "0")}
                </div>
                <div className="text-xl font-display mb-2">{project.title}</div>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container
        component="footer"
        wrapperClassName="py-8 border-t border-border bg-background"
        className="mx-auto max-w-7xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} VINCENT DO. ALL RIGHTS RESERVED.
          </div>
          <Link
            href="/"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </Container>
    </div>
  );
}
