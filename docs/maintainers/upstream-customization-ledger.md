# Upstream 定制台账

这份文档是 `black-tonny-frontend` 针对本地官方 clone [vue-vben-admin](../../../../vue-vben-admin) 的文件级定制台账。

它只关心一类问题：

- 我们在 `packages/*` 和 `internal/*` 这些底座层到底改了什么
- 每个差异为什么存在
- 这些差异是应该保留、回收，还是继续抽象

它不是新的工程标准，也不替代 [前端工程标准](../frontend-engineering-standard.md) 或 [Vben 对齐审计](../vben-alignment-audit.md)。

## 1. 审计基线

当前对照基线：

- 本地官方 clone：[vue-vben-admin](../../../../vue-vben-admin)
- 分支：`main`
- 快照提交：`3528517fe`
- 审计日期：`2026-03-23`

固定范围：

- `packages/*`
- `internal/*`
- 只记录 repo-owned 的正式源码差异

不记录：

- `node_modules/`
- `playwright-report/`
- `test-results/`
- 其他本地产物或未跟踪运行目录

## 2. 结论先看

当前文件级对照结论很收敛：

- `packages/*` 没有大范围结构性分叉
- `internal/*` 没有业务品牌泄漏到共享底座
- 当前底座层真正需要长期保留说明的 repo-owned 差异只有 3 处，而且都属于“暴露稳定语义挂点”
- `internal/vite-config` 里有一处无业务价值的顺序差异，已经回收到 upstream 形态

一句话总结：

- 底座目前不是“改很多”，而是“只改了少数为业务层提供稳定挂点的点”

## 3. 决策分类

- `Keep`
  - 当前应保留的定制
- `Normalize`
  - 没有业务价值，应该回收为 upstream 形态
- `Future abstraction`
  - 当前先保留，但未来最好继续抽象或等待 upstream 更稳定入口

## 4. 当前台账

| 文件 | 差异摘要 | 当前结论 | 原因 | 后续动作 |
| --- | --- | --- | --- | --- |
| [packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue](../../packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue) | 新增 `vben-layout-sidebar*` 语义类 | `Keep` | 给业务层稳定挂点，替代高风险 `nth-child / first-child / aside` 结构选择器 | 继续保留；若 upstream 未来提供官方 class slot 或更稳定 hook，再评估回收 |
| [packages/@core/ui-kit/shadcn-ui/src/components/logo/logo.vue](../../packages/@core/ui-kit/shadcn-ui/src/components/logo/logo.vue) | 新增 `vben-logo*` 语义类 | `Keep` | 让 logo 区的业务定制不再依赖头像/文本节点顺序 | 继续保留；避免把业务文案或品牌词带进 shared 组件 |
| [packages/effects/layouts/src/widgets/user-dropdown/user-dropdown.vue](../../packages/effects/layouts/src/widgets/user-dropdown/user-dropdown.vue) | 新增 `vben-user-dropdown__trigger*` 语义类 | `Keep` | 让业务层可以命中头像入口，不再依赖脆弱选择器 | 继续保留；若后续能回到更稳定 slot/prop，也可再收缩 |
| [internal/vite-config/src/plugins/inject-app-loading/default-loading.html](../../internal/vite-config/src/plugins/inject-app-loading/default-loading.html) | `.loading.hidden` 中 CSS 属性顺序曾与 upstream 不一致 | `Normalize` | 没有业务价值，不应制造无意义 diff | 已回收成 upstream 顺序，不再作为长期差异保留 |

## 5. 边界规则

从这轮文件级对照里，固定出 4 条维护规则：

1. 底座定制优先做“稳定语义挂点”，不要做“业务内容下沉”
2. 如果一个差异没有明显业务价值，就尽量回收到 upstream 形态
3. 共享层允许的 repo-owned diff，优先是：
   - class hook
   - slot hook
   - wrapper-friendly semantic entry
4. 共享层不允许的 repo-owned diff，优先包括：
   - 业务品牌词
   - 页面私有口径
   - 与业务页强绑定的视觉文案
   - 仅为临时调试存在的无意义格式差异

## 6. 以后怎么用

只要未来再改 `packages/*` 或 `internal/*`，就按这个顺序处理：

1. 先看 [前端工程标准](../frontend-engineering-standard.md)
2. 再看 [Vben 对齐审计](../vben-alignment-audit.md)
3. 本地有官方 clone 时，先跑 `pnpm upstream:check`
4. 如果改动落在底座层，再更新这份台账

## 7. 自动护栏

仓库现在提供了一个显式的 upstream 对照脚本：

```bash
pnpm upstream:check
```

默认行为：

- 读取本地官方 clone `../../vue-vben-admin`
- 校验其 `HEAD` 是否仍为当前台账基线 `3528517fe`
- 对照 `packages/*` 和 `internal/*` 的 tracked 文件
- 只允许这份台账里已经登记的长期定制 diff 存在

可选环境变量：

- `VBEN_UPSTREAM_DIR`
  - 用于覆盖默认官方 clone 路径
- `VBEN_UPSTREAM_REF`
  - 用于覆盖当前快照提交校验值

使用边界：

- 日常页面开发不需要默认跑它
- 触及 `packages/*`、`internal/*`、官方升级对齐、共享层清理时，应主动跑一次
- 如果脚本报“某个允许 diff 已不再存在”，说明定制已经被回收；应同步更新这份台账和脚本白名单

如果新增差异没有被记录进这里，那它就不算“边界已经明确”的定制。
