---
title: 'refactor: Improve About Page Mobile Layout'
type: refactor
status: active
date: 2026-04-06
---

# refactor: Improve About Page Mobile Layout

## Overview

The About page currently renders well on desktop but has several layout and typography issues on mobile. Fixed heading sizes (3rem), fixed widths in the hero tagline row, a very tall hero image height, and unscaled section padding all make the mobile experience feel cramped and oversized. This plan addresses those issues by applying responsive Tailwind variants at the right breakpoints, following the patterns already established in the rest of the codebase.

## Problem Frame

The About page was built desktop-first. When viewed on a mobile device (< 768px):

- The hero image is 53rem tall (`h-212`) — takes up most of the viewport with no adjustment
- The "We are HEIJO" title renders at `text-5xl` (3rem) — very large for a narrow screen, and has a `mb-30` (7.5rem!) bottom margin pushing content far down
- "Our service" titles also use `text-5xl` with no responsive scaling
- The tagline paragraph below the main title has a fixed `w-75` (18.75rem) width and sits in a `flex gap-x-12` row with no wrapping — risks overflow or severe compression on narrow phones
- `Section.astro` applies `px-8 py-20` (2rem / 5rem) unconditionally — the horizontal padding is double what the rest of the site uses on mobile (`px-4` in `WorksLayout`)

## Requirements Trace

- R1. Hero image height must be responsive — visually appropriate on mobile without cropping awkwardly
- R2. All headings in About components must scale down for mobile using responsive typography variants
- R3. The Section 1 tagline row must not overflow or compress on narrow viewports
- R4. Section container padding must align with site-wide mobile conventions (`px-4` on mobile)
- R5. Changes must not alter the desktop layout — all existing `md:` behaviour is preserved
- R6. Component changes must remain backward-compatible — no new required props
- R7. For service sections (2–4), the image must appear before the title and description on mobile

## Scope Boundaries

- Does not change desktop layout (everything at `md:` and above stays the same)
- Does not touch navigation, footer, or other pages
- Does not restructure the slot architecture of `Section.astro`
- Section 1 ("We are HEIJO") visual slot ordering is not changed — its visual slot contains description text, not an image, so content-first ordering is correct there

## Context & Research

### Relevant Code and Patterns

- Responsive typography reference: `src/pages/works/[category]/[...slug].astro` — uses `text-3xl md:text-5xl` pattern
- Responsive grid gap reference: `src/components/Works/ProjectItem.astro` — uses `sm:text-base` scaling
- Mobile padding reference: `src/layouts/WorksLayout.astro` — `px-4 md:px-0` on mobile
- Mobile image ordering reference: `src/pages/works/[category]/[...slug].astro` — uses `order-1 md:order-2` pattern
- Site-wide mobile pivot: `md:` (768px) is the canonical breakpoint used throughout; `sm:` is used secondarily for grid column changes

### External References

- None needed — local patterns are sufficient for all changes

## Key Technical Decisions

- **Responsive typography via Tailwind modifiers, not new props:** Adding responsive size variants directly in the component classes (e.g. `text-3xl md:text-5xl`) rather than exposing a `size` prop keeps the components simple and avoids changing callsites
- **`mb-30` on `MainTitle` needs mobile reduction:** `mb-30` (7.5rem) is extremely large on mobile. It should scale down to around `mb-12` (3rem) or `mb-16` (4rem) at small sizes, keeping `md:mb-30` for desktop
- **Tagline row flex → wrap-friendly on mobile:** The `flex gap-x-12` row with fixed `w-75` paragraph should allow the paragraph to take full width on mobile (`w-full md:w-75`) and reduce the gap (`gap-x-4 md:gap-x-12`). Alternatively the row can be made `flex-wrap` so it collapses naturally
- **Hero height: use a stepped scale** — `h-64 sm:h-96 md:h-212` gives a reasonable mobile height (~256px), a tablet intermediate, and the full desktop 53rem
- **Section padding: `px-4 py-12 md:px-8 md:py-20`** — aligns with the `px-4` pattern used elsewhere in the site on mobile
- **Mobile image-first via `mobileVisualFirst` prop on `Section.astro`:** Section 1's visual slot is description text, not an image — applying a universal ordering flip would show description paragraphs before the main title, which is wrong. A boolean prop (`mobileVisualFirst`, default `false`) lets `about.astro` opt in for sections 2–4 only. When `true`, the visual div gets `order-1` and the content div gets `order-2`; at `md:` both reset to `order-none` so the existing `imagePosition` desktop logic is unchanged. For `imagePosition="left"` sections the existing `md:order-1` / `md:order-2` classes still apply cleanly.

## Open Questions

### Resolved During Planning

- **Should `Subtitle` also scale?** Yes — `text-2xl` at 1.5rem is acceptable on mobile but `text-xl md:text-2xl` would be more consistent. Low-risk, include in the same pass.
- **Should the `Description` component font size change?** No — `text-base` (1rem) is already correct for body text on mobile.
- **Should images appear before content on mobile for service sections?** Yes — confirmed by project owner. Sections 2–4 will use `mobileVisualFirst={true}`. Section 1 is excluded since its visual slot is description text, not an image.

### Deferred to Implementation

- None.

## Implementation Units

- [ ] **Unit 1: Responsive hero image height**

**Goal:** Scale the About hero image height gracefully from mobile to desktop

**Requirements:** R1

**Dependencies:** None

**Files:**

- Modify: `src/pages/about.astro`

**Approach:**

- Replace the fixed `h-212` class on the hero `<Image>` with a stepped responsive height: `h-64 sm:h-96 md:h-212`
- `h-64` (256px) is generous enough to feel impactful on mobile without dominating the viewport

**Patterns to follow:**

- Index page hero uses `h-full w-full object-cover` for a full-bleed approach; the About hero can stay object-cover with explicit height since it is not full-viewport

**Test scenarios:**

- Test expectation: none — pure styling change, no behavior

**Verification:**

- Hero image is not viewport-height on mobile; transitions through a medium height on tablet; reaches full desktop height at md:

---

- [ ] **Unit 2: Responsive "We are HEIJO" tagline row**

**Goal:** Prevent the hr + tagline paragraph row from overflowing or compressing on narrow viewports

**Requirements:** R3

**Dependencies:** None

**Files:**

- Modify: `src/pages/about.astro`

**Approach:**

- The container `<div class="flex w-full gap-x-12">` should allow wrapping on mobile: add `flex-wrap` and reduce gap to `gap-x-4 md:gap-x-12`
- The tagline `<p class="... w-75 text-2xl">` should be full-width on mobile: add `w-full md:w-75`
- The `<hr class="w-30 self-end">` can stay as-is or also get `w-full md:w-30` if needed — the `self-end` alignment will handle it when stacked

**Patterns to follow:**

- No direct existing pattern for this element; follow Tailwind mobile-first convention

**Test scenarios:**

- Test expectation: none — pure styling change

**Verification:**

- The tagline row does not overflow at 375px viewport; paragraph reads comfortably at full width on mobile

---

- [ ] **Unit 3: Responsive typography in About components**

**Goal:** Scale MainTitle, Title, and Subtitle heading sizes down for mobile

**Requirements:** R2

**Dependencies:** None — components are independently modified

**Files:**

- Modify: `src/components/About/MainTitle.astro`
- Modify: `src/components/About/Title.astro`
- Modify: `src/components/About/Subtitle.astro`

**Approach:**

- `MainTitle`: `text-5xl` → `text-3xl md:text-5xl`; `mb-30` → `mb-12 md:mb-30`
- `Title`: `text-5xl` → `text-3xl md:text-5xl`
- `Subtitle`: `text-2xl` → `text-xl md:text-2xl`
- These are the only changes needed — existing `font-medium tracking-wide` and other classes remain

**Patterns to follow:**

- `src/pages/works/[category]/[...slug].astro` — uses `text-3xl md:text-5xl` for page-level headings

**Test scenarios:**

- Test expectation: none — pure styling change, no behavioral logic

**Verification:**

- Headings render at a comfortable size on a 375px viewport; desktop layout is visually unchanged

---

- [ ] **Unit 4: Section container — responsive padding and mobile visual ordering**

**Goal:** Reduce padding on mobile and add opt-in image-first ordering for service sections

**Requirements:** R4, R7

**Dependencies:** None

**Files:**

- Modify: `src/components/About/Section.astro`
- Modify: `src/pages/about.astro`

**Approach:**

_Padding:_

- `px-8 py-20` → `px-4 py-12 md:px-8 md:py-20`
- `px-4` (1rem) matches `WorksLayout.astro`'s mobile padding

_Mobile visual ordering:_

- Add optional `mobileVisualFirst?: boolean` prop (default `false`) to `Section.astro`
- When `true`: visual div gets `order-1 md:order-none`, content div gets `order-2 md:order-none`
- The existing `md:order-1` / `md:order-2` classes for `imagePosition="left"` remain and take precedence at `md:` since they are more specific breakpoint classes
- In `about.astro`: pass `mobileVisualFirst={true}` to sections 2, 3, and 4 (the service sections with real images); Section 1 omits it (defaults to `false`)

**Patterns to follow:**

- `src/pages/works/[category]/[...slug].astro` — `order-1 md:order-2` ordering pattern
- `src/layouts/WorksLayout.astro` — `px-4 md:px-0` mobile padding pattern

**Test scenarios:**

- Test expectation: none — pure layout/spacing change

**Verification:**

- On mobile (< 768px): service section images render before their title and description; Section 1 description renders after the title
- On desktop (≥ 768px): all section layouts are visually unchanged
- Section padding matches site-wide mobile conventions

## System-Wide Impact

- **Interaction graph:** `Section.astro` is used only on `src/pages/about.astro` — no other pages are affected
- **Typography components scope:** `MainTitle`, `Title`, `Subtitle`, `Description`, `Link`, `Visual` are all under `src/components/About/` and used exclusively on the About page
- **Unchanged invariants:** Desktop layout (`md:` and above) must not change visually — all changes are mobile-only (below `md:`)

## Risks & Dependencies

| Risk                                                                                                                        | Mitigation                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `md:mb-30` on MainTitle may not apply if a consumer passes a `class` override via `class:list` that includes its own margin | Confirmed: `about.astro` passes no margin override to `MainTitle`; risk is low                                                                                                                             |
| Reducing `py-20` to `py-12` on mobile might feel too tight for the "We are HEIJO" section                                   | Preview on device; can increase to `py-16` if needed without affecting desktop                                                                                                                             |
| The `w-full md:w-75` on the tagline paragraph may feel less architectural than the fixed-width desktop treatment            | Acceptable trade-off — architectural feel on mobile is better served by typography scale than fixed widths                                                                                                 |
| `order-1 md:order-none` on visual div may conflict with existing `md:order-1` class when `imagePosition="left"`             | Both `md:order-none` (order:0) and `md:order-1` (order:1) would be present — last wins in CSS; since the `imagePosition` classes are applied after in `class:list`, they win correctly. Verify in browser. |

## Sources & References

- Related code: `src/components/About/Section.astro`, `src/components/About/MainTitle.astro`, `src/pages/about.astro`
- Pattern reference: `src/layouts/WorksLayout.astro`, `src/pages/works/[category]/[...slug].astro`
