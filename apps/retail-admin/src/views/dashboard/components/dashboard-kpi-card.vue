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
    actionLabel?: string;
    delta?: string;
    deltaTone?: DashboardStatusTone;
    icon: string;
    note?: string;
    subtitle?: string;
    title: string;
    value: string;
    variant?: 'revenue' | 'sale';
  }>(),
  {
    accent: 'slate',
    actionLabel: '',
    delta: '',
    deltaTone: 'neutral',
    note: '',
    subtitle: '',
    variant: 'sale',
  },
);

const saleCardClassMap: Record<DashboardAccent, string> = {
  amber: 'border-[#FE9F43] bg-[#FE9F43] text-white',
  blue: 'border-[#155EEF] bg-[#155EEF] text-white',
  emerald: 'border-[#3EB780] bg-[#3EB780] text-white',
  navy: 'border-[#092C4C] bg-[#092C4C] text-white',
  rose: 'border-[#E04F16] bg-[#E04F16] text-white',
  slate: 'border-[#646B72] bg-[#646B72] text-white',
  teal: 'border-[#0E9384] bg-[#0E9384] text-white',
  violet: 'border-[#6C5CE7] bg-[#6C5CE7] text-white',
};

const saleIconClassMap: Record<DashboardAccent, string> = {
  amber: 'bg-white text-[#FE9F43]',
  blue: 'bg-white text-[#155EEF]',
  emerald: 'bg-white text-[#3EB780]',
  navy: 'bg-white text-[#092C4C]',
  rose: 'bg-white text-[#E04F16]',
  slate: 'bg-white text-[#646B72]',
  teal: 'bg-white text-[#0E9384]',
  violet: 'bg-white text-[#6C5CE7]',
};

const revenueIconClassMap: Record<DashboardAccent, string> = {
  amber: 'bg-[#FCEFEA] text-[#E04F16]',
  blue: 'bg-[#E9F5F4] text-[#0E9384]',
  emerald: 'bg-[#E9F8FB] text-[#06AED4]',
  navy: 'bg-[#E6EAED] text-[#092C4C]',
  rose: 'bg-[#FCEFEA] text-[#E04F16]',
  slate: 'bg-slate-100 text-slate-500',
  teal: 'bg-[#E9F5F4] text-[#0E9384]',
  violet: 'bg-[#EDEDFB] text-[#391694]',
};

const saleTrendClassMap: Record<DashboardStatusTone, string> = {
  negative: 'bg-[#FFEDE9] text-[#E04F16]',
  neutral: 'bg-white/15 text-white',
  positive: 'bg-[#FFF6EE] text-[#FE9F43]',
  warning: 'bg-[#EEFAF1] text-[#3EB780]',
};

const iconWrapClass = computed(() => {
  return props.variant === 'sale'
    ? saleIconClassMap[props.accent]
    : revenueIconClassMap[props.accent];
});

const revenueDeltaClassMap: Record<DashboardStatusTone, string> = {
  negative: 'text-[#E04F16]',
  neutral: 'text-slate-500',
  positive: 'text-[#3EB780]',
  warning: 'text-[#FE9F43]',
};

const saleCardClass = computed(() => saleCardClassMap[props.accent]);
const revenueDeltaClass = computed(() => revenueDeltaClassMap[props.deltaTone]);
const iconComponent = computed(() => createIconifyIcon(props.icon));
const revenueActionLabel = computed(() => props.actionLabel || 'View All');
</script>

<template>
  <article
    v-if="props.variant === 'sale'"
    :class="['rounded-lg border px-4 py-4', saleCardClass]"
  >
    <div class="flex items-center gap-3">
      <span
        :class="[
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl',
          iconWrapClass,
        ]"
      >
        <component :is="iconComponent" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm text-white">
          {{ title }}
        </p>
        <div class="mt-1 inline-flex flex-wrap items-center gap-2">
          <p class="text-[28px] font-bold leading-none text-white">
            {{ value }}
          </p>
          <span
            v-if="delta"
            :class="[
              'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold',
              saleTrendClassMap[deltaTone],
            ]"
          >
            {{ delta }}
          </span>
        </div>
      </div>
    </div>
  </article>

  <article v-else class="rounded-lg border border-slate-200 bg-white px-5 py-5">
    <div
      class="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3"
    >
      <div>
        <h4 class="mb-1 text-[28px] font-bold leading-none text-slate-900">
          {{ value }}
        </h4>
        <p class="text-sm text-slate-500">
          {{ title }}
        </p>
      </div>
      <span
        :class="[
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base',
          iconWrapClass,
        ]"
      >
        <component :is="iconComponent" />
      </span>
    </div>

    <div class="flex items-center justify-between gap-3">
      <p class="text-[13px] text-slate-500">
        <span class="font-bold" :class="revenueDeltaClass">{{ delta }}</span>
        <span v-if="props.note"> {{ props.note }}</span>
      </p>
      <button
        class="text-[13px] font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
        type="button"
      >
        {{ revenueActionLabel }}
      </button>
    </div>
  </article>
</template>
