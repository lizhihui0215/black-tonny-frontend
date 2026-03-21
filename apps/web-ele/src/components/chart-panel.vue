<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import type { EchartsUIType } from '@vben/plugins/echarts';
import type { BlackTonnyTableRow } from '#/types/black-tonny';

import { computed, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import EmptyStateBlock from './empty-state-block.vue';

const props = withDefaults(
  defineProps<{
    chartType?: 'bar' | 'line';
    description?: string;
    dimensionKey: string;
    rows?: BlackTonnyTableRow[];
    title: string;
    valueKeys: string[];
  }>(),
  {
    chartType: 'bar',
    description: '',
    rows: () => [],
  },
);

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const hasRows = computed(() => Boolean(props.rows.length));

function displaySeriesLabel(key: string) {
  return (
    {
      avg_order_value: '客单价',
      member_ratio: '会员占比',
      order_count: '订单数',
      sales_amount: '销售额',
      sales_qty: '销售件数',
    }[key] ?? key
  );
}

const option = computed<EChartsOption>(() => ({
  color: ['#0f172a', '#c2410c', '#0f766e'],
  grid: {
    bottom: 24,
    left: 16,
    right: 16,
    top: 24,
    containLabel: true,
  },
  legend: {
    bottom: 0,
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    axisLabel: {
      interval: 0,
      rotate: props.rows.length > 6 ? 20 : 0,
    },
    data: props.rows.map((row) => String(row[props.dimensionKey] ?? '未命名')),
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: props.valueKeys.map((key) => ({
    data: props.rows.map((row) => Number(row[key] ?? 0)),
    name: displaySeriesLabel(key),
    smooth: props.chartType === 'line',
    type: props.chartType,
  })),
}));

watch(
  option,
  async (value) => {
    if (!hasRows.value) {
      return;
    }
    await renderEcharts(value);
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-base font-semibold text-slate-950">{{ title }}</span>
          <p
            v-if="description"
            class="mt-1 max-w-2xl text-sm leading-6 text-slate-500"
          >
            {{ description }}
          </p>
        </div>
        <span class="text-xs text-slate-400">样本图表</span>
      </div>
    </template>

    <div v-if="hasRows" class="h-96">
      <EchartsUI ref="chartRef" class="h-full w-full" />
    </div>
    <EmptyStateBlock
      v-else
      compact
      description="当前样本没有可绘制的图表数据。"
      title="暂无图表"
    />
  </el-card>
</template>
