# Project Handoff: Vape 2.0 

## Objective
Normalize and generate professional one-sentence descriptions for ~1,760 inventory items for the `vape-more.cloveronline.com` storefront MVP, and implement an authentic, real-time voice-to-voice AI Showcase (Phase 6).

## Core Files
- **Inventory Data**: `src/data/inventory.json` (JSON array of objects)
- **TTS Engine**: `src/lib/voice-engine.ts` (Client-side Web Speech hook for listening)
- **TTS API Route**: `src/app/api/tts/route.ts` (Server-side Google Cloud TTS endpoint)
- **AIVoiceBot UI**: `src/components/features/AIVoiceBot.tsx` (Animated chat interface for voice pipeline)
- **Data Logic**: `src/lib/data.ts` (Categorization and normalization logic)
- **Environment**: `.env.local` (Contains `GOOGLE_TTS_API_KEY` and `GEMINI_API_KEY`)

## Current Status (Phase 6: AI Showcase)
- **Inventory Descriptions**: **COMPLETED**. Local procedural script successfully generated 1,760 unique descriptions.
- **Voice-to-Voice AI Foundation**: **COMPLETED**. Ported Google Cloud TTS engine and `useVoiceEngine` hook from Nighttime Companion.
- **Voice AI UI Integration**: **COMPLETED**. Built `AIVoiceBot.tsx` with animated Framer Motion states (listening, thinking, talking) and wired it natively into the Gemini and TTS pipeline.
- **Premium AI Interface & Polish**: **COMPLETED**. Built the `AnimatedBot` avatar using glassmorphism and dual-layer glow. Added 3D tilt effects to the main chat container. Implemented `RichMessage` components (Highlight Cards, Capability Badges) for inline response formatting. Added `service-account-key.json` to `.gitignore`.
- **Known Issue**: On the live Vercel deployment, the client-side Web Speech STT works, but the backend AI/TTS route fails to connect (likely due to missing or misconfigured Vercel environment variables for Gemini/Google Cloud). The system falls back to the native browser robotic TTS with an error message ("I'm having trouble connecting right now.").

## Next Steps for Development
1. **Bug Fix**: Debug and resolve the Vercel production API connection issue for Gemini and Google Cloud TTS.
2. **Verification**: Functional walkthrough of all scripted interactions and overall showcase readiness.
