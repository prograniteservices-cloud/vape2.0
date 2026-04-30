const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');

const KEY_PATH = path.join(__dirname, '..', 'service-account-key.json');
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf-8'));

const vertexAI = new VertexAI({
    project: key.project_id,
    location: 'us-central1',
    googleAuthOptions: {
        keyFile: KEY_PATH
    }
});

async function listModels() {
    console.log("Attempting to list models via Vertex AI...");
    try {
        // Vertex AI doesn't have a direct 'listModels' in the simple SDK, 
        // so we'll try a very basic 'gemini-1.5-flash' hit to check the error message
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const resp = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash!");
    } catch (err) {
        console.error("Error Detail:", err.message);
    }
}

listModels();
