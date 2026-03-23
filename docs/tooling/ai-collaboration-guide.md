# AI 协作说明

## 1. 这份文档的作用

这份文档只说明 `black-tonny-frontend` 仓库内 AI 协作相关文档的关系。

它不展开低 Token 协作的具体操作细则；这部分统一放在 [AI 协作低 Token 操作手册](./ai-token-playbook.md)。

它回答的是：

- `AGENTS / CLAUDE / GEMINI` 各自是什么
- 什么时候该继续读 tooling docs
- repo-local temp skill 和全局 Codex skill 的区别
- 规则究竟该写在文档、adapter，还是 skill 里

## 2. 推荐读顺序

当任务涉及前端代码或文档时，推荐顺序是：

1. `README.md`
2. `ARCHITECTURE.md`
3. `docs/README.md`
4. `docs/frontend-engineering-standard.md`
5. 如果涉及 AI 辅助工具或 repo-local temp skill，再看：
   - [工具文档入口](./README.md)
   - [AI 协作低 Token 操作手册](./ai-token-playbook.md)
   - [skills 使用说明](./skills-guide.md)

## 3. 规则归位原则

当前仓库对 AI 协作的默认分层是：

1. 正式规则写入仓库文档
   - `README.md`
   - `ARCHITECTURE.md`
   - `docs/README.md`
   - `docs/frontend-engineering-standard.md`
   - `docs/maintainers/*`
2. `AGENTS / CLAUDE / GEMINI / .claude/CLAUDE` 只负责入口导航和优先级说明
3. `skills` 只负责薄提醒、工具接线或高重复度工作流

必须遵守：

- 不把仓库规则只写在某个 skill 里
- 不把 adapter 文件扩写成第二份规范正文
- 如果某条规则已经稳定，应先进入正式文档，再决定 skill 是否还需要保留薄提醒

## 4. adapter 文档的定位

这些文件都只是 AI 入口或兼容层：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`

它们负责：

- 指定读顺序
- 指向正式文档
- 保持不同 AI 工具的入口一致

它们不应该重复业务规则，也不应该变成第二份 source of truth。

## 5. repo-local temp skill 与全局 skill 的区别

repo-local temp skill：

- 存在于当前仓库里
- 由当前仓库维护
- 服务当前仓库的特定上下文
- 当前例子：
  - `temp_skills/black-tonny-dashboard-expert`

全局 skill：

- 存在于用户级 Codex skill 目录
- 不属于这个仓库的正式资产
- 可以辅助当前仓库工作，但不应被写成 repo 规则

## 6. skill 的使用边界

适合保留或使用 skill 的场景：

- 它能稳定节省重复的上下文整理
- 它封装了真实有收益的工具工作流
- 它提供的是薄提醒，而不是一整套平行规范

不适合继续维护 skill 的场景：

- 它只是在重复仓库文档
- 它承载的是长期规则而不是执行提醒
- 它离开当前 AI 环境后就几乎没有复用价值

当前仓库默认结论：

- 文档为主
- adapter 为入口
- skill 为辅
- 如果没有明确收益，可以不依赖 skill

## 7. 使用边界

适合引用 AI 协作说明的时候：

- 你在更新 repo-local temp skill
- 你在整理 adapter 文档
- 你要判断某条规则应该放正式 docs，还是只放 tooling docs
- 你要确认低 Token 规则应该收口在哪里，而不是散写到业务文档里

不适合用它替代：

- 低 Token 协作操作手册
- 业务规则文档
- 页面交互规则
- dashboard 指标口径

## 8. 相关文档

- [文档总图](../document-map.md)
- [工具文档入口](./README.md)
- [AI 协作低 Token 操作手册](./ai-token-playbook.md)
- [skills 使用说明](./skills-guide.md)
- [Frontend Docs Index](../README.md)
- [前端工程标准](../frontend-engineering-standard.md)
- [维护者文档入口](../maintainers/README.md)
