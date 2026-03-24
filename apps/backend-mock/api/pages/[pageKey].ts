import { defineEventHandler, getRouterParam } from 'h3';
import { readPagePayload } from '~/utils/black-tonny-mock';
import { notFoundResponse, useResponseSuccess } from '~/utils/response';

export default defineEventHandler((event) => {
  const pageKey = getRouterParam(event, 'pageKey') ?? '';
  const payload = readPagePayload(pageKey);
  if (!payload) {
    return notFoundResponse(event, `Page fixture "${pageKey}" not found.`);
  }

  return useResponseSuccess(payload);
});
