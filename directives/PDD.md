# Product Design Document: VapeOS v2 (Vape Shop MVP)

## Overview
**Project Type**: Agentic Semantic Inventory Search System for Vape Shop (PWA)
**Technology Stack**: Next.js (App Router) + React 19 + Tailwind CSS 4 + Supabase (PostgreSQL + pgvector)
**Deployment**: Vercel (SSG for Catalog; protected MVP must not be overwritten)
**Hardware Constraint**: Optimized for Pentium Gold CPU / 4GB RAM — all heavy compute offloaded to cloud

## Core Objectives
1. **Semantic Inventory Search**: Natural language product discovery powered by pgvector cosine similarity and LLM-generated embeddings.
2. **Mobile-First PWA**: Progressive Web App with offline capabilities.
3. **AI-Enriched Metadata**: LLM (Gemini) generates flavor profiles, product categories, and descriptive metadata per item name.
4. **Scalable Data Pipeline**: MVP uses partial Clover JSON scrape → future: official Clover CSV export or API integration.
5. **SEO Mastery**: Automated sitemap generation and submission via GSC API.

## User Personas
- **The Casual Browser**: Doesn't know what they want, wants to explore by flavor or type.
- **The Returning Customer**: Knows roughly what they want ("something watermelon, under $20").
- **The Shop Staff**: Needs fast lookup by name or category.

## User Journeys

### Journey 1: Semantic Search (Primary)
1. Customer types or speaks: "I want something fruity with a lot of hits."
2. System generates embedding from query via Gemini API.
3. `match_products` RPC returns top matches by cosine similarity.
4. Results filtered optionally by price.
5. Customer selects product.

### Journey 2: Category Browse
1. Customer opens PWA.
2. Left sidebar shows hierarchical category tree.
3. Customer drills down: Vapes → Flavor → Watermelon.
4. Product cards render from Supabase query.

### Journey 3: Voice AI Assistant
1. Customer activates voice mode.
2. Web Speech STT captures query.
3. Gemini processes intent and generates semantic search embedding.
4. Results surfaced with rich AI response.

### Journey 4: Inventory Management (Future)
1. Owner opens PWA on mobile.
2. Supabase Edge Function triggers reorder alert when stock < 5.

## Design Principles
1. **Simplicity Above All**: Intuitive for users aged 21-60.
2. **Visual Hierarchy**: Irregular card shapes (2026 high-end aesthetic).
3. **Performance First**: Optimized for low-resource hardware; prioritize cloud execution.

## Visual Design System
- Dark mode glassmorphism aesthetic.
- Framer Motion animations for card reveals and state transitions.
- Dual-layer glow effects on interactive elements.

## Technical Requirements

### Database
- **Engine**: Supabase cloud-hosted PostgreSQL (project: `kqxbysmbnoejkflufnyj`)
- **Extension**: `pgvector` enabled in `extensions` schema
- **Primary Table**: `public.inventory`
  - `id` — uuid (PK)
  - `clover_id` — text (unique, from Clover URL slug)
  - `name` — text (product name)
  - `price` — integer (cents, e.g. 1799 = $17.99)
  - `category` — text (LLM-generated)
  - `metadata` — text (LLM-generated flavor profile / description)
  - `embedding` — vector(768) (Gemini `text-embedding-004`)
- **RPC Function**: `match_products(query_embedding, match_threshold, match_count, max_price)`

### Data Ingestion Pipeline
| Phase | Source | Status |
|-------|--------|--------|
| MVP | Partial JSON scrape (`inventory_part_1.json`, ~1,760 items) | ✅ Available |
| Enrichment | LLM generates `metadata` + `embedding` per product name | Complete for current 288-row MVP inventory |
| Production | Official Clover CSV export or Clover REST API | 🔮 Future |

### Voice Agent
- Client-side Web Speech STT + server-side Gemini API integration.
- *Current Status*: UI/UX complete. Debugging Vercel production API connection.

### Frontend
- Next.js App Router with SSG for catalog pages.
- Supabase JS client for real-time queries.
- Future: Cloud Run for containerized auto-scaling.

### Intelligence
- **MVP**: Gemini API for chat responses and query embedding.
- **Phase 8**: Batch embedding generation complete for the current MVP inventory.
- **Future**: Vertex AI Agent Builder with grounding in real-time inventory.

## Last Updated
2026-05-01 (Phase 8: semantic enrichment and search integration complete)
