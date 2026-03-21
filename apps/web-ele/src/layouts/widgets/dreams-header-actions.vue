<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/locales';

import { computed } from 'vue';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { createIconifyIcon } from '@vben/icons';
import { Preferences } from '@vben/layouts';
import { loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben/preferences';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

const BellIcon = createIconifyIcon('lucide:bell');
const ChevronDownIcon = createIconifyIcon('lucide:chevron-down');
const ChinaFlagIcon = createIconifyIcon('circle-flags:cn');
const FullscreenIcon = createIconifyIcon('lucide:maximize');
const MailIcon = createIconifyIcon('lucide:mail');
const PosIcon = createIconifyIcon('lucide:monitor');
const PlusIcon = createIconifyIcon('lucide:plus');
const SettingsIcon = createIconifyIcon('lucide:settings-2');
const StoreIcon = createIconifyIcon('lucide:store');
const UsFlagIcon = createIconifyIcon('circle-flags:us');

const localeIcon = computed(() => {
  return preferences.app.locale === 'en-US' ? UsFlagIcon : ChinaFlagIcon;
});

async function handleLocaleChange(value: string | undefined) {
  if (!value) {
    return;
  }

  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  await document.documentElement.requestFullscreen();
}
</script>

<template>
  <div class="dreams-header-actions">
    <button
      class="dreams-action dreams-action--store hidden xl:inline-flex"
      type="button"
    >
      <span class="dreams-action__symbol">
        <StoreIcon class="text-sm" />
      </span>
      <span>小黑托昵门店</span>
      <ChevronDownIcon class="dreams-action__chevron text-sm" />
    </button>

    <button
      class="dreams-action dreams-action--primary hidden xl:inline-flex"
      type="button"
    >
      <PlusIcon class="text-sm" />
      <span>新增</span>
    </button>

    <button
      class="dreams-action dreams-action--dark hidden xl:inline-flex"
      type="button"
    >
      <PosIcon class="text-sm" />
      <span>POS</span>
    </button>

    <ElDropdown
      placement="bottom-end"
      trigger="click"
      @command="handleLocaleChange"
    >
      <button
        class="dreams-icon-action"
        type="button"
      >
        <component :is="localeIcon" class="text-[18px]" />
      </button>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="item in SUPPORT_LANGUAGES"
            :key="item.value"
            :class="
              item.value === preferences.app.locale
                ? 'is-active text-primary'
                : ''
            "
            :command="item.value"
          >
            {{ item.label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>

    <button
      class="dreams-icon-action"
      type="button"
      @click="toggleFullscreen"
    >
      <FullscreenIcon class="text-base" />
    </button>

    <button
      class="dreams-icon-action relative"
      type="button"
    >
      <MailIcon class="text-base" />
      <span class="dreams-icon-badge">
        1
      </span>
    </button>

    <button
      class="dreams-icon-action"
      type="button"
    >
      <BellIcon class="text-base" />
    </button>

    <Preferences>
      <button
        class="dreams-icon-action"
        type="button"
      >
        <SettingsIcon class="text-base" />
      </button>
    </Preferences>
  </div>
</template>

<style scoped>
.dreams-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dreams-action,
.dreams-icon-action {
  border: 1px solid #e6eaed;
  background: #ffffff;
  box-shadow: none;
}

.dreams-action {
  display: inline-flex;
  height: 34px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #092c4c;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.dreams-action:hover,
.dreams-icon-action:hover {
  border-color: #d8dde3;
  color: #092c4c;
  box-shadow: 0 8px 20px -18px rgba(9, 44, 76, 0.35);
}

.dreams-action--store {
  min-width: 144px;
  justify-content: center;
}

.dreams-action--primary {
  border-color: #fe9f43;
  background: #fe9f43;
  color: #ffffff;
}

.dreams-action--primary:hover {
  border-color: #f58f28;
  background: #f58f28;
  color: #ffffff;
}

.dreams-action--dark {
  border-color: #092c4c;
  background: #092c4c;
  color: #ffffff;
}

.dreams-action--dark:hover {
  border-color: #0d3c65;
  background: #0d3c65;
  color: #ffffff;
}

.dreams-action__symbol {
  display: flex;
  height: 16px;
  width: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: transparent;
  color: #fe9f43;
}

.dreams-action__chevron {
  color: #7a8086;
}

.dreams-icon-action {
  display: flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  border-radius: 8px;
  background: #f7f7f7;
  color: #5f6875;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.dreams-icon-action:hover {
  background: #f2f2f2;
  transform: translateY(-1px);
}

.dreams-icon-badge {
  position: absolute;
  right: -4px;
  top: -5px;
  min-width: 17px;
  border-radius: 999px;
  background: #ea2f14;
  padding: 0 4px;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  line-height: 17px;
  color: #ffffff;
  box-shadow: 0 6px 14px -10px rgba(234, 47, 20, 0.9);
}

@media (max-width: 1536px) {
  .dreams-header-actions {
    gap: 8px;
  }

  .dreams-action {
    padding-inline: 10px;
  }
}
</style>
