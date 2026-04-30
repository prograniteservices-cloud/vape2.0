# Phase 6: AI Showcase - Task List

## Active Plan: [PHASE6_PLAN.md](./PHASE6_PLAN.md)

### 1. Real-Time Voice AI Experience ⏳
- [x] Port Google Cloud TTS engine and API keys from Nighttime Companion.
- [x] Implement client-side `useVoiceEngine` hook for Web Speech recognition.
- [x] Implement `AIVoiceBot` component to handle listening, thinking, and talking states.
- [x] Wire Web Speech output -> Gemini API -> Cloud TTS playback pipeline.

### 2. Premium AI Interface & Polish ⏳
- [x] Develop `AnimatedBot` avatar component (Framer Motion).
- [x] Design and implement `RichMessage` components (Highlight Cards, Badges).
- [x] Apply dual-layer glow and glassmorphism refinements to Chat UI.
- [x] Integrate 3D Tilt effect on the chat container.

### 3. Presentation State Management ⏳
- [x] Map AI responses to dashboard highlight triggers.
- [x] Implement `ResetDemo` utility.
- [ ] Ensure URL syncing for deep-linking (optional but recommended).

### 4. Verification ⏳
- [x] Build verification: `npm run build`
- [x] TypeScript verification: `npx tsc --noEmit`
- [ ] Functional walkthrough of all scripted interactions.

### 5. Known Bugs & Next Steps 🐛
- [ ] Fix Vercel production API connection issue: Chatbot STT works, but fails to connect to Gemini/Cloud TTS backend (falls back to native browser TTS). Verify Vercel environment variables (`NEXT_PUBLIC_GEMINI_API_KEY`, `GOOGLE_TTS_API_KEY`, etc.) and API route configurations.
