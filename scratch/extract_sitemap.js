const fs = require('fs');

const sitemapPath = 'C:\\Users\\heath\\.gemini\\antigravity\\brain\\0c046d8c-a229-4c98-abf1-ad71ad8d0f62\\.system_generated\\steps\\159\\content.md';

try {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urlRegex = /https:\/\/vape-more\.cloveronline\.com\/[^<\s]+/g;
    const urls = content.match(urlRegex) || [];
    
    const items = urls.map(url => {
        const parts = url.split('/').pop().split('-');
        if (parts.length > 1) {
            const id = parts.pop();
            const name = parts.join(' ').replace(/%20/g, ' ');
            return { name, url };
        }
        return null;
    }).filter(item => item !== null);

    fs.writeFileSync('sitemap_items.json', JSON.stringify(items, null, 2));
    console.log(`Extracted ${items.length} items from sitemap.`);
} catch (e) {
    console.error(`Error: ${e.message}`);
}
