const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = 'C:\\Users\\heath\\Downloads';

function parseCSVLine(line) {
    const result = [];
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

function main() {
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const csvFiles = files.filter(f => f.startsWith('vape-more-cloveronline-com-2026-04-29') && f.endsWith('.csv'));
    
    let totalRows = 0;
    const uniqueNames = new Set();
    const uniqueNamesUrls = new Set(); // Combination of name + URL
    
    for (const file of csvFiles) {
        const filePath = path.join(DOWNLOADS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const cols = parseCSVLine(line);
            if (cols.length < 5) continue;
            
            const url = cols[1];
            const name = cols[3];
            
            if (name) {
                totalRows++;
                uniqueNames.add(name.toLowerCase().trim());
                uniqueNamesUrls.add(name.toLowerCase().trim() + '||' + url.toLowerCase().trim());
            }
        }
    }
    
    console.log('Total rows (including duplicates) in all CSVs:', totalRows);
    console.log('Total unique item names:', uniqueNames.size);
    console.log('Total unique item name + URL combinations:', uniqueNamesUrls.size);
}

main();