# Codex 执行任务说明

请在当前项目中落地 POS Dashboard 顶部 Summary 模块的文档与后端接口契约。

## 一、目标

实现 Dashboard 顶部 8 张卡片的：

- 产品文档
- 指标口径文档
- API 文档
- FastAPI route
- Pydantic schema
- Swagger/OpenAPI example
- mock / sample payload

## 二、固定字段

顶部 8 张卡固定为：

1. `salesAmount`
2. `orderCount`
3. `avgOrderValue`
4. `salesQuantity`
5. `attachRate`
6. `lowStockSkuCount`
7. `sizeBreakStyleCount`
8. `outOfSeasonStockQty`

不要改名。

## 三、文档输出

请确保以下文件存在：

- [overview.md](./overview.md)
- [summary-metrics.md](./summary-metrics.md)
- [summary-api.md（backend GitHub 链接）](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/dashboard/summary-api.md)
- [interaction-rules.md](./interaction-rules.md)

## 四、接口输出

请新增：

`GET /api/dashboard/summary`

并补齐：

- query params
- response schema
- example response
- Swagger 描述

## 五、联动规则

### 跟日期变化

- salesAmount
- orderCount
- avgOrderValue
- salesQuantity
- attachRate

### 主值恒为当前状态，副值跟周期变化

- lowStockSkuCount
- sizeBreakStyleCount
- outOfSeasonStockQty

## 六、日期预设

- today
- yesterday
- last7days
- last30days
- thisMonth
- lastMonth
- custom

对比规则统一为：当前区间 vs 上一个等长区间

## 七、业务规则

### 缺码款数

以“款色”为单位，若目标尺码集合中任一尺码库存为 0，则记为 1 个缺码款。

### 过季库存件数

当前有库存 SKU 中，若商品季节标签不等于当前销售季，且不属于“四季常规”，则其库存数量计入过季库存件数。

v1 季节标签支持：

- 春夏
- 秋冬
- 四季常规

## 八、实现要求

1. 优先遵循现有项目代码风格
2. 若无真实聚合，先给 mock / stub
3. 文档与 schema 先稳定，再逐步接真实数据
4. 不扩展到毛利、多店、复杂会员分析
