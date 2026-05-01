/**
 * seed-mvp.ts
 * 
 * Phase 7: MVP Data Seeding Script
 * 
 * Reads the partial Clover JSON scrape (inventory_part_1.json),
 * maps each item to the public.inventory schema, and upserts
 * all records into the Supabase cloud database.
 * 
 * NOTE: This seeds name/price/clover_id only.
 * category, metadata, and embedding are left NULL — to be
 * generated in Phase 8 via LLM (Gemini text-embedding-004).
 * 
 * Usage:
 *   npx ts-node --esm scripts/seed-mvp.ts
 * OR compile and run:
 *   npx tsc scripts/seed-mvp.ts --outDir dist && node dist/seed-mvp.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface CloverItem {
  name: string;
  price: number;
  url: string;
}

interface InventoryRow {
  clover_id: string;
  name: string;
  price: number;      // in cents
  category: null;
  metadata: null;
  embedding: null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts the Clover product ID from the URL slug.
 * e.g., "https://vape-more.cloveronline.com/bc5000-watermelon-ice-GHTXQHV46T21W"
 *   → "bc5000-watermelon-ice-GHTXQHV46T21W"
 */
function extractCloverId(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || url;
}

/**
 * Converts a float dollar price to integer cents.
 * e.g., 17.99 → 1799
 */
function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Maps a Clover scrape item to the inventory DB schema.
 */
function mapItem(item: CloverItem): InventoryRow {
  return {
    clover_id: extractCloverId(item.url),
    name: item.name.trim(),
    price: toCents(item.price),
    category: null,
    metadata: null,
    embedding: null,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seedMVP() {
  console.log("🌱 Vape 2.0 — MVP Data Seeder");
  console.log("================================");
  console.log(`📡 Target: ${SUPABASE_URL}`);

  // 1. Initialize Supabase client with service role (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 2. Load the JSON scrape
  const jsonPath = join(__dirname, "..", "inventory_part_1.json");
  console.log(`\n📂 Loading: ${jsonPath}`);
  
  let rawItems: CloverItem[];
  try {
    const content = readFileSync(jsonPath, "utf-8");
    rawItems = JSON.parse(content);
    console.log(`✅ Loaded ${rawItems.length} items from JSON scrape`);
  } catch (err) {
    console.error("❌ Failed to load inventory_part_1.json:", err);
    process.exit(1);
  }

  // 3. Map to DB schema
  const rows = rawItems.map(mapItem);
  console.log(`🗺️  Mapped ${rows.length} items to inventory schema`);

  // 4. Show sample mapping
  if (rows.length > 0) {
    console.log("\n📋 Sample mapping (first item):");
    console.log("  Source:", JSON.stringify(rawItems[0]));
    console.log("  Mapped:", JSON.stringify(rows[0]));
  }

  // 5. Upsert in batches of 100 (Supabase recommends ≤ 1000 per request)
  const BATCH_SIZE = 100;
  const batches = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE));
  }

  console.log(`\n🚀 Upserting ${rows.length} rows in ${batches.length} batches (${BATCH_SIZE}/batch)...`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    process.stdout.write(`  Batch ${i + 1}/${batches.length}... `);

    const { data, error } = await supabase
      .from("inventory")
      .upsert(batch, { onConflict: "clover_id" })
      .select("id");

    if (error) {
      console.log(`❌ Error`);
      errors.push(`Batch ${i + 1}: ${error.message}`);
      errorCount += batch.length;
    } else {
      console.log(`✅ ${data?.length || batch.length} rows`);
      successCount += data?.length || batch.length;
    }
  }

  // 6. Final report
  console.log("\n================================");
  console.log("📊 Seeding Complete:");
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed:     ${errorCount}`);
  console.log(`  📦 Total:      ${rows.length}`);

  if (errors.length > 0) {
    console.log("\n⚠️  Errors:");
    errors.forEach(e => console.log(`  - ${e}`));
  }

  // 7. Verify count in DB
  console.log("\n🔍 Verifying database count...");
  const { count, error: countError } = await supabase
    .from("inventory")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Count verification failed:", countError.message);
  } else {
    console.log(`✅ Total rows in public.inventory: ${count}`);
  }

  console.log("\n🎉 Next: Phase 8 — Generate embeddings + metadata via Gemini API");
}

seedMVP().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
