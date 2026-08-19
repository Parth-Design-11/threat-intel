# API Playground Design

**Date:** 2026-08-17  
**Status:** Approved for implementation (contracts approved; remaining UI defaults locked below)

## Goal

A Playground on API Management: pick an API type, paste a JSON request, run validation, and get a JSON response. Valid input returns a mock success payload. Invalid input returns a structured error body. No live network.

## Placement

Third tab on API Management: **Access Keys** | **Usage and Logs** | **Playground**. Same shell (top bar, sidebar). No auth in v1.

## Contracts

See `2026-08-17-api-playground-brief.md` for request/success/error JSON per type:

- A-Party Risk Score
- B-Party Vulnerability
- CTA Check
- Pattern Check

## Engine

`runPlayground(type, rawText) → { status, body }`

- Client-side only
- Same input → same success payload (deterministic score from identifier)
- `checked_at` is ISO-8601 UTC
- Max raw body 16 KB
- Validate against the **selected** type only

## UI

- Type select
- Request JSON textarea (monospace)
- Load example / Run
- Response pane: status + pretty-printed JSON
- Copy response

## Out of scope

Saved history, shareable links, rate-limit UI, live API, access-key auth.
