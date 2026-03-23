# 维护者文档入口

这组文档服务的是 `black-tonny-frontend` 的维护动作，不是日常页面开发说明。

它们同时是这些维护主题的 `role-scoped source of truth`。

它们回答的是：

- 什么时候应该看官方 `Role-scoped` 文档，而不是直接改业务代码
- 升级、release、CLI/bootstrap、模板清理、UI framework 评估应该怎么落到当前仓库
- 哪些能力现在只是 `Future-watch`，但未来一旦演进必须回到官方基线

## 适用范围

- 官方 CLI / quick-start 类操作
- `.changeset`、workspace package 版本和 release 决策
- 基于官方文档的项目升级与模板清理
- UI framework 评估
- CI / runner 选型
- 仓库清理执行边界
- 登录闭环演进
- 外部模块接入评审

不适用范围：

- 日常页面开发
- 一般前端样式/交互改动
- dashboard 业务口径

这些内容继续以正式规则为准：

- [Frontend Docs Index](../README.md)
- [前端工程标准](../frontend-engineering-standard.md)
- [官方覆盖清单](../official-doc-coverage-board.md)
- [Vben 对齐审计](../vben-alignment-audit.md)

## 推荐读法

### 1. 想升级仓库或对齐官方基线

1. [官方覆盖清单](../official-doc-coverage-board.md)
2. [项目更新手册](./project-update-handbook.md)
3. [Vben 对齐审计](../vben-alignment-audit.md)

### 2. 想判断要不要写 changeset

1. [Changeset 与 Release 手册](./changeset-and-release-handbook.md)
2. [项目更新手册](./project-update-handbook.md)

### 3. 想用官方 CLI 或 quick-start 思路做初始化/重建

1. [CLI 与 Bootstrap 手册](./cli-and-bootstrap-handbook.md)
2. [前端工程标准](../frontend-engineering-standard.md)

### 4. 想删模板代码或瘦身仓库

1. [模板清理手册](./template-cleanup-handbook.md)
2. [Vben 对齐审计](../vben-alignment-audit.md)

### 5. 想评估未来演进方向

- UI framework：看 [UI Framework 策略](./ui-framework-strategy.md)
- CI / runner：看 [CI 与 Runner 策略](./ci-and-runner-strategy.md)
- 底座定制边界：看 [Upstream 定制台账](./upstream-customization-ledger.md)
- 清理执行边界：看 [仓库清理手册](./repo-cleanup-handbook.md)
- 登录体系：看 [登录演进手册](./login-evolution-handbook.md)
- 外部模块：看 [外部模块手册](./external-modules-handbook.md)

## 文档列表

- [CLI 与 Bootstrap 手册](./cli-and-bootstrap-handbook.md)
- [Changeset 与 Release 手册](./changeset-and-release-handbook.md)
- [项目更新手册](./project-update-handbook.md)
- [模板清理手册](./template-cleanup-handbook.md)
- [UI Framework 策略](./ui-framework-strategy.md)
- [CI 与 Runner 策略](./ci-and-runner-strategy.md)
- [Upstream 定制台账](./upstream-customization-ledger.md)
- [仓库清理手册](./repo-cleanup-handbook.md)
- [登录演进手册](./login-evolution-handbook.md)
- [外部模块手册](./external-modules-handbook.md)

## 当前结论

- 日常开发继续遵守 [前端工程标准](../frontend-engineering-standard.md)
- 维护动作优先看这组文档；这组文档就是对应维护主题的正式规范源
- 如果未来某个维护主题开始频繁影响日常开发，再考虑把它提升进 [前端工程标准](../frontend-engineering-standard.md)
