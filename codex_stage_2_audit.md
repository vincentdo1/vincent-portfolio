# Codex Stage 2 Audit

## Scope

This is a read-only audit of the uncommitted `v3_stage_1` implementation against:

- `V3_STAGE_1_UI_UX_REVIEW.md`
- Section 00 of `V3_IMPLEMENTATION_NOTES.md`
- `CODEX_STAGE_2_BRIEF.md`
- The revised desktop screenshots supplied on August 16, 2026

The review prioritizes visual hierarchy, usability, accessibility, conversion reliability, responsive behavior, and the hiring-manager scan. Copy changes are deliberately out of scope. In particular, this audit does not rewrite the AMELIE wording, “before AI,” project titles, or “Your move.”

No application files were changed during the audit. Nothing was committed or pushed.

## Executive verdict

The Stage 1 implementation is a genuine structural improvement, not a cosmetic patch. The portfolio is now hire-screenable: identity, work, evidence, experience, résumé, and contact are accessible without forcing a visitor through a 630vh presentation.

The remaining weaknesses are concentrated rather than systemic:

1. The contact endpoint can still silently report success without delivering a legitimate message.
2. Fixed three-column readouts visibly fail at 320px.
3. The scroll-coupled field morph selects the wrong project shape on desktop and leaks the DNA motif into unrelated sections.
4. Formal accessibility, contrast, real-device, and real-GPU validation remains undone.
5. The work is presented as polished project summaries rather than case studies demonstrating senior decision-making.

Stage 1 succeeded. The portfolio no longer needs structural rescue; it needs a small number of high-impact corrections and a final pass of visual restraint.

## Independent verification

The implementation was checked independently rather than accepting the brief’s claims as evidence.

- `npm run verify:ui`: **103/103 passed**
- `npm run lint`: passed
- `npx tsc --noEmit`: passed
- `git diff --check`: passed
- `npm run build`: passed when Google Fonts network access was available
- Generated Three.js/R3F chunk: approximately **892 KB raw / 194 KB Brotli**

### What 103/103 actually proves

The count is accurate, but the label is rhetorically stronger than the coverage. There are 42 `ok()` call sites expanded by loops; 55 assertions are the same 11 responsive predicates repeated at five viewport sizes.

Important limitations in `scripts/verify-ui.mjs`:

- “Find locates … without scrolling” searches `body.innerText`; it does not exercise browser Find.
- Most “keyboard reachable” checks call `.focus()` programmatically rather than pressing Tab through the page.
- Hidden anchors are included in the focusable-element audit.
- “Keyboard reachable in order” compares DOM indexes rather than actual Tab order.
- Mobile Work navigation passes because the link exists in the DOM, even though CSS hides it below `md`.
- Contact checks wait for preloading and therefore do not test an immediate cold click, delayed chunk, or failed chunk.
- Readout collision checks inspect `dd` values but not overflowing `dt` labels.
- Root `overflow-x-clip` can conceal local overflow while document width still passes.
- Dialog reachability can pass merely because the dialog is scrollable.
- There are no checks for submission success, API error, timeout, focus restoration, Escape, focus trapping, WebGL context loss, actual morph targets, console errors, failed requests, contrast, axe violations, Web Vitals, Safari, Firefox, or real devices.

The suite should be described as **103 structural and responsive assertions**, not as a comprehensive UI, accessibility, or performance audit.

## Task 1: original P0–P3 review, item by item

### P0

#### 1. Replace the 630vh forced sequence — Resolved

The old single-active-stage presentation is gone. `app/page.tsx` renders normal-flow Intro, Featured Work, Experience, and Profile sections. Visitors can scan, jump, search, and revisit content without driving presentation state through scroll position.

#### 2. Preserve all content in semantic DOM order — Mostly resolved

The important semantic work is real:

- One stable `h1` in `components/sections/intro.tsx`
- Project `article` elements with correctly connected headings in `components/sections/featured-work.tsx`
- Experience `article` elements with correctly connected headings in `components/sections/experience.tsx`
- Named Work, Experience, and Profile sections
- Project evidence and links remain persistently present in the DOM

Remaining defect: `#contact` is a plain `div` containing an `h2` inside the Profile/How I Work region (`components/profile/profile-section.tsx`, around line 158). Landmark navigation therefore exposes no separately named Contact/Your Move region. It should ultimately become a peer `<section aria-labelledby="contact-heading">`, or its heading should be demoted if it is intentionally subordinate to Profile.

Verdict on ARIA: the core wiring is correct rather than merely present. The exception is the missing Contact section relationship.

#### 3. Fix responsive and short-viewport clipping — Partial

The fixed-height hero and capability-rail failures are substantially fixed. The header, normal-flow sections, and dialog are much more resilient.

A real 320px failure remains in `components/sections/readout.tsx`:

- At 320×568, `THROUGHPUT` crosses approximately 17px into the next cell.
- `PHENOTYPES` similarly crosses into its neighbor.
- `CANDIDATES`, `RELOCATION`, and other long labels exceed their cell widths.
- `PYTORCH · CUDA` breaks in the middle of “PYTORCH.”

The combination of three fixed columns, roughly 55px of available text width per cell, 11px mono labels, and `0.16em` letter spacing is not viable below approximately 360px. The page-level overflow clip masks the failure from the existing suite.

Recommended design direction: switch readouts to one or two columns at the narrowest breakpoint, or reduce narrow-screen label tracking and value size without enabling arbitrary mid-word breaks.

#### 4. Remove false-success contact behavior — Partial; P0 remains

Renaming the honeypot from `company` to `ref_id` makes accidental browser autofill less likely. That is an improvement.

However, `app/api/contact/route.ts` still returns `{ ok: true }` without sending whenever this one client-controlled field is non-empty. The UI can therefore announce “Message sent” while discarding the message. This remains a conversion-critical defect because the failure is invisible to both the visitor and Vincent.

The trap should not be used as a single decisive signal. Combine abuse signals and real rate controls, or return a recoverable response rather than a false delivery confirmation.

### P1

#### 5. Provide direct navigation to work — Partial

The Intro now has a prominent View Work action, and desktop navigation exposes Work, Experience, and About. This is a large improvement.

Below `md`, all three section links are hidden. Mobile visitors retain résumé and Message but lose persistent Work and Experience navigation after leaving the Intro. Because two stacked project cards precede Experience on mobile, this is material to recruiter scanning.

Recommended direction: add a compact mobile section navigation or at minimum a direct Experience shortcut.

#### 6. Replace the capability rail — Resolved

The rail is now a static responsive grid/list. All content is legible at once, there is no pinned horizontal track, and off-center cards are no longer faded to 50% opacity. This is one of the strongest changes in Stage 1.

#### 7. Make evidence and actions outrank decoration — Mostly resolved

The hierarchy is substantially improved. A wholesale type-scale rewrite is **not** necessary.

What now works:

- Featured Work has a clear section heading.
- Both projects can be compared side by side on desktop.
- Project names, summaries, readouts, and CTAs form a coherent scan path.
- Evidence is persistently visible rather than transient.
- Capability cards are fully legible.
- The field is strongest in the Intro and generally quieter behind content.

Remaining hierarchy defects:

- The particle field becomes visually bright at some section transitions.
- The brain is visibly active behind the Airport Routing card in the supplied screenshots.
- Readout evidence breaks down at 320px.
- Experience descriptions run across extremely long desktop measures while large portions of the cards remain unused.

The remaining seniority problem is not primarily visual hierarchy; it is **evidence architecture**. The project model has slots for name, category, implementation summary, metrics, and links, but not problem, ownership, constraints, decision rationale, rejected alternatives, tradeoffs, validation method, or metric baseline. The cards are strong summaries, not yet case studies proving judgment.

#### 8. Honor reduced motion without a scroll-driven canvas — Partial overall

Rendering no canvas under reduced motion is appropriate. The field is decorative, the normal DOM remains complete, and loading Three.js solely to show a static decorative frame would be wasteful.

The current device profile is cached once with a no-op subscription in `lib/three/device.ts`. Enabling reduced motion during a visit, rotating a device, resizing a window, changing zoom/reflow, or changing Save-Data will not refresh the profile. The behavior is therefore correct only at cold load.

Recommendation: keep the no-canvas policy, but subscribe to the relevant media queries or explicitly document and test a cold-load-only policy.

#### 9. Remove artificial scroll drag — Resolved

Lenis has been removed. Native scrolling is the correct choice and should remain.

Benefits now restored include anchor behavior, Page Up/Down, browser Find, keyboard scrolling, lower cognitive friction, and faster perceived inspection. Nothing valuable depended on eased wheel behavior.

#### 10. Make the first contact activation deterministic — Mostly resolved

The common failure has been fixed. Before the dialog chunk is ready, `open()` returns false and the native `mailto:` activation is not prevented. A slow or failed import no longer produces the original swallowed click.

A smaller failure window remains:

- `ready` means the raw module import resolved.
- It does not prove that the dialog is mounted and `showModal()` will succeed.
- A post-import effect error, unsupported dialog behavior, or tiny mount race can occur after the click has been prevented.
- Pointer/focus preload and provider readiness are not one shared state.

The simplest robust design would be to eager-load this relatively small form. Otherwise, only return successful `open()` after the mounted dialog capability is confirmed.

### P2

#### 11. Reduce decorative motif density — Partial; implementation claim rejected

The page no longer feels excessively specified. Scan lines, SYS numbering, and much of the original instrumentation have been removed.

The brief nevertheless retained four motifs despite the original target of at most three:

1. Particle field
2. Monospaced instrumentation
3. Neon green
4. Notched controls

In addition, the modal still renders four corner brackets and `Touch_`, despite notes suggesting corner/underscore treatments were removed.

The page is no longer amateurish, but the notch is the least defensible motif. Particle field + mono instrumentation + green already form a complete identity. Plain sharp rectangles would feel more mature for a backend/infrastructure portfolio.

If the notch is personally important, reserve it for the single filled primary CTA rather than applying it across résumé, source, utility, and secondary controls.

#### 12. Reduce the exhaustive chip wall — Resolved narrowly

The curated Core Stack contains 19 chips, not the claimed 18. This is still roughly half of the prior 37-item inventory and is grouped meaningfully. Capability cards also include contextual tags, but the standalone wall is no longer a serious UX problem.

#### 13. Make the contact dialog safe on small and short screens — Resolved

The dialog now includes:

- Viewport-bounded max height
- Internal scrolling and overscroll containment
- Wrapping/stacking actions
- `aria-busy` during submission
- Success focus management
- A visible direct-email fallback

At 320×568, the dialog remained bounded and scrollable rather than clipping actions outside the viewport.

#### 14. Make reveal behavior fail open — Resolved

The observer is created before the hidden state is applied. Focus entry reveals content permanently, and CSS protects `:focus-within`. Keyboard targets should no longer remain invisibly focusable when IntersectionObserver is unavailable or delayed.

#### 15. Replace presentation language with action language — Resolved

Stage progress, SYS numbering, “scroll to advance,” and inconsistent CTA language are gone. Project actions consistently use Live Demo/Source, and the primary contact action is Message.

### P3

- `<dl>/<dt>/<dd>` relationships: resolved, aside from the narrow-width layout failure.
- Skip target with `tabIndex={-1}`: resolved in `app/page.tsx`.
- Footer DOM/visual order: not fully resolved. `flex-col-reverse` makes mobile visual order differ from DOM reading order.
- Shader green tokens: resolved narrowly.
- Browser acceptance coverage: improved but incomplete for the reasons documented above.

## Task 2: judgment calls

### 1. Should scroll-coupled field morphing exist at all?

**Recommendation: cut the per-section morph; retain the particle identity.**

This is not primarily a performance objection. The current mapping is conceptually incorrect:

- Both Featured Work cards occupy the same desktop grid row.
- `lib/three/field.ts` selects the nearest registration using vertical distance only.
- Both project cards therefore score zero simultaneously.
- Insertion order wins, leaving the Chess brain active behind Airport Routing and making the globe effectively unreachable on desktop.
- After UW–Madison, no later major section registers a target, so DNA persists through How I Work, Core Stack, education, and contact.
- The revised screenshots visibly show this semantic leak.

Recommended visual model:

- Keep the animated scatter/particle field in the Intro.
- Fade into one sparse, neutral, static or slowly ambient field below the Intro.
- Do not assign semantic shapes to sibling cards.

If morphing is retained, register only major page sections, add a neutral Profile target, select projects using more than vertical proximity, invalidate the canvas after measurement updates the target, and fade the field earlier beneath content.

### 2. Should Projects remain above Experience?

**Yes, keep Projects first.**

The Intro already establishes current Boeing credibility. Featured Work then answers “what can this person build?” with runnable proof, while Experience answers “has this person shipped professionally?” immediately afterward. Moving Experience first would make the top of the page feel more like a résumé duplicate and delay the only inspectable artifacts.

The condition is mobile navigation: visitors need a direct Experience route instead of being forced through two stacked project cards.

If project cards remain architecture-only summaries indefinitely, Experience-first may eventually become the more credible ordering. If the projects gain ownership, rationale, and validation evidence, the current order is stronger.

### 3. Was removing Lenis the right choice?

**Yes. Keep native scrolling.**

No meaningful part of the visual identity requires scroll easing. The native page is faster to inspect and more predictable across keyboard, touch, assistive technology, browser Find, and anchor navigation.

### 4. Is `frameloop="demand"` behaving correctly?

The settlement math is reasonable; the wake integration is fragile.

- The dwell plateaus and settlement tolerance are tight enough that the field should not intentionally freeze halfway between shapes.
- The Intro intentionally never settles because idle drift remains active, so “demand” still means continuous rendering while the Intro owns most of the viewport.
- Section measurement updates `field.target` in one animation callback.
- `FrameWaker` invalidates independently from the scroll event.
- If a demand frame consumes the old settled target before measurement writes the new target, measurement itself does not request another frame. Correctness currently depends on listener/callback ordering.
- The performance governor requires roughly 5.5 seconds of continuous rendering before it can classify and degrade performance.

If per-section morphing is removed, much of this complexity disappears. If it remains, target measurement should explicitly wake the canvas after committing a new target.

### 5. Is the first contact click fixed?

The original common failure is fixed, but the interaction is not fully deterministic.

- Cold/not-ready click: native email client may open.
- Warm/ready click: custom dialog opens.
- Rare post-import mounting or `showModal()` failure: click may still be prevented without either result.

A single deterministic interaction is preferable. Eager-loading the form is the simplest option; otherwise readiness needs to mean “mounted and operational,” not merely “module imported.”

## Task 3: known gaps and risk decisions

### Three.js bundle size

The reported size is essentially correct: the built Three/R3F chunk is about 194 KB Brotli and contains general Three.js machinery irrelevant to a one-draw-call point field.

Do not rewrite the effect in raw WebGL solely on bundle intuition. First place a lightweight eligibility and idle gate **outside** the dynamic Three import. Currently, reduced-motion, Save-Data, and unsupported-WebGL users can still download and parse the expensive chunk before the inner component decides not to render.

After real-device measurement, consider raw WebGL or a static asset only if parse/compile/runtime cost remains material.

### `failIfMajorPerformanceCaveat`

The current comment overclaims what the option guarantees. It is a best-effort browser hint, not proof of hardware acceleration and not a deterministic rejection of software rasterizers. SwiftShader passed during headless verification.

The comment/type documentation should not claim a hardware/software guarantee. The performance governor is the actual safety mechanism, although it reacts late and only to sustained frame time.

### Real-device and real-GPU testing

This is a P1 pre-release gap. Test at minimum:

- iPhone Safari
- Midrange Android Chrome
- Integrated-GPU or locked-down corporate laptop
- Cold load and quick-scroll behavior
- Orientation changes
- Enabling reduced motion during an active visit
- Save-Data behavior
- WebGL context creation and context loss
- Sustained thermals, battery, and frame stability
- Anchor jumps while the field is active

Headless SwiftShader results are useful regression evidence but not representative hardware evidence.

### Accessibility, Lighthouse, and contrast

Run:

- axe
- Manual keyboard navigation using actual Tab/Shift+Tab
- VoiceOver and NVDA
- 200% and 400% zoom/reflow
- WCAG text-spacing overrides
- Safari-specific keyboard and dialog behavior
- Lighthouse and Web Vitals measurement
- Manual contrast measurement for text, controls, focus states, and boundaries

A token-level calculation places resting card/input borders around **1.2:1** against their surroundings, below the expected 3:1 non-text component contrast threshold. Placeholder styling also appears unnecessarily faint. This is precisely the kind of defect that the current structural suite cannot detect.

### Production contact reliability

The contact route still has no meaningful abuse budget. Requests without an Origin are accepted, and same-origin checking is not bot protection. A script could consume the provider quota and make legitimate recruiter messages fail.

Before public traffic:

- Add Cloudflare or equivalent rate limiting/Turnstile controls.
- Remove single-signal silent success.
- Validate delivery and domain email authentication.
- Make timeout/retry behavior idempotent so a timed-out send cannot be duplicated by retry.

## Hiring-manager assessment

### What the new version proves well

- The candidate’s role and specialization are immediately understandable.
- Current Boeing experience and previous Expedia work appear early enough to establish credibility.
- Two projects can be compared without remembering content across six screens.
- Runnable demos and source actions are obvious.
- Metrics are visible and semantically related to their labels.
- Experience, methodology, résumé, and contact are all accessible in normal document flow.
- The visual identity is distinctive without controlling the entire interaction model.

### What it still does not prove

The project schema currently provides no explicit structural slots for:

- The measurable problem
- Vincent’s exact role and ownership
- Constraints
- Alternatives considered
- A decision and its rationale
- Tradeoffs accepted
- Validation method
- Benchmark hardware/load conditions
- Outcome versus a baseline

The critical panel question remains:

> What did you personally own, which alternative did you reject and why, and what changed under what test or benchmark conditions?

This is not a request to rewrite current copy. It is a recommendation to eventually add evidence slots or technical case-study/detail routes so the interface can present that information when Vincent supplies it.

## Remaining prioritized actions

### P0 — conversion critical

1. Eliminate the single-signal silent contact discard and false success.
2. Add meaningful abuse/rate controls so legitimate contact remains available.

### P1 — high-impact usability and release confidence

1. Replace the fixed three-column readout at sub-360px widths.
2. Remove per-card/per-role field morphing, or scope shapes to major sections and add a neutral Profile target.
3. Gate Three.js before dynamically importing it.
4. Run real-device, real-GPU, axe, contrast, zoom, screen-reader, Lighthouse, and Web Vitals audits.
5. Raise resting form/control boundary contrast.

### P2 — meaningful refinement

1. Make Contact a named section landmark.
2. Restore compact persistent section navigation on mobile.
3. Subscribe to live reduced-motion, viewport, orientation, and Save-Data changes.
4. Cap Experience prose width and use the empty right side deliberately.
5. Remove the notch motif or reserve it for one filled primary CTA.
6. Make dialog readiness mean mounted and operational rather than merely imported.

### P3 — polish and coverage

1. Align footer DOM order with mobile visual order.
2. Give inline profile links more generous touch targets.
3. Rename or strengthen verification assertions whose current labels overclaim their behavior.
4. Add tests for actual Tab order, cold/failing contact load, API lifecycle, focus restoration, WebGL target correctness, context loss, console errors, and failed requests.

## Final recommendation

Accept the Stage 1 structural direction. Do not restore the old hero sequence, capability rail, Lenis behavior, or scroll-gated content.

Before considering the branch production-ready, fix the contact false-success path and narrow readouts. Then simplify the field below the Intro and run the missing real-device/accessibility validation. After those changes, the largest remaining hiring weakness will be the absence of case-study evidence structure rather than UI quality.
