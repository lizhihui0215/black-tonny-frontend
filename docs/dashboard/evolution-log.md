# Dashboard 演进记录

## 1. 背景与目标

这份文档用于记录 Dashboard 主线已经如何演进、当前停在哪一层、后续建议怎么继续推进。

它不是新的产品规范，也不替代现有 Dashboard 核心文档。

对 Dashboard 而言，文档职责继续保持：

- [overview.md](./overview.md) 负责产品目标与页面结构
- [summary-metrics.md](./summary-metrics.md) 负责顶部 8 张卡的业务口径
- [interaction-rules.md](./interaction-rules.md) 负责日期联动与前后端职责边界
- [summary-analysis-logic.md](./summary-analysis-logic.md) 负责指标之间的经营解释
- backend [summary-api.md（GitHub 链接）](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/dashboard/summary-api.md) 负责 `/api/dashboard/summary` 的接口契约

本文件只回答 3 个问题：

1. 已经做到了哪一步
2. 当前有哪些明确边界
3. 下一步应该按什么顺序推进

---

## 2. 当前已完成

### 2.1 顶部 8 张卡口径已固定

Dashboard 顶部 summary 已明确固定为以下 8 个指标：

1. `salesAmount`
2. `orderCount`
3. `avgOrderValue`
4. `salesQuantity`
5. `attachRate`
6. `lowStockSkuCount`
7. `sizeBreakStyleCount`
8. `outOfSeasonStockQty`

当前前后端文档、后端 schema、sample payload 都围绕这 8 个字段对齐，不再使用通用演示页里的卡片语义。

### 2.2 日期选择器交互已收口

Dashboard 右上角日期筛选已经围绕 summary 主线收口，支持：

- `today`
- `yesterday`
- `last7days`
- `last30days`
- `thisMonth`
- `lastMonth`
- `custom`

当前采用统一筛选状态：

- `preset`
- `startDate`
- `endDate`
- `compareStartDate`
- `compareEndDate`

summary 主值、副值以及对比区间逻辑已按“当前区间 vs 上一个等长区间”统一。

### 2.3 DreamsPOS 视觉参考的顶部 / 侧栏改造已落一轮

Dashboard 当前页面视觉参考了 DreamsPOS 的布局和氛围，但已经明确区分：

- DreamsPOS 只作为视觉和交互参考
- Black Tonny 的业务指标命名、字段语义、接口契约不再跟随演示模板

目前已完成的视觉层演进主要包括：

- 顶部 header 与搜索 / 操作区的风格调整
- 左侧侧栏的收起 / 展开交互靠拢目标页
- summary 区域视觉与当前业务页语言统一

### 2.4 文档与 `/api/dashboard/summary` 契约已对齐

当前文档与接口契约已经完成一轮收口：

- 前端文档负责产品口径与交互规则
- 后端文档与 FastAPI schema 负责接口契约
- `attachRate` 与 3 个库存风险指标的 `subText` 规则已统一
- 日期预设与对比规则已统一

### 2.5 前端顶部 8 卡已接真实 summary 接口

Dashboard 顶部 8 张卡当前已经不再依赖 DreamsPOS 风格的 mock 语义，而是直接消费：

- `GET /api/dashboard/summary`

当前页面通过固定卡片配置表映射后端字段，避免在模板里散写业务判断。

这意味着“顶部 8 张卡 = 文档定义 = 后端契约 = 前端展示”已经形成一条稳定主线。

---

## 3. 当前明确不动

当前主线已经不再只稳住 Dashboard 顶部 8 张卡，以下内容仍然明确不在这轮范围：

- shared `page-shell` 体系下的其他业务页
- `/details`
- `/monthly`
- `/quarterly`
- `/relationship`

也就是说，当前不要求：

- 立刻为 dashboard 再造第二套独立页面壳
- 立刻为 dashboard 下半部分拆更多专属接口
- 立刻把 serving 侧所有 sample/cache fallback 一次性清空

这条边界是刻意保留的，目的是让 dashboard 顶部保留专属表达，同时让下半部分回到正式 payload-driven shared sections，而不是再次回到 page-level mock。

---

## 4. 现状边界

### 4.1 dashboard 下半部分已回到正式 payload 驱动

当前页面下半部分已经不再依赖前端 runtime page-level mock builder，而是回到：

1. `GET /api/manifest`
2. `GET /api/pages/dashboard`
3. shared `page-shell` 区块渲染链路

也就是说，dashboard 当前只保留顶部 hero + summary 的专属壳，下半部分已经重新并回正式页面数据主线。

### 4.2 backend summary 仍允许 sample/cache fallback

后端 `/api/dashboard/summary` 已具备稳定契约，但当前数据主链路仍允许：

1. 优先读 `data/cache/dashboard_summary.json`
2. 不存在时回退到 `data/sample/dashboard_summary.json`

这意味着接口已经可前后端稳定联调，但 serving 侧当前仍应理解为可演进投影层，真实聚合与表结构都还可以后续逐步调整。

### 4.3 `/api/pages/dashboard` 已重新纳入主线

当前 dashboard 仍然由 `/api/dashboard/summary` 驱动顶部 8 卡，但下半部分区块已经重新依赖 `/api/pages/dashboard`。

后续如果还要继续增强 dashboard，不应该再回到整页 mock，而是继续在 `summary API + page payload` 这两条正式链路上演进。

---

## 5. 后续演进顺序

建议按以下顺序继续推进，而不是并行发散：

### 第一步：稳住顶部 8 卡

优先继续稳定以下内容：

- 文档口径
- summary API 契约
- 顶部日期筛选联动
- 顶部 8 卡在页面中的展示与空态

只要这条主线没再漂移，就先不要把注意力扩散到整页所有模块。

### 第二步：继续让下半部分 payload 更业务化

顶部 8 卡已经稳定、下半部分也已回到正式 payload 主线后，再逐块评估：

- 销售趋势
- 热销商品 / 热销尺码
- 库存风险
- 会员概览

是继续复用 page payload、补充 shared panel 映射，还是有必要拆成单独接口。

### 第三步：再接真实 serving 聚合替代 sample fallback

当 serving 侧对 summary 足够稳定后，再逐步把 `/api/dashboard/summary` 从 sample/cache fallback 切到真实 MySQL serving 数据。

这一步属于数据层收口，不影响前端字段契约。

这里的前提不是“先把最终标准库一次设计完”，而是先让 serving 作为当前 API 的投影层逐步成熟。

---

## 6. 文档关系图

当前建议把 Dashboard 文档理解成下面这张“职责关系图”：

### 前端产品与业务口径

- [overview.md](./overview.md)
  - 回答 Dashboard 是什么、页面目标是什么、模块结构是什么
- [summary-metrics.md](./summary-metrics.md)
  - 回答顶部 8 张卡各自的业务定义、单位、公式和副文案规则
- [interaction-rules.md](./interaction-rules.md)
  - 回答日期筛选怎么联动、哪些指标主值变化、哪些指标主值恒为当前值
- [summary-analysis-logic.md](./summary-analysis-logic.md)
  - 回答这些指标应该如何一起理解，分别反映哪些经营问题

### 后端接口契约

- [summary-api.md（backend GitHub 链接）](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/dashboard/summary-api.md)
  - 负责 `/api/dashboard/summary` 的参数、返回结构、字段说明和示例响应

### 本文档

- [evolution-log.md](./evolution-log.md)
  - 只负责记录 Dashboard 主线“已经怎么演进过、当前停在哪、下一步怎么接”
  - 不重复定义指标字段，不替代产品规范或 API 契约

---

## 7. 当前主线结论

截至当前阶段，Dashboard 的主线结论是：

1. 先稳住顶部 8 张卡
2. 其他模块后续慢慢演进
3. 视觉可以继续参考 DreamsPOS
4. 业务指标定义和数据契约必须以 Black Tonny 自己的文档与接口为准
