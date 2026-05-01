# Project Handoff: Vape 2.0

## Objective

Build a semantic inventory search system for the Vape More MVP using Supabase PostgreSQL + pgvector, Vertex AI embeddings, and the existing Next.js app UI.

## Protected MVP

- Client-facing MVP remains protected under Vercel link/name `vapes and more mvp 2026`.
- Do not deploy over or merge into the protected MVP branch `vapes-and-more-mvp-2026` unless explicitly requested.
- Current work is on `codex-phase8-vertex-audit`, with user approval to push the completed integration to `main`.

## Current Status

Phase 8 semantic enrichment and first-pass app integration are complete for the current Supabase inventory.

- Supabase target: `https://kqxbysmbnoejkflufnyj.supabase.co`
- Current inventory rows: 288
- Enriched rows: 288
- Missing embeddings: 0
- Embedding model: Vertex AI `text-embedding-004` with 768 dimensions
- Chat/enrichment model default: `gemini-2.5-flash-lite`
- Search RPC: `public.match_products`

## Core Files

- `PROJECT_STATE.md` - canonical current state and restart checklist
- `DECISIONS.md` - durable process decisions
- `supabase/migrations/20260501113402_init_vector_inventory.sql` - inventory + vector schema
- `src/app/api/search/route.ts` - server-side semantic search route
- `src/lib/supabase.ts` - server-only Supabase client
- `src/lib/vertex.ts` - server-side Vertex embedding helper
- `src/app/page.tsx` - assistant navigation to semantic search
- `src/lib/data.ts` - category taxonomy and product mapping
- `scripts/test-vertex.ts` - Vertex model diagnostic
- `scripts/generate-embeddings-vertex.ts` - enrichment pipeline

## Verification Completed

- `npx tsc --noEmit --pretty false` passes.
- `npm run build` passes.
- Targeted lint passes with only existing Dashboard image warnings.
- `/api/search` tested locally through Next dev server using real Vertex embeddings + Supabase RPC.

Sample successful semantic queries:

- `black mild wood tip cigar`
- `watermelon ice vape`
- `apothic merlot bottle`
- `al fakher watermelon hookah shisha`

## Known Issues / Risks

- Browser automation is prohibited; use manual UI testing steps instead.
- Repo-wide lint still has pre-existing issues outside this search path.
- Product names are not unique; scripts should log/use `id` and `clover_id`.
- Some `Miscellaneous` rows are conservative classifications and may need manual review.
- Existing scraped/generated files are large; avoid loading them unless required.

## Next Steps

1. Manually test the app UI with natural-language search prompts.
2. Decide whether semantic results need stricter category filtering or threshold tuning.
3. Review `Miscellaneous` rows for manual taxonomy improvements.
4. Push/deploy only to the confirmed non-MVP target.

## Last Updated

2026-05-01 by Codex
