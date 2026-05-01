import { NextResponse } from 'next/server';
import { createSearchEmbedding } from '@/lib/vertex';
import { createServerSupabaseClient } from '@/lib/supabase';
import { categoryNameToId, findCategoryById, categoryTree, getCategoryFallbackImage } from '@/lib/data';
import { Product } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type MatchRow = {
  id: string;
  name: string;
  price: number | null;
  category: string | null;
  metadata: string | null;
  similarity: number;
};

function toPositiveInt(value: unknown, fallback: number, max: number) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function toProduct(row: MatchRow): Product {
  const categoryId = categoryNameToId(row.category);
  const category = findCategoryById(categoryTree, categoryId);

  return {
    id: row.id,
    name: row.name,
    description: row.metadata || `Inventory match for ${row.name}.`,
    price: typeof row.price === 'number' ? row.price / 100 : 0,
    imageUrl: getCategoryFallbackImage(categoryId),
    categoryPath: [categoryId],
    color: category?.color,
    inStock: true,
    organization_id: 'default-shop',
    stock: 1,
    updated_at: new Date().toISOString(),
    similarity: row.similarity,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = String(body.query || '').trim();
    const limit = toPositiveInt(body.limit, 24, 50);
    const threshold = typeof body.threshold === 'number' ? body.threshold : 0.45;
    const maxPrice =
      typeof body.maxPrice === 'number' && Number.isFinite(body.maxPrice)
        ? Math.round(body.maxPrice * 100)
        : null;

    if (query.length < 2) {
      return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
    }

    const embedding = await createSearchEmbedding(query);
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.rpc('match_products', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      max_price: maxPrice,
    });

    if (error) {
      throw new Error(error.message);
    }

    const products = ((data || []) as MatchRow[]).map(toProduct);

    return NextResponse.json(
      {
        query,
        count: products.length,
        products,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('[Search API] Failed to search inventory:', error);
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 });
  }
}
