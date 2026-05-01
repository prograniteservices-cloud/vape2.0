# Product Functional Document: vape2.0

## Core Features

### 1. Hierarchical Category Navigation
**Priority**: High
**Status**: In Progress

**Description**:
Left sidebar displays category tree that expands progressively. Categories drill down from general (Vapes) to specific (Watermelon flavor) with smooth animations. Each level reveals only when parent is selected.

**User Stories**:
- As a customer, I want to see categories organized hierarchically so that I can narrow down my search systematically
- As a non-tech-savvy user, I want navigation that shows me options gradually so I don't feel overwhelmed

**Acceptance Criteria**:
- [ ] Clicking a category expands to show subcategories below it
- [ ] Subcategories can be nested multiple levels deep
- [ ] Visual indicator shows which category is currently selected
- [ ] Smooth animation when expanding/collapsing categories
- [ ] "Browse" option available at each level for unsure customers

**Technical Requirements**:
- Recursive category tree component
- State management for expanded/collapsed nodes
- Smooth CSS transitions for expand/collapse

---

### 2. AI Chat Assistant
**Priority**: High
**Status**: Complete (Debugging Vercel API connection)

**Description**:
AI chat window integrated into left sidebar above category navigation. Provides real-time assistance, answers questions about products, helps with navigation, and gives recommendations.

**User Stories**:
- As a customer, I want to ask questions in natural language so I can get help finding what I need
- As a confused shopper, I want the AI to suggest categories based on my description

**Acceptance Criteria**:
- [ ] Chat window visible at top of left sidebar
- [ ] Text input for customer questions
- [ ] AI responses guide users to appropriate categories
- [ ] Chat history visible in the window
- [ ] AI can suggest browsing categories based on vague descriptions

**Technical Requirements**:
- Gemini API integration (server-side via Next.js API Routes)
- Chat message state management
- Auto-scroll to latest message
- Typing indicators

---

### 3. Irregular-Shaped Category Cards
**Priority**: High
**Status**: In Progress

**Description**:
Main dashboard displays categories as cards of varying shapes and sizes - different sized rectangles, circles, and organic shapes. No uniform grid. Cards display category names only (not products). Clicking navigates deeper or shows items.

**Acceptance Criteria**:
- [ ] Cards appear in various shapes (rectangles of different sizes, circles, etc.)
- [ ] No two cards are identical in shape/size
- [ ] Cards display category name prominently
- [ ] Hover effects indicate interactivity
- [ ] Clicking a card navigates to subcategories or shows items
- [ ] Responsive layout that maintains irregularity across screen sizes

**Technical Requirements**:
- CSS Grid with custom placement
- Framer Motion or similar for animations
- Dynamic card sizing algorithm
- 2026 high-end design aesthetic

---

### 4. Browse Mode ✅ COMPLETE
**Priority**: Medium
**Status**: Complete - 2026-01-30

**Description**:
Special "Browse" button available at every category level. When clicked, displays items from current category level without requiring specific subcategory selection.

**Acceptance Criteria**:
- [x] "Browse" option visible at every category level
- [x] Clicking Browse shows all items at current level
- [x] Items displayed in same irregular card style
- [x] Can still navigate to subcategories from browse view

---

### 5. Item Display ✅ COMPLETE
**Priority**: High
**Status**: Complete - 2026-01-30

**Description**:
When customer reaches leaf category or clicks Browse, dashboard displays actual vape products in irregular-shaped cards with product info.

**Acceptance Criteria**:
- [x] Products display in irregular-shaped cards
- [x] Each card shows product image, name, price
- [x] Clicking product shows detailed view
- [x] Visual distinction between category cards and product cards

---

### 6. Semantic Search (Vector Search)
**Priority**: High
**Status**: Implemented locally — Phase 8

**Description**:
Natural language product search powered by Supabase pgvector. User query is embedded via Gemini `text-embedding-004` (768 dimensions). The `match_products` RPC function performs cosine similarity search against pre-embedded inventory items. Results are ranked by similarity score with optional price filtering.

**User Stories**:
- As a customer, I want to say "something fruity under $20" and get relevant results
- As a voice user, I want my spoken query to find matching products instantly

**Acceptance Criteria**:
- [x] Query embedding generated server-side via Vertex AI
- [x] `match_products` RPC returns ranked results above similarity threshold
- [x] Results can be filtered by max price at the API/RPC layer
- [x] Results displayed in product card grid through assistant navigation
- [x] Graceful fallback to static catalog filtering when API search fails

**Technical Requirements**:
- Supabase JS client calling `match_products` RPC
- Server-side embedding generation via Gemini API route
- `public.inventory` table with `embedding vector(768)` column
- Cosine similarity operator (`<=>`) in SQL

---

## Technical Requirements

### Stack
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase cloud PostgreSQL + pgvector
- **Semantic Search**: `match_products` RPC (cosine similarity)
- **AI/Embeddings**: Gemini API (`text-embedding-004`)
- **Authentication**: Optional for Phase 1 (open read via RLS policy)
- **Payment**: Not required for Phase 1 (catalog only)
- **Deployment**: Vercel (protected MVP deployment must not be overwritten)

### Data Structure

**Inventory Table** (`public.inventory`):
```
id          uuid       PK, default gen_random_uuid()
clover_id   text       UNIQUE — Clover URL slug (e.g. "bc5000-watermelon-ice-GHTXQHV46T21W")
name        text       Product name (e.g. "BC5000 WATERMELON ICE")
price       integer    Price in cents (e.g. 1799 = $17.99)
category    text       LLM-generated category label
metadata    text       LLM-generated flavor profile / description
embedding   vector(768) Gemini text-embedding-004 output
```

**Categories Tree** (derived from inventory, not a separate table in MVP):
```
Vapes
├── Flavor
│   ├── Watermelon, Strawberry, Grape, Mango, Menthol...
├── Hits
│   ├── 5000, 10000, 15000...
├── Brand
│   ├── BC5000, Lost Mary, Elf Bar, Geek Bar...
├── Type
│   ├── Disposable, Cartridge, Mod, Pod...
└── Accessories
```

**match_products RPC Signature**:
```sql
match_products(
  query_embedding  vector(768),
  match_threshold  float,
  match_count      int,
  max_price        int  -- nullable, in cents
) returns table(id, name, price, category, metadata, similarity)
```

## Performance Targets
- **Page Load**: < 2 seconds
- **Semantic Search Latency**: < 800ms (embedding + RPC round trip)
- **Category Expansion**: < 100ms
- **Lighthouse Score**: > 90

## Testing Requirements
- [ ] Unit tests for embedding pipeline
- [ ] Integration test: seed → embed → search round trip
- [ ] E2E tests (critical search paths)
- [ ] Mobile responsive testing

## Third-Party Integrations
- **Gemini API**: Chat assistant + product embedding generation
- **Supabase**: PostgreSQL + pgvector (cloud-hosted)
- **Vercel**: Hosting and deployment
- **Clover**: Data source (JSON scrape MVP → CSV/API future)

## Last Updated
2026-05-01 (Phase 8: Semantic search integration implemented locally)
