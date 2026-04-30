import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.GEMINI_API_KEY;
console.log('Key starts:', API_KEY?.substring(0, 8));

const genAI = new GoogleGenerativeAI(API_KEY);

async function main() {
  console.log('\nTesting available Gemini models...\n');

  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-2.5-pro-exp-03-25'
  ];

  for (const name of models) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent('Say "hello" in one word.');
      const text = result.response.text();
      console.log(`  [OK] ${name} => "${text.trim()}"`);
    } catch (e) {
      const msg = e.message?.substring(0, 120);
      console.log(`  [FAIL] ${name} => ${msg}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(e => console.error(e));