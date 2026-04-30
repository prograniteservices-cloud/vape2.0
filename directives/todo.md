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
- [/] Functional walkthrough of all scripted interactions (STALLED - PRODUCTION HANG).

### 5. Known Bugs & Next Steps 🐛
- [ ] **URGENT**: Fix Vercel production API connection issue and Sidebar Hang.
    - [x] Added `ErrorBoundary` to Dashboard.
    - [x] Added `try-catch` to `setTimeout` in `page.tsx` to prevent infinite spinners.
    - [x] Added Server-Side debug logs for API keys.
    - [ ] Inspect Vercel Logs for `[Navigation]` and `[Gemini Server]` tags.
- [ ] Fix AIVoiceBot connectivity error "I'm having trouble connecting right now."
    - [x] Secured API key via Server Actions.
    - [x] Fixed "handleSendMessage is not defined" regression.
    - [ ] Verify `GOOGLE_APPLICATION_CREDENTIALS` for Cloud TTS if native fallback is triggered.
