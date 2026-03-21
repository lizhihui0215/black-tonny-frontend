---
name: "black-tonny-frontend-standards"
description: "Use when tasks involve the black-tonny-frontend repository, especially apps/web-ele pages, components, styles, routes, preferences, or frontend dependency changes. Enforce the shared Black Tonny frontend rules: build on vue-vben-admin v5, keep visuals aligned with existing Black Tonny pages, treat apps/web-ele/src/preferences.ts as the global theme entry, read the repo rule document before making changes, and do not add third-party libraries unless explicitly approved after justification."
---

# Black Tonny Frontend Standards

This skill applies only when the current task is inside the `black-tonny-frontend` repository.

## Required first step

Before making changes, read the repo document:

- `docs/frontend-change-standard.md`

Treat that document as the source of truth. If this skill and the repo document ever differ, follow the repo document and update the skill afterward.

## Fast guardrails

- Stay on top of `vue-vben-admin v5` and the repo's existing `@vben/*`, Element Plus, Tailwind, router, bootstrap, and preferences systems.
- Keep Black Tonny's existing business visual language; do not force pages back to generic demo styling.
- Treat `apps/web-ele/src/preferences.ts` as the global theme entry. Do not isolate global-looking colors or layout preferences from that theme chain.
- Default to reusing existing dependencies. Do not add new third-party libraries unless the user explicitly approves after you explain the gap.
- Prefer changes in `apps/web-ele`, keep business-facing text in Simplified Chinese, keep engineering identifiers in English, and run `pnpm typecheck` after meaningful frontend changes when feasible.
