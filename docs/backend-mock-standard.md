# Backend Mock 标准

状态：`Source of truth`

这份文档定义 `black-tonny-frontend` 当前“前端先用 `vben` 风格 `apps/backend-mock` 定正式接口，再由 sibling backend 按同一路径接棒”的默认做法。

它的目标不是在 frontend runtime 里再造一层假后端，而是把下面这件事收成长期标准：

- backend 路由还没落地时，frontend 仍然可以先推进页面
- mock 必须直接对齐未来正式 `/api/*` 契约
- mock 的正式归宿必须是 `apps/backend-mock`
- E2E 只消费这层 mock，不允许自己再长一套业务接口语义

## 1. 适用范围

适用于：

- 正式业务 `/api/*` 接口的前置 mock 定义
- 单店主开发态登录 mock
- repo-local E2E 与本地联调样本

不适用于：

- 页面内临时演示数据
- 纯视觉 demo 的局部假数据
- backend 已落地后仍想长期停留在 mock 的做法

## 2. 当前正式规范源顺序

如果同一接口同时存在多个材料，按下面顺序判断：

1. 已存在的 backend 契约文档
2. frontend `apps/backend-mock/api/*` 与 `apps/backend-mock/utils/*`
3. frontend `apps/retail-admin/src/api/*` 的正式请求封装
4. `tests/e2e/*` 的 route interception
5. 页面展示代码里的消费方式

也就是说：

- backend 契约文档一旦存在，`backend-mock` 必须跟它走
- backend 契约文档还没落地时，frontend 先在 `apps/backend-mock` 落 mock route、fixture 和 helper
- 不允许反过来让页面组件或 E2E 自己的临时字段成为事实标准

## 3. Mock 必须遵守的硬规则

### 3.1 路径与方法必须直接使用正式目标

- 必须直接使用未来正式 `/api/*` 路径
- 必须使用最终 HTTP method
- 不允许先写 `/mock/*`、`/demo/*`、`/local/*`，后面再整体重命名

### 3.2 成功响应必须遵循标准 envelope

正式业务 mock 的成功响应必须返回：

```json
{
  "code": 0,
  "data": {},
  "message": "ok"
}
```

错误响应允许返回：

```json
{
  "code": 500,
  "data": null,
  "message": "error message"
}
```

并继续配合正常 HTTP status 使用。

### 3.3 request 字段名必须直接对齐最终契约

- query 参数名必须直接用最终名字
- request body 字段名必须直接用最终名字
- 不允许先写 frontend 自己的临时字段，再在接 backend 时二次翻译

例如：

- `GET /api/dashboard/summary` 继续用 `preset`、`start_date`、`end_date`
- `POST /api/assistant/chat` 继续用 `prompt`、`context`、`recentMessages`
- `POST /api/auth/login` 继续用 `username`、`password`

### 3.4 mock 归宿必须受控

允许归宿：

- `apps/backend-mock/api/*`
  - 正式 mock route
- `apps/backend-mock/utils/*`
  - route helper、fixture builder、envelope helper
- `apps/backend-mock/fixtures/*`
  - repo-owned 业务样本
- `tests/e2e/support/*`
  - 只负责 route interception、失败注入和测试驱动
- `docs/*`
  - 作为文档样本或说明材料

禁止归宿：

- `apps/retail-admin/src/api/contracts/*`
- `apps/retail-admin/src/api/core/mock-auth.ts`
- `apps/retail-admin/public/*`
- 页面组件内联 mock
- runtime page-level `*.mock.ts`
- `tests/e2e/fixtures/pages/*`

### 3.5 frontend runtime 与 mock 必须分层

- `apps/retail-admin/src/api/*` 只保留正式请求封装
- `apps/backend-mock/*` 承担 mock route、fixture 和 mock helper
- `tests/e2e/*` 只能复用 `apps/backend-mock`，不能再单独维护一套业务接口定义

## 4. 当前推荐实现分层

当 frontend 需要先定义一条新接口时，默认按这 4 层落：

1. `apps/backend-mock/api/*`
   - 定义 mock route
2. `apps/backend-mock/utils/*`
   - 定义路径常量、fixture builder、auth helper、envelope helper
3. `apps/backend-mock/fixtures/*`
   - 保留 repo-owned 样本 payload
4. `apps/retail-admin/src/api/*`
   - 只保留正式请求代码，直接请求最终 `/api/*`

这样做的好处是：

- 结构上更贴近官方 `vben` 的 `apps/backend-mock`
- 底座依赖可以直接对齐 upstream，例如 `nitropack`、`h3`、`jsonwebtoken`
- runtime 请求层和 mock server 职责清晰分开
- backend 接棒时只需要照同一路径、method、字段名和 envelope 实现
- E2E 不会再慢慢长成另一套业务接口语义

## 5. 当前仓库的标准落点

当前正式 mock 入口已经按这套模式整理：

- [backend-mock package](../apps/backend-mock/package.json)
- [Nitro mock config](../apps/backend-mock/nitro.config.ts)
- [auth mock routes](../apps/backend-mock/api/auth)
- [user info mock route](../apps/backend-mock/api/user/info.ts)
- [manifest / pages / summary mock routes](../apps/backend-mock/api)
- [assistant chat mock route](../apps/backend-mock/api/assistant/chat.post.ts)
- [page payload fixtures](../apps/backend-mock/fixtures/pages)
- [E2E route mock 入口](../tests/e2e/support/dashboard-api.ts)
- [正式请求入口：manifest / pages / summary](../apps/retail-admin/src/api/black-tonny.ts)
- [正式请求入口：assistant chat](../apps/retail-admin/src/api/assistant.ts)
- [正式请求入口：auth / user](../apps/retail-admin/src/api/core)

## 6. 前后端共同推进时的默认流程

### 场景 A：backend 契约还没有

1. frontend 先在 `apps/backend-mock/api/*` 和 `apps/backend-mock/utils/*` 定 mock route
2. frontend 再让 `apps/retail-admin/src/api/*` 直接消费同一条正式 `/api/*`
3. frontend 在对应 area doc 或边界文档里写清楚用途
4. backend 按同一路径、method、字段名和 envelope 实现

### 场景 B：backend 契约已经存在

1. frontend 直接按 backend 契约更新 `backend-mock` 与请求层
2. 如果 mock 发现契约不够用，先更新契约文档
3. backend 与 frontend 同步变更，不能只改一边

## 7. 登录当前态

当前单店主开发态登录也属于这套标准的一部分：

- frontend login form 继续走官方 `_core` auth 页面和 store 链路
- `apps/retail-admin/src/api/core/auth.ts` 与 `user.ts` 继续走正式 `/auth/*`、`/user/info`
- 本地 mock 由 `apps/backend-mock/api/auth/*` 和 `apps/backend-mock/api/user/info.ts` 提供
- 不允许再回到 guard、页面或本地 API provider 内部硬编码 sample token / sample user

## 8. 与 backend 的协作边界

- frontend 可以先通过 `backend-mock` 定义契约
- backend 文档一旦成型，backend 契约文档仍是长期规范源
- `backend-mock` 只是前置契约实现和联调样本，不是长期替代 backend 的业务真源

当前跨仓边界见：

- [frontend 工程标准](./frontend-engineering-standard.md)
- [sibling backend 前后端边界文档（GitHub 链接）](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/frontend-backend-boundary.md)
- [sibling backend API 响应标准（GitHub 链接）](https://github.com/lizhihui0215/black-tonny-backend/blob/main/docs/api-response-standard.md)

## 9. 反模式

下面这些做法都不符合当前标准：

- 在 `apps/retail-admin/src/api/contracts/*` 再维护一层 contract helper
- 在 `tests/e2e/fixtures/pages/*` 继续存正式业务页面样本
- 在 `apps/retail-admin/src/api/core/mock-auth.ts` 继续维护本地登录 provider
- mock 成功响应不带 `{ code, data, message }`
- backend 接口落地后，frontend 还继续偷偷吃旧 mock 字段
- 为了联调，把样本重新放回 app runtime `public/`
- 在页面组件里直接拼业务 mock 数据
