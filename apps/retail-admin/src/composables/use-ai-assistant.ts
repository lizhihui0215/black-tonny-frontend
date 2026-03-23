import type {
  AiAssistantContext,
  AiAssistantMessage,
} from '#/types/ai-assistant';

import { computed, reactive } from 'vue';

import { requestAiAssistantReply } from '#/api';

interface AiAssistantState {
  context: AiAssistantContext | null;
  isOpen: boolean;
  messages: AiAssistantMessage[];
  pending: boolean;
}

const DEFAULT_PROMPTS = [
  '今天先做什么',
  '为什么这是当前重点',
  '给店员怎么同步',
  '有哪些风险需要先盯',
];

const state = reactive<AiAssistantState>({
  context: null,
  isOpen: true,
  messages: [],
  pending: false,
});

let messageSeed = 0;

function createMessage(
  role: AiAssistantMessage['role'],
  content: string,
): AiAssistantMessage {
  messageSeed += 1;
  return {
    content,
    id: `ai-assistant-${messageSeed}`,
    role,
  };
}

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function pickPromptMatches(items: string[], prompt: string) {
  const normalized = cleanText(prompt);
  const keywords = ['补货', '会员', '去化', '库存', '店员', '清货', '风险'];
  const matchedKeyword = keywords.find((keyword) => normalized.includes(keyword));

  if (!matchedKeyword) {
    return items;
  }

  const matchedItems = items.filter((item) => item.includes(matchedKeyword));
  return matchedItems.length > 0 ? matchedItems : items;
}

function buildWelcomeMessage(context: AiAssistantContext) {
  const prompts = (context.prompts?.length ? context.prompts : DEFAULT_PROMPTS)
    .slice(0, 3)
    .join('、');
  const summary = cleanText(
    context.summary || context.description || '我会优先引用当前页已经加载的数据。',
  );

  return `这里是右侧 DeepSeek 助手，当前挂在「${context.pageTitle}」页面。我只基于这页已加载的内容回答，不会自己重算指标。${summary} 你可以先问我：${prompts}。`;
}

function buildActionReply(context: AiAssistantContext, prompt: string) {
  const lines = (context.actions ?? []).map((item) =>
    item.note ? `${item.title} ${item.note}` : item.title,
  );
  const matched = pickPromptMatches(lines, prompt).slice(0, 3);

  if (matched.length === 0) {
    return buildFallbackReply(context);
  }

  return [
    `${context.pageTitle}这页我建议先按这个顺序推进：`,
    ...matched.map((item, index) => `${index + 1}. ${item}`),
    context.summary ? `判断依据：${cleanText(context.summary)}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildRiskReply(context: AiAssistantContext, prompt: string) {
  const matched = pickPromptMatches(context.riskPoints ?? [], prompt).slice(0, 3);

  if (matched.length === 0) {
    return buildFallbackReply(context);
  }

  return [
    '当前最该先盯的风险点有：',
    ...matched.map((item, index) => `${index + 1}. ${item}`),
    context.sourceNote ? `数据提示：${context.sourceNote}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildStaffReply(context: AiAssistantContext) {
  const tips = (context.staffTips ?? []).slice(0, 3);

  if (tips.length === 0) {
    return buildFallbackReply(context);
  }

  return [
    '如果你要拿这页内容去开晨会，我建议这样同步：',
    ...tips.map((item, index) => `${index + 1}. ${item}`),
  ].join('\n');
}

function buildGuardrailReply(context: AiAssistantContext) {
  const lines = (context.guardrails ?? []).slice(0, 4);

  if (lines.length === 0 && !context.sourceNote) {
    return buildFallbackReply(context);
  }

  return [
    '这块我会按下面的边界来回答：',
    ...lines.map((item, index) => `${index + 1}. ${item}`),
    context.sourceNote ? `当前上下文：${context.sourceNote}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildMetricReply(context: AiAssistantContext) {
  const metrics = (context.metrics ?? []).slice(0, 4);

  if (metrics.length === 0) {
    return buildFallbackReply(context);
  }

  return [
    `这页我会先抓这几条核心信息：`,
    ...metrics.map((item, index) => `${index + 1}. ${item}`),
    context.summary ? `整体判断：${cleanText(context.summary)}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildFallbackReply(context: AiAssistantContext) {
  const metrics = (context.metrics ?? []).slice(0, 3);

  return [
    `我现在拿到的是「${context.pageTitle}」页面上下文。`,
    context.headline ? `当前主判断：${cleanText(context.headline)}` : '',
    context.summary
      ? `补充说明：${cleanText(context.summary)}`
      : context.description
        ? `补充说明：${cleanText(context.description)}`
        : '',
    metrics.length > 0 ? `先看：${metrics.join('；')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function resolveAssistantReply(
  prompt: string,
  context: AiAssistantContext | null,
) {
  if (!context) {
    return 'DeepSeek 面板已经打开，但当前页面还没把业务上下文传进来。你可以先切到经营页面，或者问我“今天先看什么”。';
  }

  const normalized = cleanText(prompt);

  if (/今天|先做|优先|动作|安排/.test(normalized)) {
    return buildActionReply(context, normalized);
  }

  if (/为什么|原因|重点|风险|异常/.test(normalized)) {
    return buildRiskReply(context, normalized);
  }

  if (/店员|晨会|话术|同步/.test(normalized)) {
    return buildStaffReply(context);
  }

  if (/数据|口径|可信|注意/.test(normalized)) {
    return buildGuardrailReply(context);
  }

  if (/指标|数据点|看什么|summary|概览/.test(normalized)) {
    return buildMetricReply(context);
  }

  if (/补货|清货|去化|会员|库存/.test(normalized)) {
    return buildActionReply(context, normalized);
  }

  return buildFallbackReply(context);
}

function buildTransportFallbackReply(
  prompt: string,
  context: AiAssistantContext | null,
) {
  return [
    'assistant 接口暂未成功返回，我先基于当前页已加载内容给你一个快速判断：',
    resolveAssistantReply(prompt, context),
  ].join('\n');
}

function ensureWelcomeMessage(forceReset: boolean = false) {
  if (!state.context) {
    if (forceReset) {
      state.messages = [];
    }
    return;
  }

  if (forceReset || state.messages.length === 0) {
    state.messages = [createMessage('assistant', buildWelcomeMessage(state.context))];
  }
}

export function setAiAssistantContext(context: AiAssistantContext) {
  const pageChanged = state.context?.pageKey !== context.pageKey;
  state.context = context;
  ensureWelcomeMessage(pageChanged);
}

export function resetAiAssistantThread() {
  ensureWelcomeMessage(true);
}

export function openAiAssistant() {
  state.isOpen = true;
}

export function closeAiAssistant() {
  state.isOpen = false;
}

export function toggleAiAssistant(force?: boolean) {
  state.isOpen = typeof force === 'boolean' ? force : !state.isOpen;
}

export async function submitAiAssistantPrompt(prompt: string) {
  const content = cleanText(prompt);

  if (!content || state.pending) {
    return;
  }

  const recentMessages = state.messages
    .filter((message, index) => !(index === 0 && message.role === 'assistant'))
    .slice(-6)
    .map((message) => ({
      content: message.content,
      role: message.role,
    }));

  state.messages.push(createMessage('user', content));
  state.pending = true;

  try {
    const response = await requestAiAssistantReply({
      context: state.context,
      prompt: content,
      recentMessages,
    });
    state.messages.push(createMessage('assistant', response.reply));
  } catch {
    state.messages.push(
      createMessage('assistant', buildTransportFallbackReply(content, state.context)),
    );
  } finally {
    state.pending = false;
  }
}

export function useAiAssistant() {
  return {
    context: computed(() => state.context),
    isOpen: computed(() => state.isOpen),
    messages: computed(() => state.messages),
    pending: computed(() => state.pending),
    prompts: computed(() =>
      state.context?.prompts?.length ? state.context.prompts : DEFAULT_PROMPTS,
    ),
  };
}
