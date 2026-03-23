import type {
  AiAssistantChatResponse,
  AiAssistantContext,
  AiAssistantMessage,
} from '#/types/ai-assistant';

import { requestClient } from './request';

const ASSISTANT_CHAT_PATH = '/api/assistant/chat';

export async function requestAiAssistantReply(params: {
  context: AiAssistantContext | null;
  prompt: string;
  recentMessages?: Array<Pick<AiAssistantMessage, 'content' | 'role'>>;
}) {
  return requestClient.post<AiAssistantChatResponse>(ASSISTANT_CHAT_PATH, {
    context: params.context ?? undefined,
    prompt: params.prompt,
    recentMessages: params.recentMessages ?? [],
  });
}
