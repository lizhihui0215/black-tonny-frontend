# 仓库清理手册

这份文档是 `black-tonny-frontend` 在“清理”类任务上的维护侧规范源。

它只回答 3 件事：

- 什么叫“可以执行的清理”
- 什么东西绝对不能因为“看起来没用”就直接删
- 当 AI 或维护者收到“清理一下”这类指令时，应该按什么顺序处理

它不替代 [前端工程标准](../frontend-engineering-standard.md)、[模板清理手册](./template-cleanup-handbook.md) 或 [Vben 对齐审计](../vben-alignment-audit.md)。

## 1. 当前清理原则

当前仓库的“清理”默认不是指随手删文件，而是指：

- 收口已经确认无价值的 repo-owned 残留
- 回收没有业务价值的 upstream diff
- 清掉不应进入版本管理的调试产物
- 收缩已被新标准替代的旧入口、旧说明或旧样本
- 在磁盘压力场景下，清掉本地可再生内容，但保留仓库配置和正式源码

固定规则：

- 没有明确指令时，只做审计，不做删除或回收。
- 只有在用户明确表达“执行清理”“帮我清掉”“现在就删”等意思时，才进入执行阶段。
- 如果用户明确表达“彻底清理本地内容，但配置都保留”，进入 `Full local cleanup` 模式。
- 如果任务只是“看看还有什么要清理”，那属于审计，不属于执行清理。
- 清理动作必须建立在现有标准和台账之上，不能凭主观感觉删。

## 2. 清理任务的四级分类

### 2.1 `Safe cleanup`

可以直接执行的低风险清理：

- repo root 被跟踪的调试截图
- `playwright-report`、`test-results`、`output/*` 这类不应入库的产物
- 已被新文档替代的旧文档入口
- 已确认无引用的样本或说明文件
- 没有业务价值的格式性 upstream diff

执行前仍然要：

- 确认它确实无引用或属于本地产物
- 跑对应验证

### 2.2 `Review-required cleanup`

需要先做影响判断，再决定是否执行：

- `apps/web-ele/src` 内的页面、组件、API、样式文件
- `tests/e2e/*` 下的 fixture、spec、support 文件
- `docs/*` 下仍可能承担入口责任的文档
- `scripts/*` 下的 repo-local 工具脚本

这类对象必须先回答：

- 它现在还有没有正式入口
- 有没有被标准、审计、E2E 或 workflow 引用
- 删除后要更新哪些文档

### 2.3 `Boundary-sensitive cleanup`

默认不能直接删，必须回看边界文档：

- `packages/*`
- `internal/*`
- `apps/web-ele/src/router/*`
- `apps/web-ele/src/preferences.ts`
- `apps/web-ele/src/api/request.ts`
- `page-shell`、shared shell、layout widget 主链文件

处理这类清理前，必须同时看：

- [前端工程标准](../frontend-engineering-standard.md)
- [Vben 对齐审计](../vben-alignment-audit.md)
- [Upstream 定制台账](./upstream-customization-ledger.md)

### 2.4 `Do-not-clean by default`

没有专项任务时，不应主动碰：

- `_core` 认证、fallback、profile 等官方底座页面
- `packages/*`、`internal/*` 中没有登记为无价值差异的源码
- 当前仍承担 runtime 主链职责的正式 `/api/*` 接线
- 只是“看起来不像业务代码”的 upstream 基础设施

### 2.5 `Full local cleanup`

这是给“个人机器磁盘压力”准备的执行模式。

目标：

- 尽可能释放本地空间
- 但保留仓库配置、正式源码、标准文档和工作流定义

默认允许清掉：

- `node_modules`
- `dist`、`dist-ssr`、`dist.zip`
- `.turbo`
- `.nitro`、`.output`
- `coverage`
- `playwright-report`
- `test-results`
- `output`
- 未跟踪的调试截图和调试日志

默认保留：

- `README.md`、`docs/*`
- `.node-version`、`.nvmrc`
- `package.json`、`pnpm-lock.yaml`
- `.forgejo/`、`.github/`
- `.env*` 这类本地配置文件
- 所有被 Git 跟踪的正式源码与正式配置

执行规则：

- 默认先预览，再决定是否执行
- 当前仓库使用：
  - `pnpm clean:local:plan`
  - `pnpm clean:local:apply`
- `clean:local:*` 默认不会删除任何被 Git 跟踪的文件

## 3. 标准读法

当任务明确要求“执行清理”时，固定读法如下：

1. [README.md](../../README.md)
2. [ARCHITECTURE.md](../../ARCHITECTURE.md)
3. [前端工程标准](../frontend-engineering-standard.md)
4. [Vben 对齐审计](../vben-alignment-audit.md)
5. [模板清理手册](./template-cleanup-handbook.md)
6. 如果触及底座层，再看 [Upstream 定制台账](./upstream-customization-ledger.md)

## 4. 标准执行流程

### 第一步：先审计，再执行

先把候选项分成下面三类：

- `可直接清理`
- `需要复核`
- `禁止本轮清理`

如果还没分级清楚，就不能开始删。

### 第二步：只在明确授权范围内执行

如果用户只说：

- “看看还有什么不干净”
- “扫一下有没有残留”
- “审计一下”

那就只输出候选项，不执行删除。

只有当用户明确表达执行意图时，才真正做修改。

如果用户明确说：

- “彻底清理本地内容，但配置都保留”
- “释放磁盘，源码和配置别动”
- “做一轮 full local cleanup”

则按 `Full local cleanup` 模式执行。

### 第三步：同步更新文档和护栏

只要清理影响了入口、标准、边界或审计结论，就必须同步更新：

- `README.md`
- `docs/README.md`
- `docs/frontend-engineering-standard.md`
- `docs/vben-alignment-audit.md`
- 对应维护手册

如果清理对象属于“以后还可能回流”的类型，还要同步更新：

- `.gitignore`
- `scripts/check-frontend-standards.mjs`

### 第四步：按改动类型验收

最低要求：

- 文档变更：`pnpm docs:check`
- 标准边界/目录归位/产物清理：`pnpm standards:check`
- 代码清理：`pnpm check:mainline`
- runtime 主链清理：`pnpm check:runtime`
- `Full local cleanup`：至少先跑 `pnpm clean:local:plan` 预览，执行后再按需补装依赖或重跑对应检查

## 5. 当前仓库的清理边界结论

截至 `2026-03-23`，当前仓库的正式结论是：

- repo root 调试产物应持续清理，不得入库
- 页面样本 fixture 只能留在 `tests/e2e/fixtures/*` 或 `docs/*`，不得回流到 app runtime 邻近目录
- 底座层差异只允许保留“有明确业务价值的稳定挂点”，见 [Upstream 定制台账](./upstream-customization-ledger.md)
- 没有业务价值的 upstream diff，应该优先回收
- 当前没有打开的 `Mandatory drift` 或 `Registered exception`，因此任何新清理都必须先解释“它为什么又出现了”

## 6. 给 AI 的固定规则

如果 AI 收到清理类请求，固定按下面理解：

- “审计 / 看看 / 扫一下 / 检查一下”
  - 只输出候选项，不执行删除
- “执行清理 / 帮我清掉 / 直接删 / 现在收掉”
  - 才进入执行阶段
- “彻底清理本地内容，但配置都保留”
  - 进入 `Full local cleanup` 模式

AI 在执行清理时必须：

- 明确本轮清理的对象和边界
- 优先清理 `Safe cleanup`
- 对 `Boundary-sensitive cleanup` 先做影响判断
- 不把“清理”扩大成大范围重构
- 如果是 `Full local cleanup`，优先使用仓库脚本预览，然后只删除可再生本地产物

## 7. 什么时候更新这份手册

只有在出现下面情况时，才需要继续扩写：

- 新出现一类反复回流的脏产物
- 新增一类高风险“看起来可删、其实不能删”的对象
- 清理工作开始频繁触及新的共享层或 runtime 主链边界

如果没有新模式，不要继续给这份手册堆规则。
