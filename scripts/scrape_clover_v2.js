const fs = require('fs');
const path = require('path');

const MERCHANT_ID = "WV2BFYZ60SBX1";
const OUTPUT_FILE = path.join(__dirname, '..', 'inventory_v2.json');
const STATE_FILE = path.join(__dirname, '..', 'scrape_state.json');
const LIMIT = 100;
const DELAY_MS = 1000; // 1 second delay between requests to be safe
const MAX_RETRIES = 5;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeInventory() {
    console.log(`🚀 Starting Clover Scraping for Merchant: ${MERCHANT_ID}`);
    
    let state = { offset: 0, totalItems: 0 };
    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        console.log(`📂 Resuming from offset: ${state.offset}`);
    }

    let allItems = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            allItems = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            console.log(`📦 Loaded ${allItems.length} existing items.`);
        } catch (e) {
            console.error(`⚠️ Error loading output file: ${e.message}. Starting fresh.`);
            allItems = [];
        }
    }

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://vapes-more.cloveronline.com/",
        "Origin": "https://vapes-more.cloveronline.com"
    };

    while (true) {
        const url = `https://www.clover.com/online-ordering/api/v1/merchants/${MERCHANT_ID}/items?limit=${LIMIT}&offset=${state.offset}`;
        console.log(`🌐 Fetching offset ${state.offset}...`);

        let retryCount = 0;
        let success = false;
        let batch = null;

        while (retryCount < MAX_RETRIES && !success) {
            try {
                const response = await fetch(url, { headers });
                
                if (response.status === 429) {
                    const waitTime = Math.pow(2, retryCount) * 5000;
                    console.warn(`⚠️ Rate limited (429). Waiting ${waitTime/1000}s...`);
                    await sleep(waitTime);
                    retryCount++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                batch = await response.json();
                success = true;
            } catch (err) {
                retryCount++;
                const waitTime = Math.pow(2, retryCount) * 2000;
                console.error(`❌ Error at offset ${state.offset} (Retry ${retryCount}/${MAX_RETRIES}): ${err.message}`);
                if (retryCount < MAX_RETRIES) {
                    console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
                    await sleep(waitTime);
                } else {
                    console.error(`🛑 Max retries reached. Saving state and exiting.`);
                    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
                    process.exit(1);
                }
            }
        }

        const items = batch.items || [];
        if (items.length === 0) {
            console.log("🏁 No more items found. Scraping complete!");
            break;
        }

        const formattedItems = items.map(item => ({
            name: item.name,
            price: item.price ? item.price / 100 : 0,
            url: `https://vapes-more.cloveronline.com/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.id}`,
            id: item.id,
            description: item.description || ""
        }));

        allItems = allItems.concat(formattedItems);
        state.offset += items.length;
        state.totalItems = allItems.length;

        // Save progress every batch
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allItems, null, 2));
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

        console.log(`✅ Fetched ${items.length} items. Total: ${allItems.length}`);

        if (items.length < LIMIT) {
            console.log("🏁 Reached end of inventory.");
            break;
        }

        await sleep(DELAY_MS);
    }

    console.log(`🎉 Successfully scraped ${allItems.length} items to ${OUTPUT_FILE}`);
}

scrapeInventory().catch(err => {
    console.error("💥 Unhandled error:", err);
    process.exit(1);
});
