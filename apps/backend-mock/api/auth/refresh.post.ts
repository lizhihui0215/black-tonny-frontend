import { defineEventHandler } from 'h3';
import { createMockRefreshTokenResult } from '~/utils/auth-mock';

export default defineEventHandler(() => {
  return createMockRefreshTokenResult();
});
