# Decision Log - VapeOS v2

Record durable project decisions here. Keep entries short and factual.

## 2026-05-01 - Protect Current Client MVP

The current client-facing MVP is deployed separately under the Vercel link/name `vapes and more mvp 2026`.

Decision:

- Treat `vapes-and-more-mvp-2026` as protected.
- Do not merge, deploy over, or otherwise disturb the MVP unless the user explicitly asks.
- New work must happen on a separate branch.
- Do not push to GitHub or deploy to Vercel without explicit user approval and confirmed targets.

Rationale:

The client is actively reviewing the MVP with their company, and it currently works as a demo.

## 2026-05-01 - Replace Current MVP With Semantic Search Build

Decision:

- User approved replacing the current MVP with the semantic search build.
- Pushed semantic search work to `origin/main`.
- Promoted the Vercel `vape-shop-mvp-2026` production deployment to the new main-branch build.
- Added required production env vars to `vape-shop-mvp-2026`, including server-side Supabase and Vertex credential configuration.

Rationale:

The user wanted the new semantic-search MVP to take the place of the current client-facing MVP.

## 2026-05-01 - Use PROJECT_STATE.md As Canonical Continuity File

Decision:

- Use `PROJECT_STATE.md` as the first source of current verified project state.
- Treat `handoff.md` and directive docs as historical/planning context that must be verified.
- Update `PROJECT_STATE.md` whenever meaningful work changes state, blockers, or next steps.

Rationale:

The prior handoff contains inaccuracies, and future sessions need a low-friction restart path.

## 2026-05-01 - Credentials Source Of Truth

Decision:

- Existing auth material lives in `C:\Users\heath\Desktop\skills\auth\`.
- When credentials are created, deleted, rotated, or discovered, update the relevant file in that folder.
- Do not expose raw secret values in project docs, commits, logs, or chat responses.

Rationale:

Credentials are intentionally centralized outside the repo, and future agents need to know where to look without copying secrets into source control.
