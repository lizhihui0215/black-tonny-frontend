# Official Doc Coverage Board

这份文档用于记录：

- 官方 `vue-vben-admin v5` 文档我们已经系统学习到哪里
- 每个官方章节在 `black-tonny-frontend` 中属于哪一类长期标准
- 哪些内容必须进入本仓硬性规则，哪些只作为参考、维护者指南或未来观察项

它不是替代 [frontend-engineering-standard.md](./frontend-engineering-standard.md) 的新规则源，而是“官方知识覆盖清单”。

## Status Types

- `Mandatory`
  - 必须进入本仓长期标准，默认影响日常开发与评审
- `Role-scoped`
  - 只对某类维护动作重要，例如初始化、迁移、发布、底座维护
- `Reference`
  - 需要学习并理解，但不应该直接写成所有开发都要触发的硬规则
- `Future-watch`
  - 当前仓库尚未大规模使用，但随着项目演进可能升高优先级

## Coverage Summary

本轮已完成：

- `Guide` 全部一级章节盘点
- `Components` 全部当前公开组件章节盘点
- 相关生态 `shadcn-vue`、Nitro 的边界盘点

结论：

- 当前官方文档树已经完成“全量目录级覆盖”
- 与本仓长期标准直接相关的内容，已同步收敛到 [frontend-engineering-standard.md](./frontend-engineering-standard.md)
- `Role-scoped` 主题已收敛到 [maintainers/README.md](./maintainers/README.md) 及其子文档
- 其余内容已在本表内按角色与优先级分类，不再依赖记忆判断

## Guide Coverage

| Official Page | URL | Coverage Status | Local Decision |
| --- | --- | --- | --- |
| 关于 Vben Admin | https://doc.vben.pro/guide/introduction/vben.html | `Reference` | 用于理解框架定位、能力范围和技术栈，不直接形成硬编码规则 |
| 为什么选择我们? | https://doc.vben.pro/guide/introduction/why.html | `Reference` | 用于理解官方设计目标、质量哲学和工程取向 |
| 快速开始 | https://doc.vben.pro/guide/introduction/quick-start.html | `Role-scoped` | 对新成员上手、重建 demo、验证官方初始化流程有价值，但不是日常业务开发硬规则 |
| 精简版本 | https://doc.vben.pro/guide/introduction/thin.html | `Future-watch` | 适合未来评估更轻量基座时参考，当前仓库不直接采用 |
| 基础概念 | https://doc.vben.pro/guide/essentials/concept.html | `Mandatory` | 已进入本仓关于 Monorepo、apps/packages/internal 边界的长期标准 |
| 本地开发 | https://doc.vben.pro/guide/essentials/development.html | `Mandatory` | 已进入本仓关于 dev/build/preview 与静态资源位置的长期标准 |
| 路由和菜单 | https://doc.vben.pro/guide/essentials/route.html | `Mandatory` | 已进入本仓 router/meta/menu/access 基线 |
| 配置 | https://doc.vben.pro/guide/essentials/settings.html | `Mandatory` | 已进入 `preferences.ts`、`useAppConfig()` 和环境配置链路标准 |
| 图标 | https://doc.vben.pro/guide/essentials/icons.html | `Reference` | 需要遵守现有图标链路，但不单独作为一套高优先级硬规则维护 |
| 样式 | https://doc.vben.pro/guide/essentials/styles.html | `Mandatory` | 已进入主题链路、样式挂点、全局覆盖边界标准 |
| 外部模块 | https://doc.vben.pro/guide/essentials/external-module.html | `Future-watch` | 随项目接入更多外部模块时再提升优先级，目前作为边界参考 |
| 构建与部署 | https://doc.vben.pro/guide/essentials/build.html | `Mandatory` | 已进入本仓构建验证与应用级运行方式标准 |
| 服务端交互与数据 Mock | https://doc.vben.pro/guide/essentials/server.html | `Mandatory` | 已进入 `requestClient`、正式 `/api/*`、mock 边界和契约标准 |
| 登录 | https://doc.vben.pro/guide/in-depth/login.html | `Mandatory` | 当前仓库已启用单店主正式登录闭环，这部分已进入 guard、auth store 和 request 链路标准 |
| 主题 | https://doc.vben.pro/guide/in-depth/theme.html | `Mandatory` | 已进入 token、`preferences`、全局主题链路标准 |
| 权限 | https://doc.vben.pro/guide/in-depth/access.html | `Mandatory` | 已进入 access mode、route meta、后端菜单结构标准 |
| 国际化 | https://doc.vben.pro/guide/in-depth/locale.html | `Mandatory` | 已进入 locale、请求语言头、应用级语言切换标准 |
| 常用功能 | https://doc.vben.pro/guide/in-depth/features.html | `Reference` | 用于理解可复用能力范围，按具体需求再映射进本仓规则 |
| 检查更新 | https://doc.vben.pro/guide/in-depth/check-updates.html | `Role-scoped` | 对框架升级和版本维护重要，不是普通页面开发的日常规则 |
| 全局loading | https://doc.vben.pro/guide/in-depth/loading.html | `Mandatory` | 已进入启动页、首屏 loading 和注入式 loading 边界标准 |
| 组件库切换 | https://doc.vben.pro/guide/in-depth/ui-framework.html | `Future-watch` | 当前项目固定 Element Plus，不作为日常规则，但属于长期架构观察项 |
| 规范 | https://doc.vben.pro/guide/project/standard.html | `Mandatory` | 已进入 lint、format、commit、hook 等工程标准 |
| CLI | https://doc.vben.pro/guide/project/cli.html | `Role-scoped` | 主要用于初始化、脚手架和维护操作，不是日常业务代码规范 |
| 目录说明 | https://doc.vben.pro/guide/project/dir.html | `Mandatory` | 已进入本仓目录边界和责任分层标准 |
| 单元测试 | https://doc.vben.pro/guide/project/test.html | `Mandatory` | 已进入验证矩阵标准 |
| Tailwind CSS | https://doc.vben.pro/guide/project/tailwindcss.html | `Mandatory` | 已进入 Tailwind v4 与共享配置链路标准 |
| Changeset | https://doc.vben.pro/guide/project/changeset.html | `Role-scoped` | 对共享包发布与版本维护重要，不是业务页面开发默认规则 |
| Vite Config | https://doc.vben.pro/guide/project/vite.html | `Mandatory` | 已进入 `@vben/vite-config` 与 shared build chain 标准 |
| 项目更新 | https://doc.vben.pro/guide/other/project-update.html | `Role-scoped` | 对底座升级维护重要，属于维护者职责 |
| 移除代码 | https://doc.vben.pro/guide/other/remove-code.html | `Role-scoped` | 对模板清理、项目瘦身有帮助，属于维护阶段参考 |
| 常见问题 | https://doc.vben.pro/guide/other/faq.html | `Reference` | 作为排障知识库，不单独沉淀成长期强制标准 |

## Components Coverage

| Official Page | URL | Coverage Status | Local Decision |
| --- | --- | --- | --- |
| 组件介绍 | https://doc.vben.pro/components/introduction.html | `Mandatory` | 已进入“先复用后封装”的组件策略标准 |
| Page 页面 | https://doc.vben.pro/components/layout-ui/page.html | `Mandatory` | 已映射到 `PageSpec + page-shell + page container` 体系 |
| ApiComponent | https://doc.vben.pro/components/common-ui/vben-api-component.html | `Mandatory` | 已进入远程选项类和 adapter 复用优先规则 |
| Alert | https://doc.vben.pro/components/common-ui/vben-alert.html | `Reference` | 理解现有轻提示能力边界，按需使用 |
| Modal | https://doc.vben.pro/components/common-ui/vben-modal.html | `Mandatory` | 已进入 `useVbenModal` / shared modal 复用规则 |
| Drawer | https://doc.vben.pro/components/common-ui/vben-drawer.html | `Mandatory` | 已进入 `useVbenDrawer` / shared drawer 复用规则 |
| Form | https://doc.vben.pro/components/common-ui/vben-form.html | `Mandatory` | 已进入 schema / adapter / `useVbenForm` 长期标准 |
| Vxe Table | https://doc.vben.pro/components/common-ui/vben-vxe-table.html | `Future-watch` | 当前业务若表格复杂度继续提升，这部分会升为高优先级标准 |
| CountToAnimator | https://doc.vben.pro/components/common-ui/vben-count-to-animator.html | `Reference` | 作为效果组件参考，不纳入高优先级架构规则 |
| EllipsisText | https://doc.vben.pro/components/common-ui/vben-ellipsis-text.html | `Reference` | 作为细节 UI 能力参考，不单独形成高优先级规则 |

## Related Ecosystem Coverage

| Source | URL | Coverage Status | Local Decision |
| --- | --- | --- | --- |
| shadcn-vue | https://www.shadcn-vue.com/ | `Mandatory` | 作为组件底层方法论边界已纳入：不在业务页散装复制，优先沿用 `@vben-core/shadcn-ui` 与 shared ui kit |
| Nitro | https://nitro.build/ | `Mandatory` | 作为 mock/dev 基础设施边界已纳入：可用于联调与 mock，不替代正式 backend |

## Role-Scoped Doc Mapping

下面这些官方主题已经有维护者文档归宿：

| Official Theme | Local Maintainer Doc |
| --- | --- |
| 快速开始 / CLI | [CLI 与 Bootstrap 手册](./maintainers/cli-and-bootstrap-handbook.md) |
| Changeset | [Changeset 与 Release 手册](./maintainers/changeset-and-release-handbook.md) |
| 检查更新 / 项目更新 | [项目更新手册](./maintainers/project-update-handbook.md) |
| 移除代码 | [模板清理手册](./maintainers/template-cleanup-handbook.md) |
| 组件库切换 | [UI Framework 策略](./maintainers/ui-framework-strategy.md) |
| 登录 | [登录演进手册](./maintainers/login-evolution-handbook.md) |
| 外部模块 | [外部模块手册](./maintainers/external-modules-handbook.md) |

## What Is Already Promoted Into Local Standards

下面这些主题已经被提升为本仓长期标准正文的一部分：

- Monorepo 边界
- 环境与运行时配置
- `preferences.ts` 与 app-level 行为
- router / menu / access
- request layer 与正式 API 契约
- 页面组合与布局扩展
- 组件复用与 shared wrapper
- 主题、样式与 Tailwind v4
- `@vben-core/shadcn-ui` 组件底层边界
- Nitro mock/dev 基础设施边界
- 文档同步
- dev/build/i18n/loading
- 验证矩阵

对应正文见 [frontend-engineering-standard.md](./frontend-engineering-standard.md)。

## Watchlist

下面这些主题已经学习过，但当前仍以观察、维护者知识或未来扩展项为主：

- 精简版本
- 外部模块
- 登录闭环
- 组件库切换
- CLI
- Changeset
- 项目更新
- 移除代码
- Vxe Table 深度能力

如果未来项目演进触及这些区域，应优先把它们从本表提升到 [frontend-engineering-standard.md](./frontend-engineering-standard.md) 的强制规则正文。

## Maintenance Rule

每次发生以下情况之一，都应回看这张覆盖表：

- 官方文档导航新增一级页面
- 本仓新增新的能力层，如复杂表格、完整登录流、多 UI 库适配、包发布流程
- 团队开始频繁讨论“这件事官方到底怎么建议做”

如果发现某个官方主题已经从“偶尔参考”变成“反复触发的主线问题”，就把它从本表提升进 [frontend-engineering-standard.md](./frontend-engineering-standard.md)。
