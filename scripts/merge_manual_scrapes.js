const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const DOWNLOADS_DIR = 'C:\\Users\\heath\\Downloads';
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'inventory.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const csvFiles = [
    'vape-more-cloveronline-com-2026-04-29-3.csv',
    'vape-more-cloveronline-com-2026-04-29-4 (1).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (10).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (11).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (12).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (13).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (14).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (15).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (16).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (17).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (2).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (3).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (4).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (5).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (6).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (7).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (8).csv',
    'vape-more-cloveronline-com-2026-04-29-4 (9).csv',
    'vape-more-cloveronline-com-2026-04-29-4.csv'
];

const categoryMap = {
    'Search Results': 'All Items',
    'Cigaretts': 'Cigarettes',
    'Lighter%20%5C%20Torch': 'Lighters & Torches',
    'Misc%20Smoke': 'Smoking Accessories',
    'Sex%20Misc': 'Adult Novelties',
    'Devices': 'Vape Devices',
    '%20Candy_': 'Candy & Snacks',
    'Vape': 'Vapes',
    'CBD%20Products': 'CBD & Delta',
    'Cigars': 'Cigars',
    'Chew%20Tobacco': 'Chewing Tobacco',
    'Vape%20Juice': 'E-Liquids',
    'Glass': 'Glassware',
    'Misc': 'Miscellaneous'
};

const mergedData = new Map();
const foundCategories = new Set();

csvFiles.forEach(file => {
    const filePath = path.join(DOWNLOADS_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File ${file} not found, skipping.`);
        return;
    }
    console.log(`Processing ${file}...`);
    
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const records = csv.parse(content, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true
        });

        records.forEach(record => {
            let name = record.title || record.data || record.name;
            let price = record.price || record.data2;
            let url = record.web_scraper_start_url || '';

            if (!name) return;

            name = name.trim();
            price = price ? price.trim() : '';
            
            let rawCategory = 'Misc';
            if (url) {
                const parts = url.split('/');
                rawCategory = parts[parts.length - 1];
                if (rawCategory.includes('?')) {
                    rawCategory = 'Search Results';
                }
            }

            const category = categoryMap[rawCategory] || rawCategory;
            foundCategories.add(category);

            if (!mergedData.has(name) || (price && !mergedData.get(name).price)) {
                mergedData.set(name, {
                    name,
                    price,
                    category,
                    image: `/assets/categories/${category.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`,
                    original_url: url
                });
            }
        });
    } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
    }
});

const finalData = Array.from(mergedData.values());
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));

console.log(`Successfully merged ${finalData.length} items into src/data/inventory.json`);
console.log(`Categories found: ${Array.from(foundCategories).join(', ')}`);
