-- =============================================================================
-- Migration: init_vector_inventory
-- Phase 7: Semantic Search Backend for Vape More Shop
-- Applied via: supabase db push (cloud-only, no local Docker)
-- =============================================================================

-- Enable pgvector extension (must be in 'extensions' schema for Supabase)
create extension if not exists vector with schema extensions;

-- =============================================================================
-- Table: public.inventory
-- Stores the full Clover product inventory with semantic search embeddings.
-- Price stored as integer cents to avoid floating point precision issues.
-- embedding: vector(768) matches Google text-embedding-004 output dimensions.
-- =============================================================================
create table if not exists public.inventory (
  id         uuid        primary key default gen_random_uuid(),
  clover_id  text        unique,                -- Clover URL slug (unique product identifier)
  name       text        not null,              -- Product name (e.g. "BC5000 WATERMELON ICE")
  price      integer,                           -- Price in cents (e.g. 1799 = $17.99)
  category   text,                             -- LLM-generated category label (Phase 8)
  metadata   text,                             -- LLM-generated flavor profile / description (Phase 8)
  embedding  vector(768)                        -- Gemini text-embedding-004 output (Phase 8)
);

-- =============================================================================
-- Row Level Security
-- Open read access for MVP (unauthenticated product browsing).
-- Write access requires service_role_key (server-side only).
-- =============================================================================
alter table public.inventory enable row level security;

create policy "Public read access"
  on public.inventory
  for select
  using (true);

-- =============================================================================
-- Function: match_products
-- Semantic similarity search using pgvector cosine distance operator (<=>).
-- Similarity = 1 - cosine_distance (range: 0.0 to 1.0, higher = more similar).
-- max_price is optional (null = no price filter), in cents.
-- =============================================================================
create or replace function public.match_products(
  query_embedding  vector(768),
  match_threshold  float,
  match_count      int,
  max_price        int default null
)
returns table (
  id          uuid,
  name        text,
  price       integer,
  category    text,
  metadata    text,
  similarity  float
)
language sql stable
as $$
  select
    i.id,
    i.name,
    i.price,
    i.category,
    i.metadata,
    1 - (i.embedding <=> query_embedding) as similarity
  from public.inventory i
  where
    i.embedding is not null
    and 1 - (i.embedding <=> query_embedding) > match_threshold
    and (max_price is null or i.price <= max_price)
  order by i.embedding <=> query_embedding
  limit match_count;
$$;
