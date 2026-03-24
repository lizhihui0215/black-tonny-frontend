import { expect, test } from '@playwright/test';

import { installDashboardApiMocks } from './support/dashboard-api';
import { loginAsOwner } from './support/login';

test('supports sidebar toggle, prompt click, and composer send on dashboard', async ({
  page,
}) => {
  await installDashboardApiMocks(page);
  await loginAsOwner(page);

  const sidebar = page.getByTestId('ai-assistant-sidebar');
  const toggle = page.getByTestId('ai-assistant-toggle');
  const messages = sidebar.getByTestId('ai-assistant-messages');
  const prompts = sidebar.getByTestId('ai-assistant-prompts');
  const input = sidebar.getByTestId('ai-assistant-input');

  await expect(sidebar).toHaveAttribute('data-open', 'true');
  await toggle.click();
  await expect(sidebar).toHaveAttribute('data-open', 'false');
  await toggle.click();
  await expect(sidebar).toHaveAttribute('data-open', 'true');

  await prompts.getByRole('button', { name: '今天先看什么' }).click();
  await expect(messages).toContainText('今天先看什么');
  await expect(messages).toContainText('backend-mock reply：今天先看什么');

  await input.fill('帮我总结今天重点');
  await sidebar.getByTestId('ai-assistant-send').click();

  await expect(messages).toContainText('帮我总结今天重点');
  await expect(messages).toContainText('backend-mock reply：帮我总结今天重点');
});
