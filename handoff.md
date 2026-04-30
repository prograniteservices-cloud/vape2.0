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
- **Voice-to-Voice AI Foundation**: **IN PROGRESS**. Ported Google Cloud TTS engine and `useVoiceEngine` hook. 
- **Voice AI UI Integration**: **STALLED**. Built `AIVoiceBot.tsx` with animated Framer Motion states.
- **Vercel Deployment**: **FAILING**. Despite multiple attempts to secure the Gemini API key and fix component logic, the production build remains unstable.

## ⚠️ Lessons Learned & Failed Approaches
The following strategies were attempted and resulted in failure or instability:
1. **Client-Side API Direct Call**: Attempting to call Gemini directly from the browser resulted in environment variable leakage risks and 500 errors. 
2. **Environment Variable Injection**: Repeatedly adding `GEMINI_API_KEY` via Vercel CLI did not immediately resolve connectivity, possibly due to build-caching or incorrect environment mapping (Production vs Preview).
3. **Refactoring Regressions**: An accidental deletion of `handleSendMessage` during a refactor led to a "not defined" error that caused silent failures in the AI bot.
4. **Infinite Loading Loops**: Errors occurring inside async `setTimeout` callbacks (without try-catch) prevented `setIsLoading(false)` from firing, leaving the user stuck on the "Processing Data" spinner.

## Current Blockers
- **Sidebar Hang**: On the live site, clicking categories often triggers an infinite loading spinner.
- **AI Connectivity**: The bot still reports connection errors in production, despite keys being set in Vercel.

## Next Steps for Development
1. **Critical Debug**: Inspect Vercel runtime logs for the *specific* deployment ID to see the output of the new debug logs added to `gemini.ts` and `page.tsx`.
2. **Local Parity**: Verify if the `npx vercel dev` environment can replicate the production hang with the actual production inventory.
3. **State Recovery**: Implement a "Hard Reset" button on the UI that clears all local state and forces a re-render of the Dashboard.
