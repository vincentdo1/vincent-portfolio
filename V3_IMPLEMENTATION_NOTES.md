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

1. _"Make it a majority of 3D scrolling or all 3D scrolling… the short version
   repeats the work history and About… I'm not sure we need Selected Works."_
   → the static projects/experience/about/contact sections were deleted and the
   projects moved **into** the sequence as stages.
2. _"The search and commit portion isn't really necessary… the short version
   can be shorter, with more emphasis on what I am as a software engineer and
   what I like to do rather than hobbies… it'd be cool if it used dynamic
   scrolling too."_
   → the personal closing stage was cut, and the closing section was rebuilt
   around a scroll-driven capability rail.
3. _"Scratch that, I am not a fan of the headshot. Go back to the original
   space particles."_ → stage 00 is the `scatter` cloud again (§2), plus a
   mobile pass: 44px tap targets in the top bar, no text under 11px, and
   `scroll-mt` so anchor jumps clear the fixed header.

---

## 000. Fourth pass, 2026-08-16 — Codex stage-2 audit fixes

Branch `v3_stage_1`, on top of commit `37ac1a5`. Implements
`codex_stage_2_audit.md`, which independently re-verified the stage-1 work and
found three defects the stage-1 suite had missed. All three were real.

### The three real bugs

**1. The contact endpoint could still silently discard a legitimate message.**
Renaming the honeypot to `ref_id` narrowed _who_ could trip it, but the route
still answered `{ ok: true }` without sending, so one client-controlled field
could make the UI announce "Message sent" for mail nobody would receive —
invisible to the sender and to Vincent. The trap now returns a recoverable
**422** naming the direct address. A single decisive signal must never fake a
delivery confirmation, however unlikely the false positive.

**2. Three fixed readout columns broke below 360px.** `THROUGHPUT`,
`PHENOTYPES`, `CANDIDATES` and `RELOCATION` crossed into neighbouring cells and
`PYTORCH · CUDA` broke mid-word. ~55px of text width at 11px mono with 0.16em
tracking is not viable. Now one column below `xs`, label and value on one row.
The stage-1 check missed it twice over: it inspected `dd` but not `dt`, and the
page's `overflow-x-clip` hid the spill from a document-width assertion.

**3. The field morph targeted the wrong shape.** Both project cards share a
grid row on desktop, so both scored a vertical distance of exactly zero and
insertion order decided the winner — the chess brain sat behind the Airport
Routing card and the globe was unreachable at any scroll position. After
UW–Madison nothing registered at all, so the last shape persisted through
Profile and Contact.

The rule is **never register two things that can share a vertical band** — a
layout constraint, not a granularity one. The first fix over-corrected to
section-level everywhere, which dropped the sequence from six shapes to four.
Vincent preferred six, and six is available without any tie risk, because only
the project cards ever sit side by side:

| Registers                                                           | Shape     |
| ------------------------------------------------------------------- | --------- |
| Intro                                                               | `scatter` |
| `#work` (section — the two cards can tie, so one shape covers both) | `brain`   |
| `#boeing`                                                           | `rocket`  |
| `#expedia-group`                                                    | `handset` |
| `#uw-madison`                                                       | `dna`     |
| `#profile` + `#contact`                                             | `globe`   |

The three roles are a single-column `<ol>`, so they stack at every width and
can never tie. Indices run 0,1,2,3,4,5,5 in document order — monotonic, so
the field never races backwards. Verified by screenshot at all six positions:
six distinct frames, with the rocket and the handset (both previously
unreachable) clearly rendered behind Boeing and Expedia.

The shapes are documented as an abstract progression, not labels for the
content behind them.

### Also fixed

| Audit item                                     | Fix                                                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Three.js downloaded by ineligible visitors     | `FieldBackdrop` decides no-WebGL / reduced-motion / Save-Data **outside** the dynamic import |
| Device profile cached at cold load only        | `device.ts` subscribes to reduced-motion, viewport, connection, and resize                   |
| Contact was a bare `div` inside Profile        | its own `<section aria-labelledby>` landmark                                                 |
| No mobile section navigation                   | Work is now visible at every width, including 320px                                          |
| Dialog readiness meant "module imported"       | the mounted dialog reports itself operational                                                |
| Resting control borders at 1.21:1              | new `--border-strong` token, **measured 3.23:1** in the browser                              |
| Placeholder text at 2.47:1                     | raised to `/80`                                                                              |
| Notch on every control                         | reserved for filled primary CTAs                                                             |
| Dialog still drew corner brackets and `Touch_` | removed                                                                                      |
| Experience prose ran ~140 characters           | capped at `max-w-prose`                                                                      |
| `flex-col-reverse` footer                      | DOM order matches visual order at every breakpoint                                           |
| No abuse budget on `/api/contact`              | in-isolate per-IP limiter, 5 per 10 min                                                      |

**The rate limiter is not a substitute for the Cloudflare rule.** Workers
isolates are per-colo and short-lived, so it bounds a naive single-client flood
and nothing else. A distributed script gets a fresh budget per colo. The
dashboard rule (or Turnstile) is still outstanding.

### Verification

`npm run verify:ui` is **121/121**, up from 103. The audit's critique of the
old suite was fair, so the additions test the things it named:

- **real Tab order** (pressing Tab, not calling `.focus()`)
- **cold contact click** before the prefetch resolves — asserts the `mailto:`
  is _not_ swallowed
- **contrast**, rasterising one pixel per colour because Chrome returns
  computed colours as `lab()`, so scraping numbers from the string is
  meaningless
- **console errors and failed requests** across a full scroll
- **readout cells** now check `dt` as well as `dd`, and use `scrollWidth`
  rather than document width
- assertions renamed where they overclaimed: "Find locates X" became "X is in
  rendered text at rest", "keyboard reachable in order" became "appears in
  sequential DOM order"

Three of the new checks failed first as **test** bugs worth recording: the
Next.js dev overlay injects a 0×0 focusable portal that does not exist in a
production build; a 40-press Tab loop wraps the page and double-counts; and
`toDataURL` returns a blank buffer because `preserveDrawingBuffer` is off by
design, so the rendered shape cannot be pixel-diffed — that check became a
structural contract test instead, with the limitation documented in the script.

**Bundle 2,452.45 KiB gzip**, 620 KiB under the free-plan limit.

### Not done, and why

- **Real-device, real-GPU, axe, screen-reader, Lighthouse.** Needs hardware
  and tooling not available here. Still the largest pre-release gap.
- **Case-study evidence slots** (problem / ownership / alternatives rejected /
  validation). The audit is right that this is now the biggest hiring
  weakness, but it needs facts only Vincent has; inventing them was out of
  scope.
- **Raw-WebGL rewrite of the point field.** The audit advised gating before
  importing first and measuring on real hardware after. Gating is done.

---

## 00. Third pass, 2026-08-16 — the stage-1 UI/UX review

Branch `v3_stage_1`, implementing `V3_STAGE_1_UI_UX_REVIEW.md` (a Codex audit).
Everything in §0 and §1 below describes the structure this pass **replaced**;
it is kept for the reasoning, not as a description of the current page.

**The verdict that drove it:** the site behaved like a WebGL presentation
wrapped around resume bullets. Six sticky stages ran ~630vh before any
normal-flow content, only one stage existed in the DOM at a time, and the
flagship projects could not be found, linked to, tabbed to, or compared.

**What the page is now.** One animated intro screen carrying the page's single
stable `<h1>`, then ordinary anchored sections:

```
MorphScene   — fixed inset-0 z-0, one canvas, purely decorative
TopBar       — Work · Experience · About · Résumé · GitHub · LinkedIn · Message
Intro        — #top, the one <h1>, readout, View work / Message / Résumé
FeaturedWork — #work → #chess-engine, #airport-routing
Experience   — #experience → #boeing, #expedia-group, #uw-madison
ProfileSection — #profile (capability grid, core stack, education) + #contact
footer
```

**9.4 viewports → 4.7.** Every project heading, summary, readout, and link is
in the DOM at rest.

**The field is now driven by reading position, not scroll gating.** Each
section registers a shape (`lib/three/field.ts`); the field morphs to whichever
section is nearest the middle of the viewport. `SHAPE_ORDER` therefore has to
match document order or the field races backwards. Nothing on the page depends
on it rendering.

**Changes worth knowing about:**

| Item                | Before                                 | After                                          |
| ------------------- | -------------------------------------- | ---------------------------------------------- |
| Capability rail     | pinned, cards tilt/fade to 0.5 opacity | static responsive grid, no JS                  |
| Lenis smooth scroll | 1.05s duration                         | removed, native scrolling                      |
| Reduced motion      | full 630vh track + morphs              | **no canvas at all**                           |
| `frameloop`         | `"always"`                             | `"demand"`, woken by scroll, settles and stops |
| Honeypot            | `company` (autofill-prone)             | `ref_id`, non-semantic                         |
| URL in name         | silent success                         | visible 400                                    |
| Contact first click | `preventDefault` before chunk loaded   | idle prefetch; `open()` false until ready      |
| Tech chips          | 37                                     | 18                                             |
| Readouts            | content-sized `inline-block`           | fixed 3-col `<dl>`                             |
| Header CTA          | "Email"                                | "Message" (it opens a form)                    |

**Motif reduction.** Removed: scan lines, corner brackets, decorative
underscores, blueprint grid, `SYS //` numbering, section heading rules.
Kept: particle field, monospace instrumentation, notched buttons, green.
`CornerBrackets` is deleted; the contact dialog still draws its own inline.

**Verification.** `npm run verify:ui` (new) drives a real browser through the
review's acceptance matrix: **103/103**, covering navigation/scanning, keyboard
and focus, no-JS, no-WebGL, reduced motion, contact, and the responsive matrix
at 320×568, 390×844, 844×390, 1280×720, 1440×900. Needs `CHROME_PATH` or a
system Chrome.

**Bundle: 2,450.99 KiB gzip** (was 2,461.81), 621 KiB under the free-plan
limit. Removing Lenis paid for the new sections.

Two real bugs the browser matrix caught that static checks could not:

- At **844×390** the `md` breakpoint turned on both the section links and the
  external-link labels, overflowing the row and clipping the Message action.
  Labels moved to `lg`.
- The `:not(:focus-within)` reveal guard needs the CSS rule _and_ the
  `focusin` handler. The CSS alone leaves the element revealed only while
  focused, so it fades back out on blur mid-tab-sequence.

---

## 0. Second pass, 2026-08-16 — the ending, and a copy rewrite

Vincent: _"I'm not the biggest fan of the ending page… research alternatives
that match better with the 3D modeling"_ and _"match the portfolio with better
wording (non AI generated wording), I want it to sound like a human wrote it."_

**The diagnosis.** The canvas died when the hero track released and the last
three viewports were flat cards on black: a 40-chip tech-stack wall, a "Where"
block that repeated stages 01–03 (the Madison row reused stage 03's three
readout numbers verbatim), and `LET'S BUILD_` floating above ~200px of empty
space and a copyright line. The page peaked at stage 05 and decayed. That is a
[peak-end](https://lawsofux.com/peak-end-rule/) failure in the most literal
form — the very last thing on screen was nothing.

**What shipped.** The `<Canvas>` moved out of `HeroSequence` to a page-level
`fixed inset-0 z-0` layer driven by the whole document, so it survives past the
sequence and the dossier is no longer a flat page. This is the standard r3f
architecture (cf. [`14islands/r3f-scroll-rig`](https://github.com/14islands/r3f-scroll-rig))
and how Apple's product pages avoid the same handoff. Still **one WebGL
context**, still **zero downloaded assets**, **+0.26 KiB gzip** on the Worker.

**What was built and then removed the same day.** A full closing stage
(`SYS // 07 — CONTACT`, `Your move_`, its own 190vh sticky track) where the
field morphed one last time into `tree`, the chess search tree that prunes to a
single bright line, with the contact CTA in the same frame. It worked and it
verified. Vincent: _"I also do not like the ending page you just added so
remove that."_ It came out; the compact closing band went back where it was, at
the end of the dossier.

So the page still ends on a flat screen. That was a deliberate call, not an
oversight — **do not rebuild the closing stage without asking.** `tree` has now
been written for a closing stage and cut twice.

Also rejected: appending a closing stage without moving the canvas, and a
non-WebGL echo of the field (reads as a fake next to the real thing).

**On the copy.** Vincent rewrote roughly half of `lib/content.ts` on top of the
first pass and the result is the reference for his voice: **shorter, denser,
plainer titles**. He cut every narrative sentence (_"that summer is when the
code half won"_, _"sitting with the frontend engineers until the edge cases
stopped"_, _"mostly because I wanted to find out what breaks first"_) and
restored terse factual ones. Titles went back to literal: `Real-time delivery`,
`Neural network`, `Airports routing`. What he kept from the first pass: all of
stage 00, every capability card, the `experiences` rows, and `alsoBuilt`.

Match that register for anything new. Concise and factual beats narrative here,
even though narrative is what usually reads as human.

## 1. Page structure

```
MorphScene    — fixed inset-0 z-0, ONE canvas for the whole document
TopBar (fixed: Résumé + Email always; About/GitHub/LinkedIn on wider screens)
HeroSequence   — 6 stages, sticky copy panel                 ~6.3 viewports
ProfileSection — rail + facts + closing band, field receded  ~2.7 viewports
footer
```

**~9.4 viewports desktop, ~10.7 mobile.** All content sits at `z-10`; the
scan-line overlay is at `z-1`, so the field reads as depth _under_ the page.

### The sequence (`stages` in `lib/content.ts`, shapes in `lib/three/shapes.ts`)

| #   | Shape     | Stage                                            |
| --- | --------- | ------------------------------------------------ |
| 00  | `scatter` | Vincent Do — identity, clearance, chess hook     |
| 01  | `rocket`  | Boeing — real-time delivery                      |
| 02  | `handset` | Expedia — backend at product scale               |
| 03  | `dna`     | UW–Madison — solving medicine through code       |
| 04  | `brain`   | Playable Chess AI · **Play it / Source**         |
| 05  | `globe`   | Airport Routing Service · **Live demo / Source** |

`tree`, `network`, and `mesh` are generated and posed but unused. See §0 before
reaching for `tree`.

### How the hero drives a canvas it doesn't contain (`lib/three/field.ts`)

The canvas is fixed behind the whole document, so the section driving it and
the canvas rendering it are no longer parent and child. They meet at a module
singleton that `useScrollStage` writes on every scroll frame:

```
progress = 0→1 across the sequence   (drives the morph)
recede   = 1 − presence              (1 once the sticky panel releases)
```

`presence` is how much the hero's sticky panel owns the screen: 1 while pinned,
ramping to 0 over one viewport either side. Over the dossier it is 0, so
`recede` is 1 and the field fades to 26%, shrinks 16%, and stops advancing its
time-based terms.

A module singleton rather than context on purpose: one field, both values
change every scroll frame, and nothing should re-render when they do.

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
- **Closing band** — `Your move_`, availability, Send message / Résumé. One
  line and two actions: the top bar carries résumé, GitHub, LinkedIn, and email
  at every scroll position, so a full contact panel here is just a second copy
  of it. The rail heading above it is `How I work_` rather than `What I build_`
  so the two headings do not use the same verb.
- **Back to top** in the footer, so a nine-viewport page never traps anyone at
  the bottom.

## 0b. The copy pass

Audited against a [public inventory of AI writing tells](https://github.com/conorbronsdon/avoid-ai-writing).
What the original copy was doing, all of it flagged: **12 em-dash appositives**
in user-facing strings, closing aphorisms on nearly every sentence (`keeps both
honest`, `hardware that doesn't get a second try`), **six rule-of-three
lists**, `X rather than Y` negation-before-reveal, `real health checks`
adjective inflation. Above all, one uniform rhythm: clipped noun phrase,
em-dash appositive, closing aphorism, repeat.

The pass that stuck: **no em dashes in prose** (the ones left are in
`SYS // 01 — BOEING` labels and date ranges, which is typography), **no closing
aphorisms**, and **stated preferences instead**, because the absence of any
first-person stance is itself a tell.

The pass that did **not** stick: rewriting headlines to name the thing
(`Cockpit displays` for `Real-time delivery`, `An engine you can beat` for
`Trained architectures`), and adding narrative sentences. Vincent reverted both
— see §0. His register is **concise and factual**, not narrative. When those
two goals conflict here, concise wins.

One guess left in the file, flagged inline at stage 03: `Extracted thousands of
medical papers before AI`. The original read `thousands of medical literature`,
which is ungrammatical because literature is uncountable. **`papers` is
inferred** — swap for records or abstracts if that is closer to the work.

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
  any `<Canvas>` mounts. No real GPU → every section renders as a typographic
  screen and nothing else changes.
- frameloop → `"never"` on a hidden tab. **One WebGL context on the page**, and
  no `<video>` anywhere.
- **The cost of the page-level canvas, stated honestly.** The field now renders
  for all ~9.4 viewports instead of the first six, because a fixed canvas is
  always on screen and the IntersectionObserver gate has nothing left to tell
  it. Per-frame cost is unchanged, so the device budget and PerfGovernor still
  bound the worst case; the exposure is battery over a long read, not jank.
  Partial mitigation: while receded the field fades to 26%, shrinks 16%, and
  stops advancing `uTime`, so drift and neuron firing cost nothing over the
  dossier. If this ever needs more, the lever is `frameloop="demand"` plus
  `invalidate()` on scroll while `recede > 0.96`.
- Narrow viewports stack copy under the field, so the field lifts
  (`offsetY` 1.35) and shrinks (`fieldScale` 0.72) above the text.
- three.js and lenis each sit behind their own `ssr:false` boundary — that
  boundary is what keeps them out of the Cloudflare Worker.
- The rail does all its layout reads in `measure()` (mount + resize only); the
  scroll loop writes transforms and nothing else.

## 5. Measurements (2026-08-16, local prod build, headless Chrome/SwiftShader)

- **Wrangler dry-run: Total Upload 9,224.66 KiB / gzip 2,461.82 KiB** —
  610 KiB under the 3,072 KiB free-plan limit, and **+0.26 KiB gzip** over the
  2,461.56 recorded on 2026-08-15 (v2 was 2,507.85). Moving the canvas out to
  page level is essentially free. `WebGLRenderer` in `worker.js`: 0.
- **Desktop 1440×900: 9.4 viewports**, one canvas, no horizontal overflow at
  any scroll position, zero third-party requests.
- **Mobile 390×844: 10.7 viewports**, no horizontal overflow at any scroll
  position, and every control in the closing band ≥44px tall. The capability
  rail is not pinned there — narrow viewports get the plain stacked grid.
- **31/31 browser checks pass** (`verify.mjs`, session scratchpad — not
  committed, matching the previous pass's convention). Baseline: one canvas,
  fixed/z-0/viewport-sized host, closing band inside `#profile`, no orphan
  `SYS // 07` left behind by the removed stage, no `LET'S BUILD` anywhere, both
  `#contact` and `#profile` anchors, mailto and résumé reachable in the closing
  band, canvas still alive at the very bottom of the page, no third-party
  requests. Plus: JS-blocked (closing copy and both actions in server HTML,
  dossier still indexable, page under 7,000px so a dead chunk never leaves
  viewports of blank), WebGL-refused (no canvas, closing band renders, stages
  still advance), reduced motion (canvas mounts in static pose, rail unpinned),
  and mobile.

Three of those checks failed on the first run and all three were **test** bugs
worth recording: `ContactTrigger` renders an `<a href="mailto:">` rather than a
`<button>` (that is the progressive-enhancement design — it upgrades to the
dialog on click), the availability line is uppercased by CSS so `innerText`
comparisons must be case-insensitive, and r3f inserts **two** wrapper divs
between the fixed host and the `<canvas>`, not one.

## 6. Gotchas worth knowing

- **`overflow-x-hidden` on an ancestor silently breaks `position: sticky`** (it
  becomes the containing scrollport). The page wrapper must stay
  `overflow-x-clip`. This shipped as a bug once and only screenshots caught it.
- **`content-visibility: auto` and self-measuring sections don't mix** — a
  skipped subtree reports zero-sized boxes, so the rail could not measure its
  own track. `content-auto` was removed from ProfileSection for that reason.
- react-hooks v6 / React Compiler rules: three.js objects must be mutated
  through the `<points>` ref _inside_ `useFrame`; device/hydration state uses
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
- **A square-edged scrim over the field is visible as a horizontal line.**
  `ProfileSection` dims the receded field with `bg-background/88`, and with a
  hard boundary you could see the exact scanline where the globe changed
  brightness — the same seam the rebuild existed to remove. Fixed with a
  `mask-image` that ramps in over 180px. The ramp is in **px, not %**, so the
  softness does not change with the section's height. There is deliberately no
  matching ramp at the bottom: the section runs to the footer, so the scrim
  should stay solid under the closing band rather than exposing particles.
- **react-hooks v6 bans writing a ref during render**, which rules out the
  usual `ref.current = callback` trick for keeping an effect from
  resubscribing. `useScrollStage` takes `onMeasure` as a real effect
  dependency instead, and the caller wraps it in `useCallback` with no deps.

## 7. Known / deferred

- **The Expedia (`handset`) shape is the weak one visually.** Vincent's call:
  keep for now, revisit the artwork later. It is accurate to the work (services
  → gateway → device, 16 locale arcs); it just doesn't look as good as the rest.
- **The "Where" block still repeats stages 01–03.** The rows were reworded so
  they are no longer the stage body twice, but the dossier and the sequence
  still cover the same three jobs. Deleting the rows would cost the dates and
  locations a recruiter scans for, so this is a real tension, not an oversight.
  A timeline strip (company · role · dates on one line each, no prose) would
  resolve it and is the obvious next trim.
- **The page still ends flat**, since the closing stage came out (§0). The
  field is alive behind the dossier but receded, so the last screen is the
  closing band over a faint field and then the footer. Better than the canvas
  dying at stage 05, but the ending is still the weakest part of the page.
  Whatever comes next, it should not be another full-screen closing stage.
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
