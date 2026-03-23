# skills 使用说明

## 1. 这份文档的作用

这份文档只说明 `black-tonny-frontend` 仓库内的 repo-local skills。

当前重点对象是：

- [`temp_skills/black-tonny-dashboard-expert/SKILL.md`](../../temp_skills/black-tonny-dashboard-expert/SKILL.md)
- [`temp_skills/black-tonny-cleanup-operator/SKILL.md`](../../temp_skills/black-tonny-cleanup-operator/SKILL.md)

它是这个仓库自己维护的实验性 skill，不等于全局 Codex skills。

## 2. 当前仓库对 skill 的标准

当前仓库默认遵循下面这条原则：

- 正式规则放仓库文档
- skill 只做薄适配层或工具型工作流

必须遵守：

- skill 不是 source of truth
- 不允许把 repo 规则只写在 skill 里
- 如果 skill 内容和正式文档冲突，以正式文档为准
- 如果某个 skill 已经没有明显收益，就不要继续重点维护

## 3. 当前 repo-local skill 的定位

`black-tonny-dashboard-expert` 适合处理：

- dashboard 业务文档整理
- dashboard 页面与指标的任务拆解
- AI 协作时的 dashboard 上下文补充
- 结合 repo 内样例脚本、参考文档生成更贴近本项目的任务输入

它不替代：

- [前端工程标准](../frontend-engineering-standard.md)
- `README / ARCHITECTURE / docs/README`
- 全局的 frontend coding standard skill

`black-tonny-cleanup-operator` 适合处理：

- 用户已经明确授权执行的仓库清理
- 调试产物、旧残留、低价值 upstream diff 的收口
- 清理时对标准文档、审计板和护栏脚本的同步更新
- 个人机器磁盘压力场景下的“彻底清理本地内容，但保留配置”

它不替代：

- [仓库清理手册](../maintainers/repo-cleanup-handbook.md)
- [Vben 对齐审计](../vben-alignment-audit.md)
- [Upstream 定制台账](../maintainers/upstream-customization-ledger.md)

## 4. 什么时候值得保留 skill

只有在下面情况成立时，skill 才值得继续保留：

- 它确实减少重复沟通成本
- 它封装了 repo-local 脚本、reference、assets 的使用方式
- 不开它时，AI 很难稳定走到正确的 repo 内资源

如果只是重复一遍仓库标准文档，通常不值得专门维护 skill。

## 5. 触发场景

适合触发这个 skill 的场景：

- 你在改 `docs/dashboard/` 下的文档
- 你要整理 dashboard 任务 brief
- 你要把 dashboard 业务语义翻译成更清晰的前端工作项
- 你要快速参考 repo 内的示例脚本和 reference 文件

适合触发 `black-tonny-cleanup-operator` 的场景：

- 你已经明确说“执行清理”
- 你要清掉调试产物、旧残留或低价值差异
- 你希望 AI 按仓库清理边界执行，而不是临时发挥

不适合触发的场景：

- 纯 Vue / TypeScript / Vben 代码规范问题
- 通用前端工程配置问题
- backend 的 ERP 抓取、capture、serving 研究
- 只是想审计还有什么可清理，但还没授权执行

## 6. 输入 / 输出

建议输入：

- 目标页面或目标文档
- 关心的业务模块或指标
- 预期输出形式
  - 文档
  - brief
  - checklist
  - 示例脚本说明

常见输出：

- dashboard 文档草稿
- 任务拆解清单
- 业务语义到组件/页面的映射说明
- 给 AI 会话使用的上下文摘要

`black-tonny-cleanup-operator` 常见输出：

- 清理候选项分级
- 已执行的清理变更
- 对应文档、审计和护栏同步结果
- 后续不再回流的防线说明

## 7. repo 内现有资源

当前 skill 自带资源包括：

- `scripts/example_script.cjs`
  - 示例脚本占位，可作为脚本组织方式参考
- `references/example_reference.md`
  - 示例参考文档占位，可作为 reference 目录结构参考
- `assets/example_asset.txt`
  - 示例资源占位，可作为非上下文资产目录参考

这些资源当前更接近模板和样例，不应被误读为正式业务事实源。

`black-tonny-cleanup-operator` 当前故意保持精简：

- 直接复用仓库正式文档和现有检查命令
- 可调用仓库脚本 `pnpm clean:local:plan` / `pnpm clean:local:apply`
- 只在用户显式要求执行清理时才介入

## 8. 示例

适合的请求示例：

- “帮我把 dashboard 演进文档里的 summary 和 interaction 关系整理成 brief”
- “基于 frontend repo 现有 dashboard docs，补一份新页面的文档骨架”
- “结合 temp skill 里的结构，给我一份 dashboard 改版任务输入模板”
- “按仓库清理手册，把这批已确认的调试残留直接清掉”
- “按 cleanup operator 的边界执行清理，不要扩大成重构”
- “做一轮 full local cleanup，但配置和源码别动”

## 9. 注意事项

- 这是 repo-owned experimental skill，不是正式 source of truth
- 如果 skill 内容与正式文档冲突，以正式文档为准
- 如果要把 skill 里的做法提升成正式规范，应该更新：
  - `README.md`
  - `docs/README.md`
  - `docs/frontend-engineering-standard.md`
  - 如果属于维护主题，再更新 `docs/maintainers/*`
- 如果后续确认这个 skill 不再带来明显收益，可以直接停止维护，而不是强行保留

## 10. 相关文档

- [文档总图](../document-map.md)
- [工具文档入口](./README.md)
- [AI 协作说明](./ai-collaboration-guide.md)
- [前端工程标准](../frontend-engineering-standard.md)
- [维护者文档入口](../maintainers/README.md)
- [仓库清理手册](../maintainers/repo-cleanup-handbook.md)
