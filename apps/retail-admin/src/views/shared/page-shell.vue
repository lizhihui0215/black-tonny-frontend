<script lang="ts" setup>
import type {
  BlackTonnyManifest,
  BlackTonnyPageKey,
  BlackTonnyPayload,
} from '#/types/black-tonny';

import { computed, onMounted, ref, watchEffect } from 'vue';

import { loadBlackTonnyPayload } from '#/api';
import { setAiAssistantContext } from '#/composables/use-ai-assistant';
import DateRangeTrigger from '#/components/date-range-trigger.vue';
import SummaryCardGroup from '#/components/summary-card-group.vue';
import { buildTrailingRange } from '#/utils/date-range';
import {
  buildSummaryCardItems,
  formatDateTime,
  formatEmptyValue,
} from '#/utils/black-tonny';

import DashboardShell from './dashboard-shell.vue';
import PageShellContent from './page-shell-content.vue';
import { BLACK_TONNY_PAGE_SPECS } from './page-specs';

const props = defineProps<{
  pageKey: BlackTonnyPageKey;
}>();

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

const manifest = ref<BlackTonnyManifest>();
const payload = ref<BlackTonnyPayload>();
const errorMessage = ref('');
const isLoading = ref(false);
const heroClassMap = {
  analysis: 'from-slate-950 via-slate-900 to-teal-950',
  execution: 'from-slate-950 via-orange-950 to-slate-900',
  overview: 'from-slate-950 via-slate-900 to-amber-950',
  relationship: 'from-emerald-950 via-slate-950 to-slate-900',
  strategy: 'from-slate-950 via-slate-900 to-sky-950',
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
  ].find(
    (item): item is string =>
      typeof item === 'string' && item.trim().length > 0,
  );

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

onMounted(() => {
  void loadPage();
});

watchEffect(() => {
  if (pageSpec.value.shellKind === 'dashboard') {
    return;
  }

  const aiAnalysis = asRecord(payload.value?.ai_analysis);
  const bossBrief = asRecord(aiAnalysis?.boss_brief);
  const llmContract = asRecord(aiAnalysis?.llm_contract);

  const focusTags = Array.isArray(bossBrief?.focus_tags)
    ? bossBrief.focus_tags
        .map((item) => asRecord(item))
        .map((item) => toOptionalText(item?.label))
        .filter((item): item is string => Boolean(item))
    : [];

  const managerActions = Array.isArray(aiAnalysis?.manager_actions)
    ? aiAnalysis.manager_actions
        .map((item) => asRecord(item))
        .map((item) => {
          const title = toOptionalText(item?.title);
          const why = toOptionalText(item?.why);
          const nextStep = asRecord(item?.next_step);
          const nextLabel = toOptionalText(nextStep?.label);

          if (!title) {
            return undefined;
          }

          return {
            note: [why, nextLabel ? `下一步：${nextLabel}` : '']
              .filter(Boolean)
              .join(' '),
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
        )
    : [];

  const staffTips = Array.isArray(aiAnalysis?.staff_sync)
    ? aiAnalysis.staff_sync
        .map((item) => asRecord(item))
        .map((item) => {
          const title = toOptionalText(item?.title);
          const instruction = toOptionalText(item?.instruction);
          return instruction || title;
        })
        .filter((item): item is string => Boolean(item))
    : toTextList(payload.value?.today_focus?.tasks);

  const riskPoints = Array.isArray(aiAnalysis?.risk_explanations)
    ? aiAnalysis.risk_explanations
        .map((item) => asRecord(item))
        .map((item) => {
          const issue = toOptionalText(item?.issue);
          const check = toOptionalText(item?.what_to_check);

          if (!issue) {
            return undefined;
          }

          return check ? `${issue}。先看：${check}` : issue;
        })
        .filter((item): item is string => Boolean(item))
    : (payload.value?.health_lights ?? [])
        .map((item) => {
          const title = toOptionalText(item.title);
          const note = toOptionalText(item.note);

          if (!title) {
            return undefined;
          }

          return note ? `${title}：${note}` : title;
        })
        .filter((item): item is string => Boolean(item));

  const summaryMetrics = summaryCards.value
    .filter((item) => item.value !== '--')
    .slice(0, 4)
    .map((item) => `${item.label} ${item.value}`);

  const fallbackActions = toTextList(
    payload.value?.execution_board?.today_must_do,
  ).map((title) => ({
    title,
  }));

  const prompts = Array.from(
    new Set([
      ...focusTags,
      '今天先做什么',
      '给店员怎么同步',
      '有哪些风险需要先盯',
    ]),
  ).slice(0, 4);

  const sourceNote = [
    manifest.value?.analysis_batch_id
      ? `样本批次 ${manifest.value.analysis_batch_id}`
      : '',
    manifest.value?.generated_at
      ? `生成时间 ${formatDateTime(manifest.value.generated_at)}`
      : '',
  ]
    .filter(Boolean)
    .join('，');

  setAiAssistantContext({
    actions: managerActions.length > 0 ? managerActions : fallbackActions,
    description: pageSpec.value.businessGoal,
    guardrails:
      toTextList(llmContract?.guardrails).length > 0
        ? toTextList(llmContract?.guardrails)
        : [
            '只引用当前页面已加载的数据。',
            '不重算 KPI，只做解释、排序和行动建议。',
            '业务表达保持中文。',
          ],
    headline:
      toOptionalText(bossBrief?.headline) ||
      payload.value?.decision?.headline ||
      pageSpec.value.pageTitle,
    metrics: summaryMetrics,
    pageKey: pageSpec.value.pageKey,
    pageTitle: pageSpec.value.pageTitle,
    prompts,
    riskPoints,
    sourceNote,
    staffTips,
    summary:
      toOptionalText(bossBrief?.summary) ||
      payload.value?.decision?.summary ||
      pageSpec.value.pageSummary,
  });
});
</script>

<template>
  <DashboardShell
    v-if="pageSpec.shellKind === 'dashboard'"
    :error-message="errorMessage"
    :is-loading="isLoading"
    :manifest="manifest"
    :payload="payload"
  />

  <div v-else class="space-y-6 p-5">
    <section
      class="overflow-hidden rounded-[32px] bg-gradient-to-r px-6 py-6 text-white shadow-sm"
      :class="heroClassMap[pageSpec.heroMode]"
    >
      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-300"
          >
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

          <div v-if="decisionBadges.length" class="mt-4 flex flex-wrap gap-2">
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

          <div
            class="mt-5 rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur"
          >
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

    <PageShellContent
      :error-message="errorMessage"
      :is-loading="isLoading"
      :manifest="manifest"
      :page-key="props.pageKey"
      :page-spec="pageSpec"
      :payload="payload"
    />
  </div>
</template>
