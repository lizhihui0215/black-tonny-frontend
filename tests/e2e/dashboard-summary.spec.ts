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
  const initialSummaryRequestCount = api.summaryRequests.length;

  await page.getByTestId('date-range-trigger').click();
  const quickYesterday = page.getByTestId('date-range-quick-yesterday');
  await expect(quickYesterday).toBeVisible();
  await quickYesterday.click({
    force: true,
  });
  await page.getByTestId('date-range-apply').click({
    force: true,
  });
  await expect
    .poll(() => api.summaryRequests.length)
    .toBeGreaterThan(initialSummaryRequestCount);
  await expect(primarySummary).toContainText('¥3,720');
});
