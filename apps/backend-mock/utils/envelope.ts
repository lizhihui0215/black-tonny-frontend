export interface ApiErrorEnvelope {
  code: number;
  data: null;
  message: string;
}

export interface ApiSuccessEnvelope<T> {
  code: 0;
  data: T;
  message: string;
}

export function createApiSuccessEnvelope<T>(
  data: T,
  message = 'ok',
): ApiSuccessEnvelope<T> {
  return {
    code: 0,
    data,
    message,
  };
}

export function createApiErrorEnvelope(
  code: number,
  message: string,
): ApiErrorEnvelope {
  return {
    code,
    data: null,
    message,
  };
}
