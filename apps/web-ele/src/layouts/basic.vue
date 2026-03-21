<script lang="ts" setup>
import { computed } from 'vue';

import { BasicLayout, UserDropdown } from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import DreamsHeaderActions from './widgets/dreams-header-actions.vue';
import DreamsHeaderLeading from './widgets/dreams-header-leading.vue';

const userStore = useUserStore();
const { sidebarCollapsed } = usePreferences();
const isSidebarMiniMode = computed(() => !preferences.sidebar.expandOnHover);
</script>

<template>
  <BasicLayout
    :class="[
      'black-tonny-layout',
      {
        'is-sidebar-collapsed': sidebarCollapsed,
        'is-sidebar-mini-mode': isSidebarMiniMode,
      },
    ]"
  >
    <template #header-left-0>
      <DreamsHeaderLeading />
    </template>

    <template #header-right-0>
      <DreamsHeaderActions />
    </template>

    <template #logo-text>
      <div class="black-tonny-layout__logo-copy">
        <span class="black-tonny-layout__logo-name">小黑托昵</span>
        <span class="black-tonny-layout__logo-subtitle">经营后台</span>
      </div>
    </template>

    <template #user-dropdown>
      <div class="dreams-user-dropdown">
        <UserDropdown
          :avatar="userStore.userInfo?.avatar"
          :description="userStore.userInfo?.username ?? 'black-tonny-owner'"
          :text="userStore.userInfo?.realName ?? '老板'"
        />
      </div>
    </template>
  </BasicLayout>
</template>
