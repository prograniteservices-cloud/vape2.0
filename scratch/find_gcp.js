const fs = require('fs');
const content = fs.readFileSync('c:/Users/heath/Desktop/Projects/vape2.0/scratch/all_page_chunk.js', 'utf8');
const index = content.indexOf('GCP');
if (index !== -1) {
    console.log(content.substring(index - 500, index + 500));
} else {
    console.log('GCP not found');
}
