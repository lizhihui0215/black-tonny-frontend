import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Page, Route } from '@playwright/test';

import { createDashboardSummaryFixture } from '../fixtures/dashboard-summary';

type AssistantMode = 'failure' | 'success';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const dataRoot = resolve(repoRoot, 'tests/e2e/fixtures/pages');
const manifestFixture = readJsonFile<Record<string, any>>('manifest.json');

function readJsonFile<T>(fileName: string): T {
  const absolutePath = resolve(dataRoot, fileName);
  return JSON.parse(readFileSync(absolutePath, 'utf8')) as T;
}

function createEnvelope(data: unknown, message = 'ok') {
  return {
    code: 0,
    data,
    message,
  };
}

function createManifestFixture() {
  const availablePages = Object.fromEntries(
    Object.keys(manifestFixture.available_pages ?? {}).map((pageKey) => [
      pageKey,
      `/api/pages/${pageKey}`,
    ]),
  );

  return {
    ...manifestFixture,
    available_pages: availablePages,
  };
}

function readPagePayload(pageKey: string) {
  const absolutePath = resolve(dataRoot, `${pageKey}.json`);

  if (!existsSync(absolutePath)) {
    return null;
  }

  return JSON.parse(readFileSync(absolutePath, 'utf8'));
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    body: JSON.stringify(body),
    contentType: 'application/json; charset=utf-8',
    status,
  });
}

export async function installDashboardApiMocks(
  page: Page,
  options: {
    assistantMode?: AssistantMode;
  } = {},
) {
  const summaryRequests: string[] = [];
  const assistantMode = options.assistantMode ?? 'success';

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname, searchParams } = url;
    const normalizedPathname = pathname.replace(/\/+$/, '') || '/';

    if (request.method() === 'GET' && normalizedPathname.endsWith('/api/manifest')) {
      await fulfillJson(route, createEnvelope(createManifestFixture()));
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.includes('/api/pages/')
    ) {
      const pageKey = normalizedPathname.split('/').pop() ?? '';
      const payload = readPagePayload(pageKey);

      if (!payload) {
        await fulfillJson(route, {
          code: 404,
          data: null,
          message: `E2E fixture for page "${pageKey}" not found.`,
        }, 404);
        return;
      }

      await fulfillJson(route, createEnvelope(payload));
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.endsWith('/api/dashboard/summary')
    ) {
      summaryRequests.push(url.toString());
      await fulfillJson(
        route,
        createEnvelope(createDashboardSummaryFixture(searchParams)),
      );
      return;
    }

    if (
      request.method() === 'POST' &&
      normalizedPathname.endsWith('/api/assistant/chat')
    ) {
      if (assistantMode === 'failure') {
        await fulfillJson(
          route,
          {
            code: 500,
            data: null,
            message: 'E2E assistant fixture failure',
          },
          500,
        );
        return;
      }

      const rawBody = request.postData() ?? '{}';
      const payload = JSON.parse(rawBody) as { prompt?: string };
      const prompt = String(payload.prompt ?? '').trim();

      await fulfillJson(
        route,
        createEnvelope({
          grounded: true,
          provider: 'e2e-fixture',
          reply: `E2E fixture reply：${prompt}`,
        }),
      );
      return;
    }

    await fulfillJson(
      route,
      {
        code: 404,
        data: null,
        message: `Unhandled E2E mock for ${request.method()} ${normalizedPathname}`,
      },
      404,
    );
  });

  return {
    summaryRequests,
  };
}
