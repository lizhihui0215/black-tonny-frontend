# Changeset 与 Release 手册

这份文档承接官方 `Changeset` 主题在当前仓库的落地边界。

## 当前仓库事实

- 根目录存在 `.changeset/`
- 已安装 `@changesets/cli`
- `.changeset/config.json` 已配置固定包组：
  - `@vben-core/*`
  - `@vben/*`

这说明仓库保留了 upstream 风格的 workspace versioning 能力，但它不是每次日常业务改动都必须触发的流程。

## 什么时候考虑写 changeset

- 你修改了 `packages/*` 或 `internal/*` 中面向复用或发布的 workspace package
- 这次改动会改变共享包的行为边界、类型、导出或发布产物
- 维护者明确要为这次 shared change 记录 release 语义

## 什么时候通常不需要

- 纯 `apps/retail-admin` 页面改动
- 纯文档改动
- 只影响当前本地业务表现、不会被当作 package version 语义管理的变更

## 当前仓库的默认判断

- app-only 改动默认不写 changeset
- shared package / internal package 改动，先判断它是不是“版本语义变化”
- 如果只是局部修复且不会走 release 节奏，先不要机械补 changeset

## 推荐流程

1. 先确认改动是否跨出 `apps/retail-admin`。
2. 如果动到 `packages/*` 或 `internal/*`，再判断是否触发共享版本语义。
3. 只有当维护者确认这次变化需要进入 release 轨道时，再执行 `pnpm changeset`。
4. 写 changeset 后，同步更新相关维护或标准文档。

## 验证要求

- shared package 变更至少验证受影响 app 的 `typecheck`
- 涉及构建链或导出能力，补跑对应 `build`
- changeset 只是版本记录，不替代类型检查、构建和文档同步
