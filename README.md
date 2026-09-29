# سند — Early Risk Detection

An Arabic, right-to-left Next.js interface that reads a message and surfaces early
signs of suicidal ideation, so trained reviewers can intervene in time. Each message is
classified into `safe`, `suicidal_ideation`, or `active_suicide_risk` through OpenRouter.
The UI is built with [shadcn/ui](https://ui.shadcn.com) (Base UI, RTL mode) on Tailwind
CSS v4 and uses the Cairo typeface.

## Setup

Install dependencies (this project uses [bun](https://bun.sh)):

```bash
bun install
```

Create `.env.local` (or `.env`) and add your OpenRouter key:

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
