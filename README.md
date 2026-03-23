# Black Tonny Frontend

Frontend repository for the Black Tonny retail dashboard, built on `vue-vben-admin v5` with the current `retail-admin` application shell.

This repo owns the page layer, route structure, shared panels, theme preferences, and frontend-facing interaction model for the current dashboard experience.

## Current Status

- Main business frontend lives in `apps/retail-admin`
- Five business pages are currently exposed:
  - `/dashboard`
  - `/details`
  - `/monthly`
  - `/quarterly`
  - `/relationship`
- Main page payloads now load through the backend `GET /api/manifest` and `GET /api/pages/{page_key}` APIs
- Dashboard summary uses the backend endpoint `GET /api/dashboard/summary`
- A layout-level right-side AI assistant sidebar is available across the business pages and now uses the backend `POST /api/assistant/chat` path, with frontend fallback only for local unavailable-backend scenarios
- Single-owner frontend login currently uses the documented centralized frontend mock owner flow, while `frontend access mode` remains the current access model

## Quick Start

This repo pins the local Node runtime through [`.node-version`](./.node-version). An [`.nvmrc`](./.nvmrc) mirror is also provided for `nvm` users.

```bash
corepack enable
pnpm install
pnpm sync:data
pnpm dev
```

Default local URL:

```text
http://localhost:5777
```

## Common Commands

```bash
pnpm dev
pnpm check:mainline
pnpm check:runtime
pnpm build
pnpm typecheck
pnpm sync:data
pnpm test:e2e:dashboard
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md): runtime flow, page composition model, and frontend ownership boundaries
- [docs/README.md](./docs/README.md): topic-level documentation index
- [docs/document-map.md](./docs/document-map.md): cross-repository document map for product, implementation, and tooling navigation
- [docs/product/README.md](./docs/product/README.md): product overview and solution-facing docs for customer communication
- [docs/tooling/README.md](./docs/tooling/README.md): repo-local tooling docs for temp skills and AI-assisted workflows
- [CONTRIBUTING.md](./CONTRIBUTING.md): contribution and documentation update rules

## AI Entry Docs

- [AGENTS.md](./AGENTS.md): vendor-neutral AI entrypoint, precedence, and repo-wide documentation rules
- [CLAUDE.md](./CLAUDE.md): Claude adapter for the shared AI entry standard
- [GEMINI.md](./GEMINI.md): Gemini adapter for the shared AI entry standard
- [.claude/CLAUDE.md](./.claude/CLAUDE.md): Claude compatibility shim that points to the root adapter

## Documentation Policy

This repository uses a strict documentation language split:

- public-facing standard docs must be written in English
- internal working docs must be written in Chinese

Public-facing standard docs include:

- `README.md`
- `ARCHITECTURE.md`
- `docs/README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`

## Stack

- Vue 3
- TypeScript
- Vite
- `vue-vben-admin v5`
- Element Plus
- Pinia
- ECharts
- pnpm workspace

## Repository Layout

```text
apps/retail-admin/src/
  adapter/
  api/
  components/
  layouts/
  router/
  types/
  utils/
  views/
tests/e2e/
docs/
scripts/
packages/
```

## Data Notes

- The current page shell is config-driven through `PageSpec + page-shell + shared components`, and `dashboard` now also re-enters through the same route-level shell
- Repo-local page payload fixtures now live under `tests/e2e/fixtures/pages`, while the formal runtime page path goes through backend `manifest/pages` APIs
- The dashboard summary and right-side assistant chat paths both expect the backend service for the full current experience

## Related Repositories

- [Optional sibling backend repo (local workspace link)](../black-tonny-backend)
- [Optional sibling backend architecture doc (local workspace link)](../black-tonny-backend/ARCHITECTURE.md)

These sibling references are helpful when you use the split local workspace, but this frontend repo should remain readable on its own.
