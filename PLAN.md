# PathwayAI — Static Frontend → Full-Stack (Clerk + Neon + Groq)

## Context

PathwayAI is currently a **100% static frontend**. Every number on screen is hardcoded, the onboarding questionnaire collects four steps of answers and then throws them away (`handleComplete` is just `router.push('/dashboard')`), the roadmap is 11 hand-placed React Flow nodes, and the resources page has cards with no links at all.

The goal is to make it real: authenticate users with Clerk, persist to Neon Postgres, and have Groq generate a genuinely personalized CS/engineering roadmap from questionnaire answers — with every downstream surface (dashboard metrics, courses, progress, resources) reading from that same data instead of from mocks.

**Hard constraint from the user:** the existing visual design stays. This is a data-wiring + responsiveness job, not a redesign.

---

## Verified facts (checked, not assumed)

These were confirmed against the bundled docs and live registries — several contradict common knowledge and drive decisions below.

**Next.js 16.2.4 breaking changes** (from `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`):
- `middleware.ts` → **`proxy.ts`** at project root; function must be named `proxy` or be the default export. **Node runtime only** — `edge` is unsupported and `runtime` cannot be configured.
- Sync access to dynamic APIs is **fully removed**. `await cookies()`, `await headers()`, `params: Promise<…>`, `searchParams: Promise<…>`.
- `revalidateTag` now **requires a second argument**: `revalidateTag('tag', 'max')`. Single-arg is a TS error.
- Route handlers unchanged (`app/api/*/route.ts`), **not cached by default**. Dynamic params must be awaited.
- Turbopack is default for dev *and* build. `next lint` is **removed**. Node 20.9+ (local: v24.18.0 ✓).
- Docs explicitly warn that Server Functions are POST-reachable at their own route, so a proxy matcher can silently skip them: *"Always verify authentication and authorization inside each Server Function rather than relying on Proxy alone."*

**Clerk** — `@clerk/nextjs@7.9.2` peer deps are `next: ^16.1.0-0`, `react: ~19.2.3`. Compatible with this project. Clerk ships an official Next 16 `proxy.ts` quickstart, so no workaround is needed.

**Groq** — strict JSON-schema constrained decoding is supported on only three models; of those, **`openai/gpt-oss-120b`** is the only production-grade fit (131k context, 65k max output, ~500 T/s). `qwen/qwen3.8-27b` is preview-only ("not for production"); `llama-3.3-70b-versatile` is production but supports only best-effort `json_object`. Critically, **streaming and tool use are not supported with structured outputs** — which independently confirms the "generate once, don't stream" decision.

---

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Auth | Clerk via `proxy.ts` | Officially supported on Next 16 |
| DB | Neon Postgres + Drizzle ORM | Type-safe schema, SQL migrations, small runtime |
| LLM | Groq `openai/gpt-oss-120b`, strict JSON schema | Only production model with constrained decoding |
| Roadmap generation | Once on submit, persisted, regenerable | Predictable, cheap, stable across sessions |
| Node positions | **Computed** via DAG auto-layout, not LLM-chosen | LLMs produce overlapping coordinates |
| Node status | **Computed** from progress + prerequisites, never stored | The mock already has this bug (3/11 complete vs "4/11" in stats) |
| Courses | Seed existing content to DB verbatim | Hand-written quality, no generation cost |
| Resources | Curated table of verified real URLs | LLM-generated deep links 404 |
| Questionnaire | Structured CS/engineering tracks | Constrains LLM output, keeps metrics computable |

---

## Loopholes found in the original plan

The user asked for these explicitly. Each was verified against the actual code, not assumed.

### Correctness / integrity

1. **Quiz answers are graded in the browser.** `app/courses/page.tsx:48-50` compares against `q.ans`, and `ans`/`exp` ship inside the JS bundle. Any student can read the answer key. → Strip `ans`/`exp` from the client payload; grade in a route handler; return explanations only in the response *after* submission.

2. **A cycle in the generated graph bricks the whole roadmap.** Node status is computed from "are all prerequisites complete?" — a cycle means nothing is ever unlockable. The LLM will occasionally emit one. → Topological-sort validation before persisting; reject and retry on cycle.

3. **Stored status drifts from reality.** The existing mock already demonstrates the bug: 3 of 11 nodes are marked `completed` but `dashboardStats` claims `4/11`. → `status` is never a column. One pure function derives it from progress + incoming edges, and every surface calls that same function.

4. **Three mutually contradictory progress sources exist today.** Roadmap says 3/11 nodes and 200 total hours; `dashboardStats` says 34% and 4/11; the progress page says 164h and 42/60 modules while its own chart data sums to 66h. → One derivation layer; no page computes its own totals.

5. **Double-submit creates two roadmaps.** "Generate My Roadmap" has no guard and generation takes 5-30s, so an impatient double-click races. → Unique partial index on `(user_id) WHERE is_active`, plus a generation-job row as the mutex.

6. **Onboarding answers must be persisted *before* generation runs.** Currently `handleComplete` discards everything. If we persist only on success, a failed LLM call loses all four steps of user input. → Write answers first, then generate; failure leaves a retry button, not an empty form.

### Security

7. **Proxy-level auth is not sufficient on its own.** The Next 16 docs are explicit: Server Functions are POST-reachable at their own route, so a matcher change silently removes coverage. → `auth()` check inside every route handler and server action, not just `proxy.ts`.

8. **`dangerouslySetInnerHTML` at `app/courses/page.tsx:170`** is safe today (hand-written HTML) but becomes an XSS sink the moment any content is LLM- or user-sourced. → Sanitize at the boundary now, while the content is still trusted.

9. **Unbounded LLM spend.** Nothing stops a user from regenerating in a loop. → Per-user rate limit + a regeneration cap.

### Things that will silently not work

10. **Tailwind cannot JIT runtime-generated class names.** `app/dashboard/page.tsx:248-252` stores bar widths as literal strings (`'w-[80%]'`) in a data array. Fed from the DB these render at **zero width**, with no error. → Inline `style={{ width }}`.

11. **`RoadmapCanvas` cannot display fetched data.** `useNodesState(mockRoadmapData.nodes)` (line 38) captures its argument once; there is no `nodes`/`edges` prop, and `MiniMap`'s `nodeColor` (lines 80-88) re-reads the mock rather than live state. Passing real data changes nothing on screen until this is rewired.

12. **`data.icon` is dead.** `RoadmapNode.tsx` picks its icon purely from status (`CheckCircle2`/`PlayCircle`/`Lock`) and never reads `data.icon`. Asking the LLM for an icon name is wasted tokens unless we wire it up. → Either render it or drop it from the schema.

13. **Two Tailwind classes in use are no-ops** because the plugins were never installed: `prose prose-slate prose-lg` (`courses:169`, needs `@tailwindcss/typography`) and `animate-in slide-in-from-right` (`roadmap:66`, needs an animate plugin) — the roadmap panel has never actually animated.

14. **Hardcoded `5`** appears in five places in the quiz flow (submit guard, disabled guard, copy, `{score}/5`, pass threshold `>= 3`). Any variable-length quiz breaks. → Derive from `chapter.quiz.length`.

15. **The "Critical Skill Gap" table is hardcoded `<tr>` JSX**, not a `.map()` — it cannot render DB rows at all without being rewritten.

16. **Fonts are faux-bold.** Only weights 400-700 are loaded, but `font-extrabold` (800) and `font-black` (900) are used throughout — the browser is synthesizing them. → `next/font` with the real weights.

### Product gaps

17. **Resources have no URL field anywhere** — not even `'#'`. The cards are non-navigable `<div>`s and `Link` is imported but unused. "Working links" requires a new column *and* a rewrite of the card.

18. **There is no way to know time spent.** Every hours-based metric is unbackable until tracking exists. → Visibility-aware heartbeat (decided).

19. **No empty states exist anywhere.** Every `.map()` renders without a `.length === 0` branch, so a brand-new user with no roadmap and no history sees blank cards and empty chart frames. Every metric needs a defined zero-activity state.

20. **Courses have no URL state.** The whole flow is one `view` string, so browser-back exits the course entirely and refresh dumps you back to the catalog with progress lost.

21. **`/community` and `/settings` both 404** from the sidebar today.

---

## Phase 1 — Auth + database foundation

### Packages
```bash
npm i @clerk/nextjs@^7.9.2 drizzle-orm@^0.45.2 @neondatabase/serverless@^1.1.0 \
      ws@^8.18.0 server-only@^0.0.1 zod@^4.6.5
npm i -D drizzle-kit@^0.31.10 tsx@^4.23.13 @types/ws@^8.5.13 @next/env@^16.2.4
```

**Driver choice — `neon-serverless` (WebSocket Pool), not `neon-http`.** Verified from `drizzle-orm@0.45.2/neon-http/session.js`:
```js
async transaction() { throw new Error("No transactions support in neon-http driver"); }
```
Four flows need interactive transactions (roadmap persist, quiz submit, onboarding complete, heartbeat), so HTTP is disqualified. The old reason to prefer HTTP — Edge runtime — no longer applies, since Next 16 proxy is Node-only.

`lib/db/client.ts` must memoize the Pool on `globalThis`: Turbopack HMR re-evaluates modules and will exhaust Neon's connection limit within minutes otherwise.

### Clerk wiring
- `proxy.ts` at root: `export default clerkMiddleware()` — default export (Clerk returns an anonymous handler). **Never add `export const runtime`** — Next 16 throws.
- **Clerk v7 breaking changes**: `<SignedIn>` / `<SignedOut>` / `<Protect>` are *removed*, replaced by `<Show when="signed-in">`. `<ClerkProvider>` goes **inside `<body>`**, not wrapping `<html>`. `auth()` is async. Run `npx @clerk/upgrade` for the codemod.
- `createRouteMatcher` is deprecated; Clerk now says middleware is the wrong place to protect routes. So **proxy attaches the session only** — authorization is resource-level.
- User sync: **lazy get-or-create** in `requireUser()`, wrapped in React `cache()` so one lookup serves a whole request. Chosen over webhooks because webhooks need a dev tunnel and race the first page load. A `user.deleted` webhook can be added later.

### Route groups (URL-neutral)
```
app/(auth)/sign-in|sign-up/[[...]]/page.tsx
app/(onboarding)/layout.tsx  → auth.protect(), redirect out if already onboarded
app/(app)/layout.tsx         → auth.protect() + requireUser() + onboarding gate
app/(app)/{dashboard,roadmap,courses,progress,resources}/page.tsx   ← moved
```
This is what lets a *server* layout guard pages that are currently all `'use client'`.

### The authorization guarantee
The Next 16 docs warn that Server Functions are POST-reachable at their own route, so a proxy matcher can silently skip them. Therefore the load-bearing check is **`requireUser()` inside every DAL function**, with ownership expressed *in the WHERE clause*, not an `if`:
```ts
.where(and(eq(roadmapNodes.id, nodeId), eq(roadmaps.userId, user.id)))
```
Layout checks and proxy are UX/plumbing, not security.

### Schema highlights
Six modules under `lib/db/schema/`. Full definitions are long; the load-bearing decisions:

- **`roadmap_nodes` has no `status` column.** Status is computed by one pure function, `lib/roadmap/status.ts::computeNodeStatuses()`, called only from `lib/dal/roadmap.ts`. Every consumer reads the resulting DTO, so they cannot disagree. The `NodeStatus` union gains a 4th value, **`available`** — today all 8 not-started nodes render with a padlock even when their prerequisites are done, which tells users they can't start something they can.
- **Three partial unique indexes carry the idempotency guarantees**, in Postgres rather than app logic:
  - `roadmaps … UNIQUE (user_id) WHERE is_active`
  - `generation_jobs … UNIQUE (user_id) WHERE status IN ('queued','running')`
  - `study_sessions … UNIQUE (user_id) WHERE ended_at IS NULL` (kills multi-tab time farming)
- **`quiz_questions.correct_index` / `.explanation` are server-only.** The public read path uses an explicit `select({...})` allowlist so those columns are *never fetched*, not fetched-then-stripped. A DB check constraint guarantees `correct_index` is a valid index into `options`.
- **`users.timezone`** captured at onboarding from `Intl.DateTimeFormat().resolvedOptions().timeZone`. Streaks computed in UTC for an IST user break every time they study after 18:30 local — the highest-probability "correct code, wrong numbers" bug in the design.
- **`daily_activity`** is a per-user-per-day rollup, making streaks/weekly buckets/velocity `O(days)` instead of `O(events)`.
- Regeneration **archives** (`is_active = false`), never deletes. `node_progress` cascades from `roadmap_nodes`, so deleting an old roadmap would erase the user's entire history.

### Seeding
`lib/courseData.ts` → `lib/seed-data/courses.ts` with `satisfies SeedCourse[]` (surfaces existing typos). Seeds are upserts keyed on natural slugs and re-runnable; quiz questions upsert on `(chapterId, position)` rather than delete-and-recreate, because `quiz_attempts.answers` store question UUIDs that must stay stable. Run with `tsx`, not bun (not installed) and not Next (Turbopack is a bundler, not a script runner).

### Caching decision
**Do not enable `cacheComponents: true` in this project.** Every read is Clerk-user-scoped, and `use cache` forbids reading cookies/headers inside a cached scope. Route handlers are uncached by default in Next 16 and Clerk-reading pages are dynamic anyway. Use `revalidateTag(tag, 'max')` — remembering the mandatory second argument.

### Phase 1 verification gates (do these before building on top)

1. **Partial index SQL.** `uniqueIndex().on().where(sql\`…\`)` is confirmed to exist in Drizzle's API, but after `drizzle-kit generate`, open `drizzle/0000_*.sql` and grep for `CREATE UNIQUE INDEX … WHERE`. If the predicate is missing, hand-write those three indexes via `drizzle-kit generate --custom`. **Do not build the generation flow until this SQL is correct** — without it, double-submit protection is application-level only.
2. **Enum in an index predicate.** `WHERE status IN ('queued','running')` against a `pgEnum` may need explicit casts. Same check as above.
3. **Clerk `<Show>` renders.** Drop `<Show when="signed-in"><UserButton/></Show>` into the sidebar and confirm. `<SignedIn>` is *removed* in v7, and a loose import fails at runtime, not compile time.
4. **Neon under Turbopack.** A trivial `/api/health` doing `SELECT 1` must work in **both** `npm run dev` and `npm run build && npm start` — Turbopack's dev and build graphs differ.
5. **`revalidateTag` arity.** Grep for single-argument `revalidateTag(` before every commit; muscle memory will write it and it's a TS error in 16.

---

## Phase 2 — Questionnaire + Groq roadmap generation

### Model
**`openai/gpt-oss-120b`** (production, 131k ctx, ~500 T/s, supports `strict:true` constrained decoding).
Do **not** use `llama-3.3-70b-versatile` (deprecated 2026-08-16), `moonshotai/kimi-k2-*` (removed from catalog), or `qwen/qwen3.8-27b` (preview tier — can vanish). Fallback is `openai/gpt-oss-20b`.

**Never trust `response_format`.** There is a documented, reproducible issue where `gpt-oss-120b` ignores `strict:true` and returns free-form text. Every response goes `JSON.parse → lenient Zod → repair → strict Zod`, unconditionally. Zod is the only contract.

### Two-phase generation
Splitting the call is the core architectural decision:
- **Phase A "Architect"** — nodes + edges only (~1.5k tokens, ~3s). All the failure modes that matter (cycles, budget, connectivity) live here, and retrying is cheap.
- **Phase B "Enricher"** — descriptions, topics, projects for validated nodes (~7k tokens, ~15s). Failure here is **non-fatal**: degrade to deterministic placeholders, mark `enrichment_status='degraded'`, offer an "Add details" retry.

Single-call design would force regenerating 8k tokens to fix one cycle. Happy path ~18s, worst case ~40s — fits Vercel's 60s Hobby cap with `maxDuration = 60`.

**Resources are never LLM-generated.** Phase A emits `tags` from a fixed vocabulary; the server resolves resources from the curated table. Zero hallucinated URLs by construction.

### Validation pipeline (24 checks)
Order: `JSON.parse → lenient Zod → graph repair → content repair → budget reconcile → strict Zod`.

Most defects **auto-fix** deterministically (duplicate ids, dangling edges, wrong array lengths, bad icons, off-vocabulary tags). Only three burn a retry:
- **Cycles** — Kahn detection; remove the back edge whose source has the higher emission index (emission order is a strong topological prior); retry with the literal cycle path in the error (`"You produced a cycle: n4 → n7 → n9 → n4"`). This is the one defect worth retrying — a cycle locks every node forever.
- **Node count far out of range**
- **Scope violation** (>20% of nodes carry zero valid tags) — retry with the free-text note stripped.

Also: **transitive reduction** of redundant edges (this is what stops the layout looking like spaghetti), and orphan nodes get attached rather than dropped (hours were already budgeted for them).

Retry budget: **4 LLM calls max**, 55s wall-clock guard via `AbortSignal`.

**Runtime safety net:** `getRoadmapGraph()` re-runs the cycle check on *persisted* data and falls back to a linear chain if a stored graph is somehow cyclic. The user is never hard-locked.

**Last resort:** after 2 failed attempts, fall back to a hand-authored 10-node template DAG per track. Never leave a user with an empty product.

### Hour budget
```
budgetHours = plannedWeeks × daysPerWeek × hoursPerSession × 0.8   // attrition
targetNodes = clamp(round(budgetHours / 18), 8, 25)
```
The model will still miss. Reconcile **deterministically, never by re-prompting**: ≤15% off → accept; 15-40% over → proportional scale (`roundTo5`); >40% over → scale then mark trailing nodes `is_stretch`. **Scale, don't trim** — trimming breaks the DAG and can reintroduce cycles.

### Questionnaire — 14 questions, still 4 steps
Same StepIndicator, same density (3-4 per step). Highest-leverage additions:
- **Track** (8 CS/engineering options) — replaces the free-text goal, which was both the injection surface and the main cause of off-scope output.
- **Languages already known** — removes entire "learn language X" nodes, freeing 20-40h.
- **"Have you shipped anything?"** — separates "knows syntax" from "can build", the most common mis-levelling.
- **Days per week** — replaces `schedule` ('Morning'/'Weekends' told us nothing about hours, and is why the budget was uncomputable today). Time-of-day is kept but feeds only the dashboard's Today's Plan, never the prompt.

**Cut:** free-text goal, `'Get certified'` (no cert content exists — the model would emit a plausible lie), and "preferred difficulty curve" (already fully determined by skills + budget; asking again produces contradictory inputs that make output *worse*).

### Prompt injection guarding
Only one free-text field survives (≤200 chars). Five layers, but the strongest is structural and free: **every node's `tags` must come from a fixed CS vocabulary**, enforced by the JSON-schema enum at decode time and re-asserted by Zod. A node about astrology cannot carry a valid tag.

### Auto-layout
`@dagrejs/dagre` with `ranker: 'network-simplex'` (not `longest-path`, which flattens branches), `nodesep: 60`, `ranksep: 110`, measured node height 132px, width derived from label length. Dagre returns *center* coords; React Flow wants *top-left*. Runs **server-side at generation time, positions persisted** — deterministic, no layout flash, keeps dagre out of the client bundle.

Because `fitView` normalizes zoom, only aspect ratio is visible, not absolute scale.

---

## Phase 3 — Metrics engine

Every dashboard/progress slot keeps its visual; only the semantics change.

### Dashboard
| Slot | Becomes | Zero-activity state |
|---|---|---|
| Learning Insight (big % + gradient bar) | **Pace Index** — actual hours vs your own stated weekly budget | Day 0-2 shows "Plan Readiness 100%" |
| Hours Learned (5 bars) | Real hours, 6-day buckets over 30d | Plots *planned* hours in grey, label flips to "Planned" |
| Curated Highlight | **Recommended Next** — resources tag-matched to unlocked nodes | Works day 0 (unlocked set = DAG roots) |
| Schedule | **Today's Plan** — time-blocked from hours/day + preferred time | Works day 0 (plans from roadmap, not history) |
| Critical Skill Gap | **Modules Needing Attention** — risk score from stall time, downstream blocking weight, budget pressure, quiz deficit | Day 0 uses blocking weight + budget pressure only |
| Trending Skills | **Your Skill Mix** — hours share per tag | Works day 0 from plan |
| Learning Activity | Cumulative modules + daily hours, 7d | Two flat lines + honest "No activity yet" caption |

**"Trending Skills" cannot show real trends** — there's no user population and no job-market feed. Faking it is exactly the recruiting-metric smell being removed, so it becomes a skill-mix breakdown instead.

### Progress
Three KPIs map directly. The fourth — **"Learning Velocity / Top 10%" — cannot be computed**; a percentile needs a user population this app doesn't have. Replaced with **Consistency** (day streak + active days/7): same card shape, genuinely computable, and it's the metric that actually predicts completion.

Empty-state rules that matter: Average Score shows `—`, **never `0%`** (reads as failing). Weeks with no quiz attempts are `null`, **not `0`** (a zero draws a "you failed" bar).

### Two real bugs this surfaces
- `lineData` has an `outreached` key no `<Line>` renders — dead field.
- Learning Activity plots cumulative modules (0-15) and daily hours (0-4) on a **shared YAxis**, so the hours curve flattens to the baseline. Needs a second hidden right-side axis.

### Caching
Four layers, and notably **not** `use cache`: wrap queries in React `cache()` (fetch once per request, derive all 15 slots in memory from ~5 queries); materialize a `daily_stats` rollup so time-series reads hit ≤180 tiny rows; `unstable_cache` only for non-user-scoped data (catalog, curated resources) behind one isolation file; and the rule **never put `userId` in a cache key** — cached means shared-by-construction.

---

## Phase 4 — Responsive + async UI

### The preservation contract
**At ≥1280px every page renders identically to today** — same column counts, card widths, chart sizes, spacing. Between 1024–1279px column counts drop (that band currently crams 4 stat cards at ~176px each holding `text-3xl` numbers). Below 1024px everything changes, because below 1024px everything is currently broken.

### Root cause
Five pages each repeat `flex h-screen … overflow-hidden` with a `w-64 … shrink-0` sidebar. At 375px the sidebar eats 256px leaving **119px** for the app. Two compounding bugs: `shrink-0` prevents compression, and **`min-w-0` is missing on every content pane**, so flex children can't shrink below intrinsic width — that's half the breakage independent of the sidebar.

### Fix: one shared shell + container queries
`app/(dashboard)/layout.tsx` replaces all five shells. Sidebar becomes `hidden lg:flex` + a Radix Sheet drawer below `lg`, with **one `SidebarNav` implementation** shared by rail and drawer.

Breakpoints move from viewport to **container queries** (Tailwind v4 has `@container` in core — verified compiling against the installed 4.2.4). Custom tokens:
```css
--container-pane-sm: 30rem;  --container-pane-md: 45rem;  --container-pane-lg: 58rem;
```
Calibration: pane width = `min(1280, V − 256 − 64)`. At 1280/1366/1440/1600 viewport, `@pane-lg` fires exactly where `lg:` fires today — identical output. Only 1024 and 1152 differ, which is the band we agreed to let reflow.

### Highest-value fixes
- **`grid-cols-1 md:grid-cols-4`** on progress (worst in the app) → proper `1 → 2 → 4` ladder.
- **Trending Skills class-strings-as-data** → inline `style={{ width }}`.
- **Critical Skill Gap hardcoded `<tr>`** → `.map()` with a static severity→class record.
- **Pie chart `innerRadius={55} outerRadius={75}`** → `"61%"`/`"83%"`, which is *pixel-identical* at the current desktop size and scales instead of clipping.
- **`activeBar={<Bar …/>}`** on progress — a Recharts misuse (dashboard does it correctly with an object). Latent bug.
- **`barSize` → `maxBarSize`** — caps at the same width on desktop, shrinks instead of overflowing when narrow.
- **Dashboard's 4 hand-placed x-axis labels** under 5 data points (already misaligned) → a real `<XAxis>`.
- **StepIndicator** 388px intrinsic vs 343px available → `h-8 w-8 sm:h-10 sm:w-10` etc. New intrinsic: 248px. Desktop byte-identical.
- **`Step3Style` `grid-cols-2`** with zero breakpoints, **`Step2Skills`** three buttons with no wrap.
- **iOS zoom-on-focus**: header inputs are `text-sm` (<16px) → `text-base lg:text-sm`.
- **Landing particles**: 400 → 120/220/400 by width, add DPR handling, `prefers-reduced-motion`, `pointermove` instead of `mousemove` (touch currently does nothing), and pause on tab hide.

### Roadmap canvas
`RoadmapCanvas` gets a real prop API (`nodes`, `edges`, `dataKey`, `onNodeSelect`). Three fixes:
- `useNodesState` seeds once and never syncs → merge-on-`dataKey`-change that **keeps user-dragged positions by id** while taking fresh `data`.
- MiniMap `nodeColor` re-reads the mock → reads live state via a static status→color record.
- The per-render node remap that stuffs `onClick` into `data` (unserializable, and defeats memoization) → `<ReactFlow onNodeClick>`.

Plus `fitViewOptions={{ minZoom: 0.35 }}` — with 40 generated nodes plain `fitView` zooms to ~0.1 and every node becomes an unreadable smudge. And touch config (`zoomOnPinch`, `preventScrolling`, `zoomOnDoubleClick={false}`), none of which exists today.

**Detail panel** becomes a Radix sheet (focus trap, Esc, scroll lock, `aria-modal` — none present today). Desktop-preservation detail: today the panel is `absolute` inside the pane so it does *not* dim the sidebar; a stock `fixed` sheet would. Portal into the pane element on `lg`, into `document.body` below it. Selection moves to `?node=<id>` so back works and deep links work.

### Courses restructure
One 303-line client component using a `view` string as a router becomes real routes:
`/courses` → `/courses/[courseId]` → `/courses/[courseId]/[chapterId]` → `…/quiz` → `…/complete`.
Back works, refresh works, chapters are linkable, and resume-from-last-chapter becomes possible. All five hardcoded `5`s derive from `questions.length`; the `score >= 3` threshold becomes `Math.ceil(total * 0.6)`.

### Approved visual changes
- **`next/font` with real 400–900 weights.** Every heading is currently *synthesized* bold; real weights look subtly crisper. Also kills a render-blocking Google Fonts `@import`.
- **`@tailwindcss/typography` installed**, making the dead `prose` classes real. Needs `prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0` resets so the existing dark code blocks in the seeded content aren't fought.
- **1024–1279px reflows** to 2–3 columns.

### Palette — deliberately NOT unified
Three grays coexist: pages use `slate-*`, `components/ui/*` use `zinc-*`, background is `bg-[#f3f4f6]` ×6. Slate is blue-tinted, zinc is neutral — a global swap across hundreds of usages **is** a visible warmth shift on every surface, for purely cosmetic benefit. Do the zero-risk parts only: add a `--color-canvas` token for the repeated literal, delete the vestigial `#__next` rule, delete the four unreferenced `@theme` colors (two of which shadow Tailwind's `border-*`/`bg-*` namespace — a trap). Then **document the split in CLAUDE.md** rather than fixing it.

---

## Build order

**Phase 0 — Foundation (serial, blocking).** Resolve the two lockfiles; install everything; register Tailwind plugins and the container/canvas tokens; `next/font`; build `Skeleton`/`EmptyState`/`Sheet`/`Dialog`; add `asChild` + `type="button"` to `button.tsx` (a `<Button>` in a form currently submits it — a live footgun); fix the 6 existing lint errors.

**Phase 1 — Shell (serial, blocking).** `AppShell`, `PageHeader`, sidebar trio, `(dashboard)/layout.tsx`. Move all five pages in **unchanged except** for deleting their shell and header. **Checkpoint: all five routes must be pixel-identical to pre-refactor screenshots at 1440px before anything else starts.**

**Phase 2 — Backend, parallel with Phase 3.** Schema + migrations + seed + Clerk + DAL, then the Groq pipeline. Verification gates from Phase 1 above apply here.

**Phase 3 — UI tracks (5-way parallel, no shared files).** Metrics pages · Courses routes · Roadmap canvas · Resources · Landing+onboarding.

**Phase 4 — Async states.** Every `loading.tsx` / `error.tsx`, all skeletons, and **every empty state** — this is the highest-value, most-skipped item, since a new user currently sees blank cards on every page. Plus the generation waiting experience.

**Phase 5 — Wire real data.** Mechanical, because Phase 3 already made every page prop-driven and every shape serializable. Delete `lib/mockData.ts`.

**Phase 6 — Verify.** 375/414/768/1024/1280/1440/1920 × 8 routes, with ≥1280 diffed against the Phase-1 baseline. Keyboard-only pass. `prefers-reduced-motion`. iOS Safari: no zoom on input focus, safe-area insets, `h-dvh` behavior.

---

## Cross-agent contracts to lock early

Three interfaces span the phases and should be defined before parallel work starts:
1. Query-layer return shapes must be **serializable and pre-formatted** (dates formatted server-side — `toLocaleString()` on the client hydration-mismatches across timezones).
2. The resources `icon: React.ReactNode` must become `iconKey: string` — a JSX element cannot come from a DB query.
3. Roadmap needs a `status: 'generating' | 'ready' | 'failed'` field plus a status endpoint, or the waiting UI has nothing to poll.

## Verification

- `SELECT 1` through `/api/health` in **both** `npm run dev` and `npm run build && npm start` (Turbopack's graphs differ).
- Seed, then confirm 5 courses / 25 chapters / 125 questions land and re-running the seed is a no-op.
- Sign up → questionnaire → watch generation → roadmap renders with computed statuses.
- Open devtools on the quiz page and confirm **no `correctIndex` or `explanation`** appears in any payload.
- Double-click "Generate My Roadmap" and confirm exactly one roadmap exists.
- Feed the validator hand-written adversarial fixtures: cyclic graph, orphan node, 3× over budget, duplicate ids.
- Click through a resource card and confirm it opens a real URL in a new tab.
- New-user pass: every page must show a real empty state, never a blank card or an empty chart frame.