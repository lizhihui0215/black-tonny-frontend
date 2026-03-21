<script lang="ts" setup>
import type {
  BlackTonnyManifest,
  BlackTonnyPageBlockKey,
  BlackTonnyPageKey,
  BlackTonnyPayload,
} from '#/types/black-tonny';
import type { Component } from 'vue';

import { computed, onMounted, ref } from 'vue';

import { loadBlackTonnyPayload } from '#/api';
import ChartPanel from '#/components/chart-panel.vue';
import ConsultingAnalysisPanel from '#/components/consulting-analysis-panel.vue';
import DateRangeTrigger from '#/components/date-range-trigger.vue';
import DecisionBriefPanel from '#/components/decision-brief-panel.vue';
import EmptyStateBlock from '#/components/empty-state-block.vue';
import ExecutionBoardPanel from '#/components/execution-board-panel.vue';
import HealthLightsPanel from '#/components/health-lights-panel.vue';
import InsightListPanel from '#/components/insight-list-panel.vue';
import MetricTableCard from '#/components/metric-table-card.vue';
import RelationshipPanel from '#/components/relationship-panel.vue';
import SummaryCardGroup from '#/components/summary-card-group.vue';
import TodayFocusPanel from '#/components/today-focus-panel.vue';
import { buildTrailingRange } from '#/utils/date-range';
import {
  buildSummaryCardItems,
  formatDateTime,
  formatEmptyValue,
  resolveChartRows,
} from '#/utils/black-tonny';

import { BLACK_TONNY_PAGE_SPECS } from './page-specs';

const props = defineProps<{
  pageKey: BlackTonnyPageKey;
}>();

interface ShellSection {
  component: Component;
  key: BlackTonnyPageBlockKey;
  layoutClass: string;
  props: Record<string, unknown>;
  title: string;
}

const manifest = ref<BlackTonnyManifest>();
const payload = ref<BlackTonnyPayload>();
const errorMessage = ref('');
const isLoading = ref(false);

const actionKeys = new Set<BlackTonnyPageBlockKey>([
  'executionBoard',
  'healthLights',
  'todayFocus',
]);
const consultingKeyMap: Record<BlackTonnyPageKey, string[]> = {
  dashboard: [
    'focus_issues',
    'weekly_actions',
    'replenish_advice',
    'clearance_advice',
    'risk_alerts',
  ],
  details: [
    'focus_issues',
    'inventory_analysis',
    'category_analysis',
    'sku_analysis',
    'risk_alerts',
  ],
  monthly: [
    'weekly_actions',
    'replenish_advice',
    'clearance_advice',
    'role_guidance',
  ],
  quarterly: [
    'priority_matrix',
    'category_advice',
    'inventory_analysis',
    'rhythm_analysis',
    'if_ignore',
  ],
  relationship: [
    'replenish_advice',
    'clearance_advice',
    'category_advice',
    'risk_alerts',
  ],
};
const heroClassMap = {
  analysis:
    'from-slate-950 via-slate-900 to-teal-950',
  execution:
    'from-slate-950 via-orange-950 to-slate-900',
  overview:
    'from-slate-950 via-slate-900 to-amber-950',
  relationship:
    'from-emerald-950 via-slate-950 to-slate-900',
  strategy:
    'from-slate-950 via-slate-900 to-sky-950',
} as const;
const pageRangeWindowMap: Record<BlackTonnyPageKey, number> = {
  dashboard: 7,
  details: 14,
  monthly: 30,
  quarterly: 90,
  relationship: 30,
};

const pageSpec = computed(() => BLACK_TONNY_PAGE_SPECS[props.pageKey]);
const heroDateRange = computed(() => {
  const anchor = [
    manifest.value?.generated_at,
    payload.value?.summary_cards?.data_capture_at,
    payload.value?.meta?.generated_at,
  ].find((item): item is string => typeof item === 'string' && item.trim().length > 0);

  return anchor
    ? buildTrailingRange(anchor, pageRangeWindowMap[props.pageKey])
    : undefined;
});
const summaryCards = computed(() =>
  buildSummaryCardItems(
    payload.value?.summary_cards,
    pageSpec.value.summaryPriority,
  ),
);
const chartRows = computed(() =>
  resolveChartRows(payload.value, pageSpec.value.primaryChart),
);
const tableConfigs = computed(() =>
  pageSpec.value.tableOrder.map((table) => ({
    ...table,
    rows: payload.value?.tables?.[table.key] ?? [],
  })),
);

const decisionBadges = computed(() =>
  [
    payload.value?.decision?.mode,
    payload.value?.decision?.stage,
    payload.value?.decision?.season,
    payload.value?.decision?.phase,
  ]
    .map((item) => String(item ?? '').trim())
    .filter(Boolean),
);

const heroMetaCards = computed(() => [
  {
    label: '门店',
    value: formatEmptyValue(
      payload.value?.summary_cards?.store_name ?? manifest.value?.store_name,
    ),
  },
  {
    label: '样本批次',
    value: formatEmptyValue(manifest.value?.analysis_batch_id),
  },
  {
    label: '生成时间',
    value: formatDateTime(
      manifest.value?.generated_at ??
        payload.value?.summary_cards?.data_capture_at ??
        payload.value?.meta?.generated_at,
    ),
  },
  {
    label: '销售口径',
    value: formatEmptyValue(
      payload.value?.summary_cards?.sales_source_label ??
        payload.value?.meta?.sales_source_label,
    ),
  },
]);

const sectionCatalog = computed<Record<BlackTonnyPageBlockKey, ShellSection>>(
  () => ({
    consulting: {
      component: ConsultingAnalysisPanel,
      key: 'consulting',
      layoutClass: 'xl:col-span-12',
      props: {
        analysis: payload.value?.consulting_analysis,
        preferredKeys: consultingKeyMap[props.pageKey],
      },
      title: '经营分析',
    },
    decision: {
      component: DecisionBriefPanel,
      key: 'decision',
      layoutClass: 'xl:col-span-6',
      props: {
        decision: payload.value?.decision,
      },
      title: '判断摘要',
    },
    executionBoard: {
      component: ExecutionBoardPanel,
      key: 'executionBoard',
      layoutClass: 'xl:col-span-12',
      props: {
        board: payload.value?.execution_board,
        manifest: manifest.value,
      },
      title: '执行面板',
    },
    healthLights: {
      component: HealthLightsPanel,
      key: 'healthLights',
      layoutClass: 'xl:col-span-5',
      props: {
        items: payload.value?.health_lights,
      },
      title: '经营红绿灯',
    },
    insights: {
      component: InsightListPanel,
      key: 'insights',
      layoutClass: 'xl:col-span-12',
      props: {
        insights: payload.value?.insights,
        tips: payload.value?.dashboard_tips,
      },
      title: '关键提醒',
    },
    relationship: {
      component: RelationshipPanel,
      key: 'relationship',
      layoutClass: 'xl:col-span-12',
      props: {
        relationship: payload.value?.inventory_sales_relationship,
      },
      title: '库销关系',
    },
    todayFocus: {
      component: TodayFocusPanel,
      key: 'todayFocus',
      layoutClass: 'xl:col-span-7',
      props: {
        focus: payload.value?.today_focus,
      },
      title: '今天先做什么',
    },
  }),
);

const actionSections = computed(() =>
  pageSpec.value.expandedBlocks
    .filter((key) => actionKeys.has(key))
    .map((key) => sectionCatalog.value[key]),
);

const narrativeSections = computed(() =>
  pageSpec.value.expandedBlocks
    .filter((key) => !actionKeys.has(key))
    .map((key) => sectionCatalog.value[key]),
);

const collapsedSections = computed(() =>
  pageSpec.value.collapsedBlocks.map((key) => sectionCatalog.value[key]),
);

async function loadPage() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const data = await loadBlackTonnyPayload(props.pageKey);
    manifest.value = data.manifest;
    payload.value = data.payload;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '页面数据加载失败';
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadPage);
</script>

<template>
  <div class="space-y-6 p-5">
    <section
      class="overflow-hidden rounded-[32px] bg-gradient-to-r px-6 py-6 text-white shadow-sm"
      :class="heroClassMap[pageSpec.heroMode]"
    >
      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-300">
            {{ pageSpec.pageTitle }}
          </p>
          <h1 class="mt-3 text-3xl font-semibold tracking-tight">
            {{ payload?.decision?.headline || pageSpec.pageTitle }}
          </h1>
          <p class="mt-3 max-w-4xl text-sm leading-7 text-slate-200">
            {{ payload?.decision?.summary || pageSpec.pageSummary }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="question in pageSpec.keyQuestions"
              :key="question"
              class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100"
            >
              {{ question }}
            </span>
          </div>

          <div
            v-if="decisionBadges.length"
            class="mt-4 flex flex-wrap gap-2"
          >
            <el-tag
              v-for="badge in decisionBadges"
              :key="badge"
              effect="dark"
              round
              size="small"
            >
              {{ badge }}
            </el-tag>
          </div>

          <div class="mt-5 rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-300">
              这个页面负责
            </p>
            <p class="mt-2 text-sm leading-7 text-slate-100">
              {{ pageSpec.businessGoal }}
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex xl:justify-end">
            <DateRangeTrigger
              class="self-start"
              :initial-range="heroDateRange"
              theme="dark"
              title="页面观察窗口"
            />
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <article
              v-for="item in heroMetaCards"
              :key="item.label"
              class="rounded-[22px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur"
            >
              <p class="text-xs uppercase tracking-[0.24em] text-slate-300">
                {{ item.label }}
              </p>
              <p class="mt-3 text-sm leading-6 text-white">
                {{ item.value }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <SummaryCardGroup
      :cards="summaryCards"
      :description="pageSpec.businessGoal"
      :title="`${pageSpec.pageTitle}核心指标`"
    />

    <el-alert
      v-if="errorMessage"
      :closable="false"
      show-icon
      type="error"
      :title="errorMessage"
    />

    <div
      v-if="isLoading"
      class="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm"
    >
      正在读取样本数据…
    </div>

    <template v-else-if="payload">
      <div
        v-if="actionSections.length"
        class="grid gap-6 xl:grid-cols-12"
      >
        <div
          v-for="section in actionSections"
          :key="section.key"
          :class="section.layoutClass"
        >
          <component :is="section.component" v-bind="section.props" />
        </div>
      </div>

      <ChartPanel
        :chart-type="pageSpec.primaryChart.chartType"
        :description="pageSpec.primaryChart.description"
        :dimension-key="pageSpec.primaryChart.dimensionKey"
        :rows="chartRows"
        :title="pageSpec.primaryChart.title"
        :value-keys="pageSpec.primaryChart.valueKeys"
      />

      <div
        v-if="narrativeSections.length"
        class="grid gap-6 xl:grid-cols-12"
      >
        <div
          v-for="section in narrativeSections"
          :key="section.key"
          :class="section.layoutClass"
        >
          <component :is="section.component" v-bind="section.props" />
        </div>
      </div>

      <section class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Core Tables
            </p>
            <h2 class="mt-2 text-xl font-semibold text-slate-950">
              本页核心表格
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              只保留这个页面最值得先看的表格，先做判断，再决定是否继续下钻。
            </p>
          </div>
        </div>

        <div class="mt-6 grid gap-6">
          <MetricTableCard
            v-for="table in tableConfigs"
            :key="table.key"
            :description="table.description"
            :max-rows="table.maxRows"
            :rows="table.rows"
            :title="table.title"
          />
        </div>
      </section>

      <section
        v-if="collapsedSections.length"
        class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              More Analysis
            </p>
            <h2 class="mt-2 text-xl font-semibold text-slate-950">
              更多分析
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              这部分保留更深一层的分析材料，保证首页信息先聚焦，细节再展开。
            </p>
          </div>
        </div>

        <el-collapse class="mt-6">
          <el-collapse-item
            v-for="section in collapsedSections"
            :key="section.key"
            :name="section.key"
            :title="section.title"
          >
            <component :is="section.component" v-bind="section.props" />
          </el-collapse-item>
        </el-collapse>
      </section>
    </template>

    <EmptyStateBlock
      v-else-if="!isLoading"
      description="页面 payload 未能成功加载，请先运行样本同步脚本。"
      title="没有可用页面数据"
    />
  </div>
</template>
