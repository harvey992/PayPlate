# Contributing to PayPlate

## Before you start (for AI coding agents especially)

**Pull the latest `main` from GitHub before making any changes, and push your
changes as commits — don't regenerate/overwrite the whole tree from a stale
local snapshot.** This repo has had repeated regressions from tools that
rewrite files wholesale instead of diffing against current `main`, which
silently reverts recent fixes and features. If you're an AI agent picking
this project up: check `git log` first, read the recent commit messages to
understand what's already been fixed, and build incrementally on top of it.

Do not commit scratch/debug files (JSON dumps, `.txt` working files, etc.)
to the repo root. `.gitignore` covers `dist/`, `.tanstack/`, and
`*.tsbuildinfo` — respect it, don't re-add those.

## Stack

- **Framework:** TanStack Start (TanStack Router, file-based routes under
  `src/routes/`), React 19, Vite.
- **Styling:** Tailwind v4 (via `@tailwindcss/vite`), design tokens defined
  in `tailwind.config.js` + `src/styles/globals.css`. The app's brand
  identity is a fixed OLED-black/green dark theme (`#050505` background,
  `#00D27A` primary) — this is the default theme for all users; don't
  change the color system without a specific reason.
- **Backend:** Supabase (auth + data). See `src/services/supabase-client.ts`
  — the app falls back to mock data/auth gracefully when Supabase env vars
  aren't configured, so it still runs without a live backend.
- **Animation:** Framer Motion, respecting `prefers-reduced-motion`
  throughout (see `src/hooks/use-prefers-reduced-motion.ts`).
- **State:** React Context per domain (`src/contexts/`) — auth, cart,
  wallet, credit, orders, rewards, restaurants, favorites, settings, theme,
  toast. All wired together in `src/routes/__root.tsx`.

There is no C# backend, and this is not meant to resemble C# conventions.
Ignore any prior guidance suggesting otherwise — that was a mistake and has
been removed. This is a standard TypeScript/React codebase; use normal
React/TypeScript naming and structure (PascalCase components, camelCase
functions/variables, interfaces in `src/types/payplate.ts` as the source of
truth for data shapes).

## Conventions

- Match field names to `src/types/payplate.ts` exactly (e.g.
  `priceCents` not `price`, `restaurant.cuisine` not `cuisines`,
  `reward.isEarned` not `redeemed`) — several past bugs came from domain
  components guessing at field names instead of checking the real types.
- Use the existing UI primitives in `src/components/ui/` (`Button`,
  `Badge`, `Card`, etc.) as-is — check their actual prop signatures before
  passing props like `size` or `variant="outline"` that don't exist on them.
- New interactive elements (restaurant cards, buttons, etc.) need a real
  `onClick`/navigation handler — several past regressions shipped
  visually-complete but non-functional components (cards that don't
  navigate anywhere, etc.). Test the actual click path, not just that it
  renders.
- Icon-only buttons need `aria-label`.
- Run `npm run typecheck` (`tsc --noEmit`) and `npm run build` before
  considering a change done — both should be clean.
