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
- Formal auth contract now follows the sibling backend `/api/auth/*` and `/api/user/info` routes, while repo-owned `apps/backend-mock` remains the dev/test fallback for single-repo work

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
- [docs/backend-mock-standard.md](./docs/backend-mock-standard.md): source of truth for repo-owned `backend-mock` rules when frontend and backend advance formal `/api/*` work together
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
apps/backend-mock/
  api/
  fixtures/
  utils/
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
- Repo-owned page payload fixtures now live under `apps/backend-mock/fixtures/pages`, while the formal runtime page path still goes through backend `manifest/pages` APIs
- Formal auth source of truth is now the sibling backend auth routes; `apps/backend-mock` only remains as the local dev/test fallback, instead of becoming a second frontend-local auth provider
- The dashboard summary and right-side assistant chat paths both expect the backend service for the full current experience

## Related Repositories

- [Sibling backend repository](https://github.com/lizhihui0215/black-tonny-backend)
- [Sibling backend architecture doc](https://github.com/lizhihui0215/black-tonny-backend/blob/main/ARCHITECTURE.md)

These sibling references should stay readable on GitHub even when the frontend repo is viewed on its own.
