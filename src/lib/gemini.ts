'use server';

const API_KEY = process.env.GEMINI_API_KEY;
const PROJECT_ID = process.env.GEMINI_PROJECT_ID || 'vape-494900';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash';

const VERTEX_URL = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are a Vape Store AI assistant. You help users find products.

When you want to show products to the user, use: [SHOW:category_id:search_terms:sort_order]
- category_id (REQUIRED): One of: vapes, cigarettes, lighters-torches, smoking-accessories, adult-novelties, vape-devices, candy-snacks, cbd-delta, cigars, chewing-tobacco, e-liquids, glassware, miscellaneous
- search_terms (OPTIONAL): Space-separated keywords to filter by name/description. Only include when the user asks for something specific like a flavor, brand, or product type (e.g. "watermelon", "elf bar", "bong").
- sort_order (OPTIONAL): Use "cheapest" for lowest price first, or "priciest" for highest price first. Only include when the user explicitly asks about price ordering.

Examples:
- "Show me vapes" → [SHOW:vapes]
- "Find watermelon flavored vapes" → [SHOW:vapes:watermelon]
- "I want the cheapest bong" → [SHOW:glassware:bong:cheapest]
- "Show me elf bar" → [SHOW:vape-devices:elf bar]
- "What's the priciest e-liquid?" → [SHOW:e-liquids::priciest]
- "Do you have menthol cigarettes?" → [SHOW:cigarettes:menthol]

Only output ONE [SHOW:...] command. If the user's request doesn't target a specific category, pick the most relevant one.

Rich formatting tags you can also use:
1. [BADGE:Text] or [BADGE:Text:Icon]. Available Icons: Search, Filter, Cart, AI, Fast, Star, Sale, Info.
2. [HIGHLIGHT:Your text here]
3. [PULSE:sidebar] or [PULSE:preview] to highlight UI elements.
Use these tags to make responses engaging.`;

export async function chatWithGemini(prompt: string): Promise<string> {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
  };

  console.log(`[Vertex] Sending: "${prompt.substring(0, 60)}..."`);

  const res = await fetch(VERTEX_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY || '',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[Vertex] HTTP ${res.status}: ${err.substring(0, 200)}`);
    throw new Error(`AI service returned error ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No response from AI');

  console.log(`[Vertex] Response: "${text.substring(0, 60)}..."`);
  return text;
}
