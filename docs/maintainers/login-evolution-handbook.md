# 登录演进手册

这份文档承接官方 `登录` 与 `权限` 主题在当前仓库的当前基线和后续演进边界。

## 当前仓库事实

当前仓库已经有：

- `@vben/access`
- `@vben/stores`
- `_core` 认证页面
- 路由守卫与 access 生成链路
- `apps/backend-mock` auth routes

当前 `apps/retail-admin/src/router/guard.ts` 继续走统一 access bootstrap，但当前开发态登录由 `apps/backend-mock` 提供，而不是 sibling backend。

## 当前判断

当前判断：

- 当前单店主开发态登录继续使用 repo-owned `backend-mock`，并且这是当前仓库的正式标准模式
- 当前仍保留 `frontend access mode`
- 当前不启用 refresh token
- 角色目前固定为 `owner`，但 guard/access/store 链路仍保留未来多角色扩展空间

边界说明：

- 当前 mock 只允许集中收敛在 `apps/backend-mock/api/auth/*` 与 `apps/backend-mock/api/user/info.ts`
- 不允许回到 guard、页面组件或 frontend-local API provider 里临时注入 sample token / sample user
- 当前 mock 登录不再作为登记例外管理，而是作为已文档化的单店主基线维护

## 未来进入生产级登录时必须遵守

- 从 `preferences.ts` 与 access mode 出发设计
- 保持 router meta、access store、user store、request token 处理一致
- 不在页面里各自维护登录态
- 不绕开现有 `_core` auth/access 链路直接平地再起一套

## 推荐演进顺序

1. 继续保持当前 `backend-mock` auth routes 与 guard/access store 一致。
2. 未来如果切回正式登录，先恢复统一 auth provider，再决定是否启用 backend token 与 refresh token。
3. 如果未来进入多角色或更细权限模型，继续保留现有 access/router 模型，不单独再造权限体系。
4. 登录契约变化时，同步更新标准文档、审计文档和前后端边界文档。

## 进入正式改造前的必读

- [前端工程标准](../frontend-engineering-standard.md)
- [Vben 对齐审计](../vben-alignment-audit.md)
- sibling backend 的边界文档与 future auth 规划
