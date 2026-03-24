import type {
  AiAssistantChatRequest,
  AiAssistantChatResponse,
} from '#/types/ai-assistant';

import { requestClient } from './request';

const ASSISTANT_CHAT_PATH = '/api/assistant/chat';

export async function requestAiAssistantReply(params: AiAssistantChatRequest) {
  return requestClient.post<AiAssistantChatResponse>(ASSISTANT_CHAT_PATH, {
    context: params.context ?? undefined,
    prompt: params.prompt,
    recentMessages: params.recentMessages ?? [],
  });
}
