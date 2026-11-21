# Design Direction

Dial: ENERGY 3 / RHYTHM 3 / MOTION 3

## Design Read

Reading this as: Bilingual (ID/EN) interactive personal portfolio built with React, Vite, TypeScript, and Motion for prospective clients and hiring teams, in an expressive monochrome interaction-design studio style, dial ENERGY 3 / RHYTHM 3 / MOTION 3.

## Identity & Personality

- **Voice**: Direct, grounded, architectural. No generic portfolio cliches, no fabricated claims, no decorative clutter.
- **Visual Language**: Expressive Swiss-editorial monochrome with tactile interaction design. Warm archival paper in Light mode and matte obsidian in Dark mode, structured by hairline rules, sculptural display type, and oversized tabular index numerals (`01` to `03`).
- **Profile treatment**: Text-first without profile photography, paired with a clean typographic wordmark in the navigation bar.

## Color System (Verified WCAG AA)

Both themes are strictly monochrome (neutral ground, recessed surface, elevated surface, high-contrast ink, and inverted ink as the sole focal accent):

### Light Mode (Warm Archival Paper)
- `--bg`: `#F6F5F1`
- `--surface`: `#ECEAE3`
- `--surface-elevated`: `#FFFFFF`
- `--ink`: `#111110` (17.32:1 on bg, 15.69:1 on surface)
- `--ink-secondary`: `#474642` (8.66:1 on bg, 7.85:1 on surface)
- `--ink-muted`: `#595853` (6.54:1 on bg, 5.92:1 on surface)
- `--border-strong`: `#6E6D67` (4.76:1 on bg, 4.31:1 on surface; >= 3.0:1 non-text contrast)
- `--border-subtle`: `#CFCBC2` (structural hairline dividers only)

### Dark Mode (Matte Obsidian)
- `--bg`: `#0E0E0D`
- `--surface`: `#181816`
- `--surface-elevated`: `#20201D`
- `--ink`: `#F3F2EC` (17.22:1 on bg, 15.85:1 on surface, 14.56:1 on elevated)
- `--ink-secondary`: `#C5C3BA` (10.93:1 on bg, 10.07:1 on surface, 9.25:1 on elevated)
- `--ink-muted`: `#A4A29A` (7.55:1 on bg, 6.95:1 on surface, 6.39:1 on elevated)
- `--border-strong`: `#8C8A82` (5.59:1 on bg, 5.14:1 on surface, 4.72:1 on elevated)
- `--border-subtle`: `#2E2E2A` (structural hairline dividers only)

## Typography

- **Display (`Bricolage Grotesque`)**: Expressive optical-size neo-grotesque chosen so pure black-and-white headlines carry sculptural tension instead of reading like a clinical wireframe.
- **Body & UI (`Plus Jakarta Sans`)**: Clean humanist geometric sans-serif designed for sharp bilingual readability across Indonesian and English prose at all screen sizes.
- **Index Metadata (`IBM Plex Mono`)**: Restricted exclusively to small tabular indices (`01`, `02`, `03`), frame ratios, scroll telemetry, and structural coordinates; never used for large headings.

## Interaction Design & Motion Choreography (MOTION 3)

Every motion uses `motion/react` spring physics or scroll-linked transforms, wrapped in `<MotionConfig reducedMotion="user">` so OS reduced-motion preferences disable non-essential motion immediately. Zero endless pulsing or floating loops exist.

1. **Dual-Circle Trailing Cursor**: Desktop fine-pointer cursor with a zero-lag solid center dot (`8px`, morphing to an I-beam on text inputs) and a spring-delayed outer stroke ring (`34px`, expanding on interactive controls) using `mix-blend-mode: difference` for guaranteed contrast across Light and Dark surfaces. Native OS cursor is hidden via `html.has-custom-cursor` on desktop `pointer: fine` (owner-approved R-37 override on R-39; touch devices and no-JS fallback keep native cursors).
2. **Text-Roll Micro-Interaction & Theme-Aware Selection**: Primary CTAs and nav links roll their typography cleanly inside an overflow mask on hover/focus, and `::selection` adapts automatically to the active Light/Dark monochrome palette (`--ink` background with `--ink-inverted` text).
3. **Spring Magnetic Controls**: Focal CTA, theme switcher, and back-to-top button respond subtly (+/- 8px max) to fine-pointer proximity.
4. **Scroll-Driven & Ticker Kinetic Layers**: Spring-smoothed top progress bar, parallax section index numerals (`01`..`03`), and a continuous seamless ticker band (`kinetic-band`) that auto-runs continuously and pauses immediately on hover (owner-approved R-37 override on R-39 for auto-running ticker without a separate pause button).
5. **Shared-Element `layoutId` Morphs**: Sliding inverted ink indicator across header nav active section, ID/EN language switch, and Tech Stack ARIA tabs.
6. **Interactive Hover-Expand Capabilities & 2-Column Split Works Stage**: Capabilities (`01`..`04`) expand inline details smoothly on hover/focus; Selected Works (`01`..`04`) smoothly morph from a full-width 1-column ledger into a 2-column side-by-side split on hover/focus, sliding the full project sheet in on the right and collapsing back to 1 column when the pointer leaves.

## One-Line Decision Log (R-31)

- **Color**: Warm bone paper and matte obsidian keep the monochrome palette tactile while preserving >= 5.9:1 text contrast and >= 4.3:1 control borders in both modes.
- **Accent**: Solid inverted ink (`--ink` background with `--bg` text) is reserved for key focal controls and shared-element active indicators so hierarchy stays crisp without adding hue.
- **Typography**: `Bricolage Grotesque` gives distinctive editorial character outside the AI default roster, paired with `Plus Jakarta Sans` for ID/EN body legibility and `IBM Plex Mono` for tabular metadata.
- **Layout**: Sections vary intentionally (`RHYTHM 3`) across sculptural hero + continuous ticker band, asymmetric sticky about + hover-reveal capabilities + ARIA-tabbed tech stack with monochrome brand marks, 1-to-2 column hover split works stage, two-column interactive contact, and compact two-band colophon footer.
- **Background (R-07)**: An airy monochrome stroke-ring field (`InteractiveBackground.tsx`) echoes the dual-circle custom cursor; quiet micro-rings (`1.6px`, `0.10`-`0.12` alpha) swell into crisp thin rings along a decaying cursor trace and click ripples, sleeping RAF automatically when idle so copy readability stays intact.
- **Tech Stack Icons (R-04)**: Official monochrome brand SVGs (`simple-icons` plus geometric SQL/Adobe marks) accompany each stack label so visitors can scan technologies quickly while maintaining strict monochrome consistency in both themes.
- **Footer ASCII Landscape (R-06 / R-19)**: An interactive sky-free monochrome ASCII landscape (`FooterAsciiScene.tsx`) derived from the owner's alpine mountain, grass, and wildflowers photograph (`/images/foto-footer-cutout.webp`) anchors the bottom of the footer with adaptive Light/Dark tonal ramps; characters recoil smoothly on pointer collision with damped spring return and auto-sleep RAF when settled (`aria-hidden="true"` on the decorative canvas while semantic colophon links remain above).
- **3D Monochrome Splash Screen**: A brief (~2.6s) GPU-composited CSS 3D opening curtain (`SplashScreen.tsx`) tumbles an extruded 3D prism of the `dankara.svg` mark inside twin counter-rotating 3D orbital rings with a tabular `000%` to `100%` counter, lifts cleanly upward on completion (with instant `SKIP` / `Escape` dismiss), leaves `<main>` mounted in the DOM for SEO crawlers, and uses CSS keyframes so it plays reliably even on Windows machines where OS animation effects default to reduced motion (owner-requested R-37 override).
- **Placeholders**: All personal info, skills, tech stack items, project frames, and unlinked socials are explicitly bracketed placeholders centralized in `src/data/portfolio.ts` so zero fabricated facts appear disguised as final data.
