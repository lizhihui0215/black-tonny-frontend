import { expect, test } from '@playwright/test';

import { installDashboardApiMocks } from './support/dashboard-api';
import { loginAsOwner } from './support/login';

test('refreshes dashboard summary when compact date range changes', async ({
  page,
}) => {
  const api = await installDashboardApiMocks(page);
  await loginAsOwner(page);

  const primarySummary = page.getByTestId('dashboard-summary-primary');

  await expect(primarySummary).toContainText('¥32,680');
  await expect.poll(() => api.summaryRequests.length).toBeGreaterThan(0);

  await page.getByTestId('date-range-trigger').click();
  const quickYesterday = page.getByTestId('date-range-quick-yesterday');
  await expect(quickYesterday).toBeVisible();
  await quickYesterday.click({
    force: true,
  });
  await page.getByTestId('date-range-apply').click({
    force: true,
  });
  await expect.poll(() => {
    const requestUrl = api.summaryRequests.at(-1) ?? '';
    return (
      requestUrl.includes('preset=yesterday') ||
      (requestUrl.includes('preset=custom') &&
        requestUrl.includes('start_date=2026-03-21') &&
        requestUrl.includes('end_date=2026-03-21'))
    );
  }).toBe(true);
  await expect(primarySummary).toContainText('¥3,720');
});
