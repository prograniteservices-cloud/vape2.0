const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_rsc_utf8.txt', 'utf8');
const regex = /\{"[\s\S]+?\}/g;
const matches = content.match(regex);
if (matches) {
    fs.writeFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/rsc_json_parts.txt', matches.join('\n---\n'));
} else {
    console.log('No JSON parts found');
}
