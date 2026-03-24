import { defineEventHandler, readBody } from 'h3';
import { createMockLoginResult } from '~/utils/auth-mock';
import {
  badRequestResponse,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password) {
    return badRequestResponse(event, 'Username and password are required.');
  }

  const loginResult = createMockLoginResult({ password, username });
  if (!loginResult) {
    return unAuthorizedResponse(event, 'Invalid username or password.', {
      code: 40120,
    });
  }

  return useResponseSuccess(loginResult);
});
