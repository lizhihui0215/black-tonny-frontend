<script lang="ts" setup>
import { computed } from 'vue';

import { createIconifyIcon } from '@vben/icons';

const props = withDefaults(
  defineProps<{
    actionLabel?: string;
    bodyClass?: string;
    eyebrow?: string;
    icon?: string;
    iconClass?: string;
    subtitle?: string;
    title: string;
  }>(),
  {
    actionLabel: '',
    bodyClass: '',
    eyebrow: '',
    icon: '',
    iconClass: 'bg-amber-100/50 text-amber-500',
    subtitle: '',
  },
);

const headerIcon = computed(() =>
  props.icon ? createIconifyIcon(props.icon) : null,
);
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <header
      class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"
    >
      <div class="flex items-center gap-3">
        <span
          v-if="headerIcon"
          :class="[
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base',
            props.iconClass,
          ]"
        >
          <component :is="headerIcon" />
        </span>
        <div class="min-w-0">
          <h2 class="text-[15px] font-bold tracking-tight text-slate-900">
            {{ props.title }}
          </h2>
          <p
            v-if="props.eyebrow"
            class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            {{ props.eyebrow }}
          </p>
        </div>
      </div>

      <div
        v-if="$slots.extra || props.actionLabel"
        class="flex items-center gap-2"
      >
        <slot name="extra">
          <button
            class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            type="button"
          >
            {{ props.actionLabel }}
          </button>
        </slot>
      </div>
    </header>

    <div :class="['px-5 pb-5 pt-5', props.bodyClass]">
      <slot />
    </div>
  </section>
</template>
