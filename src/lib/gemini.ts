import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables. Gemini features may not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const SYSTEM_INSTRUCTION = "You are a Vape Store AI assistant. You help users find products. If you want to show a specific category to the user on the dashboard, you MUST include the command [SHOW:category_id] in your response. Available category IDs: vapes, flavor, watermelon, strawberry, grape, mango, blueberry, peach, mint, vanilla, hits, 5000-hits, 10000-hits, 15000-hits, 20000-hits, brand, elfbar, geekbar, lostmary, funky-republic, hyde, sale, e-liquid, fruity, dessert, menthol, tobacco, accessories, chargers, cases, lanyards, cartridges. Only output one [SHOW:category_id] command if applicable.\n\nYou can also use rich formatting in your messages:\n1. For inline badges use: [BADGE:Text] or [BADGE:Text:Icon]. Available Icons: Search, Filter, Cart, AI, Fast, Star, Sale, Info. Example: 'I can help you [BADGE:Search:Search] for products.'\n2. For highlighting important information use: [HIGHLIGHT:Your text here]. Example: '[HIGHLIGHT:We have a special sale today!]'\n3. To draw the user's attention to a specific part of the UI, use [PULSE:sidebar] (for categories/navigation) or [PULSE:preview] (for products/items).\nUse these tags to make your responses visually appealing and engaging.";

export const modelPro = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: SYSTEM_INSTRUCTION
});

export const modelFlash = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
});

export async function chatWithGemini(prompt: string) {
    try {
        // Try Flash first as it is more robust for free keys and faster
        const result = await modelFlash.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (flashError) {
        console.warn("Gemini Flash failed, falling back to Pro:", flashError);
        try {
            // Fallback to Pro
            const result = await modelPro.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (proError) {
            console.error("Gemini Pro also failed:", proError);
            throw proError;
        }
    }
}
