# Project State - VapeOS v2

This is the canonical continuity file for Codex sessions. Update it whenever work changes the project state, a blocker is discovered, or the next action changes.

## Last Updated

2026-05-01 by Codex on `codex-phase8-vertex-audit`

## Protected Production MVP

- Current client-facing MVP is deployed separately under the Vercel link/name `vapes and more mvp 2026`.
- Do not touch, deploy over, or merge into the production MVP branch unless the user explicitly asks.
- Treat `vapes-and-more-mvp-2026` as protected.
- New work must happen on a separate branch from the MVP branch.
- Do not push to GitHub or deploy to Vercel without explicit user approval and a confirmed target branch/deployment.

## Trust Model

- API keys/tokens are assumed valid unless direct evidence says otherwise.
- Prior handoff/docs are useful leads but not trusted as source of truth.
- Verify claims against the actual repo files, scripts, package state, Supabase state, and command output before acting.
- Keep browser automation prohibited. Use static checks, non-browser tests, backend tests, and manual test instructions.

## Current Objective

Build a reliable semantic inventory search backend for the Vape More MVP using Supabase PostgreSQL + pgvector, then integrate it into the app without disrupting the client-facing MVP.

## Verified Repo Facts

- Framework: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS 4.
- Supabase JS dependency exists in `package.json`: `@supabase/supabase-js`.
- Supabase folder exists with config and migration:
  - `supabase/config.toml`
  - `supabase/migrations/20260501113402_init_vector_inventory.sql`
- Existing migration creates:
  - `public.inventory`
  - `embedding vector(768)`
  - RLS with public read policy
  - `public.match_products(...)`
- Existing scripts include:
  - `scripts/seed-mvp.ts`
  - `scripts/test-vertex.ts`
  - `scripts/generate-embeddings-vertex.ts`
- `src/lib/supabase.ts` is referenced by `handoff.md` but does not currently exist.
- `src/lib/supabase.ts` now exists and creates a server-only Supabase client using `SUPABASE_SERVICE_ROLE_KEY`.
- `src/lib/vertex.ts` now creates server-side Vertex search embeddings using `text-embedding-004`.
- `src/app/api/search/route.ts` now accepts natural-language search requests, generates a Vertex embedding, calls `public.match_products`, and returns app-shaped `Product` objects.
- The assistant navigation flow now sends specific `[SHOW:category:terms]` searches through `/api/search` and falls back to the static catalog filter if the API fails.
- Branch for current audit/fix pass: `codex-phase8-vertex-audit`.
- `scripts/test-vertex.ts` now uses `@google/genai` in Vertex mode and checks chat plus embedding model availability by region.
- `scripts/generate-embeddings-vertex.ts` now uses `@google/genai` in Vertex mode, defaults to dry-run, and only writes when `--write` is passed.
- Vertex diagnostic confirmed `text-embedding-004` returns 768 dimensions in `us-central1`, `us-east1`, and `us-west1`.
- Vertex diagnostic confirmed old Gemini 1.5 Flash model IDs return 404; defaults were updated to Gemini 2.5/2.0 Flash model IDs.
- Updated Vertex diagnostic confirmed `gemini-2.5-flash-lite` and `text-embedding-004` work in `us-central1`, `us-east1`, and `us-west1`.
- Dry-run enrichment passed with `npm run phase8:enrich:vertex -- --limit=1`: one Supabase row was read, Vertex generated metadata, a 768-dim embedding was generated, and no DB write occurred.
- Confirmed target Supabase URL: `https://kqxbysmbnoejkflufnyj.supabase.co`.
- One-row write enrichment passed with `npm run phase8:enrich:vertex -- --limit=1 --write`: one `10 Star` row was updated with category, metadata, and a 768-dim embedding.
- Verification found duplicate `10 Star` product names; 1 of 3 returned rows has enrichment. Future verification should use row IDs/Clover IDs, not product name alone.
- `match_products` RPC was tested with a real Vertex query embedding and returned the enriched `10 Star` row with similarity about `0.91`.
- Enrichment prompt was tightened to use the app category taxonomy, avoid unsupported claims, classify Al Fakher/hookah/shisha as `Hookah & Shisha`, classify beverages and pipe tobacco separately, and keep ambiguous products conservative.
- Current Supabase enrichment progress: 288 of 288 rows enriched, 0 rows missing embeddings.
- Latest category distribution among enriched rows:
  - `Cigars`: 71
  - `Miscellaneous`: 65
  - `Hookah & Shisha`: 41
  - `Beverages`: 28
  - `E-Liquids`: 26
  - `Vape Devices`: 20
  - `CBD & Delta`: 13
  - `Kratom`: 7
  - `Smoking Accessories`: 6
  - `Cigarettes`: 5
  - `Candy & Snacks`: 4
  - `Lighters & Torches`: 1
  - `Pipe Tobacco`: 1
- All enriched rows were reprocessed after taxonomy fixes; verified Al Fakher rows map to `Hookah & Shisha`, Apothic/Arizona/Angry Orchard/Barefoot rows map to `Beverages`, American Club Pipe Tobacco maps to `Pipe Tobacco`, Black & Mild rows map to `Cigars`, and Black Bar rows map to `Vape Devices`.
- `match_products` was rechecked after full enrichment:
  - `black mild wood tip cigar` returns cigar results.
  - `black bar vape` returns Black Bar as `Vape Devices`.
  - `apothic merlot bottle` returns Apothic Merlot as `Beverages`.
- `/api/search` was tested locally through the Next dev server with real Vertex embeddings and Supabase RPC:
  - `black mild wood tip cigar` returned Black & Mild cigar results.
  - `watermelon ice vape` returned BC5000 Watermelon Ice first.
  - `apothic merlot bottle` returned Apothic Merlot first.
  - `al fakher watermelon hookah shisha` returned Alfakher Watermelon first.
- Production build passes with `npm run build`.
- Full TypeScript passes with `npx tsc --noEmit --pretty false`.
- Targeted lint on the changed app/search files and repaired scripts passes with only existing `Dashboard` `<img>` warnings.
- Removed a hardcoded Gemini fallback key from `scripts/generate-embeddings.ts`; recorded the discovery in `C:\Users\heath\Desktop\skills\auth\gemini.md` and `C:\Users\heath\Desktop\skills\auth\SOURCES.md`.
- Added frontend categories in `src/lib/data.ts`: `Pipe Tobacco`, `Hookah & Shisha`, and `Beverages`.
- Added targeted script repair option: `--name-contains=<text>` for reprocessing matching product names.
- Script runners were added to `package.json`:
  - `npm run phase8:vertex:test`
  - `npm run phase8:enrich:vertex`

## Current Phase

Phase 8 semantic enrichment is complete for the current 288-row Supabase inventory, and first-pass app search integration is implemented locally on `codex-phase8-vertex-audit`.

Completed:

- `category`
- `metadata`
- `embedding`
- server-side `/api/search`
- assistant-to-search UI handoff

Next project phase: manually test and harden the app-level semantic search experience, then prepare a reviewable branch/PR when approved.

## Active Risks / Unknowns

- The handoff may be stale or inaccurate.
- Supabase project refs differ across files:
  - Confirmed target project URL: `https://kqxbysmbnoejkflufnyj.supabase.co`.
  - Confirmed target project ref: `kqxbysmbnoejkflufnyj`.
  - Older references mention `gnojtwlxcsmdhymqytzm`.
  - Treat older `gnojtwlxcsmdhymqytzm` references as stale unless the user explicitly revives them.
- Vertex is the primary enrichment path for this branch. AI Studio is not used by the Vertex script.
- Enrichment scripts may hit quota/cost limits if run with `--write` and large limits.
- Full repo lint still has broad pre-existing issues outside the Phase 8/search path. Full TypeScript now passes.
- Node emits `MODULE_TYPELESS_PACKAGE_JSON` warnings for TypeScript script execution via `node --experimental-strip-types`; scripts still run successfully.
- Product names are not unique in `public.inventory`; scripts and verification should log/use `id` and `clover_id`.
- Some product names are too ambiguous for reliable category inference from name alone; conservative `Miscellaneous` is expected for these.
- Frontend/enrichment taxonomy now includes first-class `Hookah & Shisha`, `Beverages`, and `Pipe Tobacco` categories.
- Existing generated/scraped files are large; avoid loading them unless required.
- There are many pre-existing modified/untracked files in the worktree. Do not revert unrelated changes.

## Next Recommended Actions

1. Manually test the app at the local dev URL by asking product-search prompts such as `Find watermelon flavored vapes`, `Do you have Black and Mild wood tips?`, and `Show me Al Fakher watermelon`.
2. Review whether semantic results need category filtering or score thresholds before client review.
3. Consider reviewing `Miscellaneous` rows for manual taxonomy improvements.
4. Clean up repo-wide lint issues when ready.
5. When approved, push `codex-phase8-vertex-audit` as a separate GitHub branch and deploy only to a non-MVP Vercel target.

## Session Restart Checklist

At the start of a future session:

1. Read `AGENTS.md`.
2. Read this file.
3. Check `git status --short --branch` using a safe-directory override if needed.
4. Read only the directive files relevant to the next action.
5. Verify any stale claim before acting.
6. Update this file before ending the session if state changed.

## Update Rules

When ending meaningful work, update:

- `Last Updated`
- `Verified Repo Facts` if facts changed
- `Current Phase` if the phase changed
- `Active Risks / Unknowns` if blockers were added or resolved
- `Next Recommended Actions`

Keep this file short and factual. Detailed implementation notes belong in code comments, issue logs, or phase docs.
