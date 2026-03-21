<script lang="ts" setup>
withDefaults(
  defineProps<{
    compact?: boolean;
    description?: string;
    title?: string;
  }>(),
  {
    compact: false,
    description: '当前样本数据没有返回这一块内容。',
    title: '暂无内容',
  },
);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--el-border-color)] bg-slate-50/70 px-6 text-center text-[var(--el-text-color-secondary)] shadow-sm"
    :class="compact ? 'py-6' : 'min-h-48 py-10'"
  >
    <div class="text-sm font-semibold text-[var(--el-text-color-primary)]">
      {{ title }}
    </div>
    <p class="mt-2 max-w-xl text-sm leading-6">
      {{ description }}
    </p>
  </div>
</template>
