# 文档总图

状态：`Reference`

这份文档是 `black-tonny-frontend` 视角下的跨仓库文档导航图。

它只负责回答一件事：

“我现在要看哪一层文档，应该从哪里进。”

它不是新的 source of truth，也不替代 frontend 或 backend 的正式规则文档。

## 1. 文档分层说明

当前文档建议按四层理解：

- 产品介绍
  - 面向客户介绍、方案沟通、交付边界说明
  - 主体放在 frontend 的 `docs/product/`
- 前端实现
  - 页面语义、交互规则、前端规范、前端 tooling
  - 主体放在 frontend 的 `docs/`
- 后端实现与数据
  - ERP 研究、capture 路线、成熟度状态、summary API、两库架构
  - 主体放在 backend 的 `docs/`
- 工具与 AI 协作
  - repo-local skills、AI 协作、MCP、browser research
  - frontend 与 backend 各自负责自己那一侧的工具文档
- 维护者手册
  - 升级、release、CLI/bootstrap、模板清理、未来架构演进
  - 主体放在 frontend 的 `docs/maintainers/`

固定边界：

- 产品文档在 frontend
- `capture / serving / ERP 准入 / 成熟度状态` 在 backend
- Workspace 不是文档承载层

## 2. 推荐读法

### 2.1 想对客户介绍系统

1. [产品文档入口](./product/README.md)
2. [平台总体介绍](./product/platform-overview.md)
3. [平台方案说明](./product/platform-solution-brief.md)

### 2.2 想理解页面与产品语义

1. [Frontend Docs Index](./README.md)
2. [dashboard 产品总览](./dashboard/overview.md)
3. [dashboard 指标定义](./dashboard/summary-metrics.md)
4. [dashboard 交互规则](./dashboard/interaction-rules.md)

### 2.3 想理解数据底座与 capture

1. [Optional sibling backend ERP 文档入口 (local workspace link)](../../black-tonny-backend/docs/erp/README.md)
2. [Optional sibling backend ERP API 成熟度总览 (local workspace link)](../../black-tonny-backend/docs/erp/api-maturity-board.md)
3. [Optional sibling backend Capture 路线注册表 (local workspace link)](../../black-tonny-backend/docs/erp/capture-route-registry.md)
4. [Optional sibling backend Capture 全量导入路线图 (local workspace link)](../../black-tonny-backend/docs/erp/capture-ingestion-roadmap.md)

### 2.4 想看工具、MCP 或浏览器研究

1. frontend 侧先看：
   - [tooling 文档入口](./tooling/README.md)
   - [AI 协作低 Token 操作手册](./tooling/ai-token-playbook.md)
   - [skills 使用说明](./tooling/skills-guide.md)
   - [AI 协作说明](./tooling/ai-collaboration-guide.md)
2. 如果任务涉及 MCP、browser research、页面研究 runner、菜单覆盖审计，再看 backend：
   - [Optional sibling backend tooling 文档入口 (local workspace link)](../../black-tonny-backend/docs/tooling/README.md)
   - [Optional sibling backend MCP 使用说明 (local workspace link)](../../black-tonny-backend/docs/tooling/mcp-guide.md)
   - [Optional sibling backend 浏览器研究工具说明 (local workspace link)](../../black-tonny-backend/docs/tooling/browser-research-tools.md)

### 2.5 想做升级、发布或长期维护决策

1. [Frontend Docs Index](./README.md)
2. [前端工程标准](./frontend-engineering-standard.md)
3. [官方覆盖清单](./official-doc-coverage-board.md)
4. [维护者文档入口](./maintainers/README.md)
5. 如果在判断当前仓库是否已经跑偏，再看：
   - [Vben 对齐审计](./vben-alignment-audit.md)

## 3. Frontend 文档树

```text
black-tonny-frontend/
├─ README.md                        # 仓库入口
├─ ARCHITECTURE.md                  # 前端架构说明
└─ docs/
   ├─ README.md                     # frontend docs 总入口
   ├─ document-map.md               # 跨仓库文档总图
   ├─ frontend-engineering-standard.md # 前端工程规范
   ├─ official-doc-coverage-board.md # 官方文档覆盖清单
   ├─ vben-alignment-audit.md       # 全仓对齐审计与例外登记
   ├─ maintainers/                  # 维护者手册
   │  ├─ README.md
   │  ├─ cli-and-bootstrap-handbook.md
   │  ├─ changeset-and-release-handbook.md
   │  ├─ project-update-handbook.md
   │  ├─ template-cleanup-handbook.md
   │  ├─ ui-framework-strategy.md
   │  ├─ ci-and-runner-strategy.md
   │  ├─ upstream-customization-ledger.md
   │  ├─ repo-cleanup-handbook.md
   │  ├─ login-evolution-handbook.md
   │  └─ external-modules-handbook.md
   ├─ product/                      # 产品介绍与方案沟通
   │  ├─ README.md
   │  ├─ platform-overview.md
   │  └─ platform-solution-brief.md
   ├─ dashboard/                    # 页面语义与 dashboard 工作文档
   │  ├─ overview.md
   │  ├─ summary-metrics.md
   │  ├─ interaction-rules.md
   │  ├─ summary-analysis-logic.md
   │  ├─ evolution-log.md
   │  └─ codex-task-brief.md
   └─ tooling/                      # 前端侧工具与 AI 协作
      ├─ README.md
      ├─ ai-token-playbook.md
      ├─ skills-guide.md
      └─ ai-collaboration-guide.md
```

## 4. Backend 文档树

```text
black-tonny-backend/
├─ README.md                        # 后端仓库入口
├─ ARCHITECTURE.md                  # 后端架构说明
└─ docs/
   ├─ README.md                     # backend docs 总入口
   ├─ two-database-architecture.md  # capture / serving 两库架构
   ├─ frontend-backend-boundary.md  # 前后端边界
   ├─ dashboard/                    # summary API 与映射
   │  ├─ summary-api.md
   │  ├─ summary-capture-mapping.md
   │  └─ evolution-index.md
   ├─ erp/                          # ERP 研究、成熟度、capture 路线
   │  ├─ README.md
   │  ├─ api-maturity-board.md
   │  ├─ capture-route-registry.md
   │  ├─ capture-ingestion-roadmap.md
   │  ├─ sales-ledger.md
   │  ├─ inventory-ledger.md
   │  ├─ member-ledger.md
   │  ├─ stored-value-ledger.md
   │  ├─ payment-and-doc-ledger.md
   │  ├─ cost-visibility-audit.md
   │  └─ page-research-runbook.md
   └─ tooling/                      # MCP、browser research、repo-local 工具
      ├─ README.md
      ├─ mcp-guide.md
      └─ browser-research-tools.md
```

## 5. Source-of-Truth 说明

为了避免以后再混层，固定按下面理解：

- 产品能力与方案表达：
  - 以 frontend `docs/product/*` 为入口
- 页面语义与前端规范：
  - 以 frontend `docs/dashboard/*`、`docs/frontend-engineering-standard.md` 和 `docs/vben-alignment-audit.md` 为准
- 升级、发布、脚手架、模板清理与长期演进：
  - 以 frontend `docs/maintainers/*` 为准
- ERP 研究、capture 路线、成熟度状态：
  - 以 backend `docs/erp/*` 为准
- summary API 与后端数据契约：
  - 以 backend `docs/dashboard/*` 为准
- 工具与 AI 协作：
  - repo-local 的工具细节，以各自 repo 的 `docs/tooling/*` 为准
  - frontend 侧 low-token 协作默认先看 `docs/tooling/ai-token-playbook.md`

如果你不确定应该先看哪一份，就回到这张总图重新进入，而不要先凭记忆跳到某个单独文件。
