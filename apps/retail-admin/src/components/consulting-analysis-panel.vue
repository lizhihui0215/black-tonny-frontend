<script lang="ts" setup>
import type { BlackTonnyConsultingAnalysis } from '#/types/black-tonny';

import { computed } from 'vue';

import { buildConsultingSections } from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  analysis?: BlackTonnyConsultingAnalysis;
  preferredKeys?: string[];
  subtitle?: string;
  title?: string;
}>();

const sections = computed(() =>
  buildConsultingSections(props.analysis, props.preferredKeys),
);
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <span class="text-base font-semibold text-slate-950">
            {{ title || '经营分析' }}
          </span>
          <p v-if="analysis?.period_label" class="mt-1 text-xs text-slate-400">
            {{ analysis.period_label }}
          </p>
        </div>
        <span class="text-xs text-slate-400">
          {{ subtitle || '把重点问题和阶段动作说清楚' }}
        </span>
      </div>
    </template>

    <div v-if="analysis" class="space-y-4">
      <div
        class="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4"
      >
        <h3 class="text-sm font-semibold text-slate-950">
          {{ analysis.focus_title || '当前重点' }}
        </h3>
        <p class="mt-2 text-sm leading-7 text-slate-600">
          {{ analysis.diagnosis_summary || '暂无经营分析摘要。' }}
        </p>
      </div>

      <div v-if="sections.length" class="grid gap-4 md:grid-cols-2">
        <section
          v-for="section in sections"
          :key="section.key"
          class="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
        >
          <h3 class="text-sm font-semibold text-slate-950">
            {{ section.label }}
          </h3>
          <ul class="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li v-for="item in section.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </div>

    <EmptyStateBlock
      v-else
      compact
      description="当前样本没有返回经营分析。"
      title="暂无经营分析"
    />
  </el-card>
</template>
