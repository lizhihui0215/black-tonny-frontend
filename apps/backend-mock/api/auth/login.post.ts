import { defineEventHandler, readBody } from 'h3';
import { createMockLoginResult } from '~/utils/auth-mock';
import {
  badRequestResponse,
  forbiddenResponse,
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
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  return useResponseSuccess(loginResult);
});
