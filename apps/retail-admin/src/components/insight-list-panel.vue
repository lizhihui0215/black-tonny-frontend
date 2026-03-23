<script lang="ts" setup>
import type {
  BlackTonnyDashboardTip,
  BlackTonnyInsight,
} from '#/types/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  insights?: BlackTonnyInsight[];
  subtitle?: string;
  title?: string;
  tips?: BlackTonnyDashboardTip[];
}>();
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '关键提醒' }}
        </span>
        <span class="text-xs text-slate-400">{{
          subtitle || '经营摘要与术语说明'
        }}</span>
      </div>
    </template>

    <div class="grid gap-6 lg:grid-cols-2">
      <section>
        <h3 class="text-sm font-semibold text-slate-950">经营摘要</h3>
        <ul
          v-if="insights?.length"
          class="mt-3 space-y-2 text-sm text-slate-600"
        >
          <li
            v-for="item in insights"
            :key="item.summary"
            class="rounded-2xl bg-slate-50 px-4 py-3"
          >
            {{ item.summary || '暂无摘要' }}
          </li>
        </ul>
        <EmptyStateBlock
          v-else
          compact
          description="当前样本没有返回经营摘要。"
          title="暂无摘要"
        />
      </section>

      <section>
        <h3 class="text-sm font-semibold text-slate-950">术语解释</h3>
        <ul v-if="tips?.length" class="mt-3 space-y-2 text-sm text-slate-600">
          <li
            v-for="tip in tips"
            :key="tip.term"
            class="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <div class="font-medium text-slate-900">
              {{ tip.term || '术语' }}
            </div>
            <p class="mt-1 leading-6">{{ tip.meaning || '暂无解释' }}</p>
            <p class="mt-1 text-xs text-slate-400">
              建议关注：{{ tip.watch || '暂无' }}
            </p>
          </li>
        </ul>
        <EmptyStateBlock
          v-else
          compact
          description="当前样本没有返回术语说明。"
          title="暂无术语说明"
        />
      </section>
    </div>
  </el-card>
</template>
