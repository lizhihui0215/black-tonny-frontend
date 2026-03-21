<script lang="ts" setup>
import type { BlackTonnyDecision } from '#/types/black-tonny';

import { computed } from 'vue';

import { buildDecisionFacts } from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  decision?: BlackTonnyDecision;
  subtitle?: string;
  title?: string;
}>();

const facts = computed(() => buildDecisionFacts(props.decision));
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '判断摘要' }}
        </span>
        <span class="text-xs text-slate-400">
          {{ subtitle || '先看策略、阶段和动作重点' }}
        </span>
      </div>
    </template>

    <div v-if="decision" class="space-y-4">
      <div class="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4">
        <h3 class="text-lg font-semibold text-slate-950">
          {{ decision.headline || '暂无判断标题' }}
        </h3>
        <p class="mt-2 text-sm leading-7 text-slate-600">
          {{ decision.summary || '当前没有返回判断摘要。' }}
        </p>
      </div>

      <div v-if="facts.length" class="grid gap-4 md:grid-cols-2">
        <article
          v-for="item in facts"
          :key="item.label"
          class="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-medium text-slate-500">
              {{ item.label }}
            </p>
            <el-tag
              v-if="item.tag"
              effect="plain"
              round
              size="small"
              type="info"
            >
              {{ item.tag }}
            </el-tag>
          </div>
          <p class="mt-3 text-lg font-semibold text-slate-950">
            {{ item.value }}
          </p>
          <p
            v-if="item.note"
            class="mt-2 text-sm leading-6 text-slate-500"
          >
            {{ item.note }}
          </p>
        </article>
      </div>
    </div>

    <EmptyStateBlock
      v-else
      compact
      description="当前样本没有返回判断摘要。"
      title="暂无判断摘要"
    />
  </el-card>
</template>
