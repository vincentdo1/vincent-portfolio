import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Atom,
  ExternalLink,
  Orbit,
  RotateCcw,
  Telescope,
  Waves,
} from "lucide-react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { HehPreview } from "@/components/chemistry/heh-preview-dynamic";
import {
  BOND_LENGTH_ANGSTROM,
  DIPOLE_MOMENT_DEBYE,
  DISSOCIATION_ENERGY_EV,
  FULL_VIZ_URL,
  HARMONIC_FREQUENCY_CM,
  ISOTOPOLOGUES,
  NGC_7027_DETECTION_YEAR,
  TOTAL_ELECTRONS,
} from "@/components/chemistry/heh-constants";

export const metadata: Metadata = {
  title: "Helium Hydride (HeH⁺) // Vincent Do",
  description:
    "An interactive 3D visualization of helium hydride, the first molecule formed in the universe — built on pre-computed quantum-chemistry data.",
};

const stats: { label: string; value: string; note?: string }[] = [
  { label: "Bond length rₑ", value: `${BOND_LENGTH_ANGSTROM.toFixed(3)} Å` },
  {
    label: "Dipole μₑ",
    value: `${DIPOLE_MOMENT_DEBYE.toFixed(2)} D`,
    note: "c.o.m.",
  },
  { label: "Harmonic ωₑ", value: `${Math.round(HARMONIC_FREQUENCY_CM)} cm⁻¹` },
  { label: "Well depth Dₑ", value: `${DISSOCIATION_ENERGY_EV.toFixed(2)} eV` },
  { label: "Electrons", value: `${TOTAL_ELECTRONS}` },
  { label: "Detected", value: `${NGC_7027_DETECTION_YEAR}`, note: "NGC 7027" },
];

const phenomena: {
  icon: typeof Atom;
  tag: string;
  title: string;
  body: string;
  hash: string;
}[] = [
  {
    icon: Atom,
    tag: "Density",
    title: "Electron-density skew",
    body: "Both electrons pile onto helium even though the proton end carries the formal charge, leaving He as the electron-rich δ− end. The headline counterintuition.",
    hash: "density",
  },
  {
    icon: Waves,
    tag: "Vibration",
    title: "Vibrational & isotope effects",
    body: "Swap HeH⁺ → HeD⁺ → HeT⁺ → ³HeH⁺ and watch the zero-point energy drop and the ground-state wavefunction localise as the reduced mass grows.",
    hash: "vibrational",
  },
  {
    icon: Orbit,
    tag: "Dissociation",
    title: "Charge migration",
    body: "Stretch the bond across the avoided crossing on the excited surface and see the density redistribute between the He+H⁺ and He⁺+H asymptotes.",
    hash: "dissociation",
  },
  {
    icon: Telescope,
    tag: "Cosmos",
    title: "First molecule in the universe",
    body: "Helium recombines before hydrogen, so He + H⁺ → HeH⁺ + γ in the recombination epoch — finally detected in space in NGC 7027 in 2019.",
    hash: "cosmos",
  },
];

const literature: { quantity: string; value: string; source: string }[] = [
  { quantity: "Bond length rₑ", value: "0.7743 Å", source: "Pachucki 2012" },
  { quantity: "Well depth Dₑ", value: "≈2.04 eV", source: "Stanke 2006" },
  { quantity: "Dipole μₑ (c.o.m.)", value: "≈1.66 D", source: "Engel 2005" },
  {
    quantity: "Harmonic ωₑ",
    value: "3228.3 cm⁻¹",
    source: "Bishop & Cheung 1979",
  },
];

const vizEnabled = FULL_VIZ_URL.length > 0;
const vizHref = (hash: string) =>
  vizEnabled ? `${FULL_VIZ_URL}#${hash}` : undefined;

export default function HeliumHydridePage() {
  return (
    <main className="relative min-h-dvh bg-background px-safe py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* ── Back link ─────────────────────────────────────────────── */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to projects
        </Link>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
          <span className="tactical-dot animate-pulse-dot" />
          CHM-005 // Chemistry // 3D
        </div>
        <h1 className="mt-3 font-display text-6xl md:text-8xl uppercase leading-none">
          Helium Hydride
          <span className="text-primary"> HeH⁺</span>
        </h1>

        {/* ── Hero: preview + copy ──────────────────────────────────── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[4/3] lg:aspect-square border border-border/60 bg-secondary overflow-hidden tactical-card">
            <CornerBrackets size={16} thickness={1.5} />
            <HehPreview />

            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-primary/60 pointer-events-none select-none">
              <RotateCcw className="h-2.5 w-2.5" />
              Drag to rotate
            </div>
            <div className="absolute bottom-3 left-4 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground pointer-events-none select-none">
              <span>
                <span className="text-[#9fc4ff]">●</span> He · δ−
                (electron-rich)
              </span>
              <span>
                <span className="text-[#ffd27a]">●</span> H · δ+ (electron-poor)
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <p className="text-muted-foreground leading-relaxed">
              Helium hydride is the simplest heteronuclear molecule and the
              first one believed to have formed after the Big Bang. With just{" "}
              <span className="text-foreground">two electrons</span>, its
              wavefunction is known to spectroscopic accuracy — which makes it a
              perfect subject for a visualization that is both rigorous and
              surprising. The cloud you can spin here is sampled from a{" "}
              <span className="text-foreground">
                pre-computed electron density
              </span>
              , skewed toward helium exactly as theory predicts.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border/60 border border-border/60">
              {stats.map((s) => (
                <div key={s.label} className="bg-card/60 p-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {s.label}
                  </div>
                  <div className="font-display text-2xl text-primary leading-none">
                    {s.value}
                  </div>
                  {s.note && (
                    <div className="font-mono text-[9px] text-muted-foreground/70 mt-1">
                      {s.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {vizEnabled ? (
              <a
                href={vizHref("density")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 tactical-chip bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors glow-primary"
              >
                Launch full viewer <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 h-11 px-5 tactical-chip border border-dashed border-primary/40 text-muted-foreground font-mono text-[11px] uppercase tracking-[0.2em]">
                Full viewer — coming soon
              </span>
            )}
          </div>
        </div>

        {/* ── Four phenomena ────────────────────────────────────────── */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-10 bg-primary" />
            Four behaviors worth seeing
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {phenomena.map((p) => {
              const href = vizHref(p.hash);
              const inner = (
                <>
                  <CornerBrackets size={12} thickness={1.5} />
                  <div className="flex items-center gap-3 mb-3">
                    <p.icon className="h-5 w-5 text-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl uppercase leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                  {href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                      Explore <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </>
              );

              const className =
                "relative block p-6 border border-border/60 bg-card/30 tactical-card transition-colors hover:border-primary/40";

              return href ? (
                <a
                  key={p.hash}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <div key={p.hash} className={className}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Isotopologue ZPE table ────────────────────────────────── */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-10 bg-primary" />
              Isotope effect (computed)
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Zero-point energy scales as √(μ_ref / μ) with the reduced mass μ.
              Heavier isotopologues sit lower in the well and vibrate over a
              narrower range — these ratios are computed live from atomic
              masses.
            </p>
            <div className="border border-border/60">
              {ISOTOPOLOGUES.map((iso, i) => (
                <div
                  key={iso.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i % 2 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <span className="font-mono text-sm text-foreground">
                    {iso.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    μ = {iso.reducedMass.toFixed(3)} amu
                  </span>
                  <span className="font-display text-xl text-primary">
                    ZPE ×{iso.zpeRatio.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Data & methods ──────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-4 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-10 bg-primary" />
              Data &amp; methods
            </div>
            <div className="border border-border/60">
              {literature.map((row, i) => (
                <div
                  key={row.quantity}
                  className={`grid grid-cols-[1.4fr_1fr_1fr] gap-2 px-4 py-3 text-sm ${
                    i % 2 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <span className="text-muted-foreground">{row.quantity}</span>
                  <span className="font-mono text-foreground">{row.value}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/70 self-center text-right">
                    {row.source}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80 leading-relaxed">
              Because HeH⁺ has only two electrons, full configuration
              interaction is exact within the basis and identical to CCSD;
              rigour comes from basis-set quality and calibration to the
              non-Born–Oppenheimer literature. The preview cloud is an
              illustrative density sample; the full viewer renders the
              ray-marched ab-initio density.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
