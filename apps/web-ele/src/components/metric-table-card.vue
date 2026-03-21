<script lang="ts" setup>
import type { BlackTonnyTableRow } from '#/types/black-tonny';

import { computed } from 'vue';

import {
  extractTableColumns,
  formatTableCell,
} from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = withDefaults(
  defineProps<{
    description?: string;
    maxRows?: number;
    rows?: BlackTonnyTableRow[];
    title: string;
  }>(),
  {
    description: '',
    maxRows: 12,
    rows: () => [],
  },
);

const visibleRows = computed(() => props.rows.slice(0, props.maxRows));
const columns = computed(() => extractTableColumns(visibleRows.value));
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <span class="text-base font-semibold text-slate-950">{{ title }}</span>
          <p
            v-if="description"
            class="mt-1 max-w-2xl text-sm leading-6 text-slate-500"
          >
            {{ description }}
          </p>
        </div>
        <span class="text-xs text-slate-400">
          显示 {{ visibleRows.length }} / {{ rows.length }} 行
        </span>
      </div>
    </template>

    <div v-if="visibleRows.length" class="overflow-x-auto">
      <el-table
        :data="visibleRows"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="column in columns"
          :key="column"
          :label="column"
          :min-width="160"
          :prop="column"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-sm text-slate-700">
              {{ formatTableCell(column, row[column]) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <EmptyStateBlock
      v-else
      compact
      description="当前表格没有可展示的数据。"
      title="暂无表格数据"
    />
  </el-card>
</template>
