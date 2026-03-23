<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import {
  resetAiAssistantThread,
  submitAiAssistantPrompt,
  useAiAssistant,
} from '#/composables/use-ai-assistant';

const props = withDefaults(
  defineProps<{
    showClose?: boolean;
  }>(),
  {
    showClose: false,
  },
);

const emit = defineEmits<{
  close: [];
}>();

const BotIcon = createIconifyIcon('lucide:bot');
const CloseIcon = createIconifyIcon('lucide:x');
const ResetIcon = createIconifyIcon('lucide:rotate-ccw');
const SendIcon = createIconifyIcon('lucide:arrow-up');
const SparklesIcon = createIconifyIcon('lucide:sparkles');
const ASSISTANT_NAME = 'DeepSeek';

const { context, messages, pending, prompts } = useAiAssistant();

const draft = ref('');
const messagesRef = ref<HTMLDivElement>();
const panelTitle = computed(() => context.value?.pageTitle || 'DeepSeek 助手');
const panelHeadline = computed(
  () =>
    context.value?.headline ||
    context.value?.summary ||
    context.value?.description ||
    '我会优先基于当前页已经加载的经营内容来回答。',
);
const metrics = computed(() => (context.value?.metrics ?? []).slice(0, 3));
const promptSuggestions = computed(() => prompts.value.slice(0, 4));
const hasUserMessages = computed(() =>
  messages.value.some((message) => message.role === 'user'),
);
const showEmptyState = computed(() => !hasUserMessages.value && !pending.value);
const visibleMessages = computed(() => {
  if (!hasUserMessages.value) {
    return [];
  }

  if (messages.value[0]?.role === 'assistant') {
    return messages.value.slice(1);
  }

  return messages.value;
});
const contextHighlights = computed(() => {
  return [context.value?.sourceNote, ...metrics.value]
    .filter((item): item is string => Boolean(item))
    .slice(0, 3);
});
const helperText = computed(
  () => context.value?.sourceNote || '基于当前页已加载数据回答',
);
const canSubmit = computed(() => draft.value.trim().length > 0);

async function scrollToBottom() {
  await nextTick();
  const container = messagesRef.value;

  if (!container) {
    return;
  }

  container.scrollTo({
    behavior: 'smooth',
    top: container.scrollHeight,
  });
}

async function handleSubmit() {
  const content = draft.value.trim();

  if (!content) {
    return;
  }

  draft.value = '';
  await submitAiAssistantPrompt(content);
  await scrollToBottom();
}

async function handleQuickPrompt(prompt: string) {
  await submitAiAssistantPrompt(prompt);
  await scrollToBottom();
}

watch(
  () => [messages.value.length, pending.value],
  () => {
    void scrollToBottom();
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <section
    class="flex h-full min-w-0 flex-1 flex-col bg-[#fffaf6]"
    data-testid="ai-assistant-panel"
  >
    <header
      class="flex items-start justify-between gap-3 border-b border-[#eedccc] bg-[#fff9f3]/95 px-4 py-2.5 backdrop-blur"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex size-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white shadow-[0_16px_30px_-18px_rgba(245,143,40,0.58)]"
          >
            <BotIcon class="text-[15px]" />
          </span>
          <div class="min-w-0">
            <p
              class="text-[10px] font-semibold tracking-[0.2em] text-[#cf7d2c]"
            >
              {{ ASSISTANT_NAME.toUpperCase() }}
            </p>
            <h2 class="truncate text-[14px] font-semibold text-slate-950">
              {{ panelTitle }}
            </h2>
          </div>
        </div>
        <p class="mt-1 truncate text-[11px] text-slate-500">
          {{ context ? '基于当前页上下文回答' : '等待当前页上下文接入' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex size-[30px] items-center justify-center rounded-xl border border-[#edd7c5] bg-white text-slate-500 transition hover:border-[#f0b27b] hover:bg-[#fff4eb] hover:text-[#c26a1c]"
          type="button"
          @click="resetAiAssistantThread"
        >
          <ResetIcon class="text-[13px]" />
        </button>
        <button
          v-if="props.showClose"
          class="inline-flex size-[30px] items-center justify-center rounded-xl border border-[#edd7c5] bg-white text-slate-500 transition hover:border-[#f0b27b] hover:bg-[#fff4eb] hover:text-[#c26a1c]"
          type="button"
          @click="emit('close')"
        >
          <CloseIcon class="text-[13px]" />
        </button>
      </div>
    </header>

    <div
      ref="messagesRef"
      class="flex-1 overflow-y-auto px-4 py-4"
      data-testid="ai-assistant-messages"
    >
      <div
        v-if="showEmptyState"
        class="flex min-h-full flex-col justify-center gap-4 py-2"
      >
        <article
          class="rounded-[24px] border border-[#efd8c5] bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ed_100%)] p-4 shadow-[0_24px_54px_-42px_rgba(201,106,28,0.34)]"
        >
          <div class="flex items-start gap-3">
            <span
              class="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white shadow-[0_18px_36px_-24px_rgba(245,143,40,0.55)]"
            >
              <BotIcon class="text-[15px]" />
            </span>

            <div class="min-w-0">
              <p
                class="text-[10px] font-semibold tracking-[0.22em] text-[#cf7d2c]"
              >
                {{ ASSISTANT_NAME.toUpperCase() }} CHAT
              </p>
              <h3 class="mt-1 text-[16px] font-semibold text-slate-950">
                先从这页开始聊
              </h3>
              <p class="mt-2 text-[13px] leading-6 text-slate-600">
                {{ panelHeadline }}
              </p>
            </div>
          </div>

          <div
            v-if="contextHighlights.length"
            class="mt-4 flex flex-wrap gap-2"
          >
            <span
              v-for="item in contextHighlights"
              :key="item"
              class="inline-flex max-w-full rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-[#9b6a3f] shadow-[0_14px_24px_-24px_rgba(15,23,42,0.32)]"
            >
              <span class="truncate">{{ item }}</span>
            </span>
          </div>
        </article>

        <section
          class="rounded-[22px] border border-[#f0dfd1] bg-white/88 p-3.5 shadow-[0_24px_52px_-44px_rgba(15,23,42,0.22)]"
          data-testid="ai-assistant-prompts"
        >
          <div class="flex items-center justify-between gap-3">
            <div
              class="flex min-w-0 items-center gap-2 text-[10px] font-semibold text-[#b36a23]"
            >
              <SparklesIcon class="shrink-0 text-[13px] text-[#d97706]" />
              <span class="truncate">{{ ASSISTANT_NAME }} 建议提问</span>
            </div>
            <span class="shrink-0 text-[10px] text-slate-400"
              >点一下直接发问</span
            >
          </div>

          <div class="mt-3 grid gap-2">
            <button
              v-for="prompt in promptSuggestions"
              :key="prompt"
              class="rounded-[18px] border border-[#f0dfd1] bg-[linear-gradient(180deg,#ffffff_0%,#fff9f3_100%)] px-3.5 py-2.5 text-left transition hover:border-[#f0b27b] hover:bg-[#fff5ea] hover:shadow-[0_18px_36px_-30px_rgba(201,106,28,0.28)]"
              type="button"
              @click="handleQuickPrompt(prompt)"
            >
              <span class="block text-[13px] font-semibold text-slate-700">
                {{ prompt }}
              </span>
              <span class="mt-0.5 block text-[11px] leading-5 text-slate-400">
                基于当前页上下文直接回答
              </span>
            </button>
          </div>
        </section>
      </div>

      <TransitionGroup v-else name="ai-message" tag="div" class="space-y-3.5">
        <article
          v-for="message in visibleMessages"
          :key="message.id"
          :class="[
            'rounded-[22px] border px-3.5 py-3 text-[13px] leading-6 shadow-[0_20px_40px_-36px_rgba(15,23,42,0.18)]',
            message.role === 'assistant'
              ? 'max-w-[96%] border-[#f0dfd1] bg-white text-slate-700'
              : 'ml-auto max-w-[88%] border-[#f4a65b] bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white',
          ]"
        >
          <p
            class="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55"
          >
            {{ message.role === 'assistant' ? ASSISTANT_NAME : '你' }}
          </p>
          <p class="whitespace-pre-line">{{ message.content }}</p>
        </article>

        <article
          v-if="pending"
          key="assistant-pending"
          class="max-w-[90%] rounded-[22px] border border-[#f0dfd1] bg-white px-3.5 py-3 text-[13px] text-slate-500 shadow-[0_20px_40px_-36px_rgba(15,23,42,0.18)]"
        >
          <p
            class="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55"
          >
            {{ ASSISTANT_NAME }}
          </p>
          <p>{{ ASSISTANT_NAME }} 正在整理这页的经营重点...</p>
        </article>
      </TransitionGroup>
    </div>

    <footer
      class="border-t border-[#eedccc] bg-[#fff9f3]/95 px-4 py-2.5 backdrop-blur"
    >
      <form @submit.prevent="handleSubmit">
        <div
          class="relative rounded-[24px] border border-[#edd7c5] bg-white px-3 py-2.5 shadow-[0_18px_40px_-32px_rgba(201,106,28,0.22)]"
        >
          <textarea
            v-model="draft"
            class="min-h-[58px] max-h-[140px] w-full resize-none bg-transparent px-1 py-1 pr-12 pb-7 text-[13px] leading-6 text-slate-700 outline-none"
            data-testid="ai-assistant-input"
            placeholder="例如：今天先做什么？为什么这个指标最重要？"
            @keydown.enter.exact.prevent="handleSubmit"
          />

          <p
            class="pointer-events-none absolute right-14 bottom-2.5 left-4 truncate text-[10px] leading-4 text-slate-400"
          >
            {{ helperText }}
          </p>
          <button
            :disabled="!canSubmit || pending"
            aria-label="发送消息"
            class="absolute right-2.5 bottom-2.5 inline-flex size-9 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
            data-testid="ai-assistant-send"
            type="submit"
          >
            <SendIcon class="text-[15px]" />
          </button>
        </div>
      </form>
    </footer>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.ai-message-enter-active,
.ai-message-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.ai-message-enter-from,
.ai-message-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
