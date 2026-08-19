# Explore Intelligence Design

**Date:** 2026-08-18  
**Status:** Approved for implementation (landing only)

## Goal

Give analysts a place to look up threat intelligence from the sidebar. v1 is the **search landing only**: pick an analysis type, type a query, submit. Results are a later pass — no mock cards, JSON, or asset lists on this screen.

## Placement

New main view behind **Explore Intelligence** in the sidebar.

- Same shell (top bar + 249px sidebar)
- Clicking **Explore Intelligence** marks that nav item active and shows this landing
- Clicking **API** returns to API Management (Access Keys / Usage and Logs / Playground)
- Home and Settings stay visible but still do nothing

## Analysis types

Three tabs above the search field. One type is always selected. Default: **A-Party Risk Analysis**.

| Tab | Maps later to playground type | Placeholder |
| --- | --- | --- |
| A-Party Risk Analysis | `risk-score` | Phone, email, or UPI (e.g. +919876543210) |
| B-Party Vulnerability Analysis | `b-party` | B-party phone, email, or UPI |
| Message Pattern Analysis | `pattern` | Phone, email, or message text |

Changing tabs keeps the current query text. Placeholder updates to the selected type.

CTA Check is not a tab. B-party is a single query in v1 (no second identifier field yet).

## Landing layout

Centered in the main pane. Search is the hero; no dashboard, metrics, or tables.

```
Explore Intelligence
Look up a number, UPI, email, or message.

[ A-Party Risk Analysis ] [ B-Party Vulnerability Analysis ] [ Message Pattern Analysis ]

[ 🔍  {placeholder}                                      ] [ Search ]
Results for this lookup will appear here.
```

- Search icon on the left of the field
- **Search** button on the right
- Enter in the field submits the same as the button
- Visual language matches the existing app (Inter, `#ebf1f1` page, `#256dec` / `#375dfb` accents, 8px/12px radii)

## Submit (v1)

- Empty or whitespace-only query: do not treat as a successful search. Show an inline error under the field: `Enter a value to search.`
- Non-empty query: keep the text in the field and show a quiet empty hint under the bar: `Results for this lookup will appear here.`
- No navigation, no fake results, no JSON, no toast, no live API

## Architecture

- `ExplorePage` in the main pane when sidebar section is `explore`
- Lift sidebar selection into `App` (`"explore" | "api"`). Default remains **API** so existing work is unchanged
- Local state on the page: `type`, `query`, `submitted` (whether a non-empty search has been run)
- No new engine. Reuse `runPlayground` only in a later results pass

## Out of scope

Analysis results, CTA Check, B-party second identifier, query history, live API, identifier format validation beyond empty check.
