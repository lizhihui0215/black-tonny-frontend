# 模板清理手册

这份文档承接官方 `移除代码` 主题在当前仓库的维护边界。

## 当前仓库结论

当前仓库虽然不是原始官方模板，但仍保留了不少 upstream 基座层：

- `_core` 认证、profile、fallback 页面
- `packages/*` 共享 UI 与效果层
- `internal/*` 构建和 lint 基础设施
- Nitro mock、loading、styles 等通用能力

因此，“看起来没用”的东西不等于可以直接删。

## 可以优先考虑清理的对象

- 已明确废弃且无引用的页面或组件
- 已过期的导出文档或样本文件
- 无收益的 repo-local temp skill
- 已被新标准替代的旧说明文档

## 不要直接动的对象

- `_core` 页面和 access/auth 相关入口
- `packages/*`、`internal/*` 中你还没完成影响评估的共享能力
- 当前仍在承担 mock/dev、build、style、loading 责任的基础设施
- 任何只因为“看着不像当前业务”就想删掉的 upstream 代码

## 清理前检查

1. 全局搜索引用。
2. 判断它属于：
   - app 私有实现
   - shared package
   - internal tool
   - 维护侧预留能力
3. 回看 [Vben 对齐审计](../vben-alignment-audit.md)，确认它是不是登记例外或未来演进入口。

## 清理后必须做的事

- 同步更新相关文档
- 如果删除改变了标准入口、维护入口或工作流，更新 `docs/README.md`、`document-map.md`、`AGENTS.md`
- 跑对应验证，不把“删代码”当成免测动作
