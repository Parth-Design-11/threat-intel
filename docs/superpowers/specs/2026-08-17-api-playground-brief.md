# API Playground — Discovery Brief

**Date:** 2026-08-17  
**Status:** Schema contracts proposed — awaiting review  
**Product:** Wisely AI Threat Intelligence

This brief captures what we know and what we still need before writing a design spec. Answer the questions below (in chat is enough). Once those are settled, this file will be replaced by a design spec.

---

## Context

The app today is a Figma-faithful **API Management** UI:

- Access Keys list, create-key flow, usage metrics, request logs
- Keys are scoped to API types: A-Party Risk Score, B-Party Vulnerability, CTA Check, Pattern Check, All API
- Logged endpoints include `/v1/intelligence/lookup`, `/v1/takedown/create`, `/v1/scammers/phone`, `/v1/intelligence/bulk`, `/v1/takedown/delete`, `/v1/scammers/patterns`
- There is **no backend**. Keys, logs, and metrics are mock data in the client
- The Figma file (`Threat-Exchange`) has no playground frame on the current page
- Sidebar items besides **API** are not implemented

---

## Decisions so far

**Job:** User submits a **JSON request**. The playground **validates** it and returns a **JSON response**.

- Valid request → success JSON body
- Invalid / malformed / edge-case input → structured error JSON (not a silent fail or a generic toast)
- v1 must cover incorrect input and other edge cases (empty body, invalid JSON, missing fields, wrong types, unknown keys, etc.)

**Request shape:** Raw JSON in (not a field-by-field form).

**Schemas:** One schema per API type. User **picks the type**, then pastes JSON.

- A-Party Risk Score
- B-Party Vulnerability
- CTA Check
- Pattern Check

Still unknown: whether these **proposed field contracts** are correct (see below).

---

## Proposed contracts (review)

Shared rules for every type:

- Request must be a single JSON **object** (not array, string, number, `null`)
- Unknown top-level keys are rejected
- `null` is not accepted in place of a required string/object
- Empty string is invalid for required strings
- Extra nested keys are rejected
- Valid request returns HTTP-like **200** + success body
- Failures return **4xx** + the error envelope below (never an empty pane or a toast-only failure)

### Error envelope (all failures)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request is invalid.",
    "details": [
      {
        "path": "identifier.value",
        "code": "INVALID_FORMAT",
        "message": "Phone must be E.164 (e.g. +919876543210)."
      }
    ]
  }
}
```

| HTTP-like status | `error.code` | When |
| --- | --- | --- |
| 400 | `INVALID_JSON` | Unparseable text, empty editor, trailing comma, etc. |
| 400 | `INVALID_TYPE` | Root is not an object |
| 400 | `VALIDATION_ERROR` | Schema violations (missing, wrong type, format, extra keys, empty, out of range) |
| 400 | `UNSUPPORTED_IDENTIFIER` | `identifier.type` not in the enum |
| 413 | `PAYLOAD_TOO_LARGE` | Body > 16 KB |
| 422 | `UNPROCESSABLE` | Valid JSON/schema but contradictory values (e.g. A and B party are the same) |

`details[]` is omitted for `INVALID_JSON` / `PAYLOAD_TOO_LARGE`. Multiple field errors are returned together, not fail-fast on the first field.

### 1. A-Party Risk Score

**Request**

```json
{
  "identifier": {
    "type": "phone",
    "value": "+919876543210"
  },
  "context": {
    "channel": "voice",
    "country": "IN"
  }
}
```

- `identifier` required. `type`: `phone` | `email` | `upi`. `value` required string.
- `phone` → E.164 (`+` and 8–15 digits). `email` → basic email. `upi` → `name@handle`.
- `context` optional. If present: `channel` `voice` | `sms` | `whatsapp`; `country` ISO 3166-1 alpha-2.

**Success (200)**

```json
{
  "identifier": { "type": "phone", "value": "+919876543210" },
  "risk": {
    "score": 87,
    "level": "high",
    "label": "Likely scam"
  },
  "signals": [
    { "code": "REPORTED_SCAM", "weight": 0.42 },
    { "code": "NEW_NUMBER", "weight": 0.18 }
  ],
  "checked_at": "2026-08-17T08:43:00.000Z"
}
```

`level` from score: 0–24 `low`, 25–59 `medium`, 60–84 `high`, 85–100 `critical`. Playground derives a deterministic mock score from the identifier (same input → same output).

### 2. B-Party Vulnerability

**Request**

```json
{
  "a_party": { "type": "phone", "value": "+919876543210" },
  "b_party": { "type": "phone", "value": "+911140000000" },
  "context": { "channel": "voice", "country": "IN" }
}
```

- `a_party` and `b_party` required; same identifier shape as Risk Score.
- `context` optional, same as above.
- If `a_party` and `b_party` normalize to the same value → `422 UNPROCESSABLE`.

**Success (200)**

```json
{
  "a_party": { "type": "phone", "value": "+919876543210" },
  "b_party": { "type": "phone", "value": "+911140000000" },
  "vulnerability": {
    "score": 64,
    "level": "high",
    "label": "B-party is a known contact-center cluster"
  },
  "signals": [
    { "code": "HIGH_FAN_IN", "weight": 0.51 }
  ],
  "checked_at": "2026-08-17T08:43:00.000Z"
}
```

### 3. CTA Check

Call-to-action / lure detection on a message or URL.

**Request**

```json
{
  "text": "Your KYC is expired. Click https://bit.ly/abc to verify now.",
  "url": "https://bit.ly/abc",
  "channel": "sms"
}
```

- At least one of `text` or `url` required (`422` if both missing; `VALIDATION_ERROR` if both present but empty).
- `text` string, 1–5000 chars if present.
- `url` http/https URL if present.
- `channel` optional: `sms` | `whatsapp` | `email` | `web`.

**Success (200)**

```json
{
  "cta_detected": true,
  "cta": {
    "type": "verify_account",
    "urgency": "high",
    "excerpt": "Click https://bit.ly/abc to verify now."
  },
  "url": {
    "value": "https://bit.ly/abc",
    "risky": true,
    "reason": "shortener"
  },
  "checked_at": "2026-08-17T08:43:00.000Z"
}
```

If no CTA: `cta_detected: false`, `cta` and `url.risky` accordingly.

### 4. Pattern Check

**Request**

```json
{
  "input": {
    "type": "phone",
    "value": "+919876543210"
  },
  "families": ["vishing", "investment"]
}
```

- `input` required. `type`: `phone` | `email` | `text`. `value` required.
- `text` value: 1–5000 chars.
- `families` optional array of `vishing` | `investment` | `otp` | `job` | `kyc`. Empty array invalid. Duplicates rejected. Omit = all families.

**Success (200)**

```json
{
  "input": { "type": "phone", "value": "+919876543210" },
  "matches": [
    {
      "family": "vishing",
      "pattern_id": "ptn_impersonate_bank",
      "confidence": 0.81
    }
  ],
  "match_count": 1,
  "checked_at": "2026-08-17T08:43:00.000Z"
}
```

No matches → `matches: []`, `match_count: 0`.

### Edge cases (all types)

Covered in v1, each with a fixture in tests:

1. Empty editor
2. Whitespace-only
3. Invalid JSON (trailing comma, single quotes, unquoted keys)
4. JSON root array / string / number / `true` / `null`
5. `{}` missing required fields
6. Required field `null`
7. Required field `""`
8. Wrong types (`identifier.value` as number, `families` as string)
9. Unknown top-level key
10. Unknown nested key
11. Enum typo (`"Phone"` vs `"phone"`)
12. Format failures (phone without `+`, bad email, `javascript:` URL)
13. Oversize payload (>16 KB)
14. Deeply nested junk
15. Valid payload for a **different** type than the one selected (validate against the selected type only)
16. Type-specific: A and B party identical (B-Party); both `text` and `url` empty (CTA); duplicate `families` (Pattern)

---

---

## Questions

Please answer in chat. Numbered so we can refer to them.

### 1. Job to be done — answered

Take a JSON request → validate → return a JSON response. Full error handling for incorrect input and edge cases.

### 5. Request shape — answered

Raw JSON editor (paste/type a request body).

### 2. Where it lives

- **A.** New tab on API Management, next to Access Keys and Usage and Logs
- **B.** New sidebar item (e.g. Playground)
- **C.** Action on a key row (opens playground scoped to that key)
- **D.** Other

### 3. Data source for this version

- **A.** Mock only — canned request/response examples, no network
- **B.** Live calls to a real Threat Intelligence API
- **C.** Mock now, with a clear seam to swap in a live client later

### 4. Auth / key

If the playground sends (or pretends to send) a request:

- **A.** Pick an existing access key from the table (secret never shown again; use a mock header)
- **B.** Paste a secret key each time
- **C.** Use a dedicated playground key
- **D.** No auth in v1

### 6. Endpoints / schemas in v1 — answered

One schema per API type. User picks the type, then pastes JSON.

- A-Party Risk Score
- B-Party Vulnerability
- CTA Check
- Pattern Check

Not a free-for-all of every logged URL. Type selection is the switch.

### 7. Success for v1

What must be true for this to count as done?

Examples we can use or ignore: matches a Figma (share the node), works at 1440px in the current shell, one happy-path payload + one error payload, copy-as-JSON, no live backend.

### 8. Out of scope for v1 (confirm)

Unless you say otherwise, v1 will **not** include: saved request history, sharing playground links, rate-limit enforcement UI, or editing production keys from the playground.

---

## After answers

Next steps, in order:

1. Propose 2–3 implementation approaches and a recommendation
2. Walk through the design (layout, data, errors)
3. Write `docs/superpowers/specs/2026-08-17-api-playground-design.md`
4. Implementation plan, then build
