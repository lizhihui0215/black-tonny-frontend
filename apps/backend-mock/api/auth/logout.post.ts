import { defineEventHandler } from 'h3';
import { createMockLogoutResult } from '~/utils/auth-mock';
import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(() => {
  return useResponseSuccess(createMockLogoutResult());
});
