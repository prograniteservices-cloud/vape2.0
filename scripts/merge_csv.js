const fs = require('fs');
const path = require('path');
const readline = require('readline');

const INVENTORY_FILE = path.join(__dirname, '..', 'src', 'data', 'inventory.json');
const DOWNLOADS_DIR = 'C:\\Users\\heath\\Downloads';

function parseCSVLine(line) {
    const result = [];
    let start = 0;
    let inQuotes = false;
    let val = '';
    
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(val);
            val = '';
        } else {
            val += line[i];
        }
    }
    result.push(val);
    return result;
}

function extractCategoryFromUrl(url) {
    if (!url) return 'All Items';
    try {
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const rawCat = lastPart.split('?')[0]; // remove query params
        
        // Map common raw categories to standard ones
        const lowerCat = rawCat.toLowerCase();
        if (lowerCat === 'vape') return 'Vape Devices';
        if (lowerCat === 'cigaretts') return 'Cigarettes';
        if (lowerCat === 'smoking_accessories') return 'Smoking Accessories';
        if (lowerCat === 'c_b_d') return 'CBD & Delta';
        if (lowerCat === 'cigars') return 'Cigars';
        if (lowerCat === 'chewing_tobacco') return 'Chewing Tobacco';
        if (lowerCat === 'candy_snack') return 'Candy & Snacks';
        if (lowerCat === 'glass') return 'Glassware';
        if (lowerCat === 'lighters_torch') return 'Lighters & Torches';
        if (lowerCat === 'adult_novelties') return 'Adult Novelties';
        if (lowerCat === 'e_liquid') return 'E-Liquids';
        
        return rawCat ? decodeURIComponent(rawCat).replace(/_/g, ' ') : 'All Items';
    } catch(e) {
        return 'All Items';
    }
}

async function main() {
    if (!fs.existsSync(INVENTORY_FILE)) {
        console.error('Inventory file not found!');
        return;
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    const existingNames = new Set(inventory.map(item => item.name.toLowerCase()));
    
    let addedCount = 0;
    
    // Find matching files in Downloads
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const csvFiles = files.filter(f => f.startsWith('vape-more-cloveronline-com-2026-04-29') && f.endsWith('.csv'));
    
    console.log(`Found ${csvFiles.length} CSV files to process.`);

    for (const file of csvFiles) {
        const filePath = path.join(DOWNLOADS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const cols = parseCSVLine(line);
            if (cols.length < 5) continue;
            
            const url = cols[1];
            const name = cols[3];
            const price = cols[4];
            
            if (!name) continue;
            
            const lowerName = name.toLowerCase();
            if (!existingNames.has(lowerName)) {
                // New item found!
                inventory.push({
                    name: name,
                    price: price || '',
                    category: extractCategoryFromUrl(url),
                    image: '/assets/categories/vapes.png', // Placeholder
                    original_url: url
                });
                existingNames.add(lowerName);
                addedCount++;
            }
        }
    }
    
    if (addedCount > 0) {
        fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
        console.log(`Added ${addedCount} new items from CSV files. New total: ${inventory.length} items.`);
    } else {
        console.log('No new items found in CSV files.');
    }
}

main();