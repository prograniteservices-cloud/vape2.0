const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_rsc_utf8.txt', 'utf8');
let pos = 0;
while (true) {
    const index = content.indexOf('items', pos);
    if (index === -1) break;
    console.log('--- MATCH AT ' + index + ' ---');
    console.log(content.substring(index - 100, index + 500));
    pos = index + 1;
}
