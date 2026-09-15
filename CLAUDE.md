# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

There is no test suite configured in this repo. Both `bun.lock` and `package-lock.json` are present — confirm with whoever is running commands which package manager is actually in use before adding/removing dependencies, since installing with one will not update the other's lockfile.

## Architecture

PathwayAI is a **static, front-end-only** Next.js App Router project — there is no backend, no API routes, and no database. All "data" (roadmap nodes/edges, course content, dashboard stats, resources) is hardcoded in `lib/mockData.ts` and `lib/courseData.ts` and imported directly into pages/components. Treat any "wire this up to real data" request as adding to those files or introducing a new data layer, not modifying an existing API.

State is not persisted or shared across routes: `app/onboarding/page.tsx` collects a 4-step profile (goal, skills, learning style, time) entirely in local `useState`, then just `router.push('/dashboard')`s — the answers are discarded. Each page independently renders from the static mock data rather than reading anything the onboarding flow produced.

Routing/layout structure:
- `app/layout.tsx` is a bare shell (just `<html>`/`<body>`, no shared nav). Each authenticated-feel page (`dashboard`, `roadmap`, `courses`, `progress`, `resources`) independently composes `components/dashboard/Sidebar.tsx` itself rather than relying on a shared layout.
- `app/page.tsx` is the marketing/landing page; `app/onboarding/page.tsx` is the standalone 4-step wizard (`components/onboarding/Step1Goal.tsx` … `Step4Time.tsx`, driven by `StepIndicator.tsx`).

The roadmap visualization (`app/roadmap/page.tsx`) is built on `@xyflow/react` (React Flow): `components/roadmap/RoadmapCanvas.tsx` wraps `<ReactFlow>` with a custom `roadmap` node type (`components/roadmap/RoadmapNode.tsx`) and colors nodes/minimap by `NodeStatus` (`completed` / `in-progress` / `locked`) defined in `lib/mockData.ts`.

`components/ui/*` are Shadcn/UI-style primitives (badge, button, card, input, progress, select, tabs) built on Radix primitives + `class-variance-authority`, composed via the `cn()` helper in `lib/utils.ts` (`clsx` + `tailwind-merge`). Follow this pattern for any new primitive rather than introducing a different UI library.

Styling is Tailwind CSS v4 (via `@tailwindcss/postcss`) with a Slate/Zinc palette; most pages use client-side interactivity (`'use client'`) since the app is dashboard/canvas-heavy rather than content/SSR-heavy.
