import { expect, test } from '@playwright/test';

import { installDashboardApiMocks } from './support/dashboard-api';
import { loginAsOwner } from './support/login';

test('redirects unauthenticated users to login and renders dashboard after mock login', async ({
  page,
}) => {
  await installDashboardApiMocks(page);

  await loginAsOwner(page);

  await expect(page.getByTestId('dashboard-hero')).toBeVisible();
  await expect(page.getByTestId('dashboard-summary-primary')).toContainText(
    '¥32,680',
  );
  await expect(page.getByTestId('dashboard-summary-secondary')).toBeVisible();
});
