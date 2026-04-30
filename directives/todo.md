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
- [ ] Map AI responses to dashboard highlight triggers.
- [ ] Implement `ResetDemo` utility.
- [ ] Ensure URL syncing for deep-linking (optional but recommended).

### 4. Verification ⏳
- [ ] Build verification: `npm run build`
- [ ] TypeScript verification: `npx tsc --noEmit`
- [ ] Functional walkthrough of all scripted interactions.
