<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { GlobalSearch } from '@vben/layouts';
import { preferences, updatePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

const accessStore = useAccessStore();
const ToggleIcon = createIconifyIcon('lucide:chevrons-left');
const isMiniSidebarMode = computed(() => !preferences.sidebar.expandOnHover);
const hoverExpandOffset = computed(() => {
  if (!isMiniSidebarMode.value || !isSidebarHovered.value) {
    return 0;
  }

  return Math.max(
    preferences.sidebar.width - preferences.sidebar.collapseWidth,
    0,
  );
});
const isLeadingHovered = ref(false);
const isSidebarHovered = ref(false);
const showMiniToggle = computed(() => {
  return !isMiniSidebarMode.value || isLeadingHovered.value || isSidebarHovered.value;
});
const leadingStyle = computed(() => {
  return {
    '--dreams-leading-offset': `${hoverExpandOffset.value}px`,
  };
});

let sidebarElement: HTMLElement | null = null;
let sidebarLeaveTimer: number | null = null;

function toggleSidebarMode() {
  const nextMiniSidebarMode = !isMiniSidebarMode.value;

  updatePreferences({
    sidebar: {
      collapsed: nextMiniSidebarMode,
      expandOnHover: !nextMiniSidebarMode,
    },
  });
}

function clearSidebarLeaveTimer() {
  if (sidebarLeaveTimer) {
    window.clearTimeout(sidebarLeaveTimer);
    sidebarLeaveTimer = null;
  }
}

function handleSidebarEnter() {
  clearSidebarLeaveTimer();
  isSidebarHovered.value = true;
}

function handleSidebarLeave() {
  clearSidebarLeaveTimer();
  sidebarLeaveTimer = window.setTimeout(() => {
    isSidebarHovered.value = false;
  }, 180);
}

function handleLeadingEnter() {
  clearSidebarLeaveTimer();
  isLeadingHovered.value = true;
}

function handleLeadingLeave() {
  isLeadingHovered.value = false;
}

onMounted(() => {
  sidebarElement = document.querySelector('.black-tonny-layout aside');
  sidebarElement?.addEventListener('mouseenter', handleSidebarEnter);
  sidebarElement?.addEventListener('mouseleave', handleSidebarLeave);
});

onBeforeUnmount(() => {
  clearSidebarLeaveTimer();
  sidebarElement?.removeEventListener('mouseenter', handleSidebarEnter);
  sidebarElement?.removeEventListener('mouseleave', handleSidebarLeave);
});
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
  min-height: 65px;
  min-width: 0;
  padding-left: calc(var(--dreams-leading-offset) + 24px);
  padding-right: 12px;
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
  display: inline-flex;
  position: absolute;
  left: calc(var(--dreams-leading-offset) - 13px);
  top: 50%;
  height: 26px;
  width: 26px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 0;
  background: #fe9f43;
  color: hsl(var(--primary-foreground));
  box-shadow: 0 10px 22px -18px hsl(var(--primary) / 0.85);
  transition:
    left var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    box-shadow 0.3s ease,
    opacity var(--dreams-layout-transition-duration, 560ms)
      var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    background 0.2s ease;
  transform: translateY(-50%);
  z-index: 2;
}

.dreams-header-leading__toggle.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(-10px) scale(0.82);
}

.dreams-header-leading__toggle:hover {
  transform: translateY(-50%) scale(1.03);
  background: #f58f28;
  box-shadow: 0 12px 24px -18px hsl(var(--primary) / 0.9);
}

.dreams-header-leading__toggle.is-mini-mode {
  box-shadow: 0 10px 22px -18px hsl(var(--primary) / 0.68);
}

.dreams-header-leading__toggle-icon {
  font-size: 13px;
  transition: transform var(--dreams-layout-transition-duration, 560ms)
    var(--dreams-layout-transition-easing, cubic-bezier(0.22, 1, 0.36, 1));
}

.dreams-header-leading__toggle.is-mini-mode .dreams-header-leading__toggle-icon {
  transform: rotate(180deg);
}

.dreams-header-leading__search {
  width: min(284px, 100%);
  flex: 0 0 284px;
}

:deep(.dreams-header-leading__search .group) {
  height: 40px;
  gap: 10px;
  border: 1px solid #e6eaed;
  border-radius: 10px;
  background: hsl(var(--card));
  padding: 0 10px 0 12px;
  box-shadow: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.dreams-header-leading__search .group:hover) {
  border-color: hsl(var(--primary) / 0.3);
  box-shadow: 0 0 0 4px hsl(var(--primary) / 0.08);
}

:deep(.dreams-header-leading__search .group > span:nth-of-type(1)) {
  color: hsl(215 12% 45%);
  font-size: 14px;
  font-weight: 500;
}

:deep(.dreams-header-leading__search .group > span:last-of-type) {
  border: 0;
  border-radius: 6px;
  background: #eef1f4;
  padding: 4px 8px;
  color: #5f6875;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
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
