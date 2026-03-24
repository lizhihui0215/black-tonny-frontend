# 登录演进手册

这份文档承接官方 `登录` 与 `权限` 主题在当前仓库的当前基线和后续演进边界。

## 当前仓库事实

当前仓库已经有：

- `@vben/access`
- `@vben/stores`
- `_core` 认证页面
- 路由守卫与 access 生成链路
- sibling backend 正式 `auth/user` routes
- `apps/backend-mock` auth routes

当前 `apps/retail-admin/src/router/guard.ts` 继续走统一 access bootstrap，正式 auth 契约与 source of truth 已经回到 sibling backend；`apps/backend-mock` 只保留为开发态与 E2E fallback。

## 当前判断

当前判断：

- 当前单店主正式 auth 契约使用 sibling backend `/api/auth/*` 与 `/api/user/info`
- 当前仍保留 `frontend access mode`
- 当前不启用 refresh token
- 角色目前固定为 `owner`，但 guard/access/store 链路仍保留未来多角色扩展空间

边界说明：

- 当前 mock 只允许集中收敛在 `apps/backend-mock/api/auth/*` 与 `apps/backend-mock/api/user/info.ts`，且只作为 dev/test fallback
- 不允许回到 guard、页面组件或 frontend-local API provider 里临时注入 sample token / sample user
- 当前 backend auth 是正式 source of truth；fallback mock 只是已文档化的开发兜底能力，不构成第二套正式 auth 实现

## 未来进入生产级登录时必须遵守

- 从 `preferences.ts` 与 access mode 出发设计
- 保持 router meta、access store、user store、request token 处理一致
- 不在页面里各自维护登录态
- 不绕开现有 `_core` auth/access 链路直接平地再起一套

## 推荐演进顺序

1. 继续保持 sibling backend auth 契约与 frontend guard/access store 一致。
2. `apps/backend-mock` 只作为本地开发或 E2E fallback 跟随正式 auth 契约，不再承载正式运行主线。
3. 如果未来进入多角色或更细权限模型，继续保留现有 access/router 模型，不单独再造权限体系。
4. 登录契约变化时，同步更新标准文档、审计文档和前后端边界文档。

## 进入正式改造前的必读

- [前端工程标准](../frontend-engineering-standard.md)
- [Vben 对齐审计](../vben-alignment-audit.md)
- sibling backend 的边界文档与 future auth 规划
