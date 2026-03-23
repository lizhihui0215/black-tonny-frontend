# Vben Official Baseline Summary

这份文档不是本仓库的规则源，而是对官方 `vue-vben-admin v5` 文档的内部摘要。

用途只有两个：

- 帮助团队快速理解官方基线到底要求什么
- 在制定或复查本仓库前端标准时，避免凭记忆误判官方能力边界

真正的本地规则仍以 [frontend-engineering-standard.md](./frontend-engineering-standard.md) 为准。

如果某个官方主题属于维护动作而不是日常开发规则，继续看 [maintainers/README.md](./maintainers/README.md)。

## Official Sources

本摘要基于以下官方文档整理：

- [Vben Admin 介绍](https://doc.vben.pro/guide/introduction/vben.html)
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

相关生态参考：

- [shadcn-vue Introduction](https://www.shadcn-vue.com/docs/introduction.html)
- [Nitro](https://nitro.build/)

## Baseline Summary

### 1. The framework is the platform, not just a component set

官方对 `Vben Admin 5.x` 的定位不是“给几个组件”，而是完整的中后台解决方案。它同时提供布局、动态菜单、权限、多主题、请求层、工程规范和 Monorepo 工具链。

对我们意味着：

- 不要把它当成纯 UI 模板使用
- 只要问题已经落在 `vben` 提供的能力边界内，优先复用底座而不是自己另搭一套

### 2. Monorepo boundary is part of the architecture

官方目录说明把仓库拆成 `apps`、`packages`、`internal` 和 `docs` 四层：

- `apps` 放应用
- `packages` 放可复用包
- `internal` 放共享工程工具
- `docs` 放文档

对我们意味着：

- `apps/retail-admin` 是业务前端主战场
- `packages/*` 只处理跨应用共享能力
- `internal/*` 只处理工程工具、lint、Vite、Tailwind 这类基础设施

### 3. Environment and runtime config must follow the app config chain

官方配置文档强调：

- 环境变量遵循 Vite 规则
- `VITE_GLOB_*` 会进入打包后的 `_app.config.js`
- 运行时接口地址等动态配置应通过 `useAppConfig()` 获取

对我们意味着：

- 接口 base URL、环境差异、运行时切换配置，优先走 `.env*` + `useAppConfig`
- 不要在页面或业务 API 文件里散写环境常量
- 不要把运行时配置能力耦合进共享包内部

### 4. Preferences are the official entry for app-level behavior

官方明确：

- 应用目录下的 `preferences.ts` 是项目偏好设置覆盖入口
- 使用 `defineOverridesPreferences`
- 只覆盖需要变更的部分
- 改动后要注意缓存影响

对我们意味着：

- 全局布局、主题、默认首页、access mode、widget 开关等，都应优先从 `preferences.ts` 进入
- 不要在页面里慢慢长出一套平行“全局配置”

### 5. Routing, menu, and access all hang off the router model

官方路由文档说明：

- 静态路由位于 `src/router/routes/index`
- 动态路由位于 `src/router/routes/modules`
- 权限通过路由 `meta.authority` 等字段表达

官方权限文档说明：

- 后端访问控制需要 `preferences.ts` 中设置 `accessMode='backend'`
- 后端菜单数据必须遵循前端可识别的数据结构

对我们意味着：

- 菜单、权限、路由不要各维护一套平行配置
- 只要是页面可见性、菜单结构、禁用访问这类问题，先回到 router + meta + access mode 体系思考

### 6. Formal API calls should go through the request layer

官方服务端交互文档说明：

- 应用内 `src/api/request.ts` 是请求配置入口
- `requestClient` 是标准请求客户端
- 多接口地址场景通过创建多个 request client 处理

对我们意味着：

- 正式 `/api/*` 默认通过 `requestClient`
- 认证、报错、token 刷新、语言头这类行为，应继续留在请求层
- 页面不应自己各写一套 API 访问习惯

### 7. Theme is token-based, not page-local hardcoding

官方主题文档强调：

- 主题基于 CSS variables 与 Tailwind utility class
- 颜色 token 使用 `hsl` 原始值表达
- `background`、`foreground`、`sidebar`、`header` 等变量都有明确职责

对我们意味着：

- 跨页面复用的颜色、阴影、圆角、背景，不应长期停留在单页样式里
- 全局主题走 token 和 preferences，业务视觉在此基础上做表达

### 8. Tailwind v4 is configured through CSS and shared Vite config

官方 Tailwind 文档明确：

- 当前项目不再把 `tailwind.config.*` 当主配置入口
- 主题与扫描范围统一放在 CSS 与共享 Vite 配置中
- Vue SFC 的 `@apply` 已有统一处理

对我们意味着：

- 不要给业务应用或共享包重新补一套旧式 `tailwind.config.*`
- Tailwind 相关变化优先检查 `@vben/vite-config` 和共享主题链路

### 9. Vite config is shared infrastructure

官方 Vite Config 文档说明：

- 应用和包都通过 `@vben/vite-config` 的 `defineConfig()` 进入
- 业务只在返回对象里覆盖应用或库自己的配置

对我们意味着：

- 不要在业务应用里另起一套独立 Vite 体系
- 涉及构建链的定制，要先判断是 app 级覆盖，还是 `internal/vite-config` 级共享能力

### 10. Engineering quality is part of the baseline, not optional polish

官方规范和测试文档强调：

- 项目默认工具链包括 `Oxfmt`、`Oxlint`、`ESLint`、`Stylelint`、`Commitlint`、`Publint`、`CSpell`、`lefthook`
- 单元测试默认使用 `Vitest`
- 测试文件使用 `.test.ts` 或 `__tests__`

对我们意味着：

- 类型检查、lint、测试不是“最后再补”，而是标准的一部分
- 只要改动触发了相应层级，就应该跑对应验证

### 10.5. Local development and build are standardized workflows

官方本地开发与构建文档说明：

- 开发通常从仓库根目录执行 `pnpm dev`
- 构建和预览分别走 `pnpm build`、`pnpm preview`
- 公共静态资源走应用自身的 `public/static`
- DevTools、构建模式和环境区分都有明确入口

对我们意味着：

- 不要绕开现有开发脚本自造一套启动方式
- 公共静态资源应该放在应用规定位置，而不是散落在源码目录临时引用
- 只要改动涉及构建链或产物行为，就要把 `build/preview` 当成正式验证的一部分

### 10.6. I18n and global loading are also part of the app baseline

官方国际化和全局 loading 文档说明：

- 默认语言和语言切换入口通过偏好设置与 locale 体系控制
- `request` 默认会带 `Accept-Language`
- 全局 loading 通过注入式 `loading.html` 和 `VITE_INJECT_APP_LOADING` 控制

对我们意味着：

- 文案、语言切换、默认语言这类应用级行为不应散落在业务页面里各自处理
- 如果要调整启动 loading 或语言体验，应沿着官方入口改，而不是各页再造一层

### 11. Framework components are preferred defaults, not mandatory shackles

官方组件文档说明：

- `Page` 是常规业务页面的基础布局容器
- `ApiComponent` 用来给目标组件增加远程数据加载能力，同时保持目标组件原始用法
- `Modal`、`Drawer`、`Form` 都有配套的 `useVben*` API
- 如果现有封装不理想，允许直接使用原生组件，或者自行封装更合适的组件

对我们意味着：

- 先查官方组件和现有 shared 组件，再决定是否自己封装
- 自定义组件不是被禁止，而是要建立在“先确认现有封装不适合”的前提下
- 复杂弹窗和抽屉内容应优先抽离成独立组件，而不是在页面里堆一个超大模板
- 远程选项类组件如果开始重复出现，应优先考虑适配到 `ApiComponent` 或现有 adapter，而不是每个页面各写一次请求逻辑
- 表单如果已经进入 schema / adapter 模式，就继续沿着 `useVbenForm`、schema、dependencies、slot 去做，而不是额外并行出第三套表单框架

### 12. The component substrate is open-code and shared, not page-local copy/paste

`shadcn-vue` 官方强调：

- 它不是传统“安装即用”的组件库
- 它更像一套开放代码的组件基础
- 组件代码允许被修改、扩展，并逐步演化成自己的设计系统

对我们意味着：

- 当前仓库真正的组件底层不是“页面里随便拼 UI”，而是 `@vben-core/shadcn-ui` 与上层 `packages/@core/ui-kit/*`
- 需要新组件时，先判断是业务页一次性需求，还是应该沉淀到 shared 组件层
- 不要把外部 `shadcn-vue` 组件直接散装复制进 `apps/retail-admin`，导致 shared layer 和业务层各有一套 UI 基础

### 13. Nitro is server infrastructure, but not our production backend default

Nitro 官方定位是：

- 给 Vite 应用补上可部署的 server layer
- 提供文件路由、插件、缓存、存储和多运行时部署能力
- 可以作为本地开发和 mock server 的基础设施

对我们意味着：

- 在 `black-tonny-frontend` 里，Nitro 更适合作为 mock/dev server 能力，而不是正式业务后端
- 正式业务 API 仍以 sibling repo `black-tonny-backend` 为准
- 如果前端仓库为了本地联调保留 mock route 或 mock server，它们必须和正式 `/api/*` 契约边界清晰分开

## What This Means For Black Tonny

对 `black-tonny-frontend` 来说，官方基线可以收敛成下面这几条：

1. `vben` 是底座，不是参考图。
2. `apps/retail-admin` 是主业务面，`packages/*` 与 `internal/*` 是共享层。
3. `preferences.ts`、router、request layer、theme token 是四条主骨架。
4. `@vben-core/shadcn-ui` 与 `packages/@core/ui-kit/*` 是组件层主要基础，不应在业务页并行出另一套底层。
5. Nitro 在前端仓库里是 mock/dev 基础设施，不是正式业务后端默认实现。
6. 文档、契约、验证要和代码同改，不能只改实现不改标准。

如果某次改动让我们开始怀疑“是不是已经偏离 `vben` 了”，先回看这份摘要，再对照 [frontend-engineering-standard.md](./frontend-engineering-standard.md) 做本地判断。
