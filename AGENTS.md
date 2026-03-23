# Black Tonny Frontend Agent Guide

This file is the vendor-neutral AI entrypoint for `black-tonny-frontend`.

Use it to find the canonical frontend docs and collaboration rules. Do not treat this file as a second source of truth.

## Purpose

- define read order and doc precedence for AI-assisted work
- point to the current frontend standards and working docs
- keep vendor-specific adapter files thin and aligned

## Precedence

If instructions differ, follow this order:

1. Direct task, runtime, or maintainer instructions
2. [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [docs/README.md](./docs/README.md), and [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Relevant deeper docs such as [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md) and the dashboard working docs listed in [docs/README.md](./docs/README.md)
4. This file
5. [CLAUDE.md](./CLAUDE.md), [.claude/CLAUDE.md](./.claude/CLAUDE.md), and [GEMINI.md](./GEMINI.md)

## Required Read Order

Before changing code or docs, read in this order:

1. [README.md](./README.md)
2. The relevant section or sections of [ARCHITECTURE.md](./ARCHITECTURE.md) that match the frontend layer, data path, or ownership boundary you may touch
3. The relevant entry in [docs/README.md](./docs/README.md) that points to the deeper docs for your area
4. Only the deeper docs that match the area you touch before changing behavior, contracts, or documented rules

Common deeper docs, open them when the task crosses those boundaries:

- [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md)

If the task is about standards, alignment review, component strategy, or whether the repo is drifting from the official `vben` baseline, also read:

- [docs/vben-official-baseline.md](./docs/vben-official-baseline.md)
- [docs/official-doc-coverage-board.md](./docs/official-doc-coverage-board.md)

If the task is about upgrade strategy, release/versioning, CLI/bootstrap workflows, template cleanup, UI framework evaluation, CI/runner choice, login evolution, or external module review, also read:

- [docs/maintainers/README.md](./docs/maintainers/README.md)

If the task involves repo-local temp skills, AI-assisted tooling, or adapter-specific workflow guidance, also read:

- [docs/tooling/README.md](./docs/tooling/README.md)
- [docs/tooling/ai-token-playbook.md](./docs/tooling/ai-token-playbook.md)

## Task Routing And Minimum Read Set

Use the smallest read set that still covers the boundary you may change.

| Task type | Minimum read set | Expand only when |
| --- | --- | --- |
| Small scoped page, component, styling, or test fix inside the existing frontend model | [README.md](./README.md), the relevant section of [ARCHITECTURE.md](./ARCHITECTURE.md), the matching entry in [docs/README.md](./docs/README.md), [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md), and the target code or test files | the change alters shared layout behavior, runtime data flow, auth behavior, or source-of-truth docs |
| Data-source integration or frontend-backend contract task | [README.md](./README.md), the data-flow and auth sections of [ARCHITECTURE.md](./ARCHITECTURE.md), [docs/README.md](./docs/README.md), [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md), and the matching frontend or sibling backend contract docs | the change also alters dashboard semantics, repo standards, or maintainer-owned decisions |
| Standards, alignment, or maintainer strategy task | [README.md](./README.md), the relevant sections of [ARCHITECTURE.md](./ARCHITECTURE.md), [docs/README.md](./docs/README.md), [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md), and the matching maintainer or alignment docs | the decision also changes product-facing behavior, backend boundaries, or formal runtime contracts |
| Repo-local tooling, AI collaboration, or temp skill task | [README.md](./README.md), [docs/README.md](./docs/README.md), [docs/tooling/README.md](./docs/tooling/README.md), and [docs/tooling/ai-token-playbook.md](./docs/tooling/ai-token-playbook.md) | the tooling work touches runtime code, frontend standards, or sibling backend tooling boundaries |
| Doc-only navigation, AI entry, or adapter maintenance | [README.md](./README.md), [docs/README.md](./docs/README.md), this file, and [docs/tooling/README.md](./docs/tooling/README.md) | the documentation update changes runtime ownership, public contracts, or repo-wide contribution rules |

## Low-Token Collaboration Defaults

- Start from one or two likely entry docs from the routing table above; do not pre-open every standard doc unless the task is boundary-spanning.
- Prefer scoped search with repo-local directories and task-specific keywords; avoid workspace-wide broad search unless local evidence is insufficient.
- Read targeted excerpts first and only scan full long docs when the task changes their owned boundary or the needed rule cannot be located otherwise.
- Keep progress updates to major checkpoints and avoid repeating the same repository facts after they are established.
- After each exploration round, keep a short fact cache with three lines: confirmed facts, excluded paths, and next step.
- If the task changes public contracts, runtime ownership, or source-of-truth rules, widen the read set before editing rather than guessing.
- Keep low-token collaboration guidance centralized in this file plus [docs/tooling/ai-token-playbook.md](./docs/tooling/ai-token-playbook.md); do not duplicate the same operating rules across unrelated area docs.

## Skill Policy

- Repository docs remain the source of truth.
- Adapter files point to those docs and should stay thin.
- Skills are optional execution helpers only; do not store repository rules only in a skill.
- If a skill and the repo docs ever differ, follow the repo docs and update or retire the skill.

## Documentation Language Policy

- Public-facing standard docs and AI entry docs must be written in English.
- Internal working docs under [docs/](./docs/README.md) must be written in Chinese.
- If an internal working doc is promoted into a public-facing standard doc, rewrite it in English as part of that promotion.

## Documentation Linking Policy

- Use Markdown hyperlinks for doc-to-doc navigation, source-of-truth references, and related-doc pointers.
- Do not rely on bare backticked file paths when the reader is expected to open another document.
- Navigation references must not be written as plain path text.

## File Naming Policy

- Use semantic filenames by default.
- Do not use numeric prefixes in Markdown filenames unless the file is explicitly allowlisted by the repository doc checker for a strict tutorial, manual, or runbook sequence.

## Verification Expectations

- Run the relevant verification for the area you changed.
- For doc-only changes, at minimum check links, naming consistency, and ownership statements.
- If page flow, frontend-owned behavior, or data-source handling changes, update the matching standard docs in the same change.

## Frontend-Specific Pointers

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [docs/README.md](./docs/README.md)
- [docs/tooling/README.md](./docs/tooling/README.md)
- [docs/frontend-engineering-standard.md](./docs/frontend-engineering-standard.md)
- [docs/maintainers/README.md](./docs/maintainers/README.md)

## Adapter Rule

Vendor-specific files such as [CLAUDE.md](./CLAUDE.md), [.claude/CLAUDE.md](./.claude/CLAUDE.md), and [GEMINI.md](./GEMINI.md) are compatibility adapters only. Keep them thin and do not duplicate frontend standards there.
