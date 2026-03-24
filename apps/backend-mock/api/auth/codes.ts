import { defineEventHandler, getHeader } from 'h3';
import { getMockAccessCodes, requireMockFrontendUser } from '~/utils/auth-mock';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default defineEventHandler((event) => {
  const authResult = requireMockFrontendUser(getHeader(event, 'Authorization'));
  if (!authResult.ok) {
    return unAuthorizedResponse(event, authResult.message, {
      code: authResult.code,
    });
  }

  return useResponseSuccess(getMockAccessCodes());
});
