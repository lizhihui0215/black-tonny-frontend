<script lang="ts" setup>
import type { BlackTonnySummaryCardViewModel } from '#/types/black-tonny';

import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    cards?: BlackTonnySummaryCardViewModel[];
    description?: string;
    highlightCount?: number;
    title?: string;
  }>(),
  {
    cards: () => [],
    description: '先看当前页面最关键的经营指标。',
    highlightCount: 4,
    title: '核心指标',
  },
);

const highlightCards = computed(() =>
  props.cards.slice(0, props.highlightCount),
);
const secondaryCards = computed(() => props.cards.slice(props.highlightCount));

function toneClass(tone?: string) {
  if (tone === 'critical') {
    return 'border-rose-200 bg-rose-50/80';
  }
  if (tone === 'focus') {
    return 'border-amber-200 bg-amber-50/90';
  }
  if (tone === 'positive') {
    return 'border-emerald-200 bg-emerald-50/80';
  }
  if (tone === 'warning') {
    return 'border-orange-200 bg-orange-50/80';
  }
  return 'border-slate-200 bg-white';
}
</script>

<template>
  <section
    class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
  >
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400"
        >
          Black Tonny Metrics
        </p>
        <h2 class="mt-2 text-xl font-semibold text-slate-950">
          {{ title }}
        </h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in highlightCards"
        :key="card.key"
        class="rounded-[24px] border px-5 py-5 shadow-sm"
        :class="toneClass(card.tone)"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm font-medium text-slate-600">
            {{ card.label }}
          </p>
          <el-tag v-if="card.tag" effect="plain" round size="small" type="info">
            {{ card.tag }}
          </el-tag>
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {{ card.value }}
        </p>
        <p class="mt-3 text-sm leading-6 text-slate-500">
          {{ card.description }}
        </p>
      </article>
    </div>

    <div
      v-if="secondaryCards.length"
      class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <article
        v-for="card in secondaryCards"
        :key="card.key"
        class="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-slate-500">
            {{ card.label }}
          </p>
          <el-tag v-if="card.tag" effect="plain" round size="small" type="info">
            {{ card.tag }}
          </el-tag>
        </div>
        <p class="mt-3 text-2xl font-semibold text-slate-900">
          {{ card.value }}
        </p>
      </article>
    </div>
  </section>
</template>
