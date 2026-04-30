const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Models to try in order of quality
const MODELS = [
    'gemini-3.1-pro-preview',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-pro'
];

const INVENTORY_FILE = path.join(__dirname, '..', 'src', 'data', 'inventory.json');

async function generateBatch(items) {
    const prompt = `Generate a short, engaging one-sentence description for each of the following products from a vape and smoke shop. 
    Return the result as a JSON array of strings in the exact same order as the products provided.
    
    Products:
    ${items.map((item, i) => `${i + 1}. ${item.name} (Category: ${item.category})`).join('\n')}
    
    Example response: ["A smooth and refreshing minty vape pod.", "High-quality rolling papers for a perfect smoke."]`;

    for (const modelName of MODELS) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (err) {
            console.warn(`Model ${modelName} failed: ${err.message}`);
            if (err.message.includes('API key expired')) {
                throw err; // Stop if key is actually bad
            }
        }
    }
    return [];
}

async function main() {
    if (!fs.existsSync(INVENTORY_FILE)) {
        console.error('Inventory file not found!');
        return;
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    const BATCH_SIZE = 15; // Smaller batch for Pro models
    let updatedCount = 0;

    console.log(`Starting smart-fallback generation for ${inventory.length} items...`);

    for (let i = 0; i < inventory.length; i += BATCH_SIZE) {
        const batch = inventory.slice(i, i + BATCH_SIZE);
        const itemsToProcess = batch.filter(item => !item.description || item.description.startsWith('High-quality'));

        if (itemsToProcess.length === 0) continue;

        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}... (${i}/${inventory.length})`);
        
        let success = false;
        let retryCount = 0;
        const MAX_RETRIES = 2;

        while (!success && retryCount < MAX_RETRIES) {
            try {
                const descriptions = await generateBatch(itemsToProcess);

                if (descriptions.length === itemsToProcess.length) {
                    let descIdx = 0;
                    for (let j = 0; j < batch.length; j++) {
                        if (!batch[j].description || batch[j].description.startsWith('High-quality')) {
                            batch[j].description = descriptions[descIdx++];
                            updatedCount++;
                        }
                    }
                    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
                    console.log(`Successfully updated batch. Total updated: ${updatedCount}`);
                    success = true;
                } else {
                    retryCount++;
                    console.log(`Retry ${retryCount}/${MAX_RETRIES}...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            } catch (err) {
                console.error(`Critical error: ${err.message}`);
                return;
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`Finished! Updated ${updatedCount} items.`);
}

main().catch(console.error);
