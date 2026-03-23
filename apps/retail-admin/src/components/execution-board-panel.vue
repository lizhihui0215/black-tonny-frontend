<script lang="ts" setup>
import type {
  BlackTonnyExecutionBoard,
  BlackTonnyManifest,
} from '#/types/black-tonny';

import { computed } from 'vue';

import {
  normalizeExportHref,
  toObjectEntries,
  toSentenceList,
} from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  board?: BlackTonnyExecutionBoard;
  manifest?: BlackTonnyManifest;
  subtitle?: string;
  title?: string;
}>();

const todayMustDo = computed(() => toSentenceList(props.board?.today_must_do));
const weeklyStrategy = computed(() =>
  toSentenceList(props.board?.weekly_strategy),
);
const riskAlerts = computed(() => toSentenceList(props.board?.risk_alerts));
const roleActions = computed(() => toObjectEntries(props.board?.role_actions));
const actionButtons = computed(() => props.board?.execution_buttons ?? []);
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '执行面板' }}
        </span>
        <span class="text-xs text-slate-400">
          {{ subtitle || '围绕今天、本周和角色动作展开' }}
        </span>
      </div>
    </template>

    <div class="grid gap-5">
      <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <h3 class="text-sm font-semibold text-slate-950">今天必须做</h3>
          <ul
            v-if="todayMustDo.length"
            class="mt-3 space-y-2 text-sm text-slate-600"
          >
            <li v-for="item in todayMustDo" :key="item">{{ item }}</li>
          </ul>
          <p v-else class="mt-3 text-sm text-slate-400">
            当前没有返回今天必须做的动作。
          </p>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 class="text-sm font-semibold text-slate-950">本周策略</h3>
          <ul
            v-if="weeklyStrategy.length"
            class="mt-3 space-y-2 text-sm text-slate-600"
          >
            <li v-for="item in weeklyStrategy" :key="item">{{ item }}</li>
          </ul>
          <p v-else class="mt-3 text-sm text-slate-400">
            当前没有返回本周策略。
          </p>
        </section>

        <section class="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
          <h3 class="text-sm font-semibold text-slate-950">风险提醒</h3>
          <ul
            v-if="riskAlerts.length"
            class="mt-3 space-y-2 text-sm text-slate-600"
          >
            <li v-for="item in riskAlerts" :key="item">{{ item }}</li>
          </ul>
          <p v-else class="mt-3 text-sm text-slate-400">
            当前没有返回风险提醒。
          </p>
        </section>
      </div>

      <section class="rounded-2xl border border-slate-200 p-4">
        <h3 class="text-sm font-semibold text-slate-950">角色动作</h3>
        <div v-if="roleActions.length" class="mt-4 grid gap-4 md:grid-cols-3">
          <div
            v-for="[role, items] in roleActions"
            :key="role"
            class="rounded-2xl bg-slate-50/80 p-4"
          >
            <h4 class="text-sm font-semibold text-slate-950">{{ role }}</h4>
            <ul
              v-if="Array.isArray(items) && items.length"
              class="mt-3 space-y-2 text-sm text-slate-600"
            >
              <li v-for="item in items" :key="String(item)">{{ item }}</li>
            </ul>
            <p v-else class="mt-3 text-sm text-slate-400">当前没有分配动作。</p>
          </div>
        </div>
        <EmptyStateBlock
          v-else
          compact
          description="当前 payload 没有返回角色动作。"
          title="暂无角色动作"
        />
      </section>

      <section class="rounded-2xl border border-slate-200 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-950">导出动作</h3>
          <span class="text-xs text-slate-400">
            可用导出
            {{ Object.keys(manifest?.available_exports ?? {}).length }} 个
          </span>
        </div>
        <div v-if="actionButtons.length" class="mt-4 flex flex-wrap gap-3">
          <a
            v-for="button in actionButtons"
            :key="`${button.label}-${button.href}`"
            :href="normalizeExportHref(button.href)"
            class="inline-flex min-w-44 flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
          >
            <span class="text-sm font-semibold text-slate-900">
              {{ button.label || '导出动作' }}
            </span>
            <span class="mt-1 text-xs text-slate-400">
              {{ button.status || 'ready' }}
            </span>
            <span class="mt-2 text-sm text-slate-500">
              {{ button.note || '打开对应导出文件' }}
            </span>
          </a>
        </div>
        <EmptyStateBlock
          v-else
          compact
          description="当前 payload 没有返回执行按钮。"
          title="暂无导出动作"
        />
      </section>
    </div>
  </el-card>
</template>
