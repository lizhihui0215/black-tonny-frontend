import type { EventHandlerRequest, H3Event } from 'h3';

import { setResponseStatus } from 'h3';

import { createApiErrorEnvelope, createApiSuccessEnvelope } from './envelope';

export { createApiErrorEnvelope, createApiSuccessEnvelope } from './envelope';

export function useResponseSuccess<T>(data: T, message = 'ok') {
  return createApiSuccessEnvelope(data, message);
}

export function badRequestResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Bad Request',
) {
  setResponseStatus(event, 400);
  return createApiErrorEnvelope(400, message);
}

export function forbiddenResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Forbidden',
) {
  setResponseStatus(event, 403);
  return createApiErrorEnvelope(403, message);
}

export function notFoundResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Not Found',
) {
  setResponseStatus(event, 404);
  return createApiErrorEnvelope(404, message);
}

export function unAuthorizedResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Unauthorized',
) {
  setResponseStatus(event, 401);
  return createApiErrorEnvelope(401, message);
}
