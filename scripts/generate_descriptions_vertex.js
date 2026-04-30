const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Load Service Account
const KEY_PATH = path.join(__dirname, '..', 'service-account-key.json');
const INVENTORY_FILE = path.join(__dirname, '..', 'src', 'data', 'inventory.json');

const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf-8'));

const vertexAI = new VertexAI({
    project: key.project_id,
    location: 'us-central1',
    googleAuthOptions: {
        keyFile: KEY_PATH
    }
});

const model = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-002',
});

async function generateBatch(items) {
    const prompt = `Generate a short, engaging one-sentence description for each of the following products from a vape and smoke shop. 
    Return the result as a JSON array of strings in the exact same order as the products provided.
    
    Products:
    ${items.map((item, i) => `${i + 1}. ${item.name} (Category: ${item.category})`).join('\n')}
    
    Example response: ["A smooth and refreshing minty vape pod.", "High-quality rolling papers for a perfect smoke."]`;

    try {
        const resp = await model.generateContent(prompt);
        const content = resp.response.candidates[0].content;
        const text = content.parts[0].text;
        
        // Extract JSON array from the response
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return [];
    } catch (err) {
        console.error(`Error in batch generation: ${err.message}`);
        return [];
    }
}

async function main() {
    if (!fs.existsSync(INVENTORY_FILE)) {
        console.error('Inventory file not found!');
        return;
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    const BATCH_SIZE = 25;
    let updatedCount = 0;

    console.log(`Starting Vertex AI generation for ${inventory.length} items...`);

    for (let i = 0; i < inventory.length; i += BATCH_SIZE) {
        const batch = inventory.slice(i, i + BATCH_SIZE);
        const itemsToProcess = batch.filter(item => !item.description || item.description.startsWith('High-quality'));

        if (itemsToProcess.length === 0) continue;

        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}... (${i}/${inventory.length})`);
        
        let success = false;
        let retryCount = 0;
        const MAX_RETRIES = 2;

        while (!success && retryCount < MAX_RETRIES) {
            const descriptions = await generateBatch(itemsToProcess);

            if (descriptions.length === itemsToProcess.length) {
                let descIdx = 0;
                // Update the inventory items
                for (let j = 0; j < batch.length; j++) {
                    if (!batch[j].description || batch[j].description.startsWith('High-quality')) {
                        batch[j].description = descriptions[descIdx++];
                        updatedCount++;
                    }
                }
                
                // Save after every batch
                fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
                console.log(`Successfully updated batch starting at ${i}. Total updated: ${updatedCount}`);
                success = true;
            } else {
                retryCount++;
                console.log(`Retry ${retryCount}/${MAX_RETRIES} for batch starting at ${i}...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
        if (!success) {
            console.error(`Failed to process batch starting at ${i} after ${MAX_RETRIES} retries.`);
        }
        
        // Brief pause to stay safe
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Finished! Updated ${updatedCount} items with descriptions using Vertex AI.`);
}

main().catch(console.error);
