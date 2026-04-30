import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const CATEGORIES = {
  'vapes': 'Disposable and rechargeable vape devices (Geek Bar, Elf Bar, Lost Mary, Flum, Funky Republic, Fume, Esco Bars, Posh, Orion Bar)',
  'cigarettes': 'Premium tobacco cigarette brands (Marlboro, Camel, Newport, Winston, American Spirit, Pall Mall)',
  'lighters-torches': 'Lighters, torches, and fire-starting tools (Bic, Clipper, Zippo, torch)',
  'smoking-accessories': 'Rolling papers, cones, filters, grinders, trays, rolling machines, wraps (RAW, Elements, Zig-Zag, Juicy Jay, OCB, Blazy Susan)',
  'adult-novelties': 'Adult lifestyle products and novelties (enhancement pills, adult items marked 18+)',
  'vape-devices': 'Advanced mods, pod systems, coils, tanks, vape batteries, chargers',
  'candy-snacks': 'Candy, chips, snacks, beverages, and food items',
  'cbd-delta': 'CBD, Delta-8, Delta-9, Delta-10, THC-A, HHC, hemp-derived products, kratom',
  'cigars': 'Cigars, cigarillos, cigar wraps (Swisher, Backwoods, White Owl, Dutch Masters, Game, Phillies)',
  'chewing-tobacco': 'Chewing tobacco, dip, snus (Grizzly, Copenhagen, Skoal, Zyn, Rogue)',
  'e-liquids': 'E-liquid, vape juice, nic salt, e-juice (Naked, Juice Head, Pod Juice, Twist, Cloud Nurdz)',
  'glassware': 'Glass pipes, bongs, water pipes, dab rigs, bubblers',
  'miscellaneous': 'Items that don\'t clearly fit other categories'
};

const BATCH_SIZE = 40;
const MODEL_NAME = 'gemini-1.5-flash';

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

function buildPrompt(products) {
  const productList = products.map((p, i) => `[${i}] "${p.name}" (price: ${p.price})`).join('\n');

  const categoryList = Object.entries(CATEGORIES)
    .map(([id, desc]) => `- "${id}": ${desc}`)
    .join('\n');

  return `Classify each vape/smoke shop product below into exactly ONE category. Return ONLY a JSON object mapping product index numbers to category IDs. Be conservative - if unsure, use "miscellaneous".

Available categories:
${categoryList}

Products:
${productList}

Respond with ONLY valid JSON in this exact format:
{
  "0": "vapes",
  "1": "cigarettes",
  ...
}`;
}

async function classifyBatch(products) {
  const prompt = buildPrompt(products);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      const classifications = JSON.parse(jsonMatch[0]);

      for (const [idx, categoryId] of Object.entries(classifications)) {
        const i = parseInt(idx);
        if (i >= 0 && i < products.length && CATEGORIES[categoryId]) {
          products[i].category = categoryId;
        }
      }

      return true;
    } catch (err) {
      console.warn(`  Attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
  }

  console.error('  All retries failed for this batch');
  return false;
}

async function main() {
  const inventoryPath = resolve(__dirname, '..', 'src', 'data', 'inventory.json');
  const progressPath = resolve(__dirname, '..', 'scratch', 'classify_progress.json');

  console.log('Loading inventory...');
  const items = JSON.parse(readFileSync(inventoryPath, 'utf-8'));
  console.log(`Loaded ${items.length} items.`);

  let startBatch = 0;

  // Resume from checkpoint
  if (existsSync(progressPath)) {
    const progress = JSON.parse(readFileSync(progressPath, 'utf-8'));
    if (progress.items) {
      for (let i = 0; i < items.length && i < progress.items.length; i++) {
        items[i].category = progress.items[i].category || 'All Items';
      }
    }
    startBatch = progress.lastBatch || 0;
    if (startBatch >= Math.ceil(items.length / BATCH_SIZE)) {
      console.log('Already complete! Saving final inventory.');
      writeFileSync(inventoryPath, JSON.stringify(items, null, 2));
      console.log('Done - inventory.json updated.');
      return;
    }
    console.log(`Resuming from batch ${startBatch + 1}...`);
  }

  const totalBatches = Math.ceil(items.length / BATCH_SIZE);

  for (let batch = startBatch; batch < totalBatches; batch++) {
    const start = batch * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, items.length);
    const slice = items.slice(start, end);

    console.log(`\nBatch ${batch + 1}/${totalBatches}: items ${start + 1}-${end}/${items.length}`);
    const ok = await classifyBatch(slice);

    // Save checkpoint
    writeFileSync(progressPath, JSON.stringify({
      lastBatch: batch,
      items: items.map(i => ({ name: i.name, category: i.category }))
    }, null, 2));

    if (ok) {
      console.log(`  OK - classified ${slice.length} items`);
    }

    // Rate limiting (15 RPM for flash free tier)
    await new Promise(r => setTimeout(r, 5000));
  }

  // Write final inventory
  writeFileSync(inventoryPath, JSON.stringify(items, null, 2));
  console.log('\nDone! inventory.json updated.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});