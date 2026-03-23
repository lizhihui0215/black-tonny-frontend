import { expect, test } from '@playwright/test';

import { installDashboardApiMocks } from './support/dashboard-api';
import { loginAsOwner } from './support/login';

test('falls back to local assistant reply when transport fails', async ({
  page,
}) => {
  await installDashboardApiMocks(page, {
    assistantMode: 'failure',
  });
  await loginAsOwner(page);

  const sidebar = page.getByTestId('ai-assistant-sidebar');
  const messages = sidebar.getByTestId('ai-assistant-messages');
  await sidebar.getByTestId('ai-assistant-input').fill('今天先做什么');
  await sidebar.getByTestId('ai-assistant-send').click();

  await expect(messages).toContainText(
    'assistant 接口暂未成功返回，我先基于当前页已加载内容给你一个快速判断：',
  );
  await expect(messages).toContainText('今天先做什么');
  await expect(messages).not.toContainText(
    'DeepSeek 正在整理这页的经营重点...',
  );
});
