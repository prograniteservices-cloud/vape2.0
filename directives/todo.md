# Phase 8: Semantic Search Integration - Task List

## Active Branch

- `codex-phase8-vertex-audit`
- User approved pushing completed work to `main`.
- Protected MVP branch/deployment remains off limits unless explicitly requested.

## Completed

- [x] Update project docs for Supabase + Vertex semantic search direction.
- [x] Create `PROJECT_STATE.md` as canonical continuity tracker.
- [x] Create `DECISIONS.md`.
- [x] Add Supabase pgvector migration for `public.inventory` and `match_products`.
- [x] Add `@supabase/supabase-js`.
- [x] Add Vertex diagnostic script.
- [x] Add Vertex enrichment script.
- [x] Confirm target Supabase project `kqxbysmbnoejkflufnyj`.
- [x] Enrich current 288 inventory rows with category, metadata, and 768-dim embeddings.
- [x] Verify semantic RPC with real query embeddings.
- [x] Add server-only Supabase client.
- [x] Add server-side Vertex embedding helper.
- [x] Add `/api/search`.
- [x] Wire assistant product searches to semantic results.
- [x] Keep static catalog fallback.
- [x] Remove hardcoded Gemini/Supabase credential fallbacks found in scripts.
- [x] Verify TypeScript and production build.

## Next

- [ ] User manual UI test in browser.
- [ ] Decide whether to tune semantic threshold or add category filtering.
- [ ] Review `Miscellaneous` rows for manual taxonomy improvements.
- [ ] Push/deploy only to confirmed non-MVP targets.

