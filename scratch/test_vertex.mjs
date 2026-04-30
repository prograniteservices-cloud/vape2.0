import { VertexAI } from '@google-cloud/vertexai';
import { readFileSync } from 'fs';
import { join } from 'path';

const key = JSON.parse(readFileSync(join(process.cwd(), 'service-account-key.json'), 'utf-8'));
const vertexAI = new VertexAI({
  project: key.project_id,
  location: 'us-central1',
  googleAuthOptions: {
    credentials: { client_email: key.client_email, private_key: key.private_key }
  }
});

async function main() {
  const models = ['gemini-1.5-flash-002', 'gemini-2.0-flash-001', 'gemini-1.0-pro-002'];
  for (const name of models) {
    try {
      const model = vertexAI.getGenerativeModel({ model: name });
      const r = await model.generateContent('Say hello in one word');
      const t = r.response.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`[OK] ${name} => "${t?.trim()}"`);
    } catch (e) {
      console.log(`[FAIL] ${name} => ${e.message?.substring(0, 120)}`);
    }
  }
}
main();