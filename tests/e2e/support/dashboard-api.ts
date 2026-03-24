import type { Page, Route } from '@playwright/test';

import type { AiAssistantChatRequest } from '../../../apps/retail-admin/src/types/ai-assistant';

import {
  AUTH_MOCK_API_PATHS,
  createMockLoginResult,
  createMockLogoutResult,
  createMockRefreshTokenResult,
  getMockAccessCodes,
  requireMockFrontendUser,
} from '../../../apps/backend-mock/utils/auth-mock';
import {
  BLACK_TONNY_MOCK_API_PATHS,
  createAssistantChatSuccessFixture,
  createDashboardSummaryFixture,
  createManifestFixture,
  readPagePayload,
} from '../../../apps/backend-mock/utils/black-tonny-mock';
import {
  createApiErrorEnvelope,
  createApiSuccessEnvelope,
} from '../../../apps/backend-mock/utils/envelope';

type AssistantMode = 'failure' | 'success';

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

    if (
      request.method() === 'POST' &&
      normalizedPathname.endsWith(AUTH_MOCK_API_PATHS.login)
    ) {
      const rawBody = request.postData() ?? '{}';
      const payload = JSON.parse(rawBody) as {
        password?: string;
        username?: string;
      };
      const loginResult = createMockLoginResult(payload);

      if (!loginResult) {
        await fulfillJson(
          route,
          createApiErrorEnvelope(40120, 'Invalid username or password.'),
          401,
        );
        return;
      }

      await fulfillJson(route, createApiSuccessEnvelope(loginResult));
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.endsWith(AUTH_MOCK_API_PATHS.accessCodes)
    ) {
      const authResult = requireMockFrontendUser(
        request.headers().authorization ?? null,
      );

      if (!authResult.ok) {
        await fulfillJson(
          route,
          createApiErrorEnvelope(authResult.code, authResult.message),
          401,
        );
        return;
      }

      await fulfillJson(route, createApiSuccessEnvelope(getMockAccessCodes()));
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.endsWith(AUTH_MOCK_API_PATHS.userInfo)
    ) {
      const authResult = requireMockFrontendUser(
        request.headers().authorization ?? null,
      );

      if (!authResult.ok) {
        await fulfillJson(
          route,
          createApiErrorEnvelope(authResult.code, authResult.message),
          401,
        );
        return;
      }

      await fulfillJson(route, createApiSuccessEnvelope(authResult.userInfo));
      return;
    }

    if (
      request.method() === 'POST' &&
      normalizedPathname.endsWith(AUTH_MOCK_API_PATHS.logout)
    ) {
      await fulfillJson(
        route,
        createApiSuccessEnvelope(createMockLogoutResult()),
      );
      return;
    }

    if (
      request.method() === 'POST' &&
      normalizedPathname.endsWith(AUTH_MOCK_API_PATHS.refresh)
    ) {
      await fulfillJson(route, createMockRefreshTokenResult());
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.endsWith(BLACK_TONNY_MOCK_API_PATHS.manifest)
    ) {
      await fulfillJson(
        route,
        createApiSuccessEnvelope(createManifestFixture()),
      );
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.includes('/api/pages/')
    ) {
      const pageKey = normalizedPathname.split('/').pop() ?? '';
      const payload = readPagePayload(pageKey);

      if (!payload) {
        await fulfillJson(
          route,
          createApiErrorEnvelope(
            404,
            `E2E fixture for page "${pageKey}" not found.`,
          ),
          404,
        );
        return;
      }

      await fulfillJson(route, createApiSuccessEnvelope(payload));
      return;
    }

    if (
      request.method() === 'GET' &&
      normalizedPathname.endsWith(BLACK_TONNY_MOCK_API_PATHS.dashboardSummary)
    ) {
      summaryRequests.push(url.toString());
      await fulfillJson(
        route,
        createApiSuccessEnvelope(createDashboardSummaryFixture(searchParams)),
      );
      return;
    }

    if (
      request.method() === 'POST' &&
      normalizedPathname.endsWith(BLACK_TONNY_MOCK_API_PATHS.assistantChat)
    ) {
      if (assistantMode === 'failure') {
        await fulfillJson(
          route,
          createApiErrorEnvelope(500, 'E2E assistant fixture failure'),
          500,
        );
        return;
      }

      const rawBody = request.postData() ?? '{}';
      const payload = JSON.parse(rawBody) as Partial<AiAssistantChatRequest>;
      const prompt = String(payload.prompt ?? '').trim();

      await fulfillJson(
        route,
        createApiSuccessEnvelope(createAssistantChatSuccessFixture(prompt)),
      );
      return;
    }

    await fulfillJson(
      route,
      createApiErrorEnvelope(
        404,
        `Unhandled E2E mock for ${request.method()} ${normalizedPathname}`,
      ),
      404,
    );
  });

  return {
    summaryRequests,
  };
}
