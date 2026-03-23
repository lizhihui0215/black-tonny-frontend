# 外部模块手册

这份文档承接官方 `外部模块` 主题在当前仓库的引入审查边界。

## 当前结论

当前仓库不把“接入外部模块”视为默认开发路径。

只有在下面情况成立时，才进入正式评估：

- 现有 `vben`、shared package、业务 shared 组件确实不够
- 引入后不会把标准边界打散
- 维护成本小于长期重复自研成本

## 接入前检查清单

1. 它解决的是 app 私有问题，还是跨应用/跨页面问题？
2. 它应该落在：
   - `apps/retail-admin`
   - `packages/*`
   - `internal/*`
3. 它是否与现有：
   - request layer
   - access model
   - theme/token chain
   - shared ui kit
   - Vite/Tailwind/tooling
   冲突？
4. 它是否会制造第二套长期体系？

## 当前仓库的高风险引入方式

- 在业务页直接引入一整套平行 UI 基础
- 用外部模块绕开现有 request/access/theme/layout 体系
- 把本应属于 backend 的能力塞进前端 mock/dev 基础设施里

## 文档要求

只要决定接入外部模块，至少同步更新：

- [前端工程标准](../frontend-engineering-standard.md)
- [官方覆盖清单](../official-doc-coverage-board.md)
- [Vben 对齐审计](../vben-alignment-audit.md)

如果它属于长期维护动作，也要把结论回写进这组 `maintainers/*` 文档。
