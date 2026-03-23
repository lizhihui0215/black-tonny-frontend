<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/locales';

import { computed } from 'vue';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { createIconifyIcon } from '@vben/icons';
import { Preferences } from '@vben/layouts';
import { loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben/preferences';

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

import {
  toggleAiAssistant,
  useAiAssistant,
} from '#/composables/use-ai-assistant';

const AiIcon = createIconifyIcon('lucide:bot');
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
const { isOpen: aiAssistantOpen } = useAiAssistant();

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

    <button
      class="dreams-action hidden lg:inline-flex" :class="[
        aiAssistantOpen
          ? 'dreams-action--assistant-active'
          : 'dreams-action--assistant',
      ]"
      type="button"
      @click="toggleAiAssistant()"
    >
      <AiIcon class="text-sm" />
      <span>DeepSeek</span>
    </button>

    <ElDropdown
      placement="bottom-end"
      trigger="click"
      @command="handleLocaleChange"
    >
      <button class="dreams-icon-action" type="button">
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

    <button class="dreams-icon-action" type="button" @click="toggleFullscreen">
      <FullscreenIcon class="text-base" />
    </button>

    <button class="dreams-icon-action relative" type="button">
      <MailIcon class="text-base" />
      <span class="dreams-icon-badge"> 1 </span>
    </button>

    <button class="dreams-icon-action" type="button">
      <BellIcon class="text-base" />
    </button>

    <Preferences>
      <button class="dreams-icon-action" type="button">
        <SettingsIcon class="text-base" />
      </button>
    </Preferences>
  </div>
</template>

<style scoped>
.dreams-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dreams-action,
.dreams-icon-action {
  background: #fff;
  border: 1px solid #e6eaed;
  box-shadow: none;
}

.dreams-action {
  gap: 8px;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #092c4c;
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.dreams-action:hover,
.dreams-icon-action:hover {
  color: #092c4c;
  border-color: #d8dde3;
  box-shadow: 0 8px 20px -18px rgb(9 44 76 / 35%);
}

.dreams-action--store {
  justify-content: center;
  min-width: 144px;
}

.dreams-action--primary {
  color: #fff;
  background: #fe9f43;
  border-color: #fe9f43;
}

.dreams-action--primary:hover {
  color: #fff;
  background: #f58f28;
  border-color: #f58f28;
}

.dreams-action--dark {
  color: #fff;
  background: #092c4c;
  border-color: #092c4c;
}

.dreams-action--dark:hover {
  color: #fff;
  background: #0d3c65;
  border-color: #0d3c65;
}

.dreams-action--assistant {
  color: #c26a1c;
  background:
    linear-gradient(135deg, rgb(255 250 245 / 100%), rgb(255 243 232 / 100%));
  border-color: #f1d8c1;
}

.dreams-action--assistant-active {
  color: #fff;
  background:
    linear-gradient(135deg, rgb(254 159 67 / 100%), rgb(245 143 40 / 100%));
  border-color: #f58f28;
  box-shadow: 0 18px 34px -24px rgb(245 143 40 / 55%);
}

.dreams-action__symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #fe9f43;
  background: transparent;
  border-radius: 4px;
}

.dreams-action__chevron {
  color: #7a8086;
}

.dreams-icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #5f6875;
  background: #f7f7f7;
  border-color: transparent;
  border-radius: 8px;
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
  top: -5px;
  right: -4px;
  min-width: 17px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 17px;
  color: #fff;
  text-align: center;
  background: #ea2f14;
  border-radius: 999px;
  box-shadow: 0 6px 14px -10px rgb(234 47 20 / 90%);
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
