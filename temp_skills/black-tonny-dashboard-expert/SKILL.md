---
name: black-tonny-dashboard-expert
description: Use when work is centered on Black Tonny dashboard docs, task briefs, page-to-metric mapping, or repo-local dashboard context building inside this frontend repository.
---

# Black Tonny Dashboard Expert

## Overview

Use this repo-owned experimental skill when a task needs dashboard-specific context that sits between product docs and implementation work.

It helps translate the existing dashboard docs in this repo into clearer task briefs, page-context summaries, and document updates for AI-assisted work.

This skill does not replace the repository source of truth. If it conflicts with formal docs, follow:

- `README.md`
- `docs/README.md`
- `docs/frontend-engineering-standard.md`
- `docs/dashboard/*`

## When To Use

Use this skill when:

- you are updating `docs/dashboard/` content
- you are preparing a dashboard-focused task brief
- you need a quick page-to-metric or page-to-component context summary
- you want to reuse the bundled examples in `scripts/` or `references/`

Do not use this skill as the primary guide for:

- generic Vue / TypeScript engineering rules
- Vben admin architecture questions
- backend ERP capture or serving work
- global Codex skill behavior

## Inputs

Typical useful inputs:

- target page or dashboard module
- target document or file path
- requested output type
  - doc update
  - task brief
  - context summary
  - example adaptation
- relevant metric or business concept name

## Outputs

Typical outputs:

- a dashboard document draft or cleanup
- a concise implementation brief
- a page-level context handoff for another agent or engineer
- an explanation of how existing dashboard docs fit together

## Workflow

1. Read the repo source-of-truth docs first:
   - `README.md`
   - `docs/README.md`
   - `docs/frontend-engineering-standard.md`
2. Read the dashboard docs that match the task.
3. Use this skill to structure or summarize the relevant dashboard context.
4. Reuse bundled examples only as scaffolding, not as product truth.
5. If the task changes runtime behavior, trace the matching frontend docs and backend contract links before finalizing.

## Example Requests

- “Summarize the dashboard summary docs into a task brief for a KPI-card refactor.”
- “Map the current dashboard docs to the page shell and shared component structure.”
- “Turn the dashboard evolution notes into a short implementation checklist.”
- “Use the bundled example files to outline a better dashboard expert skill.”

## Bundled Resources

- `scripts/example_script.cjs`
  - Example executable placeholder that shows where repo-local helper scripts can live.
- `references/example_reference.md`
  - Example context material that can be loaded into an AI session.
- `assets/example_asset.txt`
  - Example non-context asset placeholder.

These files are examples, not canonical business references.

## Notes

- This is a repo-owned experimental skill.
- It is not the same as a global Codex skill under `~/.codex/skills`.
- If this skill becomes important enough to standardize, move the rule into the repo docs rather than duplicating it here.

## Resources

This skill includes example resource directories that demonstrate how to organize different types of bundled resources:

### scripts/

Executable code that can be run directly to perform specific operations.

**Examples from other skills:**

- PDF skill: fill_fillable_fields.cjs, extract_form_field_info.cjs - utilities for PDF manipulation
- CSV skill: normalize_schema.cjs, merge_datasets.cjs - utilities for tabular data manipulation

**Appropriate for:** Node.cjs scripts (cjs), shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Gemini CLI for patching or environment adjustments.

### references/

Documentation and reference material intended to be loaded into context to inform Gemini CLI's process and thinking.

**Examples from other skills:**

- Product management: communication.md, context_building.md - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Gemini CLI should reference while working.

### assets/

Files not intended to be loaded into context, but rather used within the output Gemini CLI produces.

**Examples from other skills:**

- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

The example directories are intentionally kept here because this skill is still experimental. Remove or replace them only when the skill is promoted beyond template status.
