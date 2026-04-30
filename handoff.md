# Project Handoff: Vape 2.0 

## Objective
Normalize and generate professional one-sentence descriptions for ~1,760 inventory items for the `vape-more.cloveronline.com` storefront MVP, and implement an authentic, real-time voice-to-voice AI Showcase (Phase 6).

## Core Files
- **Inventory Data**: `src/data/inventory.json` (JSON array of objects)
- **TTS Engine**: `src/lib/voice-engine.ts` (Client-side Web Speech hook for listening)
- **TTS API Route**: `src/app/api/tts/route.ts` (Server-side Google Cloud TTS endpoint)
- **Data Logic**: `src/lib/data.ts` (Categorization and normalization logic)
- **Environment**: `.env.local` (Contains `GOOGLE_TTS_API_KEY` and `GEMINI_API_KEY`)

## Current Status (Phase 6: AI Showcase)
- **Inventory Descriptions**: **COMPLETED**. Instead of relying on rate-limited AI APIs, a local procedural script (`scripts/generate_local_descriptions.js`) successfully embedded domain knowledge to generate 1,760 unique, professional descriptions for all items.
- **Voice-to-Voice AI Foundation**: **COMPLETED**. We pivoted from a scripted text chat to a real-time audible AI experience. The Google Cloud TTS engine and `useVoiceEngine` hook have been successfully ported over from the "Nighttime Companion" app and configured in this workspace.

## Next Steps for Development
1. **Build the Voice AI UI**: Create the frontend components (e.g., an animated `AIVoiceBot` button) to utilize the new `useVoiceEngine` hook.
2. **Connect the Pipeline**: Wire the browser's speech transcription output to a Gemini API call, and pass Gemini's text response to our new `src/app/api/tts/route.ts` endpoint for audio playback.
3. **Animations**: Add the "glowing orb" pulsing animations to indicate listening, thinking, and speaking states.
