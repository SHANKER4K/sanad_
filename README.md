# Jev Risk Demo (سند)

A light-mode Next.js interface for classifying a message into `safe`,
`suicidal_ideation`, or `active_suicide_risk` with Jev through OpenRouter. The UI is
built with [shadcn/ui](https://ui.shadcn.com) (Base UI) on Tailwind CSS v4.

## Setup

Install dependencies (this project uses [bun](https://bun.sh)):

```bash
bun install
```

Create `.env.local` and add your OpenRouter key:

```env
OPENROUTER_API_KEY=sk-or-your-key
```

> The key is only read in the server route (`app/api/analyze/route.ts`). Never expose it
> in a `NEXT_PUBLIC_` variable or call OpenRouter directly from the browser.

Run the dev server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- `app/page.tsx` — the client UI: message form, example presets, and the classification
  result with per-category probabilities.
- `app/api/analyze/route.ts` — server route that validates the message and calls the
  OpenRouter Decisions API (`typesafe/jev-1.13`) with a single `choice` question.
- `components/ui/*` — shadcn components; theme tokens live in `app/globals.css`.

Add more components with:

```bash
bunx --bun shadcn@latest add <component>
```

## Safety notes

This is a demonstration, not a clinical assessment. Route non-safe classifications to a
trained human reviewer, log only what you need, add authentication and rate limiting
before deployment, and never make emergency decisions from Jev alone.
