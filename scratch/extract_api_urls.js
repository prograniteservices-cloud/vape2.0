const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_rsc_utf8.txt', 'utf8');
const regex = /\/api\/[^\s"']+/g;
const matches = content.match(regex);
if (matches) {
    console.log(Array.from(new Set(matches)).join('\n'));
} else {
    console.log('No /api/ URLs found');
}
