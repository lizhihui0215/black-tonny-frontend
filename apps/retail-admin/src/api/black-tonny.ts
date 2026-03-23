import type {
  BlackTonnyManifest,
  BlackTonnyPageKey,
  BlackTonnyPayload,
  DashboardSummaryPreset,
  DashboardSummaryResponse,
} from '#/types/black-tonny';

import { requestClient } from './request';

const MANIFEST_PATH = '/api/manifest';
const DASHBOARD_SUMMARY_PATH = '/api/dashboard/summary';

export async function loadBlackTonnyManifest() {
  return requestClient.get<BlackTonnyManifest>(MANIFEST_PATH);
}

export async function loadBlackTonnyPayload(pageKey: BlackTonnyPageKey) {
  const manifest = await loadBlackTonnyManifest();
  const pagePath = manifest.available_pages?.[pageKey];
  if (!pagePath) {
    throw new Error(`Page "${pageKey}" not found in manifest.`);
  }
  const payload = await requestClient.get<BlackTonnyPayload>(pagePath);
  return {
    manifest,
    payload,
  };
}

export async function loadDashboardSummary(params: {
  endDate?: string;
  preset: DashboardSummaryPreset;
  startDate?: string;
}) {
  const query = {
    preset: params.preset,
    ...(params.startDate ? { start_date: params.startDate } : {}),
    ...(params.endDate ? { end_date: params.endDate } : {}),
  };

  return requestClient.get<DashboardSummaryResponse>(DASHBOARD_SUMMARY_PATH, {
    params: query,
  });
}
