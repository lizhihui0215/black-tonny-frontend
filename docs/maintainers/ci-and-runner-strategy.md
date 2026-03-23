# CI 与 Runner 策略

这份文档是 `black-tonny-frontend` 在 `CI / runner` 选型上的维护侧规范源。

它只回答两件事：

- 当前仓库在持续集成平台上应该优先选什么
- 当免费额度、账号验证、平台可用性和现金成本冲突时，应该怎么决策

它不是页面开发规范，也不替代 [前端工程标准](../frontend-engineering-standard.md)。

## 1. 当前决策原则

截至 `2026-03-23`，当前仓库固定按下面顺序评估 `CI / runner` 方案：

1. 真实可用性
2. 总现金成本
3. 维护复杂度
4. 与当前仓库结构的贴合度

固定规则：

- 优先“最省钱且真实可用”的方案，而不是“名义免费额度最高”的方案。
- 如果某个平台的免费层因为信用卡验证、账号限制、区域可用性、托管位置不匹配，或者其他政策原因导致实际不好用，它就不作为主方向。
- 不为了追逐平台免费分钟，反向要求仓库迁移到一个原本不准备使用的托管平台。
- 当前仓库已经有 repo-local 检查主线，平台选择只决定“在哪里跑”，不应反向改写仓库标准。

## 2. 当前优先顺序

### 2.1 当前仓库的默认主方向：`GitHub Actions (GitHub-hosted)`

这是当前仓库在 `2026-03-23` 这次复查后的正式主方向。

原因很直接：

- 当前仓库 `origin` 已经是 `GitHub`
- 当前仓库是公开仓
- GitHub 官方文档明确写明：
  - self-hosted runner 使用免费
  - 公开仓使用标准 GitHub-hosted runner 也免费

对这个仓库的实际含义是：

- 不需要为了“跑 CI”再额外搭一套本地托管平台
- 也不需要因为成本原因优先上单机 self-hosted runner
- 直接使用 GitHub-hosted workflow，就是当前“最省钱且最省事”的方案

当前仓库已经提供的 GitHub workflow：

- [`.github/workflows/frontend-mainline.yml`](../../.github/workflows/frontend-mainline.yml)
- [`.github/workflows/dashboard-e2e.yml`](../../.github/workflows/dashboard-e2e.yml)

使用规则：

- `frontend-mainline.yml` 是默认主线，跑 `pnpm check:mainline`
- `dashboard-e2e.yml` 是 runtime 护栏，跑 `pnpm test:e2e:dashboard`
- 如果后续需要进一步控成本，可以只保留 `frontend-mainline.yml` 常开，把 `dashboard-e2e.yml` 改成手动或路径更窄的触发
- 当前仓库已移除 upstream 模板里那些不再服务本仓的 GitHub workflow，只保留这两条 repo-owned 主线，避免 Actions 页面持续堆积无效自动化噪音

### 2.2 单机本地替代方案：`GitHub self-hosted runner`

如果你明确希望：

- 任务只在自己的机器上执行
- 不希望构建和 E2E 跑在 GitHub-hosted runner 上
- 或者需要本地专属依赖、局域网资源、桌面浏览器环境

那单机 GitHub self-hosted runner 才是当前最直接的次选方案。

这条路线的优点：

- 不需要迁移仓库托管平台
- 继续复用 GitHub 仓库和 `.github/workflows/*`
- 一台机器就可以同时承担开发环境和 runner

这条路线的代价：

- 机器要常开
- 本机睡眠、电源、磁盘清理都会直接影响 CI 稳定性
- 需要维护 runner 进程和本地依赖环境

### 2.3 迁出 GitHub 时的主方向：`Forgejo / Gitea + self-hosted runner`

如果未来仓库不再以 GitHub 为主托管，或者明确想把平台和 runner 都掌握在自己手里，这才是当前最合适的自托管主方向。

适用前提：

- 已经有可常驻的机器，例如本地小主机、NAS、闲置 Linux 机器或低配 VPS
- 团队接受自己维护平台进程和 runner 进程

为什么它仍然重要：

- 平台和 runner 都由自己控制，不按云端分钟持续计费
- 不依赖第三方共享 runner 的政策变化
- 与仓库当前已有的 [`.forgejo/workflows/frontend-mainline.yml`](../../.forgejo/workflows/frontend-mainline.yml) 和 [`.forgejo/workflows/dashboard-e2e.yml`](../../.forgejo/workflows/dashboard-e2e.yml) 模板一致

### 2.4 次方向：`GitLab + self-hosted runner`

当团队希望使用 `GitLab` 仓库体验，但又想压低执行成本时，这是次优选择。

为什么不是主方向：

- 相比 `Forgejo / Gitea`，它更偏“已有 GitLab 使用习惯”的团队
- 如果只是为了跑本仓 CI，平台心智和配置成本通常高于直接走更轻的自托管路径

什么时候可以选它：

- 团队已经在用 `GitLab`
- 愿意维护自己的 runner
- 想保留 `GitLab` 的 MR、权限和项目管理体验

### 2.5 参考/临时方案：`GitLab.com shared runners`

这条路线可以作为临时过渡，但不应视为当前仓库主方向。

截至 `2026-03-23`，`GitLab Free` 官方定价页写的是：

- `400 compute minutes per month`
- 自带 runner 分钟只对 `GitLab.com` 的 shared runners 计量
- 使用自己的 runner 时不消耗这部分分钟，而且官方 FAQ 说明是 `unlimited`

同时官方文档也说明：

- `GitLab.com` 账号可能触发 `identity verification`
- 根据风险评分，验证可能停留在邮箱/手机号，也可能进一步要求信用卡验证
- 某些国家和地区的手机号验证支持有限或不支持

所以本仓固定判断是：

- 如果 shared runners 因验证、地区支持或策略原因不好用，就不作为主方向
- 即使可用，也更适合做“临时起步”或“没有自有 runner 之前的短期方案”

### 2.6 非主方向：`Bitbucket Pipelines`

截至 `2026-03-23`，`Bitbucket Free` 官方定价页写的是：

- `50 minutes per month`

对当前仓库而言，这个额度太小。

本仓现有前端检查通常至少包括：

- `pnpm standards:check`
- `pnpm docs:check`
- `pnpm --filter @black-tonny/retail-admin typecheck`
- `pnpm --filter @black-tonny/retail-admin build`
- `pnpm test:e2e:dashboard`

因此 `Bitbucket Pipelines` 只作为对比参考，不作为当前主方向。

## 3. 对当前仓库的执行建议

### 3.1 如果目标是“最省钱且最快接入”

优先建议：

- 当前仓库直接使用 `GitHub Actions (GitHub-hosted)`

原因：

- 仓库已经在 GitHub
- 当前是公开仓
- 不需要额外搭平台，不需要维护本地 runner

### 3.2 如果目标是“任务必须只在本机执行”

优先建议：

- 继续留在 GitHub，但使用 `GitHub self-hosted runner`

使用前提：

- 这台机器愿意常开
- 接受 runner 跟着本机环境一起维护

### 3.3 如果未来不再依赖 GitHub

优先建议：

- 回到 `Forgejo / Gitea + self-hosted runner`

固定规则：

- 不为了追求“理论上自托管更便宜”，在当前已经有 GitHub 公开仓的前提下反向搭一整套新平台
- 只有在托管平台真的变化时，才把自托管平台重新抬成主方向

## 4. 与仓库标准的关系

- 平台选择属于维护动作，不属于日常页面开发规范
- 真正需要跑什么检查，以 [前端工程标准](../frontend-engineering-standard.md) 和现有脚本为准
- 当前仓库已经沉淀了 repo-local 检查主线，后续无论接哪种平台，都优先复用这些命令，而不是重新发明第二套 CI 逻辑

当前最重要的命令是：

```bash
pnpm check:mainline
pnpm check:runtime
```

仓库当前已经提供两套入口：

- GitHub：
  - [`.github/workflows/frontend-mainline.yml`](../../.github/workflows/frontend-mainline.yml)
  - [`.github/workflows/dashboard-e2e.yml`](../../.github/workflows/dashboard-e2e.yml)
- Forgejo/Gitea：
  - [`.forgejo/workflows/frontend-mainline.yml`](../../.forgejo/workflows/frontend-mainline.yml)
  - [`.forgejo/workflows/dashboard-e2e.yml`](../../.forgejo/workflows/dashboard-e2e.yml)

使用规则：

- GitHub-hosted 版本默认可直接用，不需要改 runner label
- Forgejo/Gitea 版本里的 `runs-on` 仍是占位标签，只有在自托管平台接入时才需要改成你自己的 label

## 5. 当前结论

截至 `2026-03-23`，当前仓库在 `CI / runner` 选型上的正式结论是：

- 当前仓库主方向：`GitHub Actions (GitHub-hosted)`
- 本地执行次方向：`GitHub self-hosted runner`
- 迁出 GitHub 时的主方向：`Forgejo / Gitea + self-hosted runner`
- 继续保留的次方向：`GitLab + self-hosted runner`
- 临时方案：`GitLab.com shared runners`
- 参考但不主推：`Bitbucket Pipelines`

一句话规则：

- 当前仓库最省钱、最省事的办法，是直接用 GitHub-hosted workflow
- 只有在你明确要求“只在本机跑”时，才切到 self-hosted runner

## 6. 官方来源

- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [GitLab Pricing](https://about.gitlab.com/pricing/)
- [GitLab Compute minutes](https://docs.gitlab.com/ee/ci/pipelines/compute_minutes.html)
- [GitLab Identity verification](https://docs.gitlab.com/ee/security/identity_verification.html)
- [Bitbucket Pricing](https://www.atlassian.com/software/bitbucket/pricing)
- [Forgejo Actions](https://forgejo.org/docs/latest/user/actions/actions/)
- [Forgejo Runner installation guide](https://forgejo.org/docs/latest/admin/actions/runner-installation/)
