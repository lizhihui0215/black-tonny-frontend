# Frontend Vben Alignment Audit

这份文档是 `black-tonny-frontend` 的全仓对齐审计与例外登记板。

它用于对照：

- [前端工程标准](./frontend-engineering-standard.md)
- [官方覆盖清单](./official-doc-coverage-board.md)
- 当前 `vue-vben-admin v5` 官方基线

判断当前仓库在 `apps + packages + internal` 三层里：

- 哪些地方已经对齐
- 哪些地方属于 `Mandatory drift`
- 哪些地方属于 `Registered exception`
- 哪些地方曾经是 `Role-scoped gap`，现在已被维护者文档补齐

## Audit Scope

本次审计覆盖：

- `apps/retail-admin`
- `packages/*`
- `internal/*`
- 前端标准文档入口

审计维度固定为：

- Monorepo 边界
- 环境与运行时配置
- preferences / app config
- router / menu / access
- request layer 与 API 契约
- 页面组合与 layout 扩展
- 组件复用与 shared wrapper
- theme / styles / Tailwind
- shared packages / internal tooling
- i18n / loading / build / preview
- 文档同步与验证矩阵

## Classification

- `Mandatory drift`
  - 当前必须整改，否则说明仓库已偏离长期主标准
- `Registered exception`
  - 当前允许保留，但必须说明理由、风险和回收条件
- `Role-scoped gap`
  - 日常开发不一定触发，但维护侧缺少正式文档或流程说明
- `Reference-only`
  - 已学习、已记录，但当前不进入整改

## Summary

截至 2026-03-23，本轮审计结论是：

- 当前仓库没有仍然打开的 `Mandatory drift`
- `apps/retail-admin` 的正式 API、router、theme、layout 扩展和 shared 组件边界整体仍然对齐 `vben v5`
- `packages/*` 与 `internal/*` 当前未发现需要立即整改的长期硬性偏移
- repo-local `Playwright + tests/e2e` 护栏已经按标准落在仓库根目录，没有侵入 `apps/retail-admin/src`、`packages/*` 或 `internal/*`
- 当前没有仍然打开的 `Registered exception`
- `dashboard` 下半部分已经回到正式 payload-driven shared sections，不再依赖 runtime page-level mock builder
- repo-owned page payload fixture 已迁出 `apps/retail-admin/public/data`，统一收敛到 `apps/backend-mock/fixtures/pages`
- 正式 `/api/*` 的 frontend 先行 mock 已收敛到 `backend-mock` 模式：mock route、fixture 与 helper 统一经 `apps/backend-mock/*` 暴露，E2E mock 直接复用同一套 helper 与正式路径
- repo root 的调试截图素材已从版本管理中清理，并改由 `.gitignore` 约束
- 仓库已新增 `pnpm standards:check`，用于自动拦截 app runtime mock 回流、fixture 归位漂移、共享层品牌泄漏和调试素材误入版本管理
- 已与官方仓 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin/tree/3528517fe) 的 `main@3528517fe` 做骨架对照；`packages/*` 与 `internal/*` 源码骨架保持贴近 upstream，repo-owned additions 继续集中在 `docs/`、`tests/`、AI 入口与 `.forgejo/`
- 原先缺少维护说明的 `Role-scoped gap`，已通过 `docs/maintainers/*` 收口

## Current Board

| ID | Area | Scope | Classification | Status | Summary |
| --- | --- | --- | --- | --- | --- |
| A1 | Request / API contract | `apps/retail-admin` | `Mandatory drift` | `Resolved` | 正式页面数据和聊天链路已回到 `requestClient` + `{ code, data, message }` |
| A2 | Layout structure coupling | `apps/retail-admin` + shared layout | `Mandatory drift` | `Resolved` | layout/sidebar 的高风险结构选择器与全局 DOM 查询已收敛 |
| A3 | Page composition | `apps/retail-admin` | `Registered exception` | `Resolved` | `dashboard` 已并回统一 `page-shell` 入口，并通过 `shellKind='dashboard'` 委托 shared renderer |
| A4 | Style override density | `apps/retail-admin` | `Mandatory drift` | `Resolved` | `sidebar-overrides.css` 已移除局部 `!important`，并改为共享语义类挂点 |
| A5 | Login / access bootstrap | `apps/retail-admin` + `apps/backend-mock` | `Reference-only` | `Aligned` | 当前单店主开发态登录继续使用 repo-owned `backend-mock` auth routes，并保持 `frontend access mode` |
| A6 | Role-scoped maintenance docs | `docs/*` | `Role-scoped gap` | `Resolved` | `CLI / Changeset / 升级 / 模板清理 / UI framework / 登录演进 / 外部模块` 已有维护者文档归宿 |
| A7 | Shared / internal baseline | `packages/*` + `internal/*` | `Reference-only` | `Aligned` | 当前未发现新的长期硬性偏移，继续通过标准和升级流程观察 |
| A8 | Repo-local E2E guardrail | repo root + `apps/retail-admin` | `Reference-only` | `Aligned` | `playwright.config.ts`、`tests/e2e/*`、最小 `data-testid` 与 workflow 均符合当前标准边界 |
| A9 | Dashboard runtime mock removal | `apps/retail-admin` | `Mandatory drift` | `Resolved` | `dashboard` 下半部分已并回正式 payload-driven shared sections，runtime 不再依赖 `dashboard.mock.ts` |
| A10 | Fixture placement | repo root + `apps/backend-mock` | `Mandatory drift` | `Resolved` | page payload fixture 已迁到 `apps/backend-mock/fixtures/pages`，app runtime `public/` 与 `tests/e2e` 都不再承担正式业务样本归宿 |
| A11 | Repo-root debug assets | repo root | `Mandatory drift` | `Resolved` | `local-dashboard-*.png`、`reference-dashboard*.png` 与 `output/playwright` 产物已从版本管理中清理，并通过 `.gitignore` 和 `standards:check` 模式规则约束 |
| A12 | Upstream clone cross-check | repo root + `packages/*` + `internal/*` | `Reference-only` | `Aligned` | 已对照官方仓 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin/tree/3528517fe) `main@3528517fe`；共享层骨架保持贴近 upstream，文件级差异已沉淀到 [Upstream 定制台账](./maintainers/upstream-customization-ledger.md) |
| A13 | Backend-mock standard | `apps/backend-mock` + `apps/retail-admin` + `tests/e2e` + docs | `Reference-only` | `Aligned` | 前端先行 mock 的正式接口已统一收敛到官方式 `apps/backend-mock`、标准 envelope 与 fixture 归位规则 |

## Findings

### A1. Request / API Contract

当前位置：

- [apps/retail-admin/src/api/request.ts](../apps/retail-admin/src/api/request.ts)
- [apps/retail-admin/src/api/black-tonny.ts](../apps/retail-admin/src/api/black-tonny.ts)
- [apps/retail-admin/src/api/assistant.ts](../apps/retail-admin/src/api/assistant.ts)

当前状态：

- 业务层已不再直接 `fetch`
- `manifest`、`pages`、`dashboard summary`、`assistant chat` 都走正式 `/api/*`
- 当前前端正式接口默认走 `requestClient`

审计结论：

- `Resolved`

### A2. Layout Structure Coupling

当前位置：

- [apps/retail-admin/src/styles/sidebar-overrides.css](../apps/retail-admin/src/styles/sidebar-overrides.css)
- [apps/retail-admin/src/layouts/basic.vue](../apps/retail-admin/src/layouts/basic.vue)
- [packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue](../packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue)
- [packages/@core/ui-kit/shadcn-ui/src/components/logo/logo.vue](../packages/@core/ui-kit/shadcn-ui/src/components/logo/logo.vue)

当前状态：

- 已移除高风险 `nth-child` / `first-child` 布局结构选择器
- 已用业务 wrapper class 与共享语义类替代高风险挂点
- 业务层已不再通过 `document.querySelector()` 驱动 sidebar 交互

审计结论：

- `Resolved`

### A3. Dashboard 页面壳已并回统一入口

当前位置：

- [apps/retail-admin/src/views/dashboard/index.vue](../apps/retail-admin/src/views/dashboard/index.vue)
- [apps/retail-admin/src/views/shared/page-shell.vue](../apps/retail-admin/src/views/shared/page-shell.vue)

当前状态：

- `dashboard` 路由入口已经收成薄包装
- `page-shell` 继续作为统一 route-level 页面入口
- `dashboard` 通过 `shellKind='dashboard'` 委托 shared dashboard renderer

审计结论：

- `Resolved`

### A4. Sidebar Override 中的局部 `!important`

当前位置：

- [apps/retail-admin/src/styles/sidebar-overrides.css](../apps/retail-admin/src/styles/sidebar-overrides.css)

当前状态：

- `sidebar-overrides.css` 已不再包含 `!important`
- user dropdown 已补充共享语义类挂点
- sidebar/menu 的局部视觉覆盖已回到普通样式优先级覆盖

审计结论：

- `Resolved`

### A5. Login / Access 集中 mock 登录链路

当前位置：

- [apps/retail-admin/src/router/guard.ts](../apps/retail-admin/src/router/guard.ts)

当前状态：

- router guard 继续沿用统一 access bootstrap，但不再依赖 backend auth 契约
- 当前登录 provider 收敛在前端 `auth/user` API 层，而不是散落在 guard 或页面里
- 当前业务 `/api/*` 不依赖 frontend bearer token

审计结论：

- `Reference-only`
- 当前为已文档化的集中 mock 登录方案，不再作为登记例外存在

### A9. Dashboard runtime mock 主链移除

当前位置：

- [apps/retail-admin/src/views/shared/dashboard-shell.vue](../apps/retail-admin/src/views/shared/dashboard-shell.vue)
- [apps/retail-admin/src/views/shared/page-shell-content.vue](../apps/retail-admin/src/views/shared/page-shell-content.vue)

当前状态：

- `dashboard` 顶部 hero 与 summary 仍保留专属外观
- 下半部分区块已回到正式 payload-driven shared sections
- runtime 已不再导入 page-level `dashboard.mock.ts`

审计结论：

- `Resolved`

### A10. Repo-local page payload fixture 归位

当前位置：

- [apps/backend-mock/fixtures/pages](../apps/backend-mock/fixtures/pages)
- [tests/e2e/support/dashboard-api.ts](../tests/e2e/support/dashboard-api.ts)

当前状态：

- E2E fixture 已不再从 `apps/retail-admin/public/data` 读取
- 样本 payload 只保留在 `apps/backend-mock/fixtures/pages`
- app runtime `public/` 不再承担页面数据样本职责

审计结论：

- `Resolved`

### A11. Repo-root 调试素材清理

当前位置：

- [.gitignore](../.gitignore)
- [scripts/check-frontend-standards.mjs](../scripts/check-frontend-standards.mjs)

当前状态：

- `local-dashboard-*.png`、`reference-dashboard*.png` 与 `output/playwright/*` 调试截图已从版本管理中移除
- repo root 不再堆放未归档的视觉调试产物
- `.gitignore` 与 `pnpm standards:check` 都已明确拦住这类本地产物回流

审计结论：

- `Resolved`

### A12. Upstream clone cross-check

当前位置：

- [docs/maintainers/upstream-customization-ledger.md](./maintainers/upstream-customization-ledger.md)
- [scripts/check-upstream-customizations.mjs](../scripts/check-upstream-customizations.mjs)

当前状态：

- 已有文件级台账记录 `packages/*` 与 `internal/*` 的允许定制 diff
- 仓库提供 `pnpm upstream:check`，用于对照官方仓 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin/tree/3528517fe) `main@3528517fe`
- 当前共享层只允许 3 处稳定语义挂点定制继续存在，其余新增 diff 会被 guardrail 拦住

审计结论：

- `Aligned`

### A13. Backend-mock standard

当前位置：

- [apps/backend-mock](../apps/backend-mock)
- [tests/e2e/support/dashboard-api.ts](../tests/e2e/support/dashboard-api.ts)
- [backend-mock-standard.md](./backend-mock-standard.md)

当前状态：

- 正式业务 mock 的 route、fixture 与 helper 已收敛到官方式 `apps/backend-mock`
- E2E route interception mock 复用同一套正式 `/api/*` 路径和 helper
- frontend 先行 mock 的边界、fixture 归宿和 backend 接棒方式已有正式文档说明

审计结论：

- `Aligned`

### A12. Upstream clone 对照审计

当前位置：

- [官方仓基线: `vue-vben-admin`](https://github.com/vbenjs/vue-vben-admin/tree/3528517fe)
- [packages/](../packages/)
- [internal/](../internal/)

当前状态：

- 已对照本地官方 clone 的 `main@3528517fe`
- `packages/*` 当前文件骨架与 upstream 同层级结构保持一致
- `internal/*` 的源码骨架继续贴近 upstream；本地运行产生的 `node_modules/`、`playwright-report/`、`test-results/` 等不计入正式偏移
- 当前底座层的 repo-owned 文件级差异，已经单独沉淀到 [Upstream 定制台账](./maintainers/upstream-customization-ledger.md)
- 当前 repo-owned additions 主要集中在允许边界：
  - `docs/`
  - `tests/`
  - AI 入口与 repo-local tooling docs
  - `.forgejo/` 自托管 CI 模板

审计结论：

- `Reference-only`
- 当前没有发现新的共享层结构性漂移

### A6. Role-scoped 维护文档缺口

当前位置：

- [docs/maintainers/README.md](./maintainers/README.md)
- [docs/maintainers/cli-and-bootstrap-handbook.md](./maintainers/cli-and-bootstrap-handbook.md)
- [docs/maintainers/changeset-and-release-handbook.md](./maintainers/changeset-and-release-handbook.md)
- [docs/maintainers/project-update-handbook.md](./maintainers/project-update-handbook.md)
- [docs/maintainers/template-cleanup-handbook.md](./maintainers/template-cleanup-handbook.md)
- [docs/maintainers/ui-framework-strategy.md](./maintainers/ui-framework-strategy.md)
- [docs/maintainers/login-evolution-handbook.md](./maintainers/login-evolution-handbook.md)
- [docs/maintainers/external-modules-handbook.md](./maintainers/external-modules-handbook.md)

当前状态：

- 之前缺少正式维护者手册
- 当前已为官方 `Role-scoped` 主题建立归宿

审计结论：

- `Resolved`

### A7. Shared / Internal Baseline

当前位置：

- [packages/@core/ui-kit/\*](../packages/@core/ui-kit)
- [internal/vite-config/\*](../internal/vite-config)
- [internal/lint-configs/\*](../internal/lint-configs)

当前状态：

- 当前未发现新的共享层或基础设施层 `Mandatory drift`
- Nitro mock 仍处于基础设施层，且 `apps/retail-admin` 不再硬编码关闭 `nitroMock`
- shared / internal 的后续风险主要不是“已经跑偏”，而是未来升级时可能重新引入边界不清的问题

审计结论：

- `Reference-only`
- 后续通过升级流程和覆盖清单持续观察

### A8. Repo-local E2E Guardrail

当前位置：

- [playwright.config.ts](../playwright.config.ts)
- [tests/e2e](../tests/e2e)
- [apps/retail-admin/src/views/\_core/authentication/login.vue](../apps/retail-admin/src/views/_core/authentication/login.vue)
- [apps/retail-admin/src/views/shared/dashboard-shell.vue](../apps/retail-admin/src/views/shared/dashboard-shell.vue)
- [apps/retail-admin/src/layouts/widgets/ai-assistant-sidebar.vue](../apps/retail-admin/src/layouts/widgets/ai-assistant-sidebar.vue)
- [apps/retail-admin/src/layouts/widgets/ai-assistant-panel.vue](../apps/retail-admin/src/layouts/widgets/ai-assistant-panel.vue)
- [apps/retail-admin/src/components/date-range-trigger.vue](../apps/retail-admin/src/components/date-range-trigger.vue)
- [.github/workflows/dashboard-e2e.yml](../.github/workflows/dashboard-e2e.yml)

当前状态：

- Playwright 护栏集中放在 repo root `tests/e2e`
- API fixture 通过 route interception 提供 deterministic mock，没有入侵正式 request layer
- 页面层只补了运行主线所需的最小 `data-testid` 和测试专用 captcha bypass
- 没有新增第三方依赖；Playwright 仍复用 workspace catalog 里的既有依赖
- CI workflow 只在 `apps/*`、`packages/*`、`internal/*` 和 E2E 自身变更时触发

审计结论：

- `Reference-only`
- 当前目录结构与测试落点符合标准

## Registered Exceptions

当前没有仍然打开的登记例外。

维护要求：

- 如果未来再出现例外，必须先登记到本文件
- 如果例外状态变化，要同步更新 [前端工程标准](./frontend-engineering-standard.md) 或对应维护文档
- 不允许出现“未登记例外”

## Repo-wide Conclusion

当前 `black-tonny-frontend` 可以继续保持：

- `vben v5` 作为唯一底座
- `apps/retail-admin` 作为业务主面
- `packages/*` 和 `internal/*` 作为 shared / tooling 层

后续主线不是推翻架构，而是：

- 继续把新变化压回正式标准
- 控制新例外不要扩散
- 在未来升级或架构演进时，优先维持当前统一页面壳入口，并继续把登录模式集中控制在 auth provider 层
