<script lang="ts" setup>
import type {
  BlackTonnyManifest,
  BlackTonnyPayload,
  DashboardSummaryResponse,
} from '#/types/black-tonny';

import { computed, onMounted, ref, watchEffect } from 'vue';

import { loadDashboardSummary } from '#/api';
import DateRangeTrigger from '#/components/date-range-trigger.vue';
import { setAiAssistantContext } from '#/composables/use-ai-assistant';
import { Page } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { useI18n } from '@vben/locales';
import {
  normalizeDateRangeInput,
  serializeDateRange,
} from '#/utils/date-range';

import DashboardSummaryCard from '../dashboard/components/dashboard-summary-card.vue';
import {
  applyDashboardSummaryResponse,
  buildDashboardSummaryCards,
  buildDashboardSummaryRequestFromRange,
  createDashboardSummaryFilterState,
} from '../dashboard/dashboard-summary';
import PageShellContent from './page-shell-content.vue';
import { BLACK_TONNY_PAGE_SPECS } from './page-specs';

defineOptions({ name: 'DashboardShell' });

const props = withDefaults(
  defineProps<{
    errorMessage?: string;
    isLoading?: boolean;
    manifest?: BlackTonnyManifest;
    payload?: BlackTonnyPayload;
  }>(),
  {
    errorMessage: '',
    isLoading: false,
  },
);

function asRecord(value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function toOptionalText(value: unknown) {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : undefined;
}

function toTextList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => toOptionalText(item))
    .filter((item): item is string => Boolean(item));
}

const { locale, t } = useI18n();
const dashboardPageSpec = BLACK_TONNY_PAGE_SPECS.dashboard;
const summaryResponse = ref<DashboardSummaryResponse>();
const summaryError = ref('');
const summaryLoading = ref(false);
const summaryRequestId = ref(0);
const summaryFilterState = ref(
  createDashboardSummaryFilterState(
    serializeDateRange(normalizeDateRangeInput()),
  ),
);
const CircleAlertIcon = createIconifyIcon('lucide:circle-alert');
const CloseIcon = createIconifyIcon('lucide:x');
const alertVisible = ref(true);
const consultingAnalysisRecord = computed(() =>
  asRecord(props.payload?.consulting_analysis),
);
const executionButtons = computed(
  () => props.payload?.execution_board?.execution_buttons ?? [],
);
const summaryDateRange = computed<[string, string]>(() => [
  summaryFilterState.value.startDate,
  summaryFilterState.value.endDate,
]);
const summaryFallbackText = computed(() => {
  locale.value;
  return summaryLoading.value
    ? t('page.dashboardSummary.status.loading')
    : t('page.dashboardSummary.status.unavailable');
});
const summaryCardSections = computed(() => {
  locale.value;
  return buildDashboardSummaryCards(
    summaryResponse.value,
    (key) => t(key),
    summaryFallbackText.value,
  );
});
const primarySummaryCards = computed(() => summaryCardSections.value.primary);
const secondarySummaryCards = computed(
  () => summaryCardSections.value.secondary,
);
const greetingTitle = computed(() => {
  locale.value;
  return t('page.dashboardData.greeting.title');
});
const greetingSubtitle = computed(() => {
  locale.value;
  const orderCount = summaryResponse.value?.summary.orderCount?.value;
  const countText =
    typeof orderCount === 'number'
      ? orderCount.toLocaleString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US')
      : '--';

  return t('page.dashboardData.greeting.subtitle', {
    count: countText,
  });
});
const healthLightAlerts = computed(() =>
  (props.payload?.health_lights ?? [])
    .map((item) => {
      const title = toOptionalText(item.title);
      const note = toOptionalText(item.note);

      if (!title) {
        return undefined;
      }

      return note ? `${title}：${note}` : title;
    })
    .filter((item): item is string => Boolean(item)),
);
const consultingRiskAlerts = computed(() =>
  toTextList(consultingAnalysisRecord.value?.risk_alerts),
);
const executionRiskAlerts = computed(() =>
  toTextList(props.payload?.execution_board?.risk_alerts),
);
const dashboardTipAlerts = computed(() =>
  (props.payload?.dashboard_tips ?? [])
    .map((item) => {
      const term = toOptionalText(item.term);
      const watch = toOptionalText(item.watch);

      if (!watch) {
        return undefined;
      }

      return term ? `${term}：${watch}` : watch;
    })
    .filter((item): item is string => Boolean(item)),
);
const primaryAlert = computed(() => {
  const text =
    executionRiskAlerts.value[0] ||
    consultingRiskAlerts.value[0] ||
    healthLightAlerts.value[0] ||
    dashboardTipAlerts.value[0];

  if (!text) {
    return undefined;
  }

  const primaryAction = executionButtons.value[0];
  return {
    linkLabel: toOptionalText(primaryAction?.label),
    text,
  };
});

async function refreshDashboardSummary(request = summaryFilterState.value) {
  const currentRequestId = summaryRequestId.value + 1;
  summaryRequestId.value = currentRequestId;
  summaryLoading.value = true;
  summaryError.value = '';

  try {
    const response = await loadDashboardSummary({
      endDate: request.preset === 'custom' ? request.endDate : undefined,
      preset: request.preset,
      startDate: request.preset === 'custom' ? request.startDate : undefined,
    });

    if (currentRequestId !== summaryRequestId.value) {
      return;
    }

    summaryResponse.value = response;
    summaryFilterState.value = applyDashboardSummaryResponse(response);
  } catch (error) {
    if (currentRequestId !== summaryRequestId.value) {
      return;
    }

    summaryError.value =
      error instanceof Error ? error.message : 'summary fetch failed';
  } finally {
    if (currentRequestId === summaryRequestId.value) {
      summaryLoading.value = false;
    }
  }
}

function handleSummaryDateChange(value: { range: [string, string] }) {
  const request = buildDashboardSummaryRequestFromRange(value.range);
  summaryFilterState.value = {
    ...summaryFilterState.value,
    endDate: request.endDate,
    preset: request.preset,
    startDate: request.startDate,
  };
  void refreshDashboardSummary(summaryFilterState.value);
}

watchEffect(() => {
  const cards = [...primarySummaryCards.value, ...secondarySummaryCards.value];
  const highlightedMetrics = cards
    .filter((item) => item.value !== '--')
    .slice(0, 4)
    .map((item) => `${item.label} ${item.value}，${item.compareText}`);

  const riskPoints = Array.from(
    new Set([
      ...executionRiskAlerts.value,
      ...consultingRiskAlerts.value,
      ...healthLightAlerts.value,
      ...dashboardTipAlerts.value,
    ]),
  ).slice(0, 4);

  const managerActions = executionButtons.value
    .map((item) => {
      const title = toOptionalText(item.label);
      const note = toOptionalText(item.note);

      if (!title) {
        return undefined;
      }

      return {
        note: note || '当前页面已提供动作入口。',
        title,
      };
    })
    .filter(
      (
        item,
      ): item is {
        note: string;
        title: string;
      } => Boolean(item),
    );

  const staffActions = toTextList(
    asRecord(props.payload?.execution_board?.role_actions)?.['店员'],
  );
  const todayTasks = toTextList(props.payload?.today_focus?.tasks);
  const sourceNote = summaryLoading.value
    ? '正在读取 /api/dashboard/summary。'
    : summaryError.value
      ? 'summary 接口暂未成功返回，当前会结合页面 payload 与 summary 空态回答。'
      : `当前区间 ${summaryFilterState.value.startDate} 至 ${summaryFilterState.value.endDate}。`;

  setAiAssistantContext({
    actions:
      managerActions.length > 0
        ? managerActions
        : [
            primaryAlert.value
              ? {
                  note: '来自 dashboard 当前 payload 的优先提醒。',
                  title: primaryAlert.value.text,
                }
              : undefined,
          ].filter(
            (
              item,
            ): item is {
              note: string;
              title: string;
            } => Boolean(item),
          ),
    description: dashboardPageSpec.businessGoal,
    guardrails: [
      '顶部 summary 的指标口径以后端接口返回为准。',
      '下半部分区块以当前页面 payload 为准。',
      '我只解释当前页面已经加载的数据，不在前端重算经营指标。',
    ],
    headline: primaryAlert.value?.text || greetingTitle.value,
    metrics: highlightedMetrics,
    pageKey: 'dashboard',
    pageTitle: dashboardPageSpec.pageTitle,
    prompts: [
      '今天先看什么',
      '哪个指标最异常',
      '先跟店员同步什么',
      '这期和上期怎么比',
    ],
    riskPoints,
    sourceNote,
    staffTips: Array.from(new Set([...staffActions, ...todayTasks])).slice(0, 4),
    summary: summaryError.value
      ? '顶部 summary 暂未拿到完整接口结果，先结合页面 payload 判断。'
      : `当前区间为 ${summaryFilterState.value.startDate} 到 ${summaryFilterState.value.endDate}，先看顶部 8 张卡，再下钻到正式 payload 区块。`,
  });
});

onMounted(() => {
  void refreshDashboardSummary();
});
</script>

<template>
  <Page content-class="!p-6">
    <div class="space-y-6" data-testid="dashboard-main">
      <section
        data-testid="dashboard-hero"
        class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="mb-1">
          <h1 class="text-[32px] font-bold tracking-tight text-slate-900">
            {{ greetingTitle }}
          </h1>
          <p class="mt-1 text-sm font-medium text-slate-500">
            {{ greetingSubtitle }}
          </p>
        </div>
        <DateRangeTrigger
          :initial-range="summaryDateRange"
          variant="compact"
          @change="handleSummaryDateChange"
        />
      </section>

      <section
        v-if="summaryError"
        class="rounded border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-[13px] text-amber-700"
      >
        {{ t('page.dashboardSummary.status.unavailable') }}
      </section>

      <section
        v-if="alertVisible && primaryAlert"
        class="flex items-start justify-between gap-3 rounded border border-transparent bg-[#FCEFEA] px-3.5 py-2.5 text-[13px] text-slate-500"
      >
        <div class="flex flex-wrap items-center gap-1.5">
          <CircleAlertIcon class="text-sm text-[#E04F16]" />
          <span>{{ primaryAlert.text }}</span>
          <button
            v-if="primaryAlert.linkLabel"
            class="font-semibold text-[#E04F16] underline decoration-[#F5C3AB] underline-offset-2"
            type="button"
          >
            {{ primaryAlert.linkLabel }}
          </button>
        </div>
        <button
          class="text-slate-400 transition hover:text-slate-600"
          type="button"
          @click="alertVisible = false"
        >
          <CloseIcon class="text-sm" />
        </button>
      </section>

      <section
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        data-testid="dashboard-summary-primary"
      >
        <DashboardSummaryCard
          v-for="item in primarySummaryCards"
          :key="item.key"
          :accent="item.accent"
          :compare-text="item.compareText"
          :compare-tone="item.compareTone"
          :icon="item.icon"
          :label="item.label"
          :sub-text="item.subText"
          :value="item.value"
          variant="primary"
        />
      </section>

      <section
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        data-testid="dashboard-summary-secondary"
      >
        <DashboardSummaryCard
          v-for="item in secondarySummaryCards"
          :key="item.key"
          :accent="item.accent"
          :compare-text="item.compareText"
          :compare-tone="item.compareTone"
          :icon="item.icon"
          :label="item.label"
          :sub-text="item.subText"
          :value="item.value"
          variant="secondary"
        />
      </section>

      <PageShellContent
        :error-message="props.errorMessage"
        :is-loading="props.isLoading"
        :manifest="props.manifest"
        page-key="dashboard"
        :page-spec="dashboardPageSpec"
        :payload="props.payload"
      />
    </div>
  </Page>
</template>
