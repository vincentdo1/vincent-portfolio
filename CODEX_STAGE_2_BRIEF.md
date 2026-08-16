# Codex brief — verify stage 1, then advise on stage 2

## Context

You wrote `V3_STAGE_1_UI_UX_REVIEW.md`. Claude implemented it on branch
`v3_stage_1` (uncommitted working tree, ~1,100 lines changed across 21 files
plus 6 new ones). This is a request to **audit that implementation against your
own review**, then give a second opinion on a specific list of judgment calls.

Read `V3_IMPLEMENTATION_NOTES.md` §00 first — it is the changelog for this pass.

### What the page is now

The 630vh six-stage sticky sequence is gone. Structure:

```
MorphScene     fixed inset-0 z-0, one canvas, decorative only
TopBar         Work · Experience · About · Résumé · GitHub · LinkedIn · Message
Intro          #top — the page's single <h1>, readout, View work / Message / Résumé
FeaturedWork   #work → #chess-engine, #airport-routing
Experience     #experience → #boeing, #expedia-group, #uw-madison
ProfileSection #profile (capability grid, core stack, education) + #contact
footer
```

9.4 viewports → 4.7. The point field is now driven by reading position: each
section registers a shape in `lib/three/field.ts` and the field morphs to
whichever section is nearest the viewport centre. Nothing depends on it
rendering.

### How to verify

```bash
npm run dev
CHROME_PATH="/path/to/chrome" npm run verify:ui   # 103 browser checks
npm run lint && npx tsc --noEmit && npm run build && git diff --check
```

`npm run verify:ui` is new (`scripts/verify-ui.mjs`) and covers your acceptance
matrix: navigation/scanning, keyboard/focus, no-JS, no-WebGL, reduced motion,
contact, and responsive at 320×568, 390×844, 844×390, 1280×720, 1440×900. It
passes 103/103. **Treat that as a claim to check, not evidence.** Assertions
can be wrong or can test the wrong thing — three of them were, in the first
run, and I want a second pair of eyes on whether they now test what they say.

---

## Task 1 — did the implementation actually address the review?

Go item by item through your P0–P3 list and confirm or reject. In particular
I want challenge on these, where the fix may be narrower than the finding:

- **#7 "evidence and actions stronger than decoration."** I standardized the
  readouts to a fixed 3-column `<dl>`, capped the field's alpha at 0.66,
  removed every `text-shadow`, and raised body copy to 90% foreground. I did
  **not** restructure the type scale. Section `<h2>`s are still 4xl/5xl Bebas
  and project `<h3>`s are 3xl/4xl. Is the hierarchy actually fixed, or did I
  only reduce the decoration side of the ratio?

- **#11 motif density.** You asked for two or three signature motifs. I kept
  **four**: particle field, monospace instrumentation, notched buttons
  (`tactical-chip`), and green accents. Removed: scan lines, corner brackets,
  decorative underscores, blueprint grid, `SYS //` numbering, section heading
  rules. Is the notched button worth keeping, or is it the one to cut?

- **#2 semantic DOM.** Every project and role is an `<article>` with its own
  `id` and heading. Verify heading order, landmark structure, and that the
  `aria-labelledby` wiring is right, not just present.

- **#8 reduced motion.** I went further than "static visual" and render **no
  canvas at all** under `prefers-reduced-motion`. Too aggressive?

---

## Task 2 — judgment calls I want challenged

1. **Field driven by "nearest section to viewport centre."** One rAF-throttled
   scroll listener reads N section rects and picks a target shape; the field
   eases toward it. Is this a good model, or is any scroll-coupled decoration
   still a liability after everything you said about the sequence? A defensible
   answer is "cut the morph entirely and let the field be static."

2. **Projects above experience.** Follows your suggested recruiter journey, but
   it means a visitor sees side projects before the Boeing role. Right call for
   a backend/infra job search?

3. **Lenis fully removed** rather than shortened. Native scroll now. Confirm
   nothing depended on it.

4. **`frameloop="demand"`.** The canvas wakes on scroll, keeps itself alive
   while the morph eases, then stops. Check `fieldSettled()` in
   `lib/three/field.ts` for a case where it can settle mid-morph and freeze a
   half-formed shape, or fail to settle and spin forever.

5. **Contact first-click fix.** The dialog chunk is prefetched on
   `requestIdleCallback`, and `open()` returns false until it resolves so the
   `mailto:` falls through. Is there still a window where a click is dead?

---

## Task 3 — known gaps I am handing over, not hiding

- **three.js is not tree-shaken.** 196 KB brotli, and it contains
  `SkinnedMesh`, `AnimationMixer`, `InstancedMesh`, `TextureLoader`,
  `WebGLCubeRenderTarget` — none of which this site uses. It draws 1 point
  cloud with 1 draw call. This is inherent to r3f + `WebGLRenderer`. The chunk
  is lazy and off the critical path, so I judged the rewrite not worth it. Say
  if you disagree.

- **`failIfMajorPerformanceCaveat: true` does not do what its comment claims.**
  `lib/three/device.ts` says a software rasterizer "must count as no WebGL so
  fallbacks kick in deterministically." In testing, SwiftShader **passed** that
  check in both headless configurations. `PerfGovernor` is doing the real
  protection. The comment should probably be corrected; I left the code alone.

- **No real-device testing.** All browser verification ran headless on
  SwiftShader — no GPU. Frame pacing held 16.7 ms p50/p95 there, which is a
  strong signal, but nothing has been on a real phone or a locked-down
  corporate laptop. The `hardwareConcurrency` weak-device branch does not
  trigger in desktop emulation.

- **No formal accessibility or performance audit.** No axe, no Lighthouse, no
  contrast measurement. My checks assert structure and focus behaviour, not
  WCAG contrast ratios. Secondary copy uses `text-muted-foreground`
  (`oklch(0.68 0.02 145)` on `oklch(0.08 0.015 145)`) and I have not measured
  it.

- **Carried over from the v2 notes, still open:** Cloudflare rate-limit rule,
  CSP enforcement, SPF/DKIM/DMARC, and CI for any of the above.

---

## Out of scope

**Do not rewrite copy.** Vincent owns all wording and has already revised it
once this session. Specifically leave alone: the AMELIE/2,893 phrasing, the
"before AI" construction, project and section titles, and the "Your move" CTA.
Structural and hierarchy feedback on how copy is _presented_ is welcome;
rewrites of the sentences are not.

Do not commit or push. Vincent reviews and commits himself.
