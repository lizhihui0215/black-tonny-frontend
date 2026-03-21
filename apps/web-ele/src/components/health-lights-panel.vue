<script lang="ts" setup>
import type { BlackTonnyHealthLight } from '#/types/black-tonny';

import { computed } from 'vue';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  items?: BlackTonnyHealthLight[];
  subtitle?: string;
  title?: string;
}>();

const normalizedItems = computed(() => props.items ?? []);

function levelLabel(level?: string) {
  if (level === 'green') return '健康';
  if (level === 'yellow') return '预警';
  if (level === 'red') return '风险';
  return '观察';
}
</script>

<template>
  <el-card shadow="never" class="h-full rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '经营红绿灯' }}
        </span>
        <span class="text-xs text-slate-400">{{ subtitle || '看风险先看这一组' }}</span>
      </div>
    </template>

    <div v-if="normalizedItems.length" class="grid gap-3">
      <div
        v-for="item in normalizedItems"
        :key="`${item.title}-${item.level}`"
        class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex size-2.5 rounded-full"
              :class="{
                'bg-emerald-500': item.level === 'green',
                'bg-amber-500': item.level === 'yellow',
                'bg-rose-500': item.level === 'red',
                'bg-slate-400': !item.level || item.level === 'neutral',
              }"
            />
            <span class="font-medium text-slate-900">{{ item.title || '指标' }}</span>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold text-slate-700">
              {{ item.value ?? '暂无数据' }}
            </div>
            <div class="text-xs text-slate-400">
              {{ levelLabel(item.level) }}
            </div>
          </div>
        </div>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          {{ item.note || '暂无说明' }}
        </p>
      </div>
    </div>

    <EmptyStateBlock
      v-else
      compact
      description="当前 payload 没有返回经营红绿灯数据。"
      title="暂无红绿灯"
    />
  </el-card>
</template>
