# Standard Operating Procedure: VapeOS v2

## Agentic Workflow (Superpowers Framework)
1. **Brainstorming**: Refine requirements and UI design before implementation.
2. **Git Worktrees**: Isolate feature work on separate branches.
3. **Writing Plans**: Break tasks into 2-5 minute sub-tasks.
4. **Subagent-Driven Development**: Perform Two-Stage Reviews (Spec → Code Quality).
5. **TDD Enforcement**: 
   - Write failing test.
   - Implement minimal code to pass.
   - No code merged without passing tests.

## Environment & Secrets
- **Secrets Management**: Managed in `.env.local` for Supabase, Vercel, and GCP.
- **Hardware Optimization**: 
  - Minimize local memory pressure.
  - **No local Docker / `supabase start`** — all Supabase operations target the cloud project directly via `supabase db push`.
  - Offload heavy compute to Supabase Edge Functions or Vertex AI.

## Deployment & SEO
- **Vercel**: Automated build with Static Page Generation for catalog.
- **Branch Strategy**:
  - `vapes-and-more-mvp-2026` — live Vercel production (DO NOT TOUCH).
  - `main` — active integration branch when explicitly approved by the user.
  - feature/audit branches — use for work before approval.
- **Sitemaps**: Automated generator for all product routes.
- **Discovery**: Composio GSC tool for automated sitemap submission.

## Standard Stack
- **Database**: Supabase cloud-hosted PostgreSQL + pgvector extension.
- **Semantic Search**: `pgvector` cosine similarity via `match_products` RPC function.
- **Backend**: Next.js API Routes + Supabase Edge Functions (future stock triggers).
- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4.
- **Deployment**: Vercel.
- **AI/Embeddings**: Gemini API (`text-embedding-004`, 768 dimensions) for product metadata generation and vector embeddings.

## Data Pipeline (MVP → Production)
1. **MVP Phase (current)**: Partial JSON scrape from `vape-more.cloveronline.com` used as seed data.
2. **Enrichment Phase (Phase 8)**: LLM generates flavor profiles, categories, and product metadata per item name. Embeddings generated via `text-embedding-004` and stored in `embedding` column.
3. **Production Phase (future)**: Replace scrape with official Clover CSV export or full Clover API integration.

## Testing Protocol
- [ ] **Unit Tests**: Vitest/Jest for logic.
- [ ] **E2E Tests**: Playwright for scanner and PWA flows.
- [ ] **Security**: Verify Supabase RLS policies for data isolation.
- [ ] **Performance**: Page load < 2s on target hardware.

## Project Structure
```
vape2.0/
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/               # Feature & Layout components
│   ├── lib/                      # Core logic & Supabase client
│   └── types/                    # TypeScript interfaces
├── supabase/
│   ├── config.toml               # Supabase CLI config
│   └── migrations/               # SQL migrations (applied via db push)
├── scripts/
│   └── seed-mvp.ts               # MVP data seeding utility
├── directives/                   # Project documentation
├── public/                       # PWA manifest & assets
├── .env.local                    # Secrets (never committed)
└── ...
```

## Last Updated
2026-05-01 (Phase 8: semantic enrichment and first-pass app search integration complete)
