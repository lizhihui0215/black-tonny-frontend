import type { EventHandlerRequest, H3Event } from 'h3';

import { setResponseStatus } from 'h3';

import { createApiErrorEnvelope, createApiSuccessEnvelope } from './envelope';

interface ErrorResponseOptions {
  code?: number;
  statusCode?: number;
}

function useErrorResponse(
  event: H3Event<EventHandlerRequest>,
  defaultStatusCode: number,
  message: string,
  options: ErrorResponseOptions = {},
) {
  const statusCode = options.statusCode ?? defaultStatusCode;

  setResponseStatus(event, statusCode);
  return createApiErrorEnvelope(options.code ?? statusCode, message);
}

export function useResponseSuccess<T>(data: T, message = 'ok') {
  return createApiSuccessEnvelope(data, message);
}

export function badRequestResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Bad Request',
  options?: ErrorResponseOptions,
) {
  return useErrorResponse(event, 400, message, options);
}

export function forbiddenResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Forbidden',
  options?: ErrorResponseOptions,
) {
  return useErrorResponse(event, 403, message, options);
}

export function notFoundResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Not Found',
  options?: ErrorResponseOptions,
) {
  return useErrorResponse(event, 404, message, options);
}

export function unAuthorizedResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Unauthorized',
  options?: ErrorResponseOptions,
) {
  return useErrorResponse(event, 401, message, options);
}
