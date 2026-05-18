import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/nav";
import { Container } from "@/components/zippystarter/container";
import { ArrowLeft, PenLine } from "lucide-react";

// Add your blog posts here when you start writing
const posts: {
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  slug: string;
}[] = [];

// Placeholder drafts — replace with real posts when ready
const drafts = [
  {
    title: "Lessons from real-time C++ at Boeing",
    excerpt:
      "What I learned building embedded display systems: timing guarantees, cross-system debugging, and shipping to hardware.",
    tags: ["C++", "Embedded", "Systems"],
  },
  {
    title: "Training a chess engine on 4M grandmaster games",
    excerpt:
      "Deep dive into the CNN+LSTM architecture, GPU training pipeline, and why centipawn loss matters for move quality.",
    tags: ["Python", "PyTorch", "ML", "Chess"],
  },
  {
    title: "Full-stack on Cloudflare Workers: Hono.js + Next.js + Neon",
    excerpt:
      "Building We-Up from scratch — edge-deployed REST API, Postgres at the edge, and Cloudflare Images.",
    tags: ["TypeScript", "Cloudflare", "PostgreSQL"],
  },
  {
    title: "GraphQL at Expedia: microservices and mobile flows",
    excerpt:
      "How Expedia's backend schema changes power new mobile booking features across 16 languages.",
    tags: ["GraphQL", "Kotlin", "Mobile"],
  },
];

export default function BlogPage() {
  const hasPosts = posts.length > 0;

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
          WRITING_
        </h1>
        <div className="h-1 w-24 bg-primary mb-4" />
        <p className="text-muted-foreground max-w-lg mb-16">
          Notes on systems programming, machine learning, and software
          engineering. First post coming soon.
        </p>

        {hasPosts ? (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] items-baseline justify-between mb-2">
                  <h2 className="text-2xl font-display group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {post.date} // {post.readTime}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3 max-w-2xl">
                  {post.excerpt}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="h-[1px] w-full bg-border group-hover:bg-primary/50 transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mb-16">
            <div className="border border-dashed border-border p-12 text-center max-w-lg mx-auto">
              <PenLine className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <div className="font-mono text-sm text-muted-foreground">
                // NO_POSTS_YET
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Add posts to <code className="font-mono text-xs bg-secondary px-1 py-0.5">app/blog/page.tsx</code> when you&apos;re ready to start writing.
              </p>
            </div>
          </div>
        )}

        {/* Draft previews */}
        <div className="border-t border-dashed border-border pt-10">
          <div className="font-mono text-xs text-muted-foreground mb-6">
            // DRAFTS — ideas for future posts
          </div>
          <div className="grid gap-6">
            {drafts.map((draft, i) => (
              <div
                key={i}
                className="grid gap-3 p-5 border border-dashed border-border bg-card/30 opacity-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      DRAFT_{String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-lg font-display">{draft.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {draft.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {draft.tags.map((tag) => (
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
