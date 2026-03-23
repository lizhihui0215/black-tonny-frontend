<script lang="ts" setup>
import { computed } from 'vue';

import { BasicLayout, UserDropdown } from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { useAiAssistant } from '#/composables/use-ai-assistant';

import AiAssistantSidebar from './widgets/ai-assistant-sidebar.vue';
import DreamsHeaderActions from './widgets/dreams-header-actions.vue';
import DreamsHeaderLeading from './widgets/dreams-header-leading.vue';

const userStore = useUserStore();
const { isMobile, sidebarCollapsed } = usePreferences();
const { isOpen: aiAssistantOpen } = useAiAssistant();
const isSidebarMiniMode = computed(() => !preferences.sidebar.expandOnHover);
const isAiAssistantDocked = computed(
  () => !isMobile.value && aiAssistantOpen.value,
);
</script>

<template>
  <BasicLayout
    :class="[
      'black-tonny-layout',
      {
        'is-ai-assistant-open': isAiAssistantDocked,
        'is-sidebar-collapsed': sidebarCollapsed,
        'is-sidebar-mini-mode': isSidebarMiniMode,
      },
    ]"
  >
    <template #header-left-0>
      <div class="black-tonny-layout__header-leading">
        <DreamsHeaderLeading />
      </div>
    </template>

    <template #header-right-0>
      <div class="black-tonny-layout__header-actions">
        <DreamsHeaderActions />
      </div>
    </template>

    <template #logo-text>
      <div class="black-tonny-layout__logo-copy">
        <span class="black-tonny-layout__logo-name">小黑托昵</span>
        <span class="black-tonny-layout__logo-subtitle">经营后台</span>
      </div>
    </template>

    <template #user-dropdown>
      <div class="black-tonny-layout__user-dropdown dreams-user-dropdown">
        <UserDropdown
          :avatar="userStore.userInfo?.avatar"
          :description="userStore.userInfo?.username ?? 'black-tonny-owner'"
          :text="userStore.userInfo?.realName ?? '老板'"
        />
      </div>
    </template>

    <template #extra>
      <div class="black-tonny-layout__assistant-dock">
        <AiAssistantSidebar />
      </div>
    </template>
  </BasicLayout>
</template>
