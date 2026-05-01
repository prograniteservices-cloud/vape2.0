import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const VERTEX_PROJECT_ID =
  process.env.VERTEX_PROJECT_ID ||
  process.env.GEMINI_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  "vape-494900";
const VERTEX_LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const CHAT_MODEL = process.env.VERTEX_CHAT_MODEL || "gemini-2.5-flash-lite";
const EMBED_MODEL = process.env.VERTEX_EMBED_MODEL || "text-embedding-004";
const DEFAULT_LIMIT = 5;
const CATEGORY_OPTIONS = [
  "Vapes",
  "Cigarettes",
  "Lighters & Torches",
  "Smoking Accessories",
  "Adult Novelties",
  "Vape Devices",
  "Candy & Snacks",
  "CBD & Delta",
  "Cigars",
  "Chewing Tobacco",
  "Pipe Tobacco",
  "Hookah & Shisha",
  "E-Liquids",
  "Glassware",
  "Beverages",
  "Kratom",
  "Miscellaneous",
];

type InventoryRow = {
  id: string;
  clover_id: string | null;
  name: string;
};

type Enrichment = {
  category: string;
  metadata: string;
};

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

function getArgValue(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function getNumericArg(name: string, fallback: number) {
  const value = getArgValue(name);
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function configureGoogleCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return;
  }

  const localKeyPath = path.resolve("service-account-key.json");
  if (existsSync(localKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
  }
}

function parseEnrichment(text: string | undefined): Enrichment {
  if (!text) {
    throw new Error("empty model response");
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("model response did not contain JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<Enrichment>;
  if (!parsed.category || !parsed.metadata) {
    throw new Error("model response JSON missing category or metadata");
  }

  return {
    category: String(parsed.category).slice(0, 120),
    metadata: String(parsed.metadata).slice(0, 500),
  };
}

configureGoogleCredentials();

const limit = getNumericArg("limit", DEFAULT_LIMIT);
const dryRun = !hasFlag("write");
const reprocess = hasFlag("reprocess");
const delayMs = getNumericArg("delay-ms", 1000);
const nameContains = getArgValue("name-contains");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const ai = new GoogleGenAI({
  vertexai: true,
  project: VERTEX_PROJECT_ID,
  location: VERTEX_LOCATION,
});

async function enrichProduct(name: string) {
  const prompt = `You are an expert inventory manager for a premium vape and smoke shop.
Analyze the product name and return conservative catalog metadata.

Rules:
- Choose exactly one category from this list: ${CATEGORY_OPTIONS.join(", ")}.
- Do not claim puff count, nicotine strength, THC strength, device type, size, or flavor unless the product name explicitly states it.
- Flavor words alone do not imply E-Liquids. Only use E-Liquids when the name clearly says e-liquid, eliquid, vape juice, juice, salt, nic salt, or a similar bottled vape liquid term.
- Do not classify tobacco wraps, cigarillos, Swisher, Backwoods, or cigar products as E-Liquids.
- Classify Black & Mild, Black Mild, Black N Mild, Backwoods, Swisher, cigarillos, wood-tip cigar products, and plastic-tip cigar products as Cigars.
- Classify Black Bar products as Vape Devices.
- Classify Al Fakher, hookah, shisha, and hookah tobacco products as Hookah & Shisha.
- Classify pipe tobacco products as Pipe Tobacco. Do not classify pipe tobacco as Chewing Tobacco.
- Classify soda, juice, cider, energy drinks, bottled drinks, canned drinks, and wine or alcohol bottles as Beverages.
- Classify candy and snacks as Candy & Snacks.
- Classify 3CHI, Delta, THC, CBD, hemp, live resin, and similar cannabinoid products as CBD & Delta unless the name clearly says it is a vape device.
- Classify kratom capsules, extracts, or powder as Kratom.
- If the product name is ambiguous, use Miscellaneous and say the product type is unclear from the name.
- Metadata must be one short sentence based only on the product name.

Product: "${name}"

Return only a JSON object in this format:
{"category":"...","metadata":"..."}`;

  const result = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: prompt,
    config: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  return parseEnrichment(result.text);
}

async function generateEmbedding(text: string) {
  const result = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
  });
  const values = result.embeddings?.[0]?.values;

  if (!values || values.length !== 768) {
    throw new Error(`expected 768 embedding dimensions, got ${values?.length || 0}`);
  }

  return values;
}

async function main() {
  console.log("Phase 8 Vertex enrichment pipeline");
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
  console.log(`Project: ${VERTEX_PROJECT_ID}`);
  console.log(`Location: ${VERTEX_LOCATION}`);
  console.log(`Models: chat=${CHAT_MODEL}, embed=${EMBED_MODEL}`);
  console.log(`Limit: ${limit}`);
  console.log(`Selection: ${reprocess ? "reprocess enriched rows" : "rows missing embeddings"}`);
  if (nameContains) {
    console.log(`Name filter: ${nameContains}`);
  }

  let query = supabase
    .from("inventory")
    .select("id, clover_id, name")
    .limit(limit);
  if (nameContains) {
    query = query.ilike("name", `%${nameContains}%`);
  }
  const { data: items, error } = reprocess
    ? await query.not("embedding", "is", null)
    : await query.is("embedding", null);

  if (error) {
    throw new Error(`failed to fetch inventory: ${error.message}`);
  }

  if (!items || items.length === 0) {
    console.log(reprocess ? "No enriched rows found to reprocess." : "All items already have embeddings. Nothing to do.");
    return;
  }

  console.log(`Found ${items.length} rows to process.`);

  for (const item of items as InventoryRow[]) {
    console.log(`\nProcessing: ${item.name}`);
    console.log(`Row ID: ${item.id}`);
    console.log(`Clover ID: ${item.clover_id || "(none)"}`);

    const enrichment = await enrichProduct(item.name);
    const embeddingText = `${item.name} | ${enrichment.category} | ${enrichment.metadata}`;
    const embedding = await generateEmbedding(embeddingText);

    console.log(`Category: ${enrichment.category}`);
    console.log(`Embedding dimensions: ${embedding.length}`);

    if (dryRun) {
      console.log("Dry-run: skipped database update. Pass --write to update rows.");
    } else {
      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          category: enrichment.category,
          metadata: enrichment.metadata,
          embedding,
        })
        .eq("id", item.id);

      if (updateError) {
        throw new Error(`failed to update ${item.id}: ${updateError.message}`);
      }

      console.log("Database update complete.");
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.log("\nBatch complete.");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
