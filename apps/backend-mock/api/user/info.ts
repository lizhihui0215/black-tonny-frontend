import { defineEventHandler, getHeader } from 'h3';
import { verifyMockAccessToken } from '~/utils/auth-mock';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default defineEventHandler((event) => {
  const userInfo = verifyMockAccessToken(getHeader(event, 'Authorization'));
  if (!userInfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(userInfo);
});
