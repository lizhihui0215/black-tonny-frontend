# 产品文档入口

状态：`Working doc`

这组文档用于从产品和方案视角介绍 Black Tonny 系统，而不是解释某个单独页面或组件的实现细节。

它们主要服务两类场景：

- 对客户或合作方介绍系统是什么、能解决什么问题
- 内部做方案沟通、交付说明和产品能力边界说明

## 1. 文档分工

- [平台总体介绍](./platform-overview.md)
  - 面向客户和合作方
  - 更强调系统定位、适用对象、核心价值和当前能力边界
- [平台方案说明](./platform-solution-brief.md)
  - 面向更深入沟通场景
  - 更强调业务流程、数据链路、实施方式和当前交付边界

## 2. 状态表达规则

产品文档里的能力必须固定区分为三类：

- `已具备`
- `已在建设中`
- `规划中`

禁止把仍在研究、回证或准入评估中的能力写成已经稳定交付。

同时要固定区分两类信息来源：

- 产品能力与方案表达，以这组产品文档为入口
- 数据路线成熟度、`capture` 准入状态、ERP 研究结论，以 backend 的状态板和路线注册表为准

当前最重要的 backend 入口是：

- [Optional sibling backend ERP maturity board (local workspace link)](../../../black-tonny-backend/docs/erp/api-maturity-board.md)
- [Optional sibling backend capture route registry (local workspace link)](../../../black-tonny-backend/docs/erp/capture-route-registry.md)

## 3. 延伸阅读

- [文档总图](../document-map.md)
- [Frontend Docs Index](../README.md)
- [dashboard 产品总览](../dashboard/overview.md)
- [dashboard 指标定义](../dashboard/summary-metrics.md)
- [Optional sibling backend ERP maturity board (local workspace link)](../../../black-tonny-backend/docs/erp/api-maturity-board.md)
