import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

export async function loginAsOwner(page: Page) {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/auth\/login/, {
    timeout: 20_000,
  });
  await expect(page.getByTestId('login-page')).toBeVisible({
    timeout: 20_000,
  });

  await page
    .locator('input[name="username"], input[placeholder="请输入用户名"]')
    .first()
    .fill('owner');
  await page
    .locator(
      'input[type="password"], input[name="password"], input[placeholder="密码"], input[placeholder="请输入密码"]',
    )
    .first()
    .fill('black-tonny');
  await page.getByLabel('login').click();

  await expect(page).toHaveURL(/\/dashboard$/, {
    timeout: 20_000,
  });
  await expect(page.getByTestId('dashboard-main')).toBeVisible({
    timeout: 20_000,
  });
}
