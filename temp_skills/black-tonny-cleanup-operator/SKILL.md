---
name: black-tonny-cleanup-operator
description: Use when the user explicitly asks to execute cleanup inside black-tonny-frontend, such as removing tracked debug artifacts, shrinking repo-owned leftovers, or cleaning low-value upstream diffs under the documented repo cleanup rules.
---

# Black Tonny Cleanup Operator

Use this repo-owned experimental skill only when the user explicitly wants cleanup to be executed.

This skill is not the source of truth. Follow the repository docs first:

- [README.md](../../README.md)
- [docs/frontend-engineering-standard.md](../../docs/frontend-engineering-standard.md)
- [docs/vben-alignment-audit.md](../../docs/vben-alignment-audit.md)
- [docs/maintainers/repo-cleanup-handbook.md](../../docs/maintainers/repo-cleanup-handbook.md)

If the cleanup touches `packages/*` or `internal/*`, also read:

- [docs/maintainers/upstream-customization-ledger.md](../../docs/maintainers/upstream-customization-ledger.md)

## Trigger Boundary

Use this skill only when the user explicitly indicates execution intent, for example:

- “执行清理”
- “帮我清掉”
- “现在把这些删掉”
- “按这个范围收掉残留”
- “彻底清理本地内容，但配置都保留”

Do not use this skill for requests like:

- “检查一下还有什么可以清理”
- “审计一下是否有残留”
- “看看哪里不符合标准”

Those are audit tasks, not execution cleanup.

## What This Skill Is For

- remove tracked debug artifacts or generated leftovers
- clean repo-owned low-value residual files
- normalize no-value upstream diffs back to the official shape
- update guardrails so the same cleanup target does not come back
- run full local cleanup for disk pressure while preserving tracked files and repository configuration

## What This Skill Must Not Turn Into

- a blanket delete-everything pass
- a hidden refactor of runtime architecture
- a reason to delete shared or internal code just because it looks unfamiliar
- an excuse to skip docs or verification

## Execution Workflow

1. Read the cleanup handbook and current alignment audit.
2. List the requested cleanup scope.
3. Classify each target:
   - safe cleanup
   - review-required cleanup
   - boundary-sensitive cleanup
   - full local cleanup
4. Only execute inside the user-approved scope.
5. If cleanup changes docs, standards, or guardrails, update them in the same change.
6. Run the matching verification:
   - `pnpm docs:check`
   - `pnpm standards:check`
   - `pnpm check:mainline`
   - `pnpm check:runtime`

## Notes

- Default to the smallest cleanup that solves the stated problem.
- If the request is about freeing disk on the local machine, prefer `pnpm clean:local:plan` first and only move to apply mode after explicit execution intent.
- If a target is in `packages/*` or `internal/*` and is not already covered by the upstream customization ledger, pause and treat it as boundary-sensitive.
- If the user asked only for investigation, stop after the audit output.
