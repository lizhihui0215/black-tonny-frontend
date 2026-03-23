<script setup lang="ts">
import { computed, ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { GlobalSearch } from '@vben/layouts';
import { preferences, updatePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

const accessStore = useAccessStore();
const ToggleIcon = createIconifyIcon('lucide:chevrons-left');
const isMiniSidebarMode = computed(() => !preferences.sidebar.expandOnHover);
const isLeadingHovered = ref(false);
const showMiniToggle = computed(() => {
  return !isMiniSidebarMode.value || isLeadingHovered.value;
});
const leadingStyle = computed(() => {
  return {
    '--dreams-leading-offset': '0px',
  };
});

function toggleSidebarMode() {
  const nextMiniSidebarMode = !isMiniSidebarMode.value;

  updatePreferences({
    sidebar: {
      collapsed: nextMiniSidebarMode,
      expandOnHover: !nextMiniSidebarMode,
    },
  });
}

function handleLeadingEnter() {
  isLeadingHovered.value = true;
}

function handleLeadingLeave() {
  isLeadingHovered.value = false;
}
</script>

<template>
  <div
    :class="{ 'is-mini-toggle-hidden': !showMiniToggle }"
    class="dreams-header-leading"
    :style="leadingStyle"
    @mouseenter="handleLeadingEnter"
    @mouseleave="handleLeadingLeave"
  >
    <button
      :aria-label="isMiniSidebarMode ? '固定左侧菜单' : '切换为迷你菜单'"
      :class="{
        'is-hidden': !showMiniToggle,
        'is-mini-mode': isMiniSidebarMode,
      }"
      class="dreams-header-leading__toggle"
      type="button"
      @click="toggleSidebarMode"
    >
      <component :is="ToggleIcon" class="dreams-header-leading__toggle-icon" />
    </button>

    <GlobalSearch
      :menus="accessStore.accessMenus"
      class="dreams-header-leading__search hidden lg:block"
    />
  </div>
</template>

<style scoped>
.dreams-header-leading {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 65px;
  padding-right: 12px;
  padding-left: calc(var(--dreams-leading-offset) + 42px);
  transition:
    gap var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    padding-left var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1));
}

.dreams-header-leading.is-mini-toggle-hidden {
  gap: 0;
}

.dreams-header-leading__toggle {
  position: absolute;
  top: 50%;
  left: calc(var(--dreams-leading-offset) + 8px);
  z-index: 2;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: hsl(var(--primary-foreground));
  background: #fe9f43;
  border: 0;
  border-radius: 999px;
  box-shadow: 0 10px 22px -18px hsl(var(--primary) / 85%);
  transform: translateY(-50%);
  transition:
    left var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    box-shadow 0.3s ease,
    opacity var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    background 0.2s ease;
}

.dreams-header-leading__toggle.is-hidden {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-50%) translateX(-10px) scale(0.82);
}

.dreams-header-leading__toggle:hover {
  background: #f58f28;
  box-shadow: 0 12px 24px -18px hsl(var(--primary) / 90%);
  transform: translateY(-50%) scale(1.03);
}

.dreams-header-leading__toggle.is-mini-mode {
  box-shadow: 0 10px 22px -18px hsl(var(--primary) / 68%);
}

.dreams-header-leading__toggle-icon {
  font-size: 13px;
  transition: transform var(--dreams-layout-transition-duration, 560ms)
    var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1));
}

.dreams-header-leading__toggle.is-mini-mode
  .dreams-header-leading__toggle-icon {
  transform: rotate(180deg);
}

.dreams-header-leading__search {
  flex: 0 0 284px;
  width: min(284px, 100%);
}

:deep(.dreams-header-leading__search .group) {
  gap: 10px;
  height: 40px;
  padding: 0 10px 0 12px;
  background: hsl(var(--card));
  border: 1px solid #e6eaed;
  border-radius: 10px;
  box-shadow: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.dreams-header-leading__search .group:hover) {
  border-color: hsl(var(--primary) / 30%);
  box-shadow: 0 0 0 4px hsl(var(--primary) / 8%);
}

:deep(.dreams-header-leading__search .group > span:nth-of-type(1)) {
  font-size: 14px;
  font-weight: 500;
  color: hsl(215deg 12% 45%);
}

:deep(.dreams-header-leading__search .group > span:last-of-type) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: #5f6875;
  background: #eef1f4;
  border: 0;
  border-radius: 6px;
}

:deep(.dreams-header-leading__search .group kbd) {
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 1536px) {
  .dreams-header-leading {
    padding-left: calc(var(--dreams-leading-offset) + 18px);
  }

  .dreams-header-leading__search {
    flex-basis: 260px;
    width: min(260px, 100%);
  }
}
</style>
