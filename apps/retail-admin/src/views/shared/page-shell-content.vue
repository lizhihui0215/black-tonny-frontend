<script lang="ts" setup>
import type {
  BlackTonnyManifest,
  BlackTonnyPageBlockKey,
  BlackTonnyPageKey,
  BlackTonnyPageSpec,
  BlackTonnyPayload,
} from '#/types/black-tonny';
import type { Component } from 'vue';

import { computed } from 'vue';

import ChartPanel from '#/components/chart-panel.vue';
import ConsultingAnalysisPanel from '#/components/consulting-analysis-panel.vue';
import EmptyStateBlock from '#/components/empty-state-block.vue';
import ExecutionBoardPanel from '#/components/execution-board-panel.vue';
import HealthLightsPanel from '#/components/health-lights-panel.vue';
import InsightListPanel from '#/components/insight-list-panel.vue';
import MetricTableCard from '#/components/metric-table-card.vue';
import RelationshipPanel from '#/components/relationship-panel.vue';
import TodayFocusPanel from '#/components/today-focus-panel.vue';
import DecisionBriefPanel from '#/components/decision-brief-panel.vue';
import { resolveChartRows } from '#/utils/black-tonny';

interface ShellSection {
  component: Component;
  key: BlackTonnyPageBlockKey;
  layoutClass: string;
  props: Record<string, unknown>;
  title: string;
}

const props = defineProps<{
  errorMessage: string;
  isLoading: boolean;
  manifest?: BlackTonnyManifest;
  pageKey: BlackTonnyPageKey;
  pageSpec: BlackTonnyPageSpec;
  payload?: BlackTonnyPayload;
}>();

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

const chartRows = computed(() =>
  resolveChartRows(props.payload, props.pageSpec.primaryChart),
);
const tableConfigs = computed(() =>
  props.pageSpec.tableOrder.map((table) => ({
    ...table,
    rows: props.payload?.tables?.[table.key] ?? [],
  })),
);

const sectionCatalog = computed<Record<BlackTonnyPageBlockKey, ShellSection>>(
  () => ({
    consulting: {
      component: ConsultingAnalysisPanel,
      key: 'consulting',
      layoutClass: 'xl:col-span-12',
      props: {
        analysis: props.payload?.consulting_analysis,
        preferredKeys: consultingKeyMap[props.pageKey],
      },
      title: '经营分析',
    },
    decision: {
      component: DecisionBriefPanel,
      key: 'decision',
      layoutClass: 'xl:col-span-6',
      props: {
        decision: props.payload?.decision,
      },
      title: '判断摘要',
    },
    executionBoard: {
      component: ExecutionBoardPanel,
      key: 'executionBoard',
      layoutClass: 'xl:col-span-12',
      props: {
        board: props.payload?.execution_board,
        manifest: props.manifest,
      },
      title: '执行面板',
    },
    healthLights: {
      component: HealthLightsPanel,
      key: 'healthLights',
      layoutClass: 'xl:col-span-5',
      props: {
        items: props.payload?.health_lights,
      },
      title: '经营红绿灯',
    },
    insights: {
      component: InsightListPanel,
      key: 'insights',
      layoutClass: 'xl:col-span-12',
      props: {
        insights: props.payload?.insights,
        tips: props.payload?.dashboard_tips,
      },
      title: '关键提醒',
    },
    relationship: {
      component: RelationshipPanel,
      key: 'relationship',
      layoutClass: 'xl:col-span-12',
      props: {
        relationship: props.payload?.inventory_sales_relationship,
      },
      title: '库销关系',
    },
    todayFocus: {
      component: TodayFocusPanel,
      key: 'todayFocus',
      layoutClass: 'xl:col-span-7',
      props: {
        focus: props.payload?.today_focus,
      },
      title: '今天先做什么',
    },
  }),
);

const actionSections = computed(() =>
  props.pageSpec.expandedBlocks
    .filter((key) => actionKeys.has(key))
    .map((key) => sectionCatalog.value[key]),
);

const narrativeSections = computed(() =>
  props.pageSpec.expandedBlocks
    .filter((key) => !actionKeys.has(key))
    .map((key) => sectionCatalog.value[key]),
);

const collapsedSections = computed(() =>
  props.pageSpec.collapsedBlocks.map((key) => sectionCatalog.value[key]),
);
</script>

<template>
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
    正在读取页面数据…
  </div>

  <template v-else-if="payload">
    <div v-if="actionSections.length" class="grid gap-6 xl:grid-cols-12">
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

    <div v-if="narrativeSections.length" class="grid gap-6 xl:grid-cols-12">
      <div
        v-for="section in narrativeSections"
        :key="section.key"
        :class="section.layoutClass"
      >
        <component :is="section.component" v-bind="section.props" />
      </div>
    </div>

    <section
      class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400"
          >
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
          <p
            class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400"
          >
            More Analysis
          </p>
          <h2 class="mt-2 text-xl font-semibold text-slate-950">更多分析</h2>
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
    v-else
    description="页面 payload 未能成功加载，请先检查页面接口或测试 fixture。"
    title="没有可用页面数据"
  />
</template>
