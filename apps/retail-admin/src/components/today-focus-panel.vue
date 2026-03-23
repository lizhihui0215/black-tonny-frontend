<script lang="ts" setup>
import type { BlackTonnyTodayFocus } from '#/types/black-tonny';

import { computed } from 'vue';

import { toSentenceList } from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  focus?: BlackTonnyTodayFocus;
  subtitle?: string;
  title?: string;
}>();

const conclusions = computed(() => toSentenceList(props.focus?.conclusions));
const tasks = computed(() => toSentenceList(props.focus?.tasks));
</script>

<template>
  <el-card shadow="never" class="h-full rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '今天先做什么' }}
        </span>
        <span class="text-xs text-slate-400">{{
          subtitle || '先结论，再动作'
        }}</span>
      </div>
    </template>

    <div class="grid gap-5">
      <div>
        <h3 class="text-sm font-semibold text-slate-950">结论</h3>
        <ul
          v-if="conclusions.length"
          class="mt-3 space-y-2 text-sm text-slate-600"
        >
          <li
            v-for="item in conclusions"
            :key="item"
            class="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3"
          >
            {{ item }}
          </li>
        </ul>
        <EmptyStateBlock
          v-else
          compact
          description="当前样本没有返回今日结论。"
          title="暂无结论"
        />
      </div>

      <div>
        <h3 class="text-sm font-semibold text-slate-950">任务</h3>
        <ul v-if="tasks.length" class="mt-3 space-y-2 text-sm text-slate-600">
          <li
            v-for="item in tasks"
            :key="item"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            {{ item }}
          </li>
        </ul>
        <EmptyStateBlock
          v-else
          compact
          description="当前样本没有返回今日任务。"
          title="暂无任务"
        />
      </div>
    </div>
  </el-card>
</template>
