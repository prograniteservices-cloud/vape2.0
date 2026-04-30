const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_page_chunk.js', 'utf8');
const regex = /https?:\/\/[^\s"']+/g;
const matches = content.match(regex);
if (matches) {
    console.log(Array.from(new Set(matches)).join('\n'));
} else {
    console.log('No URLs found');
}
