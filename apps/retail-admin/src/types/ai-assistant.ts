export interface AiAssistantAction {
  note?: string;
  title: string;
}

export interface AiAssistantContext {
  actions?: AiAssistantAction[];
  description?: string;
  guardrails?: string[];
  headline?: string;
  metrics?: string[];
  pageKey: string;
  pageTitle: string;
  prompts?: string[];
  riskPoints?: string[];
  sourceNote?: string;
  staffTips?: string[];
  summary?: string;
}

export interface AiAssistantMessage {
  content: string;
  id: string;
  role: 'assistant' | 'user';
}

export interface AiAssistantChatResponse {
  grounded: boolean;
  provider: string;
  reply: string;
}
