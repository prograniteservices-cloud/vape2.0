'use server';

const API_KEY = process.env.GEMINI_API_KEY;
const PROJECT_ID = process.env.GEMINI_PROJECT_ID || 'vape-494900';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash';

const VERTEX_URL = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are a Vape Store AI assistant. You help users find products. If you want to show a specific category to the user on the dashboard, you MUST include the command [SHOW:category_id] in your response. Available category IDs: vapes, cigarettes, lighters-torches, smoking-accessories, adult-novelties, vape-devices, candy-snacks, cbd-delta, cigars, chewing-tobacco, e-liquids, glassware, miscellaneous. Only output one [SHOW:category_id] command if applicable.

You can also use rich formatting in your messages:
1. For inline badges use: [BADGE:Text] or [BADGE:Text:Icon]. Available Icons: Search, Filter, Cart, AI, Fast, Star, Sale, Info. Example: 'I can help you [BADGE:Search:Search] for products.'
2. For highlighting important information use: [HIGHLIGHT:Your text here]. Example: '[HIGHLIGHT:We have a special sale today!]'
3. To draw the user's attention to a specific part of the UI, use [PULSE:sidebar] (for categories/navigation) or [PULSE:preview] (for products/items).
Use these tags to make your responses visually appealing and engaging.`;

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
