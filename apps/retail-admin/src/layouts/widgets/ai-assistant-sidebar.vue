<script lang="ts" setup>
import { watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { usePreferences } from '@vben/preferences';

import {
  closeAiAssistant,
  toggleAiAssistant,
  useAiAssistant,
} from '#/composables/use-ai-assistant';

import AiAssistantPanel from './ai-assistant-panel.vue';

const BotIcon = createIconifyIcon('lucide:bot');
const PanelOpenIcon = createIconifyIcon('lucide:panel-right-open');
const PanelCloseIcon = createIconifyIcon('lucide:panel-right-close');
const SparklesIcon = createIconifyIcon('lucide:sparkles');

const { isMobile } = usePreferences();
const { isOpen } = useAiAssistant();

watch(
  isMobile,
  (value) => {
    if (value) {
      closeAiAssistant();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    :class="[
      'relative hidden shrink-0 xl:block',
      isOpen ? 'w-[440px]' : 'w-[64px]',
    ]"
  >
    <aside
      :class="[
        'fixed top-0 right-0 z-[230] hidden overflow-hidden border-l border-[#f0dfd1] bg-[#fff9f4] shadow-[-20px_0_48px_-38px_rgba(15,23,42,0.2)] transition-[width] duration-300 ease-out xl:flex',
        isOpen ? 'w-[440px]' : 'w-[64px]',
      ]"
      :data-open="isOpen ? 'true' : 'false'"
      :style="{ height: '100vh' }"
      data-testid="ai-assistant-sidebar"
    >
      <div
        class="flex w-16 shrink-0 flex-col items-center justify-between border-r border-[#f0dfd1] bg-[linear-gradient(180deg,#fff8f1_0%,#fdf0e3_100%)] pt-5 pb-4 text-slate-700"
      >
        <div class="flex flex-col items-center gap-3">
          <button
            class="inline-flex size-11 items-center justify-center rounded-2xl border border-[#edd7c5] bg-white text-[#c26a1c] shadow-[0_16px_28px_-24px_rgba(201,106,28,0.4)] transition hover:bg-[#fff3e8]"
            data-testid="ai-assistant-toggle"
            type="button"
            @click="toggleAiAssistant()"
          >
            <component
              :is="isOpen ? PanelCloseIcon : PanelOpenIcon"
              class="text-[18px]"
            />
          </button>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white shadow-[0_20px_42px_-26px_rgba(245,143,40,0.58)]"
          >
            <BotIcon class="text-[18px]" />
          </div>
        </div>

        <div class="flex flex-col items-center gap-3">
          <span
            class="inline-flex size-8 items-center justify-center rounded-2xl bg-[#fff1dd] text-[#d97706]"
          >
            <SparklesIcon class="text-sm" />
          </span>
          <div class="text-center text-[10px] font-semibold tracking-[0.18em] text-[#c26a1c]/70">
            <span class="[writing-mode:vertical-rl]">DEEPSEEK</span>
          </div>
        </div>
      </div>

      <Transition name="ai-sidebar-panel">
        <div
          v-if="isOpen"
          class="min-w-0 flex-1 bg-[radial-gradient(circle_at_top,#fff9f3_0%,#fffdfb_34%,#f8f2ea_100%)]"
        >
          <AiAssistantPanel />
        </div>
      </Transition>
    </aside>
  </div>

  <div v-if="isMobile" class="xl:hidden">
    <button
      class="fixed right-5 bottom-5 z-[160] inline-flex size-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#fe9f43_0%,#f58f28_100%)] text-white shadow-[0_24px_64px_-28px_rgba(245,143,40,0.55)] transition hover:brightness-95"
      type="button"
      @click="toggleAiAssistant()"
    >
      <BotIcon class="text-xl" />
    </button>

    <Transition name="ai-sidebar-mobile">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[170] bg-slate-950/22 backdrop-blur-[2px]"
        @click="closeAiAssistant"
      >
        <aside
          class="absolute top-0 right-0 h-full w-full max-w-[420px] overflow-hidden bg-[radial-gradient(circle_at_top,#fff9f3_0%,#fffdfb_34%,#f8f2ea_100%)] shadow-[-20px_0_60px_-28px_rgba(15,23,42,0.26)]"
          @click.stop
        >
          <AiAssistantPanel :show-close="true" @close="closeAiAssistant" />
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ai-sidebar-panel-enter-active,
.ai-sidebar-panel-leave-active,
.ai-sidebar-mobile-enter-active,
.ai-sidebar-mobile-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.ai-sidebar-panel-enter-from,
.ai-sidebar-panel-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

.ai-sidebar-mobile-enter-from,
.ai-sidebar-mobile-leave-to {
  opacity: 0;
}

.ai-sidebar-mobile-enter-from aside,
.ai-sidebar-mobile-leave-to aside {
  transform: translateX(24px);
}

.ai-sidebar-mobile-enter-active aside,
.ai-sidebar-mobile-leave-active aside {
  transition: transform 0.24s ease;
}
</style>
