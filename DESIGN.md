---
name: Wisely AI Threat Intelligence
description: Analyst operations dashboard for threat lookup, API keys, and user management.
colors:
  page: "#ebf1f1"
  surface: "#ffffff"
  surface-weak: "#f6f8fa"
  surface-muted: "#f3f4f6"
  navy: "#182230"
  navy-chip: "#2e415c"
  primary: "#256dec"
  primary-tab: "#1c73e8"
  primary-base: "#375dfb"
  avatar: "#155dfc"
  text-main: "#0a0d14"
  text-title: "#101828"
  text-body: "#1a1a1a"
  text-sub: "#525866"
  text-soft: "#868c98"
  text-tab-inactive: "#667085"
  stroke: "#e2e4e9"
  stroke-table: "#ededed"
  success-bg: "#d1fae5"
  success-text: "#065f46"
  danger: "#dc2626"
  danger-bg: "#fdf6f6"
  warning-text: "#b45309"
  warning-bg: "#fef3c7"
  info-bg: "#dcecff"
  method-get-bg: "#e0f2fe"
  method-get-text: "#0369a1"
typography:
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "-0.3125px"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "-0.084px"
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "normal"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "normal"
rounded:
  badge: "4px"
  sm: "8px"
  nav: "10px"
  md: "12px"
  pill: "28px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-base}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    typography: "{typography.body}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-sub}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    typography: "{typography.body}"
  button-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "8px 14px 8px 12px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.sm}"
    height: "42px"
    padding: "10px 14px"
  nav-item-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.nav}"
    height: "48px"
  badge-active:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success-text}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: Wisely AI Threat Intelligence

## Overview

**Creative North Star: "The Intelligence Desk"**

This is an operate surface for threat analysts: look up identifiers, manage API keys, and administer users. The visual world is a mint-paper operations floor with a navy chrome bar. Surfaces are white cards on a cool page, not a white-canvas SaaS template. Color is quiet except for one family of blues used as the action voice.

Density is desktop-first and scan-oriented. Tables, tabs, and labeled fields do the work. Ornament, illustration, and motion are not part of the language. Figma Handoff frames are the composition source; this file is the theme those frames are restyled into.

**Key Characteristics:**
- Mint page (`#ebf1f1`) with navy top bar (`#182230`)
- Inter only, 400–700; no display serif
- 8px controls, 12px cards, 4px badges
- Blue for action, tabs, and focus — never as page fill
- Status is a tinted pill, not a saturated block of color

## Colors

The palette is cool neutrals plus one blue family. Semantic greens, reds, and ambers exist only on badges, trends, and errors.

### Primary
- **Action Blue** (`{colors.primary}`): Header CTAs (Access Key, New user), focus rings on fields.
- **Tab Blue** (`{colors.primary-tab}`): 2px underline on the active tab.
- **Modal Blue** (`{colors.primary-base}`): Primary buttons inside dialogs (Create, Add user, Run).
- **Avatar Blue** (`{colors.avatar}`): User chip initials.

**The One Accent Rule.** Blue is the only loud color and it stays on actions, selection, and identity chips. Do not use it as a page, card, or table fill.

### Secondary
- **Navy Chrome** (`{colors.navy}`): Top bar and the active sidebar item. This is structure, not accent.
- **Navy Chip** (`{colors.navy-chip}`): The user menu pill on the top bar.

### Neutral
- **Mint Floor** (`{colors.page}`): App canvas. Always visible around cards.
- **Paper** (`{colors.surface}`): Cards, tables, modals, inputs.
- **Weak Paper** (`{colors.surface-weak}`): Table headers, metric label areas, result-card heads.
- **Ink** (`{colors.text-main}` / `{colors.text-title}`): Titles and primary values.
- **Slate** (`{colors.text-sub}`): Labels, secondary copy, inactive controls.
- **Mist** (`{colors.text-soft}`): Placeholders, metric captions, empty hints.
- **Hairline** (`{colors.stroke}`): Borders on cards, fields, tabs, and filters.

### Semantic
- **Clear** (`{colors.success-bg}` / `{colors.success-text}`): Active, success, LOW confidence.
- **Alert** (`{colors.danger-bg}` / `{colors.danger}`): Errors, INACTIVE/expired, HIGH confidence, required asterisks.
- **Hold** (`{colors.warning-bg}` / `{colors.warning-text}`): PENDING.
- **Notice** (`{colors.info-bg}`): Informational banners in modals.

**The Mint Floor Rule.** White is a surface that sits on mint. A full-bleed white main pane is off-brand.

## Typography

**Display Font:** Inter (system-ui, -apple-system)
**Body Font:** Inter
**Label/Mono Font:** System UI monospace stack for JSON and pattern IDs

**Character:** Neutral, slightly tight letter-spacing on UI labels. Weight does the hierarchy; size stays in a narrow 12–24px band.

### Hierarchy
- **Title** (600, 24px / 32px): Page titles (API Management, Settings, Explore Intelligence, result identifiers).
- **Headline** (500, 16px / 24px): Sidebar nav labels.
- **Body** (400–500, 14px / 20px): Table cells, buttons, tabs, field values. Default UI size.
- **Label** (400–500, 12–13px / 16–20px): Metric captions, badges, helper text, timestamps.
- **Mono** (400, 13px / 20px): Playground JSON editors only.

Tab labels go 700 when they are the in-page nav (Access Keys, User Management). That weight is reserved for tabs, not body copy.

**The Narrow Band Rule.** Do not introduce 32px+ display type or a second family. Hierarchy is weight and color, not a new font.

## Layout

Desktop shell, not a responsive app. Minimum canvas is 1440px. Top bar is 74px navy; sidebar is 249px mint with 12px inset and 4px gaps between 48px-tall nav items. Main content maxes near 1191px with 16–32px padding.

Rhythm is 4px-based: 8, 12, 16, 24, 32. Cards use 12–16px internal padding. Toolbars are a single horizontal row (search left, filters and primary CTA right). Result screens use a two-column grid: fluid main + 284px related rail.

**The Desk Width Rule.** Do not collapse the sidebar or invent a mobile nav. New screens assume the 1440 shell.

## Elevation & Depth

Mostly tonal. Cards sit on mint via a 1px hairline; shadows are faint and structural, not theatrical.

### Shadow Vocabulary
- **Control** (`0px 1px 2px 0px rgba(228, 229, 231, 0.24)`): Header CTAs, filter chips, search fields.
- **Card** (`0px 1px 1px rgba(228, 229, 231, 0.24)`): Metric cards, playground panels.
- **Table** (`0px 4px 4px rgba(0, 0, 0, 0.04)`): Data table wrappers.
- **Modal** (`0px 20px 40px -4px rgba(10, 13, 20, 0.15)`): Dialogs only, over a 63% navy scrim.

**The Hairline-First Rule.** Prefer `{colors.stroke}` over a new shadow. Shadows appear on lifted surfaces (modals, tables), not on every tile.

## Shapes

Soft operational, not pill-everything.

- **Badges:** 4px — small and rectangular, not capsules unless the status is a tight 4px pill.
- **Controls:** 8px — buttons, inputs, filter chips, dropdowns.
- **Nav items:** 10px.
- **Cards / tables / result panels:** 12px.
- **User chip:** 28px (near-pill).
- **Avatars and back control:** full circle.

Borders are 1px `{colors.stroke}` on white. Do not use 0-radius chrome or 24px “soft UI” cards.

**The 8/12 Rule.** Interactive chrome is 8px. Containing surfaces are 12px. Mixing those (a 12px button, an 8px card) reads as a different product.

## Components

### Buttons
Quiet, 14px Inter. Primary in dialogs is Modal Blue (`{colors.primary-base}`); page-header CTAs are Action Blue (`{colors.primary}`) at 36px height with a plus/key icon. Secondary is white with a hairline and slate text (Cancel, Back, Load example). Disabled is 50% opacity, not a grey fill.

### Chips / Badges
2px 8px padding, 4px radius, 12px medium. Status uses tinted paper + ink (Active green, PENDING amber, INACTIVE muted grey, HIGH red, LOW green). HTTP methods (GET/POST) use the same recipe with cool blues. Never white text on a saturated badge except where Figma used it and we restyle to tinted paper.

### Cards / Containers
White, 12px radius, 1px stroke. Table cards add the table shadow and 12px padding around header + rows. Result cards use a weak-paper header bar (`Asset Details`, `Related Senders`) then 16px body padding. Metric cards are equal-width in a 12–16px gap row.

### Inputs / Fields
White, 42px tall (48px on Explore search and some modal fields), 8px radius, 1px stroke. Placeholder is `{colors.text-soft}`. Focus swaps the border to `{colors.primary}` with no glow. Labels sit above at 14px. Required markers use `{colors.primary-base}` or danger red.

### Navigation
Sidebar: 16px/500 on mint; active is navy fill, white type, 225px wide, 10px radius. Icons are 20px Figma SVG strokes (`#1A1A1A` on mint; they stay dark even on the navy item unless a dedicated white asset exists — do not redraw icons). In-page tabs: 14px/700, inactive `{colors.text-tab-inactive}`, active title color plus 2px `{colors.primary-tab}` underline that sits on the hairline.

### Tables
Weak-paper header row, 14px slate labels. Body rows 64px, ink at 14px, muted secondary cells in slate. Hairline dividers. Actions are 24px icon buttons (edit, dots), menus white with 8px radius. Pagination is the shared control: “Page n of n”, 1–5 + last, page-size chip.

### Dialogs
Centered, 560px default / 686px for user forms, 16px radius, modal shadow, navy scrim. Header 20px padding, 18px title, close icon. Footer right-aligned Back + primary. Info banners are `{colors.info-bg}` with the Figma info glyph, 8px radius — not yellow warning.

### Search / Explore
Centered hero on the mint floor: title, lede, type tabs, 48px search field with 12px radius (the one intentional larger control radius) and a 48px primary Search. Result views drop the hero and use the two-column analyst layout.

## Do's and Don'ts

### Do:
- **Do** keep new screens on the 1440 shell with the existing top bar and 249px sidebar.
- **Do** restyle Figma frames into these tokens rather than copying TelDefence greys or hamburger chrome.
- **Do** use Inter 14/20 for body UI and 24/32/600 for page titles.
- **Do** put primary actions as blue buttons; put destructive actions as red text in menus, not red fills.
- **Do** download icons from Figma and size them explicitly (16/20/24px). Reuse a project icon only when the glyph matches.

### Don't:
- **Don't** introduce Tailwind, a second typeface, or a dark-mode canvas.
- **Don't** fill the page with `{colors.primary}`. Blue is scarce.
- **Don't** hand-draw SVG icons when a Figma export exists.
- **Don't** use heavy drop shadows, gradients, or glass on cards.
- **Don't** invent mobile breakpoints or collapse the sidebar.
- **Don't** treat JSON playground styling (monospace, weak-paper editors) as the default for forms.
