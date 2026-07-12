"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ExternalLink, Github, Clock, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/valorant/section-header";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { AirportGlobe } from "@/components/globe/airport-globe-dynamic";
import { projects } from "@/lib/content";

let globePreloaded = false;
function onGlobeButtonHover() {
  if (globePreloaded || getStaticMediaSnapshot()) return;
  globePreloaded = true;
  import("@/components/globe/airport-globe").catch(() => {});
  import("globe.gl").catch(() => {});
}

// Reduced motion or Save-Data: posters instead of autoplaying media.
// SSR snapshot defaults to static so server HTML never embeds heavy media.
function subscribeStaticMedia(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getStaticMediaSnapshot() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true
  );
}

export function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const staticMedia = useSyncExternalStore(
    subscribeStaticMedia,
    getStaticMediaSnapshot,
    () => true,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = projects[selected];

  // Only attach video/WebGL once the section approaches the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Edge-adjacent boxes report isIntersecting with ratio 0 — when the
        // section starts exactly at the hero fold, that would load media on
        // initial navigation. Require real visibility.
        if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.02) {
          setMediaEnabled(true);
          io.disconnect();
        }
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showVideo =
    mediaEnabled && !staticMedia && current.video && !current.globe;
  const showGlobe = mediaEnabled && current.globe && !staticMedia;

  // Pause the video offscreen or in a hidden tab; respect an explicit pause.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = true;
    const sync = () => {
      if (inView && !videoPaused && document.visibilityState === "visible") {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.1 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [videoPaused, showVideo, current.slug]);

  const selectProject = (i: number) => {
    setSelected(i);
    setVideoPaused(false);
  };

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    // The tablist is horizontal below lg; vertical arrows there must keep
    // scrolling the page.
    const vertical = window.matchMedia("(min-width: 1024px)").matches;
    let next: number | null = null;
    if (e.key === "ArrowRight" || (vertical && e.key === "ArrowDown"))
      next = (selected + 1) % projects.length;
    if (e.key === "ArrowLeft" || (vertical && e.key === "ArrowUp"))
      next = (selected - 1 + projects.length) % projects.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = projects.length - 1;
    if (next === null) return;
    e.preventDefault();
    selectProject(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative content-auto py-16 sm:py-24 lg:py-32 border-t border-border/60 px-safe"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="01"
          label="Projects"
          title={
            <>
              Selected
              <br />
              <span className="text-primary">Works_</span>
            </>
          }
          description="Focused projects across ML, real-time systems, and data visualization."
        />

        <div
          className="grid gap-4 lg:grid-cols-[1fr_300px] lg:gap-6 mt-12"
          data-reveal
        >
          {/* Selector rail: horizontal scroll on mobile, vertical on desktop */}
          <div
            role="tablist"
            aria-label="Projects"
            className="order-first lg:order-last flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0"
          >
            {projects.map((p, i) => {
              const isActive = i === selected;
              return (
                <button
                  key={p.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`project-tab-${p.slug}`}
                  aria-selected={isActive}
                  aria-controls="project-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectProject(i)}
                  onKeyDown={onTabKeyDown}
                  onMouseEnter={p.globe ? onGlobeButtonHover : undefined}
                  onFocus={p.globe ? onGlobeButtonHover : undefined}
                  className={cn(
                    "shrink-0 min-w-[220px] lg:min-w-0 lg:w-full text-left p-4 border transition-colors duration-200 tactical-chip",
                    isActive
                      ? "bg-primary/10 border-primary"
                      : p.upcoming
                        ? "bg-card/20 border-dashed border-border/60 hover:border-primary/40"
                        : "bg-card/40 border-border/60 hover:border-primary/40 hover:bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "font-mono text-xs tracking-widest mb-1",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {p.code}
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
                  <div className="text-xs font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
                    {p.classification}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <div
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${current.slug}`}
            tabIndex={0}
            className="relative border border-border/60 bg-card/30 overflow-hidden"
          >
            <CornerBrackets size={14} thickness={1.5} />

            <div key={current.slug} className="grid panel-fade">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60 bg-secondary">
                {showGlobe ? (
                  <AirportGlobe />
                ) : showVideo && current.video ? (
                  <video
                    ref={videoRef}
                    poster={current.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    {current.video.webm && (
                      <source src={current.video.webm} type="video/webm" />
                    )}
                    <source src={current.video.mp4} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 860px, (min-width: 1024px) calc(100vw - 380px), calc(100vw - 2rem)"
                    quality={75}
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/85 via-background/10 to-background/70" />

                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-start gap-2">
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <div className="flex items-center gap-2 min-w-0 max-w-full font-mono text-xs uppercase tracking-[0.25em] text-primary">
                      <span className="tactical-dot shrink-0" />
                      <span className="truncate">{current.classification}</span>
                    </div>
                    {current.upcoming && (
                      <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/10 border border-primary/40 text-primary">
                        <Clock className="h-3 w-3" />
                        In development
                      </div>
                    )}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground shrink-0">
                    {current.code}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase leading-[0.95] text-foreground break-words">
                    {current.title}
                  </h3>
                </div>

                {showVideo && (
                  <button
                    type="button"
                    onClick={() => setVideoPaused((p) => !p)}
                    aria-label={
                      videoPaused ? "Play project video" : "Pause project video"
                    }
                    className="absolute top-14 right-3 sm:top-16 sm:right-4 z-10 flex h-11 w-11 items-center justify-center border border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {videoPaused ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-6 lg:p-8 grid gap-5 sm:gap-6">
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {current.description}
                </p>

                {current.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 border-y border-border/60 py-4">
                    {current.stats.map((stat) => (
                      <div key={stat.label} className="min-w-0">
                        <div className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                          {stat.label}
                        </div>
                        <div className="font-display text-base sm:text-xl md:text-2xl text-primary leading-none">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-2">
                    {current.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 bg-secondary/60 border border-border tactical-chip text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {current.repo && (
                      <a
                        href={current.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-11 px-4 tactical-chip border border-border hover:border-primary hover:text-primary text-muted-foreground font-mono text-xs uppercase tracking-[0.2em] transition-colors"
                      >
                        <Github className="h-3 w-3" />
                        Source
                        <span className="sr-only">
                          for {current.title} (opens in new tab)
                        </span>
                      </a>
                    )}
                    {current.link && (
                      <a
                        href={current.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-11 px-4 tactical-chip bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                      >
                        Live project <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">
                          {current.title} (opens in new tab)
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
