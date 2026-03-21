# Black Tonny Frontend Change Standard

Black Tonny 前端仓库的业务改动以 `vue-vben-admin v5` 为唯一底座。

这份文档是当前仓库前端改动的真实规范源。无论是人工开发、代码评审，还是 Codex/AI 协作，都先遵守这里的规则，再动手实现。

仓库内面向 AI 协作的适配入口位于 `.codex/skills/black-tonny-frontend-standards`、`.claude/CLAUDE.md` 和 `GEMINI.md`。它们只是这份文档的执行入口，不是新的规范源。

## Core Principle

规范采用“vben 底座 + Black Tonny 业务视觉”的原则：

- 交互结构、工程接入、工具链遵循 vben v5。
- 视觉表现延续当前 Black Tonny 业务页面语言，不强行回退到 vben 默认示例外观。

换句话说：

- 怎么搭、怎么接、怎么验，听 vben。
- 页面看起来像什么、业务表达怎么说，延续 Black Tonny 当前页面。

## Baseline

以下内容视为当前仓库默认标准，不要绕开：

- `apps/web-ele` 作为 Black Tonny 业务前端主应用。
- `@vben/vite-config`、`@vben/styles`、`@vben/styles/ele`、`@vben/preferences`。
- Element Plus 作为当前业务 UI 基础组件库。
- Tailwind v4 主题与语义色链路。
- 根层 `eslint / oxlint / stylelint / oxfmt / lefthook` 工具链。
- 现有 `page-shell + PageSpec + shared components` 的业务页面结构。

默认优先在 `apps/web-ele` 完成业务改动。除非业务层现有能力明确不够，否则不要随意进入 `packages/*` 或 `internal/*` 改公共底座。

## Visual And Theme Rules

### `preferences.ts` is the first entry

`apps/web-ele/src/preferences.ts` 是 Black Tonny 全局主题与视觉偏好的入口。

以下改动必须先检查 `preferences.ts`，不能先在页面里硬写：

- 主题模式：`light / dark / auto`
- 头部、侧边栏、子菜单的深浅风格
- 内容区域宽度与布局密度
- 会影响全局视觉体验的主题偏好

### Do not isolate colors from the theme system

颜色、背景、边框、阴影、圆角、浮层底色等视觉规则，不要脱离现有主题链路各自散落。

优先级如下：

1. 先看 `preferences.ts` 是否已有对应偏好。
2. 再看现有设计 token、Tailwind 语义类、Element Plus design token 是否已可表达。
3. 再看当前业务页面是否已有同类视觉模式可复用。
4. 只有前三步都不满足时，才允许在局部组件内补样式。

以下做法默认禁止：

- 绕开 `preferences.ts` 做全局主题偏移。
- 把应属于全局主题的颜色长期写死在某个页面里。
- 新造一套平行主题变量，让它和 vben / Element Plus / Tailwind token 失联。

允许局部业务语义色存在，但它只能服务局部业务表达，不能替代全局主题职责。

示例：

- 单张经营卡片的风险提醒色可以局部存在。
- 全站主色、浮层基色、核心按钮色，不应只写在业务页面里。

如果一个颜色或视觉模式开始在多个页面重复出现，就应该评估是否要收敛到主题链路，而不是继续复制粘贴。

## Style Change Rules

改样式前必须先做三件事：

1. 看同模块已有页面和组件怎么写。
2. 看现有 token、Element Plus、Tailwind 语义类能不能复用。
3. 看这次改动是局部业务视觉，还是已经触及全局主题。

样式改动时遵守这些规则：

- 优先复用已有卡片、区块、标题、信息层级、间距和圆角语言。
- 不为一个局部样式需求重新发明一套布局结构。
- 不把全局视觉职责塞进单个页面。
- 不为了“更像 vben 示例”而破坏当前 Black Tonny 的业务语言。

## Dependency Rules

默认禁止新增第三方库。

当前仓库已经存在的依赖和体系优先复用，包括但不限于：

- `@vben/*`
- Vue
- Element Plus
- VueUse
- dayjs
- echarts

只有在现有能力明确不够时，才允许考虑新增外部依赖。此时必须先说明：

- 具体缺什么能力
- 为什么现有依赖和仓库内能力不够
- 影响范围
- 维护成本

在得到明确同意前，不要直接把新库加进项目。

## Engineering Rules

- 页面、组件、路由、数据接线优先遵循当前 `apps/web-ele` 的现有目录和命名方式。
- 业务文案保持中文；工程标识、变量名、类型名、文件名保持英文。
- 不绕开现有 `bootstrap / router / preferences / adapter` 体系。
- 不把应复用的业务逻辑复制到多个页面中。

## Before / After Checklist

开始改之前：

- 我是否先看过现有页面和共享组件？
- 我是否检查过 `preferences.ts` 和现有 token？
- 我是否确认不需要新增第三方库？

提交前：

- 本次改动是否仍建立在 vben v5 底座上？
- 样式是否没有脱离现有主题链路？
- 是否没有把全局视觉偏好偷偷写死在页面里？
- 是否跑过至少 `pnpm typecheck`？
- 如果涉及样式或交互，是否做过页面实际验收？
