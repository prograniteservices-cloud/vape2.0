# Codex Project Guide - VapeOS v2

This file is the first-read guide for Codex CLI sessions in this repo. Keep it concise, current, and safe for future agents.

## Current Mission

VapeOS v2 is an MVP for a vape shop inventory discovery app. The active work is moving from a polished local/demo UI toward a real semantic inventory search backend.

- App: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion.
- Database: Supabase cloud PostgreSQL with pgvector.
- AI: Gemini / Vertex AI for metadata generation and embeddings.
- Deployment: Vercel.
- Active branch target: `vape2.0`.
- Production MVP branch: `vapes-and-more-mvp-2026` - do not touch unless the user explicitly asks.

## Read These First

For project context, read these small files before making broad changes:

1. `PROJECT_STATE.md` - canonical current state, protected branch rules, risks, and next actions.
2. `DECISIONS.md` - durable project decisions and rationale.
3. `handoff.md` - historical operational handoff; verify before trusting.
4. `directives/SOP.md` - workflow, branch strategy, cloud-only Supabase rules.
5. `directives/PDD.md` - product/design intent and architecture.
6. `directives/PFD.md` - functional requirements and acceptance criteria.
7. `directives/todo.md` - current phase checklist; may be stale.
8. `directives/NORTH_STAR.md` - user experience direction.

Avoid loading large/generated files unless needed for the task:

- `node_modules/`
- `.next/`
- `package-lock.json` unless dependency resolution matters
- `src/data/inventory.json`
- `merged_inventory.json`
- large scraped HTML/JSON files in the repo root

## Current State Snapshot

As of May 1, 2026:

- Phase 7 Supabase/pgvector backend is mostly initialized.
- Supabase migration exists at `supabase/migrations/20260501113402_init_vector_inventory.sql`.
- `@supabase/supabase-js` is already installed in `package.json`.
- `scripts/seed-mvp.ts`, `scripts/generate-embeddings-vertex.ts`, and `scripts/test-vertex.ts` exist.
- Phase 8 is active: enrich inventory with Vertex/Gemini metadata and embeddings, then test `match_products`.
- `directives/todo.md` has some stale unchecked items; verify against the actual tree before assuming work is missing.

Known project refs mentioned in docs:

- Current Supabase project ref in handoff/phase plan: `kqxbysmbnoejkflufnyj`.
- Older Supabase ref appears in some docs/scripts: `gnojtwlxcsmdhymqytzm`. Treat this as stale unless the user confirms otherwise.
- GCP project: `vape-494900`.

## Safety Rules

### Browser Access Prohibition

Do not use browser automation or tools that launch/control a browser:

- No Playwright.
- No Puppeteer.
- No Selenium.
- No Cypress.
- No automated browser screenshots.
- No scripts that launch browser instances.

Use static analysis, unit/component tests that do not launch a browser, backend/API tests, and manual test instructions for the user.

Before running any test command, verify it does not launch a browser, install a browser driver, or take browser screenshots.

### Secrets

Centralized credential storage is at:

`C:\Users\heath\Desktop\skills\auth\`

Existing auth material such as API keys, tokens, JSON service account files, URLs, and integration notes are kept there across several service-specific files. Check the relevant file before asking the user for credentials. Do not print secrets to logs or final responses.

When creating, deleting, rotating, or discovering auth material:

- Update the relevant file in `C:\Users\heath\Desktop\skills\auth\`.
- Add a short source/status note so future agents know where it came from and whether it is active.
- If a matching service file does not exist, create one with the service name, credential purpose, status, source, and usage notes.
- Never copy raw secret values into project docs, commit messages, or chat responses.

Important credential files include:

- `supabase.md` / `supabase_vape.md` if present
- `gemini.md`
- `vercel.md`
- `github.md`
- `gmail.md`
- `context7.md`
- `firecrawl.md`
- `elevenlabs.md`

Project env files may exist, but never commit them:

- `.env.local`
- `.env.vercel`
- any `.env*`
- `service-account-key.json`

Keep these ignored:

```gitignore
*.env
*.env.local
.env.*
service-account-key.json
credentials/
connections/
*token*
*secret*
*_key*
```

Never expose a Supabase `service_role` key or secret key in client code. In Next.js, anything prefixed with `NEXT_PUBLIC_` is browser-visible.

## Supabase Rules

Use the local Supabase skill guidance for any Supabase work. Key repo-specific rules:

- Cloud Supabase only.
- Do not run local Docker or `supabase start`.
- Use `supabase --help` before unfamiliar CLI commands.
- For new migrations, create them with `supabase migration new <name>` instead of inventing filenames.
- Apply schema to the cloud project only when the user wants that action and credentials are available.
- Tables in exposed schemas need RLS. The MVP inventory table intentionally has public read access.
- Do not put `security definer` functions in exposed schemas.
- Views that should honor RLS need `security_invoker = true` on supported Postgres versions.

Current schema target:

- `public.inventory`
- `embedding vector(768)`
- `public.match_products(query_embedding, match_threshold, match_count, max_price)`

## AI / Vertex Rules

- Product metadata and embeddings should be generated server-side or in scripts, never with public client secrets.
- Prefer Vertex AI for Phase 8 enrichment because the free Gemini API path hit quota limits.
- `service-account-key.json` is sensitive and must remain uncommitted.
- Scripts should read credentials from env vars or the centralized auth folder, not hardcoded keys.

## Development Commands

Use these when relevant and safe:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` uses `next build --webpack`. It may take longer and can write build output to `.next/`.

Do not start a browser for verification. If UI verification is needed, provide manual browser steps to the user.

## Codebase Map

- `src/app/` - Next.js App Router pages and API routes.
- `src/components/layout/` - main dashboard/sidebar layout.
- `src/components/features/` - chat, voice, cards, product views.
- `src/lib/` - Gemini, Firebase, inventory/data helpers.
- `src/data/inventory.json` - large local inventory dataset; avoid loading wholesale.
- `supabase/` - cloud migration/config files.
- `scripts/` - data scraping, seeding, enrichment, and diagnostics.
- `directives/` - project intent and phase planning.
- `sales/` - client/demo sales collateral.

## Known Cleanup Risks

- Some docs contain mojibake from emoji encoding. Prefer ASCII when editing instructions.
- Some scripts were created during MVP exploration and may be stale.
- At least one legacy embedding script appears to contain a hardcoded Gemini-like key. Do not print it; move any needed credential to env/central auth before using that script.
- `git status` may fail under Codex sandbox with a dubious ownership warning. If git operations are required, ask before changing global git config.

## Working Style For This Repo

- Preserve the MVP's visual direction unless the user asks to simplify it.
- Prioritize semantic search backend stability over the stalled voice showcase.
- Keep changes focused; this repo contains many generated/scraped artifacts.
- Update `PROJECT_STATE.md` when you materially change current status, risks, blockers, or next steps.
- Update `DECISIONS.md` when the user makes a durable project/process decision.
- Update `handoff.md` only when the user asks or when maintaining historical handoff continuity is specifically useful.
- Update directive docs only when they become inaccurate or when the user asks for planning documentation.
