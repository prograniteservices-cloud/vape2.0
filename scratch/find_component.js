const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_page_chunk.js', 'utf8');
const index = content.indexOf('AllPageClient');
if (index !== -1) {
    console.log(content.substring(index - 100, index + 2000));
} else {
    console.log('AllPageClient not found');
}
