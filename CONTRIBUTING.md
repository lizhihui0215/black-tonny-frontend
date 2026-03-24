# Contributing to Black Tonny Frontend

Thanks for contributing.

This repository is the frontend side of the split Black Tonny workspace. It should stay readable as an independent frontend repo while still working smoothly with the sibling backend repo during local collaboration.

## Before You Change Anything

- read [README.md](./README.md) for the current repo status and entrypoints
- read [ARCHITECTURE.md](./ARCHITECTURE.md) before changing page flow, runtime structure, or ownership boundaries
- read [docs/README.md](./docs/README.md) before editing topic-level documentation
- read [AGENTS.md](./AGENTS.md) when you work through an AI coding agent in this repo
- follow [`docs/frontend-engineering-standard.md`](./docs/frontend-engineering-standard.md) for current frontend engineering rules

## Frontend Expectations

- keep the frontend on top of the existing `vue-vben-admin v5` base
- treat `apps/retail-admin` as the primary business application
- treat `apps/retail-admin/src/preferences.ts` as the global theme entrypoint
- use the pinned local Node runtime from [`.node-version`](./.node-version); [`.nvmrc`](./.nvmrc) must stay aligned with it
- avoid introducing new third-party dependencies without a clear justification
- do not move backend-owned metric logic into the frontend

## Verification

Typical local verification flow:

```bash
pnpm install
pnpm check:mainline
```

Use `pnpm check:mainline` as the default local no-drift baseline. It currently includes:

- `pnpm standards:check`
- `pnpm docs:check`
- `pnpm typecheck`

Run `pnpm check:runtime` when your change affects bundling, route loading, build output, application composition, or runtime mainline behavior such as `dashboard`, mock login redirect, summary refresh, or the right-side AI assistant sidebar.

If your change introduces or reshapes a formal frontend/backend business mock path, also update [docs/backend-mock-standard.md](./docs/backend-mock-standard.md) and the matching sibling backend boundary or API contract doc in the same change.

`lefthook` also runs `pnpm check:mainline` on `pre-push`, so local pushes inherit the same baseline instead of relying on memory.

## Documentation Update Rules

Update the correct document for the type of change:

- `README.md`
  - repo purpose
  - current status
  - quick start
  - top-level documentation entrypoints
- `ARCHITECTURE.md`
  - runtime flow
  - page composition model
  - ownership boundaries
  - data-source behavior
- `docs/README.md`
  - topic-document index entries
  - language notes
  - new or removed topic docs
- `AGENTS.md`
  - AI entry precedence
  - required read order
  - shared documentation rules for AI-assisted work
- topic docs under `docs/`
  - frontend standards
  - dashboard product rules
  - business working notes

## Documentation Naming And Linking Rules

- use semantic filenames for Markdown docs by default
- do not use numeric prefixes in Markdown filenames unless the repository doc checker explicitly allowlists the file for a strict tutorial, manual, or runbook sequence
- use Markdown hyperlinks for doc-to-doc navigation and source-of-truth references
- do not leave bare backticked file paths where the reader is expected to navigate

## Documentation Language Policy

Use the following language rule consistently:

- public-facing standard docs must be written in English
- internal working docs must be written in Chinese

In this repository, public-facing standard docs include:

- `README.md`
- `ARCHITECTURE.md`
- `docs/README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`

Internal docs include topic-level working materials under `docs/`, such as:

- frontend standards
- dashboard product rules
- business working notes

If an internal working doc is later promoted into a public-facing standard doc, it must be rewritten in English as part of that promotion.

## Pull Requests

Please include:

- a short summary of the change
- any affected routes, payload assumptions, or ownership boundaries
- the validation steps you ran
- documentation updates when page behavior or architecture changed

## Commit Messages

Conventional-style commit messages are recommended.

Examples:

```text
docs(frontend): standardize english entry docs
feat(dashboard): add backend summary integration
fix(shell): handle missing payload blocks safely
```
