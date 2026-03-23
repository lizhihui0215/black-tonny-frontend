<script lang="ts" setup>
import type { DateRangeInput, DateRangeTuple } from '#/utils/date-range';

import { createIconifyIcon } from '@vben/icons';
import { useI18n } from '@vben/locales';
import { computed, ref, watch } from 'vue';

import {
  addDays,
  cloneDateRange,
  formatDateRangeLabel,
  formatDateToken,
  normalizeDateRangeInput,
  normalizeDateInput,
  serializeDateRange,
} from '#/utils/date-range';

type CompactPanelMode = 'custom' | 'preset';
type QuickRangeId =
  | 'last14Days'
  | 'last30Days'
  | 'last7Days'
  | 'last90Days'
  | 'lastMonth'
  | 'thisMonth'
  | 'today'
  | 'yesterday';

interface QuickRangeItem {
  id: QuickRangeId;
  label: string;
  range: DateRangeTuple;
}

const props = withDefaults(
  defineProps<{
    initialRange?: DateRangeInput;
    theme?: 'dark' | 'light';
    title?: string;
    variant?: 'compact' | 'default';
  }>(),
  {
    initialRange: undefined,
    theme: 'light',
    title: undefined,
    variant: 'default',
  },
);

const emit = defineEmits<{
  change: [
    value: {
      label: string;
      range: [string, string];
    },
  ];
}>();

const CalendarRangeIcon = createIconifyIcon('lucide:calendar-range');
const ChevronDownIcon = createIconifyIcon('lucide:chevrons-up-down');
const { locale, t } = useI18n();

const hasManualSelection = ref(false);
const isOpen = ref(false);
const committedRange = ref<DateRangeTuple>(
  normalizeDateRangeInput(props.initialRange),
);
const draftRange = ref<DateRangeTuple>(cloneDateRange(committedRange.value));
const isCompact = computed(() => props.variant === 'compact');
const compactPanelMode = ref<CompactPanelMode>('preset');
const displayTitle = computed(() => {
  locale.value;
  return props.title ?? t('page.common.dateRange.rangeTitle');
});

const triggerClass = computed(() =>
  isCompact.value
    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
    : props.theme === 'dark'
      ? 'border-white/10 bg-white/10 text-white shadow-[0_16px_48px_-28px_rgba(15,23,42,0.88)] hover:bg-white/15'
      : 'border-slate-200 bg-white text-slate-600 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)] hover:border-slate-300 hover:text-slate-900',
);

const subLabelClass = computed(() =>
  isCompact.value
    ? 'text-slate-400'
    : props.theme === 'dark'
      ? 'text-slate-200/80'
      : 'text-slate-400',
);

const iconClass = computed(() =>
  isCompact.value
    ? 'text-slate-400'
    : props.theme === 'dark'
      ? 'text-slate-100'
      : 'text-slate-500',
);
const accentBadgeClass = computed(() =>
  isCompact.value
    ? 'bg-transparent text-slate-400'
    : props.theme === 'dark'
      ? 'bg-white/10 text-amber-300'
      : 'bg-amber-50 text-amber-500',
);

const rangeLabel = computed(() => formatDateRangeLabel(committedRange.value));
const compactRangeLabel = computed(() =>
  formatUsDateRange(committedRange.value),
);
const rangeSummary = computed(() => {
  locale.value;
  const start = committedRange.value[0].getTime();
  const end = committedRange.value[1].getTime();
  return t('page.common.dateRange.daysView', {
    count: Math.floor((end - start) / 86_400_000) + 1,
  });
});
const draftStartValue = computed(() => formatDateToken(draftRange.value[0]));
const draftEndValue = computed(() => formatDateToken(draftRange.value[1]));
const draftRangeDays = computed(() => {
  locale.value;
  return t('page.common.dateRange.days', {
    count:
      Math.floor(
        (draftRange.value[1].getTime() - draftRange.value[0].getTime()) /
          86_400_000,
      ) + 1,
  });
});

function buildCompactQuickRanges(anchor: Date): QuickRangeItem[] {
  locale.value;
  const today = anchor;
  const yesterday = addDays(anchor, -1);
  const thisMonthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const lastMonthStart = new Date(
    anchor.getFullYear(),
    anchor.getMonth() - 1,
    1,
  );
  const lastMonthEnd = new Date(anchor.getFullYear(), anchor.getMonth(), 0);

  return [
    {
      id: 'today',
      label: t('page.common.dateRange.today'),
      range: [today, today] as DateRangeTuple,
    },
    {
      id: 'yesterday',
      label: t('page.common.dateRange.yesterday'),
      range: [yesterday, yesterday] as DateRangeTuple,
    },
    {
      id: 'last7Days',
      label: t('page.common.dateRange.last7Days'),
      range: [addDays(anchor, -6), anchor] as DateRangeTuple,
    },
    {
      id: 'last30Days',
      label: t('page.common.dateRange.last30Days'),
      range: [addDays(anchor, -29), anchor] as DateRangeTuple,
    },
    {
      id: 'thisMonth',
      label: t('page.common.dateRange.thisMonth'),
      range: [thisMonthStart, anchor] as DateRangeTuple,
    },
    {
      id: 'lastMonth',
      label: t('page.common.dateRange.lastMonth'),
      range: [lastMonthStart, lastMonthEnd] as DateRangeTuple,
    },
  ];
}

function buildDefaultQuickRanges(anchor: Date): QuickRangeItem[] {
  locale.value;
  return [
    {
      id: 'last7Days',
      label: t('page.common.dateRange.last7Days'),
      range: [addDays(anchor, -6), anchor] as DateRangeTuple,
    },
    {
      id: 'last14Days',
      label: t('page.common.dateRange.last14Days'),
      range: [addDays(anchor, -13), anchor] as DateRangeTuple,
    },
    {
      id: 'last30Days',
      label: t('page.common.dateRange.last30Days'),
      range: [addDays(anchor, -29), anchor] as DateRangeTuple,
    },
    {
      id: 'last90Days',
      label: t('page.common.dateRange.last90Days'),
      range: [addDays(anchor, -89), anchor] as DateRangeTuple,
    },
  ];
}

function resolveQuickRanges(anchor: Date) {
  return isCompact.value
    ? buildCompactQuickRanges(anchor)
    : buildDefaultQuickRanges(anchor);
}

function findMatchingQuickRange(range: DateRangeTuple) {
  const draftTokens = serializeDateRange(range);
  const matched = resolveQuickRanges(range[1]).find((item) => {
    const itemTokens = serializeDateRange(item.range);
    return itemTokens[0] === draftTokens[0] && itemTokens[1] === draftTokens[1];
  });

  return matched;
}

function resolveCompactPanelMode(range: DateRangeTuple): CompactPanelMode {
  return findMatchingQuickRange(range) ? 'preset' : 'custom';
}

const quickRanges = computed(() => resolveQuickRanges(committedRange.value[1]));
const activeQuickRange = computed(() =>
  findMatchingQuickRange(draftRange.value),
);
const activeCompactOptionId = computed(() =>
  compactPanelMode.value === 'custom'
    ? 'custom'
    : (activeQuickRange.value?.id ?? 'custom'),
);
const compactOptionButtonClass = computed(
  () =>  (id: QuickRangeId | 'custom') =>
    id === activeCompactOptionId.value
      ? 'bg-[#FE9F43] text-white'
      : 'text-slate-500 hover:bg-[#FFF6EE] hover:text-[#FE9F43]',
);

const popoverClass = computed(() =>
  isCompact.value
    ? 'black-tonny-date-range-popper black-tonny-date-range-popper--compact'
    : 'black-tonny-date-range-popper',
);
const compactPopoverWidth = computed(() =>
  compactPanelMode.value === 'custom' ? 452 : 208,
);

watch(
  () => props.initialRange,
  (value) => {
    if (hasManualSelection.value) {
      return;
    }

    const nextRange = normalizeDateRangeInput(value);
    committedRange.value = nextRange;
    draftRange.value = cloneDateRange(nextRange);
    if (isCompact.value) {
      compactPanelMode.value = resolveCompactPanelMode(nextRange);
    }
  },
  { deep: true, immediate: true },
);

watch(isOpen, (open) => {
  if (open) {
    draftRange.value = cloneDateRange(committedRange.value);
    if (isCompact.value) {
      compactPanelMode.value = resolveCompactPanelMode(committedRange.value);
    }
  }
});

function chooseQuickRange(range: DateRangeTuple) {
  draftRange.value = cloneDateRange(range);
  if (isCompact.value) {
    compactPanelMode.value = 'preset';
  }
}

function enterCompactCustomMode() {
  compactPanelMode.value = 'custom';
}

function formatUsDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}/${month}/${day}`;
}

function formatUsDateRange(range: DateRangeTuple) {
  return `${formatUsDate(range[0])} - ${formatUsDate(range[1])}`;
}

function resolveRangeLabel(range: DateRangeTuple) {
  return isCompact.value
    ? formatUsDateRange(range)
    : formatDateRangeLabel(range);
}

function updateDraftRange(position: 'end' | 'start', value: string) {
  if (!value) {
    return;
  }

  const nextDate = normalizeDateInput(value);
  const [currentStart, currentEnd] = draftRange.value;

  if (position === 'start') {
    draftRange.value =
      nextDate.getTime() <= currentEnd.getTime()
        ? [nextDate, currentEnd]
        : [nextDate, nextDate];
    if (isCompact.value) {
      compactPanelMode.value = 'custom';
    }
    return;
  }

  draftRange.value =
    nextDate.getTime() >= currentStart.getTime()
      ? [currentStart, nextDate]
      : [nextDate, nextDate];

  if (isCompact.value) {
    compactPanelMode.value = 'custom';
  }
}

function applySelection() {
  if (!draftRange.value?.[0] || !draftRange.value?.[1]) {
    return;
  }

  committedRange.value = normalizeDateRangeInput(draftRange.value);
  draftRange.value = cloneDateRange(committedRange.value);
  hasManualSelection.value = true;
  if (isCompact.value) {
    compactPanelMode.value = resolveCompactPanelMode(committedRange.value);
  }
  isOpen.value = false;

  emit('change', {
    label: resolveRangeLabel(committedRange.value),
    range: serializeDateRange(committedRange.value),
  });
}

function resetSelection() {
  const nextRange = normalizeDateRangeInput(props.initialRange);
  committedRange.value = nextRange;
  draftRange.value = cloneDateRange(nextRange);
  hasManualSelection.value = false;
  if (isCompact.value) {
    compactPanelMode.value = resolveCompactPanelMode(nextRange);
  }
  isOpen.value = false;

  emit('change', {
    label: resolveRangeLabel(nextRange),
    range: serializeDateRange(nextRange),
  });
}
</script>

<template>
  <el-popover
    v-model:visible="isOpen"
    placement="bottom-end"
    :popper-class="popoverClass"
    trigger="click"
    :width="isCompact ? compactPopoverWidth : 360"
  >
    <template #reference>
      <span v-if="isCompact" class="relative inline-flex">
        <CalendarRangeIcon
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-400"
        />
        <button
          :class="triggerClass"
          class="inline-flex h-10 w-52 items-center rounded-md border pl-10 pr-3 text-left text-[13px] font-medium transition"
          data-testid="date-range-trigger"
          type="button"
        >
          <span class="truncate">{{ compactRangeLabel }}</span>
        </button>
      </span>

      <button
        v-else
        :class="triggerClass"
        class="inline-flex min-w-[236px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition"
        data-testid="date-range-trigger"
        type="button"
      >
        <span class="flex items-center gap-3">
          <span
            :class="accentBadgeClass"
            class="flex h-11 w-11 items-center justify-center rounded-2xl"
          >
            <CalendarRangeIcon class="text-lg" />
          </span>
          <span class="block">
            <span
              :class="subLabelClass"
              class="block text-[11px] font-semibold uppercase tracking-[0.24em]"
            >
              {{ displayTitle }}
            </span>
            <span class="mt-1 block text-sm font-semibold tracking-tight">
              {{ rangeLabel }}
            </span>
          </span>
        </span>
        <span class="flex items-center gap-2">
          <span :class="subLabelClass" class="text-xs font-medium">
            {{ rangeSummary }}
          </span>
          <ChevronDownIcon :class="iconClass" class="text-base" />
        </span>
      </button>
    </template>

    <div :class="isCompact ? 'space-y-3' : 'space-y-4'">
      <div v-if="!isCompact">
        <p class="text-sm font-semibold text-slate-950">
          {{ t('page.common.dateRange.adjustView') }}
        </p>
        <p class="mt-1 text-xs leading-5 text-slate-500">
          {{ t('page.common.dateRange.rangeHint') }}
        </p>
      </div>

      <div
        v-if="isCompact"
        :class="
          compactPanelMode === 'custom'
            ? 'grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]'
            : ''
        "
      >
        <div class="overflow-hidden rounded border border-slate-200 bg-white">
          <button
            v-for="item in quickRanges"
            :key="item.id"
            :class="compactOptionButtonClass(item.id)"
            class="flex w-full items-center justify-start border-b border-slate-100 px-3 py-2 text-left text-xs font-medium last:border-b-0 transition"
            :data-testid="`date-range-quick-${item.id}`"
            type="button"
            @click="chooseQuickRange(item.range)"
          >
            {{ item.label }}
          </button>

          <button
            :class="compactOptionButtonClass('custom')"
            class="flex w-full items-center justify-start px-3 py-2 text-left text-xs font-medium transition"
            data-testid="date-range-custom"
            type="button"
            @click="enterCompactCustomMode"
          >
            {{ t('page.common.dateRange.customRange') }}
          </button>
          <div
            v-if="compactPanelMode !== 'custom'"
            class="flex items-center justify-end gap-2 border-t border-slate-100 px-3 py-2.5"
          >
            <button
              class="rounded px-2 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              data-testid="date-range-cancel"
              type="button"
              @click="isOpen = false"
            >
              {{ t('page.common.dateRange.cancel') }}
            </button>
            <button
              class="rounded border border-[#FE9F43] bg-[#FE9F43] px-2 py-1 text-xs font-bold text-white transition hover:bg-[#E04F16] hover:border-[#E04F16]"
              data-testid="date-range-apply"
              type="button"
              @click="applySelection"
            >
              {{ t('page.common.dateRange.apply') }}
            </button>
          </div>
        </div>

        <div
          v-if="compactPanelMode === 'custom'"
          class="space-y-3 rounded border border-slate-200 bg-white p-3"
        >
          <div
            class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3"
          >
            <div>
              <p
                class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400"
              >
                {{ t('page.common.dateRange.customRange') }}
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ formatUsDateRange(draftRange) }}
              </p>
            </div>
            <span
              class="rounded bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500"
            >
              {{ draftRangeDays }}
            </span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="rounded border border-slate-200 bg-white px-3 py-2.5">
              <span
                class="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
              >
                {{ t('page.common.dateRange.startDate') }}
              </span>
              <input
                :value="draftStartValue"
                class="mt-2 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-hidden"
                type="date"
                @input="
                  updateDraftRange(
                    'start',
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </label>

            <label class="rounded border border-slate-200 bg-white px-3 py-2.5">
              <span
                class="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
              >
                {{ t('page.common.dateRange.endDate') }}
              </span>
              <input
                :value="draftEndValue"
                class="mt-2 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-hidden"
                type="date"
                @input="
                  updateDraftRange(
                    'end',
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </label>
          </div>

          <div
            class="flex items-center justify-end gap-2 border-t border-slate-100 pt-3"
          >
            <button
              class="rounded px-2 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              data-testid="date-range-cancel"
              type="button"
              @click="isOpen = false"
            >
              {{ t('page.common.dateRange.cancel') }}
            </button>
            <button
              class="rounded border border-[#FE9F43] bg-[#FE9F43] px-2 py-1 text-xs font-bold text-white transition hover:bg-[#E04F16] hover:border-[#E04F16]"
              data-testid="date-range-apply"
              type="button"
              @click="applySelection"
            >
              {{ t('page.common.dateRange.apply') }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-2">
        <button
          v-for="item in quickRanges"
          :key="item.id"
          :class="
            item.id === activeQuickRange?.id
              ? 'border-[#FE9F43] bg-[#FFF6EE] text-[#FE9F43]'
              : 'border-slate-200 text-slate-600 hover:border-[#FE9F43] hover:bg-[#FFF6EE] hover:text-[#FE9F43]'
          "
          class="rounded-md border px-3 py-2 text-sm font-medium transition"
          type="button"
          @click="chooseQuickRange(item.range)"
        >
          {{ item.label }}
        </button>
      </div>

      <div
        v-if="!isCompact"
        :class="
          isCompact
            ? 'rounded-md border border-slate-200 bg-white p-3'
            : 'rounded-[20px] border border-slate-200 bg-slate-50/80 p-3'
        "
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400"
            >
              {{ t('page.common.dateRange.manualSelection') }}
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-900">
              {{
                isCompact
                  ? formatUsDateRange(draftRange)
                  : formatDateRangeLabel(draftRange)
              }}
            </p>
          </div>
          <span
            :class="
              isCompact
                ? 'rounded-md bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500'
                : 'rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm'
            "
          >
            {{ draftRangeDays }}
          </span>
        </div>

        <div
          class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
        >
          <label
            :class="
              isCompact
                ? 'rounded-md border border-slate-200 bg-slate-50 px-3 py-3'
                : 'rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm'
            "
          >
            <span
              class="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
            >
              {{ t('page.common.dateRange.startDate') }}
            </span>
            <input
              :value="draftStartValue"
              class="mt-2 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-hidden"
              type="date"
              @input="
                updateDraftRange(
                  'start',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </label>

          <span
            class="hidden text-sm font-medium text-slate-400 sm:inline-flex"
          >
            {{ t('page.common.dateRange.to') }}
          </span>

          <label
            :class="
              isCompact
                ? 'rounded-md border border-slate-200 bg-slate-50 px-3 py-3'
                : 'rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm'
            "
          >
            <span
              class="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
            >
              {{ t('page.common.dateRange.endDate') }}
            </span>
            <input
              :value="draftEndValue"
              class="mt-2 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-hidden"
              type="date"
              @input="
                updateDraftRange(
                  'end',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </label>
        </div>
      </div>

      <div
        v-if="!isCompact"
        class="flex items-center justify-between gap-3 border-t border-slate-100 pt-3"
      >
        <button
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          type="button"
          @click="resetSelection"
        >
          {{ t('page.common.dateRange.reset') }}
        </button>

        <div class="flex items-center gap-2">
          <button
            class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            type="button"
            @click="isOpen = false"
          >
            {{ t('page.common.dateRange.cancel') }}
          </button>
          <button
            class="rounded-md bg-[#FE9F43] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E04F16]"
            type="button"
            @click="applySelection"
          >
            {{ t('page.common.dateRange.apply') }}
          </button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
:global(.black-tonny-date-range-popper) {
  padding: 18px;
  overflow: hidden;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 22px;
  box-shadow: 0 24px 80px -32px rgb(15 23 42 / 25%);
}

:global(.black-tonny-date-range-popper--compact) {
  padding: 10px;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: none;
}
</style>
