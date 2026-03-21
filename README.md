# Black Tonny Frontend

Independent frontend workspace for the Black Tonny / 小黑托昵 retail dashboard.

Phase 1 uses `vue-vben-admin v5` with the `web-ele` application shell, but the business pages, payload loader, and sample-data workflow are now tailored to Black Tonny. The app runs fully from copied JSON samples inside this repository and does not depend on the sibling `Black-Tonny` repo at runtime.

## Current Scope

- Independent repo at `~/Workspace/black-tonny-frontend`
- `vue-vben-admin v5` `web-ele` shell
- Five business pages:
  - `/dashboard`
  - `/details`
  - `/monthly`
  - `/quarterly`
  - `/relationship`
- Default home route set to `/dashboard`
- No real login, no real permissions, no backend dependency in phase 1
- Data loaded from local sample files under `apps/web-ele/public/data`

## Stack

- Vue 3
- TypeScript
- Vite
- vue-vben-admin v5
- Element Plus
- Pinia
- ECharts
- pnpm workspace

## Frontend Change Standard

业务开发、样式调整、组件接入、依赖变更都先遵守当前仓库规范：

- [前端改动规范](./docs/frontend-change-standard.md)

重点约束：

- 所有改动都基于 `vue-vben-admin v5` 底座。
- 样式改动必须先检查现有 vben / Element Plus / Tailwind token / 业务页面模式。
- `apps/web-ele/src/preferences.ts` 是全局主题与视觉偏好的入口，颜色和布局偏好不要脱离它散落到页面中。
- 默认不要引入新的第三方库；如果必须新增，要先说明原因。

团队协作固化：

- 规范源始终是 `docs/frontend-change-standard.md`
- Codex 项目入口在 `.codex/skills/black-tonny-frontend-standards`
- Claude 项目入口在 `.claude/CLAUDE.md`
- Gemini 项目入口在 `GEMINI.md`
- Codex 用户可运行 `bash ./scripts/install-codex-skill.sh` 把仓库里的共享 skill 链接到本地 `$CODEX_HOME/skills`
- 更新规则时先改规范源，再同步三个入口适配层

## Quick Start

```bash
corepack enable
pnpm install
pnpm sync:data
pnpm dev
```

Default local URL:

```bash
http://localhost:5777
```

## Main Commands

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm sync:data
```

## Data Sync

Phase 1 keeps a local copy of the dashboard payload samples so the frontend repo stays fully isolated.

Default source:

```bash
../Black-Tonny/site/dashboard
```

The sync script copies:

- `manifest.json`
- `dashboard.json`
- `details.json`
- `monthly.json`
- `quarterly.json`
- `relationship.json`
- available markdown and csv exports declared in `manifest.json`

Custom source root:

```bash
BLACK_TONNY_SOURCE_ROOT=/absolute/path/to/Black-Tonny/site/dashboard pnpm sync:data
```

## Project Structure

```text
apps/web-ele/src/
  api/
    black-tonny.ts
  components/
  types/black-tonny.ts
  utils/black-tonny.ts
  views/
    dashboard/
    details/
    monthly/
    quarterly/
    relationship/
    shared/
scripts/
  sync-black-tonny-data.mjs
```

## Phase 2 Frontend Model

The current page layer has moved into a config-driven structure:

- `PageSpec` defines each page's business goal, primary chart, summary priority, and core tables
- `page-shell.vue` acts as the template executor
- the shared components focus on rendering only
- payload contracts remain unchanged

This keeps `dashboard -> details -> relationship -> monthly -> quarterly`
optimizations consistent without creating five unrelated page systems.

## Phase 1 Rules

- Keep business-facing page text in Simplified Chinese
- Keep engineering identifiers and implementation code in English
- Do not read files from the sibling repo at runtime
- Do not move metric computation into the frontend
- Treat missing blocks, empty arrays, and partial payloads as valid inputs
- Show empty states instead of crashing when data is absent

## Verification

The current phase-1 baseline has already been verified with:

- `pnpm install`
- `pnpm typecheck`
- `pnpm build`
- local route checks for all five pages

## Next Phase

Phase 2 can replace the local payload loader with a real `FastAPI` adapter while keeping the page components and route structure unchanged.
