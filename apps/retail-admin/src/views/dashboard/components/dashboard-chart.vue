<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = withDefaults(
  defineProps<{
    height?: string;
    option: EChartsOption;
    width?: string;
  }>(),
  {
    height: '320px',
    width: '100%',
  },
);

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

async function renderChart() {
  await renderEcharts(props.option, true);
}

onMounted(renderChart);

watch(
  () => props.option,
  async () => {
    await renderChart();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <EchartsUI ref="chartRef" :height="props.height" :width="props.width" />
</template>
