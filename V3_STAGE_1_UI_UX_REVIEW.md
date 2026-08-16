# V3 Stage 1 UI/UX Review and Implementation Brief

## Purpose

This document converts the portfolio audit into an implementation brief for Claude.

The priority is the visitor experience: information architecture, visual hierarchy, responsive behavior, accessibility, navigation, interaction cost, and conversion. Do not spend implementation time fact-checking metrics, simplifying technical jargon, or rewriting domain-specific project claims unless Vincent explicitly asks for that later.

## Working constraints

- Work only on branch `v3_stage_1`.
- Preserve all unrelated modified and untracked files already in the working tree.
- Do not commit or push. Vincent intends to review and commit the work himself.
- Preserve the portfolio's distinctive black, green, monospace, and particle-field identity.
- Prefer a simpler, faster interaction over another decorative interaction.
- Content/statistical issues are owner-managed. Do not block UI work on phrases such as "thousands of papers," benchmark details, or technical terminology.

## Ruthless summary

The portfolio is visually memorable and technically polished, but its current structure is conversion-hostile. It behaves like an impressive WebGL presentation wrapped around resume bullets rather than a portfolio a hiring manager can scan quickly.

The dominant problem is not the color palette or typography. It is the forced journey:

- Six stages consume approximately `630vh` before the visitor reaches normal-flow content.
- Only one stage exists in the DOM at a time.
- Visitors cannot directly open or compare projects.
- The second major section introduces another unusual scroll interaction.
- Short and narrow viewports clip important content and actions.
- Decorative emphasis is stronger than evidence and navigation.

Within ten seconds, a hiring manager should be able to identify Vincent's role, see the two flagship projects, open either project, reach the resume, and contact him. The current experience does not meet that bar.

## What is already strong

- Consistent max-width alignment and gutters.
- Clear display/body/monospace font roles.
- Disciplined black and phosphor-green palette.
- Memorable particle illustrations tied to each subject.
- Generally strong focus styling and 44px touch targets.
- Contact form already includes loading, success, error, timeout, and direct-email states.
- WebGL failure containment and progressive-enhancement intent are thoughtful.

Keep those strengths while simplifying the journey.

## Priority order

### P0 - Fix before visual polish

#### 1. Replace the `630vh` forced sequence with a scannable work journey

Current implementation:

- `components/three/hero-sequence.tsx:12-49`
- Six stages receive `105vh` each.
- The sticky viewport shows one active stage at a time.

Required outcome:

- Keep one visually strong animated introduction.
- Follow it with normal-flow, anchored work/experience sections that can be scanned and compared.
- Make Chess and Airport Routing visible as project destinations without requiring five full-screen scroll transitions.
- A visitor must be able to use browser Find, Page Down, keyboard navigation, and direct anchors predictably.

An acceptable compromise is a shorter animated introduction followed by static project cards or case-study previews. Do not preserve six full-screen stages merely because the particle morphs already exist.

#### 2. Keep all work content and project links in the semantic DOM

Current implementation:

- `components/three/hero-sequence.tsx:36-40`
- `components/three/hero-sequence.tsx:75-133`
- Only `stages[stage]` is rendered.

Impact:

- Screen readers, crawlers, no-JS visitors, and keyboard users receive only the active stage.
- Project links mount only at exact scroll positions.
- The page `<h1>` changes identity as the user scrolls.
- A focused link can disappear when the stage changes.

Required outcome:

- Use one stable page `<h1>` for Vincent's identity.
- Render every stage/project in semantic order using sections or an ordered list of articles.
- Use `<h2>` headings for work/project sections.
- If a sticky visual projection remains, treat it as presentational and `aria-hidden`; do not make it the only copy of the content.

#### 3. Fix responsive clipping and overflow

Verified live failures:

- At `320x568`, the top navigation extends beyond the viewport and clips the Email action.
- At `844x390`, the fixed header covers the stage title.
- At `844x390`, project buttons fall below the `h-dvh overflow-hidden` panel.
- At `844x390`, the capability rail hides its heading, lower body content, tools, and progress indicator.

Relevant files:

- `components/top-bar.tsx:47-107`
- `components/three/hero-sequence.tsx:49-132`
- `components/profile/capability-rail.tsx:34-37`
- `components/profile/capability-rail.tsx:123-183`
- `app/page.tsx:32-36`

Required adjustments:

- Add an extra-small header layout around `359px` and below.
- Shorten the brand or make Resume icon-only at the smallest width.
- Hide GitHub and LinkedIn labels until at least `md`; do not show all labels merely because width exceeds `sm`.
- Wrap stage readouts into a responsive grid.
- Do not combine large fixed content blocks with `h-dvh overflow-hidden` on short screens.
- Gate pinned layouts on minimum height as well as width. Below roughly `700px` tall, use normal-flow content.
- Add short-height typography and spacing rules where needed.

#### 4. Prevent false-success contact submissions

Current implementation:

- `components/sections/contact-dialog.tsx:233-248` names the honeypot `company`.
- `app/api/contact/route.ts:159-165` silently reports success if that field is populated.

Impact:

Browsers and password managers can autofill a normal `company` field. A legitimate recruiter can then see "Message sent" even though no email was delivered.

Required outcome:

- Do not silently discard a message based only on this common autofill field.
- Use a non-semantic trap combined with more reliable server-side abuse controls, or remove this single-signal behavior.
- The UI must never show success for a known discarded legitimate-looking submission.

### P1 - High-impact experience improvements

#### 5. Add direct work navigation

Current header:

- `components/top-bar.tsx:56-108`
- About, Resume, GitHub, LinkedIn, and Email are present.
- There is no Work or Projects destination.

Required outcome:

- Add a persistent `Work` navigation item.
- Add named anchors for flagship projects.
- Make project navigation visible without requiring users to interpret stage ticks.
- Keep Resume and contact prominent.

Suggested recruiter journey:

1. Intro
2. Featured work
3. Experience/profile
4. Resume/contact

#### 6. Replace or simplify the pinned capability rail

Current implementation:

- `components/profile/capability-rail.tsx:69-90`
- Vertical scroll translates a horizontal rail.
- Cards tilt, scale, and fade based on distance from the viewport center.

Problems:

- It introduces a second unusual scroll model after an already long hero.
- Screenshots 7-9 show off-center cards becoming functionally unreadable.
- The whole-card opacity can fall to `0.5` while the body text already uses a muted token.
- On short screens, the fixed `22rem` cards cannot fit with the heading and progress UI.

Preferred outcome:

- Replace it with a static responsive two- or four-column grid.

If the rail is retained:

- Floor opacity at approximately `0.85` or remove opacity animation entirely.
- Do not reduce body-text contrast to indicate position.
- Disable pinning on short-height viewports.
- Ensure all card content fits without clipping.

#### 7. Make evidence and actions visually stronger than decoration

Current hierarchy favors giant Bebas headlines and particle illustrations. Project evidence, readouts, and links are significantly smaller and quieter.

Required outcome:

- Give project summaries, outcomes, and actions more visual weight.
- Reduce the particle field's dominance where it competes with text.
- Keep body text comfortably readable without relying on heavy text shadows.
- Standardize the readout area as a fixed three-column grid rather than a content-sized `inline-block` (`components/three/hero-sequence.tsx:92-105`).

#### 8. Make reduced-motion and no-WebGL experiences genuinely simple

Relevant files:

- `components/three/hero-sequence.tsx:12-49`
- `components/three/morph-scene.tsx:59-80`
- `components/three/morph-scene.tsx:168-191`
- `components/three/morph-field.tsx:217-273`

Current behavior:

- Reduced motion still receives a `630vh` track, scroll-driven stage swaps, geometry morphs, and camera changes.
- No-WebGL visitors retain the long sequence but lose the entire right-side visual subject.

Required outcome:

- Reduced motion should receive normal-flow sections and a static visual or no canvas.
- No-WebGL should receive normal-flow content, not empty cinematic screens.
- Avoid `frameloop="always"` when the visual is effectively static or receded.

#### 9. Remove artificial scroll drag

`components/three/smooth-scroll.tsx:19-30` adds Lenis with a `1.05s` duration.

Prefer native scrolling. If Lenis remains, substantially shorten the duration and verify trackpad, wheel, keyboard, anchor, and reduced-motion behavior. Recruiters should be able to scan rapidly.

#### 10. Fix the contact dialog's first-click fallback

Relevant files:

- `components/contact/contact-provider.tsx:13-21`
- `components/contact/contact-provider.tsx:71-89`
- `components/contact/contact-trigger.tsx:28-37`

Current behavior:

`open()` returns true and prevents the native `mailto:` before the lazy dialog chunk has loaded. On a slow or failed first request, the click can appear dead.

Required outcome:

- Only prevent the `mailto:` default once the dialog is ready, or eagerly load the small form.
- A failed first click must fall back during that same activation.

### P2 - Simplification and interaction polish

#### 11. Reduce decorative motif density

The interface currently combines:

- Particle field
- Scan lines
- Blueprint grid
- Corner brackets
- Clipped/notched buttons
- Monospace labels
- Wide tracking
- Decorative underscores
- `SYS` chapter numbering

Keep at most two or three signature motifs. Recommended core: particle field, monospace instrumentation, and restrained green accents. Remove most scan lines, corner brackets, and decorative underscores.

The implementation is not visually inconsistent; it is over-specified.

#### 12. Reduce the tech-chip wall

`components/profile/profile-section.tsx:77-103` renders more than thirty chips.

Required outcome:

- Cut the visible list by roughly half.
- Group or prioritize tools most relevant to the target roles.
- Use capabilities and projects to demonstrate tools in context.
- Keep the Resume as the exhaustive inventory.

Do not rewrite the technical terminology itself; this is a hierarchy and density change.

#### 13. Improve dialog behavior on small and short screens

Relevant files:

- `components/sections/contact-dialog.tsx:107-112`
- `components/sections/contact-dialog.tsx:141-160`
- `components/sections/contact-dialog.tsx:269-299`

Required adjustments:

- Add explicit `max-height: calc(100dvh - 2rem)` and `overflow-y: auto`.
- Allow the bottom action row to wrap or stack.
- After success replaces the form, move focus to the confirmation heading or Close button.
- Add `aria-busy` while sending.
- Keep the direct-email fallback visible and usable.

#### 14. Make reveal effects fail safely for keyboard users

Relevant files:

- `components/scroll-reveal.tsx:10-28`
- `app/globals.css:242-257`

Required outcome:

- Construct and verify `IntersectionObserver` before adding the class that hides content.
- Reveal immediately on `:focus-within` or focus entry.
- A keyboard target must never receive focus while invisible.

#### 15. Standardize progress and action language

- Resolve the `00` side-index versus `01 / 06` footer mismatch.
- Avoid labeling Profile `06` in a way that looks like a seventh stage after a six-stage total.
- Standardize `Play it` and `Live demo`.
- If the header CTA opens an in-page form, label it `Message` rather than `Email`.

### P3 - Semantic and system polish

- Convert readouts to `<dl>`, `<dt>`, and `<dd>` in `components/three/hero-sequence.tsx:92-105`.
- Add `tabIndex={-1}` to the skip-link target `<main>` in `app/page.tsx:38-57`.
- Align footer DOM order with visual order instead of using `order-first` in `app/page.tsx:59-94`.
- Move hard-coded shader greens into shared visual tokens.
- Add automated browser coverage for the acceptance criteria below.

## Owner-managed content notes - not Claude's current priority

Vincent will handle factual and narrative accuracy separately. Do not spend this stage researching or rewriting:

- The "thousands of papers" phrasing.
- Benchmark methodology and numerical substantiation.
- Technical jargon or domain terminology.
- Employer/project ownership wording.
- Case-study trade-off copy that requires Vincent's firsthand knowledge.

It is acceptable to preserve the current copy while restructuring how it is presented. Do not invent missing facts to make a layout feel complete.

## Acceptance criteria

### Navigation and scanning

- A visitor can reach Featured Work, each flagship project, Profile, Resume, and Contact directly.
- All project headings, summaries, readouts, and links exist in the DOM without scrolling through state changes.
- Browser Find can locate Chess, Airport Routing, Boeing, Expedia, and Research simultaneously.
- One stable page `<h1>` is used.

### Responsive behavior

Verify at minimum:

- `320x568`
- `390x844`
- `844x390`
- `1280x720`
- `1440x900`

At every size:

- No horizontal overflow or clipped header actions.
- Fixed navigation does not cover headings.
- Project CTAs remain visible and reachable.
- Readout values wrap without collision.
- No pinned section hides content on a short viewport.
- Contact dialog actions remain reachable.

### Accessibility and fallback

- Keyboard users can reach every project and CTA in logical order.
- Focused elements are never hidden by opacity or reveal animation.
- Reduced motion uses a static/normal-flow presentation.
- No-WebGL and no-JS modes still expose all core work content and links.
- Contact success receives focus or an equivalent reliable announcement.

### Visual hierarchy

- No essential body copy is rendered below approximately 85% opacity for positional emphasis.
- Project evidence and actions are at least as visually salient as decorative metadata.
- Decorative motifs have been reduced without erasing the site's identity.
- The tech stack reads as curated, not exhaustive keyword inventory.

## Recommended implementation order

1. Restructure `HeroSequence` and render all work semantically.
2. Add Work/project navigation and anchors.
3. Fix short-height and 320px responsive layouts.
4. Replace or simplify `CapabilityRail`.
5. Correct contact false-success and first-click behavior.
6. Add reduced-motion/no-WebGL normal-flow fallbacks.
7. Reduce motif and tech-chip density.
8. Finish dialog, reveal, semantics, and naming polish.
9. Run the full acceptance matrix.

## Verification commands

Run before handoff:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Do not treat passing static checks as sufficient. Responsive and keyboard browser checks are required because the highest-priority failures are interaction and layout problems.
