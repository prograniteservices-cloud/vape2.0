const fs = require('fs');

const MERCHANT_ID = "WV2BFYZ60SBX1";
const OUTPUT_FILE = "inventory_full.json";
const PARTIAL_FILE = "inventory_part_1.json";

async function scrapeInventory() {
    console.log(`Starting scrape for Merchant: ${MERCHANT_ID}`);
    
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://vape-more.cloveronline.com/"
    };

    let allItems = [];
    if (fs.existsSync(PARTIAL_FILE)) {
        try {
            const data = fs.readFileSync(PARTIAL_FILE, 'utf8');
            allItems = JSON.parse(data);
            console.log(`Loaded ${allItems.length} items from ${PARTIAL_FILE}`);
        } catch (e) {
            console.error(`Error loading ${PARTIAL_FILE}: ${e.message}`);
        }
    }

    let offset = allItems.length;
    const limit = 100;
    
    console.log(`Continuing from offset ${offset}...`);

    while (true) {
        const url = `https://www.clover.com/online-ordering/api/v1/merchants/${MERCHANT_ID}/items?limit=${limit}&offset=${offset}`;
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const batch = await response.json();
            const items = batch.items || [];
            
            if (items.length === 0) {
                console.log("No more items found.");
                break;
            }
            
            // Map items to the format seen in inventory_part_1.json
            const formattedItems = items.map(item => ({
                name: item.name,
                price: item.price ? item.price / 100 : 0, // Clover usually uses cents
                url: `https://vape-more.cloveronline.com/${item.name.toLowerCase().replace(/ /g, '-')}-${item.id}`
            }));

            allItems = allItems.concat(formattedItems);
            console.log(`Fetched ${allItems.length} items total...`);
            
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allItems, null, 2));
            
            offset += limit;
            await new Promise(resolve => setTimeout(resolve, 500)); // Be polite
            
            if (items.length < limit) {
                console.log("Reached end of inventory.");
                break;
            }
        } catch (ex) {
            console.error(`Pagination failed at offset ${offset}: ${ex.message}`);
            break;
        }
    }
    
    if (allItems.length > 0) {
        console.log(`Successfully saved ${allItems.length} items to ${OUTPUT_FILE}.`);
    }
}

scrapeInventory();
