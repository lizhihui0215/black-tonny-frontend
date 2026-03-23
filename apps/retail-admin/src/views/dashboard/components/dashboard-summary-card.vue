<script lang="ts" setup>
import type {
  DashboardAccent,
  DashboardStatusTone,
} from '../dashboard-presentation';

import { computed } from 'vue';

import { createIconifyIcon } from '@vben/icons';

const props = withDefaults(
  defineProps<{
    accent?: DashboardAccent;
    compareText?: string;
    compareTone?: DashboardStatusTone;
    icon: string;
    label: string;
    subText?: string;
    value: string;
    variant?: 'primary' | 'secondary';
  }>(),
  {
    accent: 'slate',
    compareText: '--',
    compareTone: 'neutral',
    subText: '',
    variant: 'primary',
  },
);

const primaryCardClassMap: Record<DashboardAccent, string> = {
  amber: 'border-[#FE9F43] bg-[#FE9F43] text-white',
  blue: 'border-[#155EEF] bg-[#155EEF] text-white',
  emerald: 'border-[#3EB780] bg-[#3EB780] text-white',
  navy: 'border-[#092C4C] bg-[#092C4C] text-white',
  rose: 'border-[#E04F16] bg-[#E04F16] text-white',
  slate: 'border-[#646B72] bg-[#646B72] text-white',
  teal: 'border-[#0E9384] bg-[#0E9384] text-white',
  violet: 'border-[#6C5CE7] bg-[#6C5CE7] text-white',
};

const primaryIconClassMap: Record<DashboardAccent, string> = {
  amber: 'bg-white text-[#FE9F43]',
  blue: 'bg-white text-[#155EEF]',
  emerald: 'bg-white text-[#3EB780]',
  navy: 'bg-white text-[#092C4C]',
  rose: 'bg-white text-[#E04F16]',
  slate: 'bg-white text-[#646B72]',
  teal: 'bg-white text-[#0E9384]',
  violet: 'bg-white text-[#6C5CE7]',
};

const secondaryIconClassMap: Record<DashboardAccent, string> = {
  amber: 'bg-[#FFF6EE] text-[#FE9F43]',
  blue: 'bg-[#EEF4FF] text-[#155EEF]',
  emerald: 'bg-[#EEFAF1] text-[#3EB780]',
  navy: 'bg-[#E6EAED] text-[#092C4C]',
  rose: 'bg-[#FFEDE9] text-[#E04F16]',
  slate: 'bg-slate-100 text-slate-500',
  teal: 'bg-[#E9F5F4] text-[#0E9384]',
  violet: 'bg-[#EDEDFB] text-[#6C5CE7]',
};

const compareBadgeClassMap: Record<DashboardStatusTone, string> = {
  negative: 'bg-[#FFEDE9] text-[#E04F16]',
  neutral: 'bg-slate-100 text-slate-500',
  positive: 'bg-[#EEFAF1] text-[#3EB780]',
  warning: 'bg-[#FFF6EE] text-[#FE9F43]',
};

const iconComponent = computed(() => createIconifyIcon(props.icon));
const primaryCardClass = computed(() => primaryCardClassMap[props.accent]);
const primaryIconClass = computed(() => primaryIconClassMap[props.accent]);
const secondaryIconClass = computed(() => secondaryIconClassMap[props.accent]);
const compareBadgeClass = computed(() => compareBadgeClassMap[props.compareTone]);
</script>

<template>
  <article
    v-if="variant === 'primary'"
    :class="['rounded-lg border px-4 py-4', primaryCardClass]"
  >
    <div class="flex items-center gap-3">
      <span
        :class="[
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl',
          primaryIconClass,
        ]"
      >
        <component :is="iconComponent" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm text-white/85">
          {{ label }}
        </p>
        <div class="mt-1 inline-flex flex-wrap items-center gap-2">
          <p class="text-[28px] font-bold leading-none text-white">
            {{ value }}
          </p>
          <span
            class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold"
            :class="compareBadgeClass"
          >
            {{ compareText }}
          </span>
        </div>
        <p v-if="subText" class="mt-2 text-xs text-white/80">
          {{ subText }}
        </p>
      </div>
    </div>
  </article>

  <article v-else class="rounded-lg border border-slate-200 bg-white px-5 py-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm text-slate-500">
          {{ label }}
        </p>
        <h4 class="mt-3 text-[28px] font-bold leading-none text-slate-900">
          {{ value }}
        </h4>
      </div>
      <span
        :class="[
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base',
          secondaryIconClass,
        ]"
      >
        <component :is="iconComponent" />
      </span>
    </div>

    <div class="mt-4 border-t border-slate-200 pt-3">
      <span
        class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold"
        :class="compareBadgeClass"
      >
        {{ compareText }}
      </span>
      <p v-if="subText" class="mt-2 text-[13px] text-slate-500">
        {{ subText }}
      </p>
    </div>
  </article>
</template>
