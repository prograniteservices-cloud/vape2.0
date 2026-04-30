# VapeOS 2.0 Issue Log

## Issue 1: Missing Product Cards / Menu Items Appearing Broken

### Description
Users reported that clicking on menu items (e.g., "Vapes", "Cigarettes") resulted in "nothing" happening—no product cards were displayed. 

### Root Cause Analysis
1. **Layout Architecture Flaw**: The main product preview area (`Dashboard`) was placed inside the left sidebar, forced into a compressed view (`compact={true}`).
2. **Mobile Unresponsiveness**: On mobile devices (`md:hidden`), the left sidebar is completely hidden. Because the Dashboard was inside this hidden container, when a mobile user selected a category, the mobile overlay closed, leaving them with just the AI VoiceBot and no product list.
3. **Desktop UX Confusion**: On desktop, the central focus remained on the AI VoiceBot, with products only appearing in the tiny compressed sidebar list, causing users to completely miss the UI change and assume the click "just doesn't work".

### Resolution
- The `Dashboard` component was moved from the Left Panel into the main Center Panel.
- It is now conditionally rendered (`compact={false}`) when a category is selected, completely taking over the center view to give the product cards the space they deserve.
- The `AIVoiceBot` remains the default view when no category is selected. 
- Removed artificial `setTimeout` delays in navigation that were previously attempting (and failing) to mask render lag.

---

## Issue 2: AI VoiceBot "Connection Error" Silent Failures

### Description
The AI VoiceBot would often fail in production with a generic "Connection Error", or silently fail (the status would quickly flip back to "idle" without providing an answer).

### Root Cause Analysis
1. **Error Hiding**: In `AIVoiceBot.tsx`, the `finally` block of `handleSendMessage` contained `setResponseMessage('')`. If an error occurred, the bot would briefly set the error message, play a fallback audio, and immediately clear the text from the screen, making it impossible for the user to read the error.
2. **Generic Catch**: The `catch` block wasn't exposing the actual `error.message` (such as "Quota Exceeded" or "API Key Missing"), leaving the developer guessing why the connection dropped.
3. **Vercel Env Vars**: Vercel cache/deployments were occasionally missing the `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY`, causing the server action to fail 500.

### Resolution
- Modified the `catch` block to explicitly parse `error?.message` and inject it into the `responseMessage`.
- Removed `setResponseMessage('')` from the `finally` block so the error text persists on the screen until the user initiates a new chat.
- Set up a clean redeploy flow to ensure Vercel picks up the correct environment variables.

---

*Log updated: 2026-04-30*
