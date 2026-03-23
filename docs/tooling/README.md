# 工具文档入口

这组文档只负责 `black-tonny-frontend` 仓库内的工具说明。

它们回答的是：

- repo-local `temp_skills` 是什么，什么时候该用
- AI 协作文档和 adapter 文档应该怎么读
- 哪些文档属于正式规则，哪些只是辅助工具说明

当前仓库的默认原则是：

- 正式规则写在仓库文档里
- `AGENTS / CLAUDE / GEMINI` 只负责导航和读顺序
- `skills` 只保留为薄适配层或工具型工作流
- 如果某个 skill 不再明显节省重复沟通或工具接线成本，就不应继续重点维护

它们不替代业务文档，也不替代 frontend 变更规范。

## 适用范围

- repo-owned `temp_skills`
- AI 协作文档与 adapter 文档
- repo-local 工具读入口

不适用范围：

- 页面业务口径
- dashboard 产品定义
- 全局 frontend 变更规范

这些内容继续以业务文档为准：

- [文档总图](../document-map.md)
- [Frontend Docs Index](../README.md)
- [前端工程标准](../frontend-engineering-standard.md)
- [维护者文档入口](../maintainers/README.md)
- [dashboard 文档目录](../dashboard/overview.md)

如果任务同时涉及产品文档、前端实现、后端数据文档或 MCP/浏览器研究入口，先从 [文档总图](../document-map.md) 进入，再回到对应的 tooling 文档。

## 文档列表

- [skills 使用说明](./skills-guide.md)
  - repo-local `temp_skills` 的用途、触发场景、输入输出、示例和注意事项
- [AI 协作说明](./ai-collaboration-guide.md)
  - AGENTS / CLAUDE / GEMINI / temp skill 的关系与使用边界
- [AI 协作低 Token 操作手册](./ai-token-playbook.md)
  - AI 协作场景下的最小读法、搜索约束、事实缓存模板和跨仓扩读建议

## 低 Token 协作入口

- 先看 [../../AGENTS.md](../../AGENTS.md) 里的 task routing，判断本次任务的 minimum read set。
- 如果问题本身就是 AI token、搜索范围、入口文档读法或跨仓库导航成本，继续看 [AI 协作低 Token 操作手册](./ai-token-playbook.md)。
- [AI 协作说明](./ai-collaboration-guide.md) 只负责说明文档关系、adapter 定位和 skill 边界，不展开低 Token 操作细则。
- 低 Token 协作规则只在这份入口和 [AI 协作低 Token 操作手册](./ai-token-playbook.md) 收口，不向其他业务 area docs 扩散同类操作说明。

## 当前边界

- `temp_skills` 是 repo-owned experimental asset
- 它们不等于 `~/.codex/skills` 里的全局技能
- 正式规则仍然以 `README / docs/README / frontend-engineering-standard` 为准
- 维护侧的长期规则与流程，以 `docs/maintainers/*` 为准
- 不允许把 repo 规则只写在某个 skill 里而不落仓库文档
