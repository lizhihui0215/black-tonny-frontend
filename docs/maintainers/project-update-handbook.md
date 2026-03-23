# 项目更新手册

这份文档承接官方 `项目更新`、`检查更新` 相关主题在当前仓库的维护流程。

## 目标

升级 `black-tonny-frontend` 时，优先保证：

- 继续对齐官方 `vben` 基线
- 不覆盖本仓已登记的业务差异和历史例外
- 升级结论能回写到标准、覆盖清单和审计文档

## 升级前必读

1. [官方覆盖清单](../official-doc-coverage-board.md)
2. [前端工程标准](../frontend-engineering-standard.md)
3. [Vben 对齐审计](../vben-alignment-audit.md)
4. 本手册

## 升级前检查

- 官方文档导航是否新增了一级页面或组件章节
- 当前仓库有哪些 `Registered exception`
- 当前仓库有哪些 shared package / internal 改动已经偏离 upstream 默认形态
- 是否存在会被升级直接影响的入口：
  - `apps/retail-admin/src/preferences.ts`
  - `apps/retail-admin/src/layouts/basic.vue`
  - `apps/retail-admin/src/api/request.ts`
  - `internal/vite-config/*`
  - `packages/@core/ui-kit/*`

## 升级实施原则

- 在独立分支做升级
- 先更新底座，再处理本仓差异，不要混成一次性大杂烩
- 每次升级都要先区分：
  - 官方新默认
  - 本仓长期标准
  - 已登记例外

## 升级后必须完成的回写

- 更新 [官方覆盖清单](../official-doc-coverage-board.md)
- 更新 [Vben 对齐审计](../vben-alignment-audit.md)
- 如果长期规则发生变化，同步更新 [前端工程标准](../frontend-engineering-standard.md)
- 若维护流程本身变了，同步更新这组 `maintainers/*` 文档

## 最低验证

- `pnpm --filter @black-tonny/retail-admin typecheck`
- 若动到 app 组成、构建链、共享包或 `internal/*`，补跑 `pnpm --filter @black-tonny/retail-admin build`
- 若改动了文档体系，补跑 `pnpm docs:check`
