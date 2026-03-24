import { defineEventHandler, readBody } from 'h3';
import { createAssistantChatSuccessFixture } from '~/utils/black-tonny-mock';
import { badRequestResponse, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return badRequestResponse(event, 'Prompt is required.');
  }

  return useResponseSuccess(createAssistantChatSuccessFixture(prompt));
});
