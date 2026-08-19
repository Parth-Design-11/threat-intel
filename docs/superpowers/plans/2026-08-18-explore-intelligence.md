# Explore Intelligence Implementation Plan

> Landing-only search view from `docs/superpowers/specs/2026-08-18-explore-intelligence-design.md`. Implemented in this session; no commits unless asked.

**Goal:** Sidebar **Explore Intelligence** opens a centered search landing with three analysis-type tabs.

**Architecture:** Lift section state into `App` (`explore` | `api`). `ExplorePage` owns `type`, `query`, and `submitted`. No engine.

**Tech Stack:** React + TypeScript, existing CSS tokens.

## Files

- `src/components/ExplorePage.tsx` — landing
- `src/components/Sidebar.tsx` — active item + explore/api clicks
- `src/App.tsx` — section switch
- `src/index.css` — landing styles
