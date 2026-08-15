# V3 Implementation Notes — 3D scroll rebuild

Implemented by Claude (Fable 5) on branch `v3` (cut from `v2`, the production
branch) on 2026-08-15, working from `PORTFOLIO_3D_BRIEF.md` +
`CONTENT_STRATEGY_RESEARCH.md`. All content verified against **resume 12.0**
(`public/resume.pdf` now serves it; source PDF kept gitignored at repo root).

Content decisions Vincent confirmed:

- Chess AI: **drop 71.2% top-5 accuracy**; resume 12.0 numbers only
  (≈393M positions processed, 15.1M-param ResNet–LSTM, 60× epoch speedup).
- Exploding Chickens: **1,600+ games** (match resume, not the live counter).
- Volleyball Motion Tracker: **removed** (off resume 12.0).
- HeH⁺ project: **still held back** (commented pointer in `lib/content.ts`).

Structure went through two passes of Vincent's feedback on the same day:

1. *"Make it a majority of 3D scrolling or all 3D scrolling… the short version
   repeats the work history and About… I'm not sure we need Selected Works."*
   → the static projects/experience/about/contact sections were deleted and the
   projects moved **into** the sequence as stages.
2. *"The search and commit portion isn't really necessary… the short version
   can be shorter, with more emphasis on what I am as a software engineer and
   what I like to do rather than hobbies… it'd be cool if it used dynamic
   scrolling too."*
   → the personal closing stage was cut, and the closing section was rebuilt
   around a scroll-driven capability rail.
3. *"Scratch that, I am not a fan of the headshot. Go back to the original
   space particles."* → stage 00 is the `scatter` cloud again (§2), plus a
   mobile pass: 44px tap targets in the top bar, no text under 11px, and
   `scroll-mt` so anchor jumps clear the fixed header.

---

## 1. Page structure

```
TopBar (fixed: Résumé + Email always; About/GitHub/LinkedIn on wider screens)
HeroSequence   — 6 stages, one morphing point field          ~6.3 viewports
ProfileSection — pinned capability rail + facts + closing    ~2.7 viewports
footer
```

**~9 viewports total.** Everything above the facts block is scroll-driven.

### The sequence (`stages` in `lib/content.ts`, shapes in `lib/three/shapes.ts`)

| # | Shape | Stage |
|---|---|---|
| 00 | `scatter` | Vincent Do — identity, clearance, chess hook |
| 01 | `rocket` | Boeing — real-time delivery |
| 02 | `handset` | Expedia — backend at product scale |
| 03 | `dna` | UW–Madison research → CS + Chemistry |
| 04 | `brain` | Playable Chess AI · **Play it / Source** |
| 05 | `globe` | Airport Routing Service · **Live demo / Source** |

`tree` (a chess search tree that prunes to one bright principal variation),
`network`, and `mesh` are generated and posed but unused — add any to
`SHAPE_ORDER` to use it. `tree` was built for a personal closing stage that
Vincent cut; the site leads with engineering and stage 00's hook line carries
the chess credential.

### ProfileSection

- **Capability rail** — four cards (Real-time systems / Services under load /
  ML systems / Proving it works) that say what Vincent is as an engineer and
  what he likes doing. Deliberately qualitative: every hard number lives in
  `stages`, exactly once.
- **Tech stack** — the complete tooling list in four columns, mirroring the
  Technical Skills block on resume 12.0. The cards name tools in context; this
  is what someone filtering for infrastructure work actually scans.
- **Facts** — three one-line experience rows, education, the Exploding Chickens
  line, and a single off-the-clock line.
- **Closing band** — availability plus Send message / Résumé, then a
  **Back to top** control in the footer so a nine-viewport page never traps
  anyone at the bottom.

## 2. Explored and rejected: the headshot as points

Stage 00 was briefly Vincent's real headshot, sampled into the point field.
He didn't like it, so the opening is the `scatter` arrival cloud again and the
runtime code, the baked map, and the generator are all removed. Recorded here
because the technique worked and the tuning was the expensive part:

- The busy outdoor background had to be removed **offline**, not at runtime — a
  bust-shaped spatial prior, a green-dominance test for the tree bokeh, and a
  brightness test for pavement and cars.
- **Luminance alone renders a featureless blob.** A Sobel edge term is what
  makes eyes, nose, mouth, collar, and lapel legible. The weight that worked
  was `0.04 + 1.00·lum^1.8 + 0.34·edge`, baked into a ~95 KB PNG (red = weight,
  green = depth) and inverse-CDF sampled at runtime to exactly `count` points.
- Three shader gates were needed on a `uPortrait` uniform: points to 55%
  (they otherwise overlap and additive blending saturates the face into a
  slab), glow to 88%, and idle drift to 18% (features sit hundredths of a
  world unit apart, and the drift smears them).

Even so, ~22,000 points reads as an evocative scan rather than a crisp
portrait — a real photographic point cloud wants 100k+, which the low-end
budget does not allow. If it is ever revisited, that ceiling is the thing to
solve first.

## 3. How the rail works, and why it isn't a carousel

The section pins; scroll position drives one `translate3d` on the rail, and
each card tilts (`rotateY`) and dims by its distance from the viewport centre.
Scroll stays 1:1 with the native scrollbar — nothing is intercepted, eased, or
snapped, so this is the same "pinned narrative" idiom as the hero and not the
scrolljacking the v2 brief bans.

Research (NN/g on scrolljacking; several a11y write-ups on horizontal regions)
was clear that a **real** horizontal scroll container is the trap: it needs its
own tab stop, ARIA name, and keyboard handling, and still strands screen-reader
users. So:

- no nested scroll container and no `overflow-x: auto`;
- **nothing focusable inside the rail** (a verified assertion), so it can never
  swallow a tab stop;
- all four cards are in DOM order for assistive tech;
- narrow viewports, `prefers-reduced-motion`, and no-JS all get the same
  content as a plain stacked grid in normal flow.

The track height is computed at runtime as `viewport + travel × 1.15`, so the
rail keeps a consistent pace on any screen instead of crawling on wide ones.
CSS scroll-driven animations (`animation-timeline`, ~84% support, runs on the
compositor) were considered and passed over: the per-card emphasis needs the
measured centre positions anyway, and rAF works everywhere.

## 4. Performance (Vincent's explicit requirement: no lag on low-end)

- Device profile (`lib/three/device.ts`, `useSyncExternalStore`): narrow
  viewport, ≤4 cores, or **Save-Data** → 6,000 points & DPR ≤1.25; otherwise
  22,000 & ≤1.75.
- **PerfGovernor**: measures real frame times after a 2.5s warmup; two
  consecutive 1.5s windows with >40% of frames slower than 28fps → one-way
  degrade to the weak budget (MorphField remounts via `key={count}`).
- **WebGL probe**: a `failIfMajorPerformanceCaveat` context is created before
  any `<Canvas>` mounts. No real GPU → the hero renders as a typographic screen
  and nothing else changes.
- frameloop → `"never"` offscreen or on a hidden tab. **One WebGL context on
  the page**, and no `<video>` anywhere.
- Narrow viewports stack copy under the field, so the field lifts
  (`offsetY` 1.35) and shrinks (`fieldScale` 0.72) above the text.
- three.js and lenis each sit behind their own `ssr:false` boundary — that
  boundary is what keeps them out of the Cloudflare Worker.
- The rail does all its layout reads in `measure()` (mount + resize only); the
  scroll loop writes transforms and nothing else.

## 5. Measurements (2026-08-15, local prod build, headless Chrome w/ GPU)

- **Wrangler dry-run: Total Upload 9,222.50 KiB / gzip 2,461.56 KiB** —
  ~610 KiB under the 3,072 KiB free-plan limit (v2 was 2,507.85).
  `WebGLRenderer` / `react-three` / `lenis` / `globe.gl` in `worker.js`: 0.
- Initial route JS **~203 KB gzip**; the three.js chunk (~231 KB gzip) is lazy
  and never render-blocking.
- Hero holds ~60fps (16.7 ms avg/frame) on this machine's GPU.
- **Mobile (390×844):** 10.7 viewports, no horizontal overflow at any scroll
  position, every control ≥44×44 except two inline links inside sentences
  (which WCAG 2.2 exempts), and no text below 11px. The capability rail is not
  pinned there — narrow viewports get the plain stacked grid.
- **22/22 browser checks pass** (`verify.mjs` in the session scratchpad): six
  distinct stages with working project links, one canvas, zero project-media or
  third-party requests, full profile content with **no focusable elements
  inside the rail**, the tech-stack block and a working back-to-top link, old
  section anchors gone, JS-blocked page fully readable with working
  mailto/résumé, WebGL-refused fallback with stages still advancing, reduced
  motion, and mobile 390 with no horizontal overflow plus a labelled
  résumé/email pair in the top bar.

## 6. Gotchas worth knowing

- **`overflow-x-hidden` on an ancestor silently breaks `position: sticky`** (it
  becomes the containing scrollport). The page wrapper must stay
  `overflow-x-clip`. This shipped as a bug once and only screenshots caught it.
- **`content-visibility: auto` and self-measuring sections don't mix** — a
  skipped subtree reports zero-sized boxes, so the rail could not measure its
  own track. `content-auto` was removed from ProfileSection for that reason.
- react-hooks v6 / React Compiler rules: three.js objects must be mutated
  through the `<points>` ref *inside* `useFrame`; device/hydration state uses
  `useSyncExternalStore`, not set-state-in-effect.
- The morph buffers cache the current segment, so any point-count change must
  remount `MorphField` (`key={count}`) or the shapes desync.
- Stage copy sets `pointer-events-none` on its container; the project link row
  re-enables it with `pointer-events-auto` or the buttons are dead.
- **Never put `hidden` and `inline-flex` on the same element** — they are the
  same Tailwind property group, so which one wins is stylesheet order, not
  class order. The top bar's mobile links looked hidden in the source and were
  visible in the browser until the display class was made exclusive.
- A label hidden with `hidden` (i.e. `display: none`) is hidden from screen
  readers too. Icon-only controls need an explicit `aria-label`, which is why
  every top-bar control now carries one.
- Track heights come from `stages.length` and from measured rail travel, so
  adding a stage or a card needs no magic vh constant updated.

## 7. Known / deferred

- **The Expedia (`handset`) shape is the weak one visually.** Vincent's call:
  keep for now, revisit the artwork later. It is accurate to the work (services
  → gateway → device, 16 locale arcs); it just doesn't look as good as the rest.
- Real-device mobile pass (the `hardwareConcurrency` branch doesn't trigger in
  desktop emulation) and a locked-down corporate laptop check.
- Everything in v2 notes §5 still stands (Cloudflare rate-limit rule, CSP
  enforcement plan, SPF/DKIM/DMARC, Playwright/axe/Lighthouse in CI).
- Deploy: push `v3`, switch the Cloudflare production branch from `v2` → `v3`
  (or merge), then verify vmd306.com serves the new commit, `/resume.pdf` is
  the 12.0 PDF, and the contact rate-limit rule is still active.

## 8. Recovering deleted media

Everything removed is in git history on `v2`:
`git checkout v2 -- public/projects/chess-network.webm` (and likewise for
`chess-network.mp4`, `chess-network-poster.png`, `exploding-chickens.jpg`,
`airport-globe-fallback.jpg`, the volleyball media, and the globe.gl vendor
bundle). The `heh-*` media is untracked and still on disk.
