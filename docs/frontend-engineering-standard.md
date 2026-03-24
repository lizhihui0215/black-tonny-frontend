# Black Tonny Frontend Engineering Standard

`black-tonny-frontend` 的业务开发必须建立在 `vue-vben-admin v5` 底座之上。

这份文档是当前仓库前端工程规则的真实规范源。无论是人工开发、代码评审，还是 AI 协作，都先遵守这里的规则，再动手实现。

仓库内面向 AI 协作的入口位于 [AGENTS.md](../AGENTS.md)、[CLAUDE.md](../CLAUDE.md)、[.claude/CLAUDE.md](../.claude/CLAUDE.md) 和 [GEMINI.md](../GEMINI.md)。它们只是执行入口，不是新的规范源。

## Purpose

我们当前的目标不是“基于 Vue 自己搭一套后台基座”，而是：

- 用 `vue-vben-admin v5` 承载 Black Tonny 的业务前端
- 复用 `vben` 已有的布局、配置、路由、权限、请求、组件和工程化能力
- 在不破坏底座的前提下，保留 Black Tonny 自己的业务视觉与页面表达

一句话概括：

- 怎么搭、怎么接、怎么验，先听 `vben`
- 页面长什么样、业务怎么表达，再结合 Black Tonny 当前产品语言

## Official Basis

这份规范直接参考以下官方文档整理而成：

- [Vben Admin 介绍](https://doc.vben.pro/guide/introduction/vben.html)
- [基础概念](https://doc.vben.pro/guide/essentials/concept.html)
- [配置](https://doc.vben.pro/guide/essentials/settings.html)
- [本地开发](https://doc.vben.pro/guide/essentials/development.html)
- [路由和菜单](https://doc.vben.pro/guide/essentials/route.html)
- [构建与部署](https://doc.vben.pro/guide/essentials/build.html)
- [服务端交互与数据 Mock](https://doc.vben.pro/guide/essentials/server.html)
- [主题](https://doc.vben.pro/guide/in-depth/theme.html)
- [权限](https://doc.vben.pro/guide/in-depth/access.html)
- [国际化](https://doc.vben.pro/guide/in-depth/locale.html)
- [全局 loading](https://doc.vben.pro/guide/in-depth/loading.html)
- [常用功能](https://doc.vben.pro/guide/in-depth/features.html)
- [规范](https://doc.vben.pro/guide/project/standard.html)
- [目录说明](https://doc.vben.pro/guide/project/dir.html)
- [Tailwind CSS](https://doc.vben.pro/guide/project/tailwindcss.html)
- [Vite Config](https://doc.vben.pro/guide/project/vite.html)
- [单元测试](https://doc.vben.pro/guide/project/test.html)
- [组件介绍](https://doc.vben.pro/components/introduction.html)

相关生态边界参考：

- [shadcn-vue Introduction](https://www.shadcn-vue.com/docs/introduction.html)
- [Nitro](https://nitro.build/)

对应的官方基线摘要见 [vben-official-baseline.md](./vben-official-baseline.md)。

如果任务属于升级、release、模板清理、CLI/bootstrap、UI framework 评估、登录演进或外部模块引入，继续看 [maintainers/README.md](./maintainers/README.md)。

## Current Conclusion

当前仓库整体没有脱离 `vben v5` 底座，主干判断仍然是对的：

- 业务主应用集中在 `apps/retail-admin`
- 全局主题与布局偏好集中在 `apps/retail-admin/src/preferences.ts`
- 路由仍走 `apps/retail-admin/src/router/routes/modules/*`
- 标准请求能力仍保留在 `apps/retail-admin/src/api/request.ts`
- 页面组合主链路仍然是 `PageSpec + page-shell + shared components`
- 当前单店主登录仍使用集中式 frontend mock owner provider，并通过 guard/access store 完成 access bootstrap；这是当前仓库的正式允许模式，不再视为例外
- 工程工具链仍建立在 `@vben/*`、`packages/effects/*`、`internal/*` 和 Tailwind v4 之上

## Mandatory Rules

### 1. Workspace Boundary

- 默认优先在 `apps/retail-admin` 完成业务前端改动。
- 只有当能力明确属于共享底座、工程工具或跨应用公共抽象时，才进入 `packages/*` 或 `internal/*`。
- 不要把 `vben` 现有能力复制一份到业务层再二次维护。
- 构建能力统一走 `@vben/vite-config`，不要在业务应用里手搓一套平行 Vite 体系。

### 2. Env And Runtime Config

环境差异、运行时接口地址和应用级动态配置，必须优先对齐 `vben` 的 app config 链路。

必须遵守：

- Vite 环境变量继续放在 `.env*` 体系
- 运行时配置优先通过 `useAppConfig()` 消费
- 接口地址、运行时开关、部署差异，不要散写在页面和业务组件里

禁止：

- 在页面、shared panel 或 layout widget 里写死环境常量
- 在共享包里偷偷依赖业务应用自己的 `.env` 约定

### 3. App Preferences

`apps/retail-admin/src/preferences.ts` 是当前仓库全局主题、布局和功能偏好的第一入口。

以下改动必须优先落在这里：

- 默认首页
- 内容宽度与布局密度
- 顶栏、侧栏、标签页等全局布局偏好
- 主题模式、主色、半深色头部/侧边栏
- `accessMode`
- widget 开关

必须遵守：

- 使用 `defineOverridesPreferences` 进行覆盖
- 只覆盖需要变更的项目级配置，不修改框架默认值源文件
- 改动配置后要意识到存在缓存影响，验收时注意清缓存或重新加载

禁止：

- 把本应属于全局偏好的东西长期写死在页面组件里
- 新造一套脱离 `@vben/preferences` 的全局配置系统

### 4. Routing, Menu, And Access

业务路由继续遵循 `vben` 路由体系：

- 页面路由放在 `apps/retail-admin/src/router/routes/modules/*`
- 菜单信息优先通过路由 `meta` 表达
- 图标、标题、排序、权限等元信息继续收敛在路由配置内
- 若切换为后端访问控制，必须从 `preferences.ts` 的 `accessMode` 进入

必须遵守：

- 不单独维护一份和路由平行、长期脱节的菜单配置
- 不绕开现有 router 模块目录，直接把大型业务路由散落到页面组件内部
- 页面可见性、菜单结构、权限控制，优先沿用 router + `meta` + access store 模型
- 当前登录与 access bootstrap 必须继续沿用现有 guard/access store 链路，且开发态 mock 登录必须通过 `apps/backend-mock` 提供的正式 `/auth/*`、`/user/info` 路径进入

禁止：

- 绕开 `vben` 的 route meta 和 access 模型，自己发明长期权限框架
- 前端路由和后端菜单接口各说各话、不做结构对齐
- 在 guard、页面组件或 layout widget 里散写 sample token、sample user 或页面级私有登录态

### 5. Request Layer And API Contracts

标准后端接口默认走 `apps/retail-admin/src/api/request.ts` 暴露出来的请求客户端能力。

当前仓库有两个数据层级：

- 正式运行时数据路径：走 `/api/*`，统一使用 `requestClient`
- repo-local sample / fixture 路径：正式业务样本只允许放在 `apps/backend-mock/fixtures/*` 或 `docs/*` 的样本区，不应再由前端页面直接读取
- 如果 backend 还没落地而 frontend 需要先推进，必须先按 [Backend Mock 标准](./backend-mock-standard.md) 在 `apps/backend-mock` 落 mock route 和 fixture，再推进页面消费

必须遵守：

- 新增正式后端接口时，优先复用 `requestClient`
- 接口鉴权、错误处理、多语言头、刷新 token 等公共行为继续走 `@vben/request` 链路
- 页面运行时不要再直接 `fetch public/data/*`
- 页面运行时不要再依赖 page-level 业务 `*.mock.ts` builder 组装正式内容
- 正式 `/api/*` 默认遵循 `vben` 可直接消费的 `{ code, data, message }`
- 当前开发态登录 mock 只服务于本地 owner 体验，并且必须由 `apps/backend-mock` 提供，不得再回到 guard、页面或 frontend-local auth provider
- 接口契约变化要同步更新前后端边界文档
- 前端先行 mock 的正式业务接口，必须把 mock route、fixture 与 helper 收敛到 `apps/backend-mock/*`

禁止：

- 为了省事跳过现有请求层，在业务代码里到处各写一套 `fetch`
- 把应由后端定义的指标语义、口径换算和权限判断搬到前端自己算
- 为单个接口加“临时裸响应特例”后长期不回收
- 让 `tests/e2e` 里的 mock path、request 字段或 response shape 脱离正式 runtime 请求实现各写一版
- 在 `apps/retail-admin/src/api/contracts/*` 或 `apps/retail-admin/src/api/core/mock-auth.ts` 再维护一套 mock 契约层

### 6. Page Architecture And Composition

页面结构默认沿用现有 `PageSpec + page-shell + shared components` 模型。

必须遵守：

- 新页面优先复用 `page-shell.vue` 和现有共享 panel
- 页面级分析、摘要、执行建议等区块优先抽成 shared 组件
- 页面顶层继续保持 `page-shell` 作为统一入口；如需特殊外观，应通过 `shellKind` 委托 shared renderer，而不是重起独立 route-level 页面壳

禁止：

- 因为一个页面特殊，就整页跳出当前页面组合模型
- 把全局布局职责、页面职责和卡片职责混在同一个大组件里

### 7. Layout And Global Widgets

全局行为继续通过 `vben` 的布局与启动链路进入：

- 全局启动入口：`apps/retail-admin/src/bootstrap.ts`
- 主布局入口：`apps/retail-admin/src/layouts/basic.vue`
- 布局扩展优先通过 `BasicLayout` 的 slot 与 shared widget 接入

必须遵守：

- 布局级能力优先接入 layout slot、preferences 或 shared layout widget
- 右侧 AI 助手一类能力属于布局级能力，不在每个业务页各复制一套
- 布局覆盖样式优先通过业务 wrapper class 或共享语义类命中稳定挂点

禁止：

- 在页面里复制一套 layout 级能力
- 使用 `nth-child`、`first-child`、泛化 `aside/header` 这类宽泛结构选择器覆盖布局

### 8. Component Reuse And Wrapping

组件选择顺序必须保持清晰：

1. 先看官方 `vben` 组件和当前仓库已有 shared 组件能否满足
2. 不够时，再决定是直接使用原生组件，还是补一层业务/共享封装

优先复用的方向：

- 页面容器优先沿用 `Page`、`page-shell` 或现有页面壳
- 表单优先沿用现有 adapter、schema、`useVbenForm` 一类模式
- 弹窗和抽屉优先沿用 `useVbenModal`、`useVbenDrawer` 或现有 shared widget
- 远程选项类组件优先评估 `ApiComponent` 或已有 adapter 是否足够
- 组件底层优先沿用 `@vben-core/shadcn-ui` 和 `packages/@core/ui-kit/*`

必须遵守：

- 先确认现有封装不合适，再新增组件层
- 一旦某个自定义组件开始跨页面复用，就要评估是否进入 shared 层
- 复杂弹窗、抽屉、表单主体优先抽成独立组件，不要把页面模板越堆越大

禁止：

- 因为不知道有现成组件，就每页各写一版
- 同一个能力在页面里长出多套并行封装风格
- 在业务层慢慢积出第三套表单、弹窗或远程选择器体系
- 直接把外部 `shadcn-vue` 组件散装复制进 `apps/retail-admin`，绕开 shared component layer

### 9. Theme, Styles, And Tailwind

样式体系必须继续建立在 `vben` 主题链路和 Tailwind v4 之上。

必须遵守：

- 优先复用 `@vben/styles`、`@vben/styles/ele`、Tailwind 语义类和 Element Plus token
- 全局主题变化优先走 `preferences.ts`、主题变量和已有 token 链路
- 局部业务语义色可以存在，但不能偷偷承担全局主题职责
- Tailwind 相关变化优先检查共享 Vite 配置和 CSS 主题链路，不把旧式 `tailwind.config.*` 重新拉回主链

特别注意：

- 如果一个颜色、阴影、圆角、浮层背景开始跨多个页面重复出现，就应该评估是否收敛到主题链路
- 布局覆盖样式要尽量精确命中结构边界，不要使用过宽选择器误伤嵌套组件

禁止：

- 把全局视觉长期写死在某一个页面或组件里
- 在仓库里再引入一套平行主题变量系统
- 重新把旧式 `tailwind.config.*` 当作当前主配置入口

### 10. Shared Packages And Internal Tooling

当改动进入 `packages/*` 或 `internal/*` 时，默认意味着你在修改底座或基础设施。

必须遵守：

- `packages/*` 只承载跨应用共享能力
- `internal/*` 只承载工程工具、构建链、lint、Tailwind、Vite 等基础设施
- 共享组件或工具新增类名、slot、hook 时，要优先暴露稳定语义入口
- 新第三方依赖默认仍要克制，但如果它明确属于底座、工程链、`apps/backend-mock` 或与 upstream `vben` 做法保持一致，可以引入
- 引入底座级依赖时，要同时满足：用途清晰、优先服务基础设施或官方对齐、不是业务页私有依赖，并在文档或变更说明里写清理由
- 前端仓库内的 Nitro 能力只作为 mock/dev 基础设施使用
- 正式业务 API 继续以 sibling repo `black-tonny-backend` 为准
- 如果为了联调保留 mock route、mock server 或 mock data，必须明确它们是测试或文档样本能力，不得替代正式接口契约，也不得继续挂在 app runtime `public/` 目录里
- 当前前后端共同推进时，正式业务 mock 的默认工作流以 [Backend Mock 标准](./backend-mock-standard.md) 为准

禁止：

- 把单一业务页私有逻辑塞进共享包
- 在 app 里复制共享能力，而不是回到底座层修正入口
- 在业务页面或业务私有组件里为了一次性需求随手新增第三方依赖

### 11. Documentation And Contract Sync

文档不是补充说明，而是标准的一部分。

必须遵守：

- 改接口契约时，同步更新相关 backend contract doc 和边界文档
- 改主链路时，同步更新顶层入口文档与标准文档
- 标准变更优先改仓库文档，不把规则只写在 skill 或聊天上下文里

至少需要检查的文档：

- [README.md](../README.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [docs/README.md](./README.md)
- area-specific docs

### 12. Local Dev, Build, I18n, And Startup Behavior

这些能力虽然不是每次页面开发都会改，但仍属于正式基线。

必须遵守：

- 开发、构建、预览优先走仓库既有脚本与 `@vben/vite-config` 链路
- 本地 Node 运行时以仓库根目录的 [`.node-version`](../.node-version) 为准；如果提供 [`.nvmrc`](../.nvmrc)，两者必须保持一致
- 公共静态资源放在应用约定位置，不要在源码目录里散落临时静态文件
- 语言、默认 locale、启动 loading 这类应用级行为，优先沿用 `vben` 官方入口和现有仓库链路
- 如果请求层、启动页、默认语言或全局 loading 行为变化，同步检查它是否影响用户首屏和联调体验
- repo-local E2E 护栏统一放在仓库根目录 `tests/e2e`
- E2E 里的 `/api/*` route interception 只用于前端仓库自测与 CI 护栏，不得反向演化成正式 runtime 契约

禁止：

- 绕开现有启动脚本，临时发明一套长期开发流程
- 在没有更新仓库版本入口和文档的情况下，各自使用漂移的 Node 版本
- 在页面里各自维护一套语言切换或启动 loading 逻辑
- 把 app 私有 E2E fixture 散落到 `apps/retail-admin/src`、shared package、`internal/*` 或正式业务 `apps/backend-mock/fixtures/*` 之外的位置

### 13. Verification Matrix

根据改动类型至少完成下面这些验证：

统一入口：

- `pnpm check:mainline`
  - 当前默认本地防漂移入口
  - 包含 `pnpm standards:check`、`pnpm docs:check`、`pnpm --filter @black-tonny/retail-admin typecheck`
- `pnpm check:runtime`
  - 当前运行主线入口
  - 在 `check:mainline` 之上再执行 `pnpm --filter @black-tonny/retail-admin build` 和 `pnpm test:e2e:dashboard`
- `pnpm upstream:check`
  - 当前底座层对照官方 clone 的显式护栏
  - 默认比对本地 `../../vue-vben-admin` 与 `packages/*`、`internal/*`

固定规则：

- 所有有意义的前端代码改动，至少通过一次 `pnpm check:mainline`
- 触及 runtime 主链时，升级为 `pnpm check:runtime`
- 触及 `packages/*` 或 `internal/*` 且本地已有官方 clone 时，额外跑一次 `pnpm upstream:check`
- 本地 `pre-push` 默认跑 `pnpm check:mainline`，避免标准只靠人工记忆
- 如果仓库接入自托管 CI，平台工作流也优先复用 `check:mainline` / `check:runtime`，而不是再发明第二套检查命令

| 改动类型 | 最低验证要求 |
| --- | --- |
| 文档改动 | 检查链接、命名语义、入口索引是否同步 |
| 一般前端代码改动 | `pnpm check:mainline` |
| 构建链、路由装载、应用组成改动 | `pnpm check:runtime` |
| 样式或交互改动 | `typecheck` + 页面实际验收 |
| dashboard / mock login / AI sidebar 运行主线改动 | `pnpm check:runtime` |
| 标准边界、目录归位、mock 收口改动 | `pnpm check:mainline` + 相关 runtime 验证 |
| 共享包或底座改动 | `pnpm check:mainline` + `pnpm upstream:check`，并确认受影响 app 的类型或构建链未被破坏 |
| 接口契约改动 | 前后端契约文档同步 + 对应运行验证 |

## Change-Type Decision Matrix

| 需求类型 | 默认落点 | 先复用什么 | 常见共改文件 |
| --- | --- | --- | --- |
| 全局主题/布局偏好 | `apps/retail-admin/src/preferences.ts` | `@vben/preferences` | `preferences.ts`、`basic.vue`、相关 docs |
| 菜单/页面路由/权限 | `apps/retail-admin/src/router/routes/modules/*` | router meta、access 模型 | routes、access docs、页面 docs |
| 正式接口接入 | `apps/retail-admin/src/api/*` | `requestClient` | `request.ts`、API file、边界 docs |
| 页面业务展示 | `apps/retail-admin/src/views/*` | `page-shell`、shared panels | page spec、shared components、业务 docs |
| 布局级能力 | `apps/retail-admin/src/layouts/*` | `BasicLayout` slot、shared widget | `basic.vue`、layout widgets、styles |
| 可复用业务组件 | `apps/retail-admin/src/components/*` 或 `views/shared/*` | 现有 shared 组件 | 组件、页面、业务 docs |
| 本地 mock / demo 联调 | mock file、shared adapter 或 Nitro mock 基础设施 | 现有 mock 能力、shared Vite plugin | mock 文件、相关说明、回收计划 |
| repo-local E2E 护栏 | `tests/e2e/*` | Playwright + route interception + 仓库样本 fixture | `playwright.config.ts`、`tests/e2e/*`、相关验证文档 |
| 启动页 / i18n / 应用级体验 | `bootstrap.ts`、locale 链路、app config | 现有 app config、locale、loading 入口 | bootstrap、相关配置、验收说明 |
| 跨应用共享能力 | `packages/*` | 现有 shared package | 共享包、受影响 app 验证 |
| 工程链/构建链 | `internal/*` 或 shared config | `@vben/vite-config`、现有 lint/tooling | Vite/lint config、相关 docs |

## Repo Mapping

| 官方主题 | 当前仓库落点 | 我们的执行规则 |
| --- | --- | --- |
| 配置 | `apps/retail-admin/src/preferences.ts` | 全局布局、主题、widget 偏好从这里进 |
| 路由和菜单 | `apps/retail-admin/src/router/routes/modules/*` | 菜单信息优先跟随路由 `meta` |
| 请求层 | `apps/retail-admin/src/api/request.ts` | 正式接口默认走这里 |
| 业务 API 入口 | `apps/retail-admin/src/api/black-tonny.ts`、`assistant.ts` 等 | 页面数据与聊天等正式能力统一经由 `/api/*` |
| 全局启动 | `apps/retail-admin/src/bootstrap.ts` | 全局插件、adapter、router、store 从这里进 |
| 页面组合 | `apps/retail-admin/src/views/shared/page-shell.vue` | 新页面优先沿用 `PageSpec + page-shell` |
| 布局扩展 | `apps/retail-admin/src/layouts/basic.vue` | 布局级能力走 layout slot，不页内散接 |
| 组件底层 | `packages/@core/ui-kit/shadcn-ui`、`packages/@core/ui-kit/*` | 组件底层与 shared wrapper 优先在这里演进 |
| 本地 mock 基础设施 | `internal/vite-config`、局部 `*.mock.ts` | 仅用于联调、demo、过渡 mock，不替代正式 backend |
| 全局样式覆盖 | `apps/retail-admin/src/styles/*.css` | 必须命中稳定挂点，避免误伤布局骨架 |
| 共享底座 | `packages/*`、`internal/*` | 只处理跨应用复用或基础设施 |

## No-Go List

以下行为在当前仓库默认视为走偏：

- 把样本文件直读方式重新带回页面运行时链路
- 绕开 `preferences.ts` 做全局主题和布局偏移
- 路由、菜单、权限各维护一套互相脱节的配置
- 在页面层重新定义后端拥有的业务口径和指标语义
- 为单页需求新造一套页面壳，而不是接入现有 `page-shell` 和 shared panel
- 用过宽的全局 CSS 选择器覆盖布局，导致嵌套组件意外受影响
- 不查现有 `vben`/shared 组件，直接每页各写一版弹窗、表单、远程选择器
- 把外部 `shadcn-vue` 组件直接散装引进业务页，绕过 `@vben-core/shadcn-ui` 和 shared ui kit
- 把单页私有逻辑塞进共享包，或者在 app 里复制底座能力
- 把前端仓库里的 mock/Nitro 能力误当成正式业务后端
- 只改代码不改标准文档、边界文档和契约文档

## Review Checklist

开始改之前：

- 我是否先确认了这次需求属于 `apps/retail-admin`，还是已经触及共享底座？
- 我是否检查过 `preferences.ts`、router、request layer、layout slot 和现有 shared 组件？
- 我是否确认这次改动是在复用 `vben` 已有能力，而不是重新发明？
- 如果我要改的是正式接口，我是否优先考虑了 `requestClient` 和 `{ code, data, message }`？

提交前：

- 本次改动是否仍然建立在 `vue-vben-admin v5` 底座上？
- 是否没有绕开 `preferences.ts`、router、request layer、theme token 这四条主骨架？
- 是否没有把过渡方案写成长期默认方案？
- 是否没有通过宽泛 CSS 选择器误伤布局内其他组件？
- 是否没有在组件层长出新的并行体系？
- 是否跑过对应的最低验证？
- 是否同步更新了相关标准文档、边界文档和契约文档？
