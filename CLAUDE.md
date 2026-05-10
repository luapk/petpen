# PetScribe® — Project Context for Claude

## What This Is

PetScribe is an AI-powered claims writing tool built for adam&eveTBWA, used on the IAMS account (Mars Petcare). It takes scientific research inputs — efficacy data, clinical trial results, ingredient science, Waltham statistics — and generates two distinct types of creative output: advertising claims and pack claims.

It is a single-file React app (Vite) deployed on Vercel, calling the Anthropic API via a serverless proxy function.

---

## API Architecture — IMPORTANT

**The app uses a Vercel serverless proxy, NOT direct browser-to-Anthropic calls.**

- `api/generate.js` handles all Anthropic API calls server-side
- The browser calls `/api/generate` (same origin — no CORS)
- The API key is read via `process.env.ANTHROPIC_API_KEY` in the serverless function

### Environment Variable Naming — DO NOT CONFUSE THESE

| Variable | Where used | Prefix required? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel serverless function (`api/generate.js`) | No prefix |
| `VITE_*` prefix | Only needed for vars read by browser-side Vite code | Yes, for browser |

**`VITE_ANTHROPIC_API_KEY` is WRONG for this project.** The API key lives in a serverless function, not the browser bundle. Set `ANTHROPIC_API_KEY` (no prefix) in Vercel → Project → Settings → Environment Variables.

This has caused confusion before. The rule: `VITE_` prefix = browser-side only. No prefix = server-side. This project is server-side.

---

## Brand Context

**Brand hierarchy:**
- **Healthy for Life** — IAMS master brand truth. Sits above everything.
- **Love Them Inside Out** — Campaign platform. Inside characters (gut bacteria, follicle cells, immune cells, muscle fibres) cause visible outside results. Claims can allude to this without stating it.
- **Claim leads. Brand line follows.** Always. Non-negotiable.

**Tonal target:** Warm enough to be IAMS. Sharp enough to cut through. Scientific enough to be believed. Not cold like pharma. Not saccharine like most pet food.

**The translation chain** (must be respected in all advertising copy):
Research fact → Product truth → Human truth → Claim territory

---

## Two Output Modes

### Mode 1 — Advertising Claims
- Warm, human, memorable headline routes
- For TV, OOH, digital, social
- Uses full copywriting skill: tonal diversity mandate, provocation route requirement, 8-filter self-critique pass, Oblique Strategies lateral thinking
- 5 routes per run, each from a genuinely different strategic angle
- Format: core claim (≤6 words ideally) + supporting line + attribution

### Mode 2 — Pack Claims
- Short, measurable, legally defensible
- For packaging, roundels, shelf, CRM, DTC
- Uses five pack principles: Named System, Time-Frame, Soft Number, Observer, Stat Alone
- Each claim has a Legal Nervousness score (1–5 with emoji, explanation)
- Format: core claim (6–8 words max) + attribution + source note + legal note

### Mode 3 — Both
- Runs both API calls in parallel via `Promise.all`
- Results render independently as they arrive

---

## Riff Feature

Every claim card (both modes) has a "↻ Riff on this" button. This fires a third API call using `RIFF_SYSTEM` prompt, generating 3 variations that change entry point, structure, rhythm or word — not synonym swaps. Results cache per card; second click does not re-fetch.

---

## Tech Stack

- **React 18** (Vite, no TypeScript)
- **Single file:** all components, prompts, styles and logic live in `src/App.jsx`
- **No CSS files** — all styling is inline JS objects
- **No Tailwind** — design tokens defined as constants at top of file
- **Anthropic API** called via `api/generate.js` serverless proxy
- **No router, no state management library, no component library**

---

## Design System

Visual language is glassmorphism on a blue-to-purple gradient. Mirrors the Etho project aesthetic.

```js
BG = "linear-gradient(150deg, #5a90cc 0%, #8264c0 45%, #a070cc 100%)"
GLASS = "rgba(255,255,255,0.18)"          // active/selected element fill
GLASS_CARD = "rgba(255,255,255,0.15)"     // card background
GLASS_CARD_HOVER = "rgba(255,255,255,0.22)"
GLASS_BORDER = "rgba(255,255,255,0.35)"   // active border
GLASS_BORDER_SOFT = "rgba(255,255,255,0.22)" // default border
GLASS_DEEP = "rgba(60,40,120,0.25)"       // rationale/nested panel
TS = "0 1px 3px rgba(40,20,80,0.35)"      // text shadow for legibility
```

**Typography:**
- Display: `Cormorant Garamond`, 300 weight, `letterSpacing: -0.04em` — used only for "PetScribe®"
- UI: `Roboto` — all labels, body, buttons
- Mono: `Roboto Mono` — index numbers, version tag, copy buttons

**Key visual rules:**
- All cards: `borderRadius: 20`, `backdropFilter: blur(20px)`
- Generate button: NO `textShadow` — this caused ugly drop shadows previously, do not reintroduce
- Pill buttons: `borderRadius: 20`, glassmorphic style via `pillBtn(active)` helper function
- Tooltips: `rgba(30,18,75,0.92)` background, appear on hover below mode buttons, `pointerEvents: none`

---

## File Structure

```
petpen/
├── api/
│   └── generate.js         # Vercel serverless proxy to Anthropic
├── index.html              # Entry, loads Google Fonts
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # ReactDOM.createRoot only
    └── App.jsx             # Everything else
```

**App.jsx structure (top to bottom):**
1. Design tokens (constants)
2. `AD_SYSTEM` prompt — full advertising copywriting skill
3. `PACK_SYSTEM` prompt — pack claim principles + legal nervousness scoring
4. `RIFF_SYSTEM` prompt — riff variation generator
5. `CATEGORIES` array + `PRODUCT_MAP` object
6. `callClaude()` API helper — calls `/api/generate`, not Anthropic directly
7. `glassCard()` style helper
8. `RiffPanel` component
9. `AdClaimCard` component
10. `PackClaimCard` component
11. `pillBtn()` style helper
12. `SkeletonCard` component
13. `SectionHeader` component
14. `App` (main export)

---

## State (App component)

```js
mode          // "advertising" | "pack" | "both"
categories    // string[] — multi-select, minimum 1 required
research      // string — textarea input
adResults     // null | { mode, claims[] }
packResults   // null | { mode, claims[] }
adLoading     // boolean
packLoading   // boolean
error         // null | string
copied        // null | string (id of last copied item)
focused       // boolean (textarea focus)
modeTooltip   // null | "advertising" | "pack" | "both"
```

**Category multi-select logic:** `toggleCategory(cat)` — if already selected and it's the only one, do nothing (minimum 1). Otherwise toggle.

---

## API Prompts — Key Rules

**AD_SYSTEM must enforce:**
- Translation chain before writing
- Oblique Strategies lateral provocations (internal, never shown)
- Tonal diversity — routes must not be siblings
- Mandatory provocation route — at least one that makes the room go quiet
- Full anti-pattern kill list (adspeak, empty parallels, the explain, AI fingerprints, relentless positivity, sameness)
- 8-filter self-critique pass
- Hard ban: em dashes in copy
- JSON output only, no preamble

**PACK_SYSTEM must enforce:**
- Five pack principles (Named System, Time-Frame, Soft Number, Observer, Stat Alone)
- Legal nervousness score: 1–5, emoji label, plain-English explanation of what specifically makes legal nervous
- 6–8 word maximum for core claim
- JSON output only, no preamble

**RIFF_SYSTEM must enforce:**
- 3 variations, not synonym swaps
- Each changes entry point, structure, rhythm or a specific word meaningfully
- `change_note` explains the craft reason (one sentence)
- Same anti-pattern standards as AD_SYSTEM

---

## JSON Output Schemas

**Advertising:**
```json
{
  "mode": "advertising",
  "claims": [{
    "route_label": "The [name] — 3-5 words",
    "core_claim": "...",
    "supporting_line": "...",
    "attribution": "IAMS [product]",
    "rationale": "..."
  }]
}
```

**Pack:**
```json
{
  "mode": "pack",
  "claims": [{
    "route_label": "...",
    "core_claim": "...",
    "attribution": "IAMS [product]",
    "source_note": "...",
    "legal_nervousness": {
      "score": 3,
      "label": "😬 The Concerned Email",
      "explanation": "..."
    },
    "rationale": "..."
  }]
}
```

**Riff:**
```json
{
  "riffs": [{
    "core_claim": "...",
    "supporting_line": "...",
    "change_note": "..."
  }]
}
```

---

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
```

Set in Vercel dashboard under Project → Settings → Environment Variables. **No `VITE_` prefix** — this is read by the serverless function (`process.env`), not the browser. The `VITE_` prefix is only for variables consumed by Vite's browser bundle (`import.meta.env.*`), which this project no longer uses for the API key.

---

## Running Locally

```bash
npm install
# Add ANTHROPIC_API_KEY to .env.local (no VITE_ prefix needed for api/ functions)
npm run dev
```

---

## Deployment (Vercel + GitHub)

1. Push repo to GitHub
2. Connect to Vercel (import project)
3. Framework preset: **Vite**
4. Add `ANTHROPIC_API_KEY` environment variable (no `VITE_` prefix)
5. Deploy

No build configuration needed beyond defaults.

---

## What Not to Do

- Do not add `textShadow` to the generate button — it previously caused ugly drop shadow on the uppercase label
- Do not mention D&AD in any user-facing copy or tooltips
- Do not show `PRODUCT_MAP` values in the UI — the product line was intentionally removed
- Do not use `em dashes (—)` in any generated advertising copy — this is a hard rule baked into the system prompts
- Do not add Tailwind — all styling is intentional inline JS
- Do not split into multiple files unless the project grows significantly — single-file is the deliberate architecture
- Do not reintroduce direct browser-to-Anthropic calls — use the `/api/generate` proxy
- Do not add `VITE_` prefix to `ANTHROPIC_API_KEY` — it is a server-side variable
- Do not reintroduce single-select category behaviour — categories is an array, minimum 1 enforced in `toggleCategory`

---

## Related Projects (same codebase family)

- **Etho** — AI pet behaviour analysis app. PetScribe shares its visual language: same gradient approach, same glassmorphic card style, same Roboto/Roboto Mono type system.
- **HORIZON v3/v4** — Mars/Waymo foresight tools. Same Vercel deployment pattern.
- **PULSE** — CD-level social trend tool. SSE streaming architecture (different pattern from PetScribe).
