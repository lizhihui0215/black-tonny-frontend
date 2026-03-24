# Frontend Docs Index

This directory contains topic-level documentation for `black-tonny-frontend`.

## Recommended First Read

If your task crosses product docs, frontend implementation docs, backend data docs, or tooling/MCP navigation, start with:

- [`document-map.md`](./document-map.md)

Then continue into the specific frontend or backend topic docs from there.

## Language Note

Top-level public entry docs in this repository are maintained in English:

- [`../README.md`](../README.md)
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- [`../AGENTS.md`](../AGENTS.md)

AI entry adapters are also maintained in English:

- [`../CLAUDE.md`](../CLAUDE.md)
- [`../GEMINI.md`](../GEMINI.md)
- [`../.claude/CLAUDE.md`](../.claude/CLAUDE.md)

Internal working documents in `docs/` must be maintained in Chinese.

This repository therefore uses a strict split:

- public-facing standard docs: English
- internal working docs: Chinese

## Status Legend

- `Source of truth`: the canonical rule or contract for the topic
- `Working doc`: active internal collaboration material
- `Draft`: incomplete or evolving internal material
- `Reference`: supporting context that is useful but not normative

Generated state panels should still use one of the four status values above. If a doc is the generated current-state entrypoint, call that out explicitly in its description.

## Core Frontend Docs

- [`frontend-engineering-standard.md`](./frontend-engineering-standard.md)
  - Current source of truth for frontend engineering rules, aligned to official `vue-vben-admin v5` docs and the local Black Tonny repo baseline, including env/config, routing/access, request layer, component reuse, theme, tooling, and verification rules
  - Current language: Chinese working doc
  - Status: `Source of truth`
- [`backend-mock-standard.md`](./backend-mock-standard.md)
  - Source of truth for official-style `apps/backend-mock` rules when frontend and backend advance formal `/api/*` interfaces together
  - Current language: Chinese working doc
  - Status: `Source of truth`
- [`vben-official-baseline.md`](./vben-official-baseline.md)
  - Internal summary of the official `vue-vben-admin v5` baseline plus related ecosystem boundaries such as `shadcn-vue` and Nitro, used to support local standards and alignment reviews
  - Current language: Chinese
  - Status: `Reference`
- [`official-doc-coverage-board.md`](./official-doc-coverage-board.md)
  - Full official-doc coverage inventory for `vue-vben-admin v5`, components, and related ecosystem boundaries, with local classification by mandatory/reference/future-watch
  - Current language: Chinese
  - Status: `Reference`
- [`vben-alignment-audit.md`](./vben-alignment-audit.md)
  - Repository-wide alignment audit and exception register against the official `vue-vben-admin v5` baseline, covering `apps`, `packages`, and `internal`
  - Current language: Chinese
  - Status: `Working doc`
- [`document-map.md`](./document-map.md)
  - Recommended cross-repository reading entrypoint for product, implementation, and tooling navigation
  - Current language: Chinese
  - Status: `Reference`

## Maintainer Docs

- [`maintainers/README.md`](./maintainers/README.md)
  - Role-scoped maintainer standards entrypoint for upgrade, release, template cleanup, framework evaluation, and future architecture evolution topics
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/cli-and-bootstrap-handbook.md`](./maintainers/cli-and-bootstrap-handbook.md)
  - Role-scoped source of truth for official CLI, quick-start-style bootstrap work, and when those flows are or are not appropriate for this repo
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/changeset-and-release-handbook.md`](./maintainers/changeset-and-release-handbook.md)
  - Role-scoped source of truth for `.changeset`, release-oriented workspace package changes, and when a changeset is required in this repo
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/project-update-handbook.md`](./maintainers/project-update-handbook.md)
  - Role-scoped source of truth for upgrading the local repo against the official `vben` baseline, including preflight and verification
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/template-cleanup-handbook.md`](./maintainers/template-cleanup-handbook.md)
  - Role-scoped source of truth for removing upstream template code safely without breaking current project assumptions
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/ui-framework-strategy.md`](./maintainers/ui-framework-strategy.md)
  - Role-scoped source of truth for the current Element Plus decision and future UI framework switch evaluation
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/ci-and-runner-strategy.md`](./maintainers/ci-and-runner-strategy.md)
  - Role-scoped source of truth for CI platform choice, runner cost strategy, and when hosted free tiers should or should not be treated as the primary direction
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/upstream-customization-ledger.md`](./maintainers/upstream-customization-ledger.md)
  - Role-scoped source of truth for file-level repo-owned customizations against the local `vue-vben-admin` upstream clone in `packages/*` and `internal/*`
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/repo-cleanup-handbook.md`](./maintainers/repo-cleanup-handbook.md)
  - Role-scoped source of truth for repository cleanup execution boundaries, cleanup classification, and when cleanup tasks should stay in audit-only mode
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/login-evolution-handbook.md`](./maintainers/login-evolution-handbook.md)
  - Role-scoped source of truth for the current single-owner auth baseline and the future path to deeper login/access evolution
  - Current language: Chinese
  - Status: `Source of truth`
- [`maintainers/external-modules-handbook.md`](./maintainers/external-modules-handbook.md)
  - Role-scoped source of truth for evaluating external modules and new capability layers against the repo standard
  - Current language: Chinese
  - Status: `Source of truth`

## Product Docs

- [`product/README.md`](./product/README.md)
  - Product-facing overview and solution docs entrypoint
  - Current language: Chinese
  - Status: `Working doc`
- [`product/platform-overview.md`](./product/platform-overview.md)
  - Customer-facing platform overview
  - Current language: Chinese
  - Status: `Working doc`
- [`product/platform-solution-brief.md`](./product/platform-solution-brief.md)
  - Solution-oriented product brief for deeper communication
  - Current language: Chinese
  - Status: `Working doc`

## Tooling Docs

- [`tooling/README.md`](./tooling/README.md)
  - Repo-local tooling docs entrypoint
  - Current language: Chinese
  - Status: `Reference`
- [`tooling/ai-token-playbook.md`](./tooling/ai-token-playbook.md)
  - Low-token collaboration defaults for AI-assisted frontend repo work
  - Current language: Chinese
  - Status: `Reference`
- [`tooling/skills-guide.md`](./tooling/skills-guide.md)
  - Repo-owned temp skill boundary, maintenance standard, and usage guide
  - Current language: Chinese
  - Status: `Reference`
- [`tooling/ai-collaboration-guide.md`](./tooling/ai-collaboration-guide.md)
  - Repo-local AI collaboration doc precedence, adapter role, and skill boundary guide
  - Current language: Chinese
  - Status: `Reference`

## Dashboard Docs

Recommended reading order:

1. [`dashboard/overview.md`](./dashboard/overview.md) - Dashboard product overview and page goals. Current language: Chinese.
   - Status: `Source of truth`
2. [`dashboard/summary-metrics.md`](./dashboard/summary-metrics.md) - Dashboard summary metric definitions. Current language: Chinese.
   - Status: `Source of truth`
3. [Sibling backend `summary-api.md`](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/dashboard/summary-api.md) - Backend contract for `GET /api/dashboard/summary`. Current language: Chinese.
   - Status: `Source of truth`
4. [`dashboard/interaction-rules.md`](./dashboard/interaction-rules.md) - Dashboard interaction and linkage rules. Current language: Chinese.
   - Status: `Source of truth`
5. [`dashboard/summary-analysis-logic.md`](./dashboard/summary-analysis-logic.md) - Business analysis logic behind the summary layer. Current language: Chinese.
   - Status: `Source of truth`
6. [`dashboard/evolution-log.md`](./dashboard/evolution-log.md) - Dashboard evolution log and current mainline status. Current language: Chinese.
   - Status: `Working doc`

Supporting internal doc:

- [`dashboard/codex-task-brief.md`](./dashboard/codex-task-brief.md) - Internal task brief for AI-assisted dashboard work. Current language: Chinese.
  - Status: `Reference`

## Related Sibling-Repo Docs

- [Sibling backend architecture](https://github.com/lizhihui0215/black-tonny-backend/blob/main/ARCHITECTURE.md)
- [Sibling frontend/backend boundary note](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/frontend-backend-boundary.md)
  - Current language: Chinese collaboration doc
  - Status: `Working doc`
