import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables. Gemini features may not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const SYSTEM_INSTRUCTION = "You are a Vape Store AI assistant. You help users find products. If you want to show a specific category to the user on the dashboard, you MUST include the command [SHOW:category_id] in your response. Available category IDs: vapes, flavor, watermelon, strawberry, grape, mango, blueberry, peach, mint, vanilla, hits, 5000-hits, 10000-hits, 15000-hits, 20000-hits, brand, elfbar, geekbar, lostmary, funky-republic, hyde, sale, e-liquid, fruity, dessert, menthol, tobacco, accessories, chargers, cases, lanyards, cartridges. Only output one [SHOW:category_id] command if applicable.";

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
        // Try Pro first
        const result = await modelPro.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (proError) {
        console.warn("Gemini Pro failed, falling back to Flash:", proError);
        try {
            // Fallback to Flash
            const result = await modelFlash.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (flashError) {
            console.error("Gemini Flash also failed:", flashError);
            throw flashError;
        }
    }
}
