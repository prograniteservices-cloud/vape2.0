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
  - Offload heavy compute to Edge Functions or Vertex AI.

## Deployment & SEO
- **Vercel**: Automated build with Static Page Generation for catalog.
- **Sitemaps**: Automated generator for all product routes.
- **Discovery**: Composio GSC tool for automated sitemap submission.

## Standard Stack
- **Database**: Firebase (Firestore + Security Rules).
- **Backend**: Firebase Cloud Functions (Stock Triggers).
- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4.
- **Deployment**: Vercel.

## Testing Protocol
- [ ] **Unit Tests**: Vitest/Jest for logic.
- [ ] **E2E Tests**: Playwright for scanner and PWA flows.
- [ ] **Security**: Verify Firebase Security Rules for `organization_id` isolation.
- [ ] **Performance**: Page load < 2s on target hardware.

## Project Structure
```
vape2.0/
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/               # Feature & Layout components
│   ├── lib/                      # Core logic & Supabase client
│   └── types/                    # TypeScript interfaces
├── directives/                   # Project documentation
├── public/                       # PWA manifest & assets
├── .env.local                    # Secrets
└── ...
```

## Last Updated
2026-04-30 (Updated Phase 6 Voice AI Showcase complete, pending Vercel API debug)
