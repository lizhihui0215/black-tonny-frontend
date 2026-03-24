import { defineEventHandler, getQuery } from 'h3';
import { createDashboardSummaryFixture } from '~/utils/black-tonny-mock';
import { useResponseSuccess } from '~/utils/response';

function toSearchParams(query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === undefined) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        params.append(key, value);
      }
      continue;
    }

    params.set(key, rawValue);
  }

  return params;
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  return useResponseSuccess(
    createDashboardSummaryFixture(toSearchParams(query)),
  );
});
