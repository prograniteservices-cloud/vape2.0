import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const DEFAULT_REGIONS = ["us-central1", "us-east1", "us-west1"];
const DEFAULT_CHAT_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash-lite"];
const DEFAULT_EMBED_MODELS = ["text-embedding-004", "text-multilingual-embedding-002"];

type TestResult = {
  region: string;
  chatModel?: string;
  embedModel?: string;
  embeddingSize?: number;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function listFromEnv(name: string, fallback: string[]) {
  const configured = (process.env[name] || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return configured
    .concat(fallback)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function configureGoogleCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return;
  }

  const localKeyPath = path.resolve("service-account-key.json");
  if (existsSync(localKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
  }
}

function vertexProjectId() {
  return (
    process.env.VERTEX_PROJECT_ID ||
    process.env.GEMINI_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    "vape-494900"
  );
}

function createVertexClient(region: string) {
  return new GoogleGenAI({
    vertexai: true,
    project: vertexProjectId(),
    location: region,
  });
}

async function testChatModel(ai: GoogleGenAI, region: string, model: string) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Reply with exactly: ok",
    });
    const text = response.text?.trim() || "(empty response)";
    console.log(`[${region}] chat ${model}: ok (${text.slice(0, 80)})`);
    return true;
  } catch (error: unknown) {
    console.error(`[${region}] chat ${model}: ${errorMessage(error)}`);
    return false;
  }
}

async function testEmbeddingModel(ai: GoogleGenAI, region: string, model: string) {
  try {
    const response = await ai.models.embedContent({
      model,
      contents: "watermelon disposable vape under 20 dollars",
    });
    const values = response.embeddings?.[0]?.values || [];
    console.log(`[${region}] embed ${model}: ok (${values.length} dimensions)`);
    return values.length;
  } catch (error: unknown) {
    console.error(`[${region}] embed ${model}: ${errorMessage(error)}`);
    return 0;
  }
}

async function main() {
  configureGoogleCredentials();

  const regions = listFromEnv("VERTEX_LOCATIONS", DEFAULT_REGIONS);
  const chatModels = listFromEnv("VERTEX_CHAT_MODELS", DEFAULT_CHAT_MODELS);
  const embedModels = listFromEnv("VERTEX_EMBED_MODELS", DEFAULT_EMBED_MODELS);
  const successes: TestResult[] = [];

  console.log("Phase 8 Vertex diagnostic");
  console.log(`Project: ${vertexProjectId()}`);
  console.log(`Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? "configured" : "not configured"}`);

  for (const region of regions) {
    console.log(`\n=== Region: ${region} ===`);
    const ai = createVertexClient(region);
    const result: TestResult = { region };

    for (const model of chatModels) {
      if (await testChatModel(ai, region, model)) {
        result.chatModel = model;
        break;
      }
    }

    for (const model of embedModels) {
      const embeddingSize = await testEmbeddingModel(ai, region, model);
      if (embeddingSize > 0) {
        result.embedModel = model;
        result.embeddingSize = embeddingSize;
        break;
      }
    }

    if (result.chatModel && result.embedModel) {
      successes.push(result);
    }
  }

  console.log("\n=== Summary ===");
  if (successes.length === 0) {
    console.error("No region passed both chat and embedding checks.");
    process.exitCode = 1;
    return;
  }

  for (const success of successes) {
    console.log(
      `${success.region}: chat=${success.chatModel}, embed=${success.embedModel}, dimensions=${success.embeddingSize}`,
    );
  }
}

main().catch((error) => {
  console.error("Fatal diagnostic error:", error);
  process.exit(1);
});
