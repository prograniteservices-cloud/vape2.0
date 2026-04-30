const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log("Testing with Key:", API_KEY.substring(0, 5) + "...");
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // We'll try to list models
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

listModels();
