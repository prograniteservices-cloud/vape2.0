import { GoogleGenAI } from '@google/genai';
import { existsSync } from 'fs';
import path from 'path';

const VERTEX_PROJECT_ID =
  process.env.VERTEX_PROJECT_ID ||
  process.env.GEMINI_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  'vape-494900';

const VERTEX_LOCATION = process.env.VERTEX_LOCATION || 'us-central1';
const EMBED_MODEL = process.env.VERTEX_EMBED_MODEL || 'text-embedding-004';

function configureGoogleCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return;
  }

  const localKeyPath = path.resolve('service-account-key.json');
  if (existsSync(localKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
  }
}

let vertexClient: GoogleGenAI | null = null;

function getVertexClient() {
  configureGoogleCredentials();

  if (!vertexClient) {
    vertexClient = new GoogleGenAI({
      vertexai: true,
      project: VERTEX_PROJECT_ID,
      location: VERTEX_LOCATION,
    });
  }

  return vertexClient;
}

export async function createSearchEmbedding(text: string): Promise<number[]> {
  const result = await getVertexClient().models.embedContent({
    model: EMBED_MODEL,
    contents: text,
  });

  const values = result.embeddings?.[0]?.values;

  if (!values || values.length !== 768) {
    throw new Error(`Search embedding failed: expected 768 dimensions, got ${values?.length || 0}`);
  }

  return values;
}
