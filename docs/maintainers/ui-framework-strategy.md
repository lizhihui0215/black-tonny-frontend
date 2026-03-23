# UI Framework 策略

这份文档承接官方 `组件库切换` 主题在当前仓库的长期边界。

## 当前结论

当前仓库固定使用 Element Plus。

原因不是单一依赖选择，而是整套基座已经围绕它成立：

- `apps/retail-admin` 明确依赖 `element-plus`
- `@vben/common-ui`、layouts、shared ui kit 已与当前框架组合稳定工作
- 当前业务视觉定制建立在现有 token、styles 和组件层之上

## 维护原则

- 不把“局部组件不顺手”误判成“应该切换 UI framework”
- 如果只是某几个组件能力不够，优先在 shared ui kit 或业务 shared 组件层解决
- 只有当框架级限制已经系统性影响 app、shared package 和 theme chain 时，才进入正式评估

## 如果未来要评估切换

必须同时评估：

- `@vben/common-ui` 与 shared ui kit 的适配成本
- 认证、profile、fallback、layout 等核心页面是否都需要重构
- 主题 token、Tailwind、全局 styles 是否还能稳定复用
- 表单、弹窗、表格、菜单、loading 等基础能力是否都有替代路径
- 对现有业务组件和文档标准的冲击范围

## 当前要求

- 日常开发不要引入“第二套 UI framework”到业务页
- 如果新增第三方组件库，只能作为局部特例，并且必须先解释为什么现有链路不够
