import { type NextRequest } from 'next/server';

// Vercel serverless function timeout
export const maxDuration = 60;

/**
 * Calls Google Cloud Text-to-Speech API
 */
async function synthesizeWithCloudTTS(text: string, apiKey: string) {
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Studio-O', // High quality premium voice
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0, 
        pitch: 0,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cloud TTS Error: ${error.error?.message || response.statusText}`);
  }

  const result = await response.json();
  if (!result.audioContent) {
    throw new Error('No audio content returned from Cloud TTS');
  }

  return Buffer.from(result.audioContent, 'base64');
}

export async function GET() {
  const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  return Response.json({
    ok: true,
    provider: 'Google Cloud TTS',
    hasApiKey: !!googleApiKey,
    usingDedicatedKey: !!process.env.GOOGLE_TTS_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!googleApiKey) {
      return Response.json({ error: 'TTS API Key not set' }, { status: 500 });
    }

    // Clean text (remove markdown, emojis, etc.)
    const cleanText = text
      .replace(/\[.*?\]/g, '')
      .replace(/[*_~`#]/g, '')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .trim();

    console.log(`[TTS] Cloud TTS Request: "${cleanText.slice(0, 30)}..."`);

    const audioBuffer = await synthesizeWithCloudTTS(cleanText, googleApiKey);

    const elapsed = Date.now() - startTime;        
    console.log(`[TTS] Success with Cloud TTS in ${elapsed}ms`);

    return new Response(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error(`[TTS Final Error]: ${error.message}`);
    return Response.json(
      {
        error: 'Google Cloud TTS failed', 
        details: error.message,
      },
      { status: 502 }
    );
  }
}
