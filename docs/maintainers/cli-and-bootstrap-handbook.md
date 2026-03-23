# CLI 与 Bootstrap 手册

这份文档承接官方 `quick-start` 与 `CLI` 的维护侧知识。

## 当前仓库结论

当前仓库已经是一个成熟的 `vben` 变体，不应把官方 CLI 当成日常改造工具直接跑在现有代码树上。

更合适的用途是：

- 在独立目录里生成官方样板，用来比对默认结构和最新约定
- 在升级前验证官方初始化输出有没有新能力
- 在某个子能力彻底缺失时，作为“参考生成器”而不是“直接改仓库”的工具

## 什么时候可以用

- 你需要确认某个官方默认目录、配置或脚手架输出长什么样
- 你要对照最新官方模板检查本仓是否缺少关键入口
- 你在做升级前的差异比对

## 什么时候不要用

- 为了省事，直接对当前仓库执行自动初始化或覆盖式生成
- 试图用 CLI 替代手工架构判断
- 想靠重新生成目录来“顺便修标准问题”

## 当前仓库的真实入口

日常工作流继续以仓库脚本为准：

- `pnpm dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm docs:check`

如果是 repo-local 工具工作流，还可以看：

- `scripts/vsh/README.md`
- `scripts/check-docs.mjs`

## 推荐操作方式

1. 先看 [前端工程标准](../frontend-engineering-standard.md) 和 [官方覆盖清单](../official-doc-coverage-board.md)。
2. 如果确实需要 CLI/quick-start 视角，在独立 sandbox 目录生成样板。
3. 只把“结构差异结论”带回当前仓库，不把生成结果整包复制进来。
4. 回到当前仓库时，仍按 `apps / packages / internal` 边界手工落地。

## 验证要求

- 只要你根据 CLI/quick-start 结论改了当前仓库，至少跑 `pnpm --filter @black-tonny/retail-admin typecheck`
- 如果改动涉及 app 组成、构建链或目录入口，补跑 `pnpm --filter @black-tonny/retail-admin build`
