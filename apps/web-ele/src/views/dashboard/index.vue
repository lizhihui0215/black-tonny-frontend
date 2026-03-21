<script lang="ts" setup>
import type {
  DashboardAccent,
  DashboardStatusTone,
} from './dashboard.mock';

import { Page } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { useI18n } from '@vben/locales';
import { computed, ref } from 'vue';

import DateRangeTrigger from '#/components/date-range-trigger.vue';
import DashboardChart from './components/dashboard-chart.vue';
import DashboardKpiCard from './components/dashboard-kpi-card.vue';
import DashboardSectionCard from './components/dashboard-section-card.vue';
import { createDashboardPageMock } from './dashboard.mock';

const { locale, t } = useI18n();
const dashboard = computed(() => {
  locale.value;
  return createDashboardPageMock((key, params) =>
    params ? t(key, params) : t(key),
  );
});
const CalendarDaysIcon = createIconifyIcon('lucide:calendar-days');
const ChevronDownIcon = createIconifyIcon('lucide:chevron-down');
const CloseIcon = createIconifyIcon('lucide:x');
const alertVisible = ref(true);
const primaryAlert = computed(() => dashboard.value.alerts[0]);
const sectionDropdownClass
  = 'inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900';

const avatarClassMap: Record<DashboardAccent, string> = {
  amber: 'bg-amber-100/60 text-amber-600',
  blue: 'bg-blue-100/60 text-blue-600',
  emerald: 'bg-emerald-100/60 text-emerald-600',
  navy: 'bg-slate-200/70 text-slate-800',
  rose: 'bg-rose-100/60 text-rose-600',
  slate: 'bg-slate-100/70 text-slate-600',
  teal: 'bg-teal-100/60 text-teal-600',
  violet: 'bg-violet-100/60 text-violet-600',
};

const statusPillClassMap: Record<DashboardStatusTone, string> = {
  negative: 'bg-[#FFEDE9] text-[#E04F16]',
  neutral: 'bg-slate-100 text-slate-600',
  positive: 'bg-[#EEFAF1] text-[#3EB780]',
  warning: 'bg-[#FFF6EE] text-[#FE9F43]',
};

const statusTextClassMap: Record<DashboardStatusTone, string> = {
  negative: 'text-[#E04F16]',
  neutral: 'text-slate-600',
  positive: 'text-[#3EB780]',
  warning: 'text-[#FE9F43]',
};

function heatCellStyle(value: number) {
  const opacity = 0.12 + value * 0.18;
  return {
    backgroundColor: `hsl(var(--primary) / ${opacity})`,
    boxShadow: 'inset 0 0 0 1px hsl(var(--primary) / 0.1)',
  };
}

function resolveIcon(icon: string) {
  return createIconifyIcon(icon);
}
</script>

<template>
  <Page content-class="!p-6">
    <div class="space-y-6">
      <section class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="mb-1">
          <h1 class="text-[32px] font-bold tracking-tight text-slate-900">
            {{ dashboard.greetingTitle }}
          </h1>
          <p class="mt-1 text-sm font-medium text-slate-500">
            {{ dashboard.greetingSubtitle.split('200+')[0] }}
            <span class="font-bold text-primary">200+</span>
            {{ dashboard.greetingSubtitle.split('200+')[1] }}
          </p>
        </div>
        <DateRangeTrigger
          :initial-range="dashboard.dateRange"
          variant="compact"
        />
      </section>

      <section
        v-if="alertVisible && primaryAlert"
        class="flex items-start justify-between gap-3 rounded border border-transparent bg-[#FCEFEA] px-3.5 py-2.5 text-[13px] text-slate-500"
      >
        <div class="flex flex-wrap items-center gap-1.5">
          <component :is="resolveIcon(primaryAlert.icon)" class="text-sm text-[#E04F16]" />
          <span>{{ primaryAlert.text }}</span>
          <button
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

      <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          v-for="item in dashboard.heroMetrics"
          :key="item.id"
          :accent="item.accent"
          :delta="item.delta"
          :delta-tone="item.deltaTone"
          :icon="item.icon"
          :title="item.title"
          :value="item.value"
          variant="sale"
        />
      </section>

      <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          v-for="item in dashboard.secondaryMetrics"
          :key="item.id"
          :accent="item.accent"
          :action-label="item.actionLabel"
          :delta="item.delta"
          :delta-tone="item.deltaTone"
          :icon="item.icon"
          :note="item.note"
          :title="item.title"
          :value="item.value"
          variant="revenue"
        />
      </section>

      <section class="grid gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        <DashboardSectionCard
          icon="lucide:chart-column"
          icon-class="bg-primary/10 text-primary"
          :title="t('page.dashboardView.salesPurchase')"
        >
          <template #extra>
            <div class="inline-flex overflow-hidden rounded-md border border-slate-200">
              <button
                v-for="range in dashboard.analyticsRanges"
                :key="range"
                :class="[
                  'flex h-7 min-w-0 items-center justify-center border-r border-slate-200 bg-slate-50 px-2.5 text-[11px] font-medium last:border-r-0',
                  range === dashboard.activeAnalyticsRange
                    ? 'border-[#FE9F43] bg-[#FE9F43] text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                ]"
                type="button"
              >
                {{ range }}
              </button>
            </div>
          </template>

          <div class="space-y-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <article
                v-for="item in dashboard.analyticsHighlights"
                :key="item.id"
                class="rounded-lg border border-slate-200 px-3 py-2"
              >
                <p class="mb-1 inline-flex items-center text-xs text-slate-500">
                  <span
                    :class="
                      item.id === 'purchase' ? 'bg-[#FFE3CB]' : 'bg-[#FE9F43]'
                    "
                    class="mr-1 h-2 w-2 rounded-full"
                  ></span>
                  {{ item.label }}
                </p>
                <h4 class="text-2xl font-bold text-slate-900">
                  {{ item.value }}
                </h4>
              </article>
            </div>
            <DashboardChart :option="dashboard.analyticsChart" height="300px" />
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          icon="lucide:circle-alert"
          icon-class="bg-info/10 text-info"
          :title="t('page.dashboardView.overallInfo')"
        >
          <div class="space-y-5">
            <div class="grid gap-3 sm:grid-cols-3">
              <div
                v-for="stat in dashboard.overviewStats"
                :key="stat.id"
                class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center"
              >
                <span
                  :class="[
                    'mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl',
                    avatarClassMap[stat.accent],
                  ]"
                >
                  <component :is="resolveIcon(stat.icon)" class="text-base" />
                </span>
                <p class="mb-1 text-sm text-slate-500">
                  {{ stat.note }}
                </p>
                <h5 class="text-[22px] font-bold leading-none text-slate-900">
                  {{ stat.value }}
                </h5>
              </div>
            </div>

            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div class="mb-4 flex items-center justify-between">
                <p class="text-sm font-bold text-slate-900">
                  {{ t('page.dashboardView.customerOverview') }}
                </p>
                <button :class="sectionDropdownClass" type="button">
                  <CalendarDaysIcon class="text-sm text-slate-400" />
                  <span>{{ t('page.dashboardView.today') }}</span>
                  <ChevronDownIcon class="text-sm text-slate-400" />
                </button>
              </div>

              <div class="grid items-center gap-4 lg:grid-cols-[120px_minmax(0,1fr)]">
                <DashboardChart :option="dashboard.customerChart" height="120px" />
                <div class="space-y-2.5">
                  <div
                    v-for="item in dashboard.customerHighlights"
                    :key="item.id"
                    class="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
                  >
                    <div>
                      <p class="text-[11px] font-medium uppercase text-slate-400">
                        {{ item.label }}
                      </p>
                      <p class="text-[28px] font-bold leading-none text-slate-900">
                        {{ item.value }}
                      </p>
                    </div>
                    <span
                      :class="[
                        'rounded px-1.5 py-0.5 text-[10px] font-bold',
                        statusPillClassMap[item.tone],
                      ]"
                    >
                      {{ item.note }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <DashboardSectionCard
          icon="lucide:badge-dollar-sign"
          icon-class="bg-info/10 text-info"
          :title="t('page.dashboardView.topProducts')"
        >
          <template #extra>
            <button :class="sectionDropdownClass" type="button">
              <CalendarDaysIcon class="text-sm text-slate-400" />
              <span>{{ t('page.dashboardView.today') }}</span>
              <ChevronDownIcon class="text-sm text-slate-400" />
            </button>
          </template>

          <div class="divide-y divide-slate-50">
            <div
              v-for="item in dashboard.topProducts"
              :key="item.id"
              class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'h-10 w-10 flex items-center justify-center rounded-lg text-[10px] font-bold',
                    avatarClassMap[item.accent],
                  ]"
                >
                  {{ item.badge }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-900">{{ item.title }}</p>
                  <p class="text-[10px] text-slate-400 truncate font-medium">{{ item.subtitle }}</p>
                </div>
              </div>
              <span
                :class="[
                  'rounded px-1.5 py-0.5 text-[10px] font-bold',
                  statusPillClassMap[item.deltaTone ?? 'neutral'],
                ]"
              >
                {{ item.delta }}
              </span>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          :action-label="t('page.dashboardView.viewAll')"
          icon="lucide:triangle-alert"
          icon-class="bg-primary/10 text-primary"
          :title="t('page.dashboardView.lowStockProducts')"
        >
          <div class="divide-y divide-slate-50">
            <div
              v-for="item in dashboard.lowStockItems"
              :key="item.id"
              class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'h-10 w-10 flex items-center justify-center rounded-lg text-[10px] font-bold',
                    avatarClassMap[item.accent],
                  ]"
                >
                  {{ item.badge }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-900">{{ item.title }}</p>
                  <p class="text-[10px] font-medium text-slate-400">
                    {{ t('page.dashboardView.skuCode') }} {{ item.sku }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[11px] text-slate-500">{{ item.statusLabel }}</p>
                <p class="text-[22px] font-bold" :class="statusTextClassMap[item.statusTone]">
                  {{ item.stock }}
                </p>
              </div>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          icon="lucide:shopping-bag"
          icon-class="bg-pink-100 text-pink-500"
          :title="t('page.dashboardView.recentSales')"
        >
          <template #extra>
            <button :class="sectionDropdownClass" type="button">
              <CalendarDaysIcon class="text-sm text-slate-400" />
              <span>{{ t('page.dashboardView.weekly') }}</span>
              <ChevronDownIcon class="text-sm text-slate-400" />
            </button>
          </template>

          <div class="divide-y divide-slate-50">
            <div
              v-for="item in dashboard.recentSalesItems"
              :key="item.id"
              class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'h-10 w-10 flex items-center justify-center rounded-lg text-[10px] font-bold',
                    avatarClassMap[item.accent],
                  ]"
                >
                  {{ item.badge }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-900">{{ item.title }}</p>
                  <div class="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <span>{{ item.category }}</span>
                    <span>{{ item.amount }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-medium text-slate-400">
                  {{ item.when }}
                </p>
                <span
                  :class="[
                    'mt-1 inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold',
                    statusPillClassMap[item.statusTone],
                  ]"
                >
                  {{ item.statusLabel }}
                </span>
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </section>

      <section class="grid gap-6 2xl:grid-cols-[1.3fr_1fr]">
        <DashboardSectionCard
          icon="lucide:chart-column"
          icon-class="bg-rose-100 text-rose-500"
          :title="t('page.dashboardView.salesStatistics')"
        >
          <template #extra>
            <button :class="sectionDropdownClass" type="button">
              <CalendarDaysIcon class="text-sm text-slate-400" />
              <span>{{ dashboard.salesRanges[2] }}</span>
              <ChevronDownIcon class="text-sm text-slate-400" />
            </button>
          </template>

          <div class="space-y-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="item in dashboard.salesStatisticsHighlights"
                :key="item.id"
                class="rounded-lg border border-slate-200 px-4 py-3"
              >
                <div class="inline-flex items-center gap-2">
                  <p class="text-[22px] font-bold leading-none text-slate-900">
                    {{ item.value }}
                  </p>
                  <span
                    :class="
                      item.id === 'revenue'
                        ? 'text-[#3EB780]'
                        : 'text-[#E04F16]'
                    "
                    class="text-[11px] font-bold"
                  >
                    25%
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-500">
                  {{ item.label }}
                </p>
              </div>
            </div>
            <DashboardChart :option="dashboard.salesStatisticsChart" height="290px" />
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          :action-label="t('page.dashboardView.viewAll')"
          icon="lucide:receipt-text"
          icon-class="bg-primary/10 text-primary"
          :title="t('page.dashboardView.recentTransactions')"
        >
          <div class="space-y-5">
            <div class="border-b border-slate-50">
              <div class="flex items-center gap-5 overflow-x-auto no-scrollbar px-1">
                <button
                  v-for="tab in dashboard.transactionTabs"
                  :key="tab"
                  :class="[
                    'border-b-2 pb-2 text-sm font-semibold transition whitespace-nowrap',
                    tab === dashboard.activeTransactionTab
                      ? 'border-[#FE9F43] text-[#E04F16]'
                      : 'border-transparent text-slate-700 hover:text-[#E04F16]',
                  ]"
                  type="button"
                >
                  {{ tab }}
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <th class="pb-3">{{ t('page.dashboardView.tableDate') }}</th>
                    <th class="pb-3">{{ t('page.dashboardView.tableCustomer') }}</th>
                    <th class="pb-3 text-center">{{ t('page.dashboardView.tableStatus') }}</th>
                    <th class="pb-3 text-right">{{ t('page.dashboardView.tableAmount') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="item in dashboard.transactions" :key="item.id">
                    <td class="py-3.5 text-xs font-medium text-slate-500">
                      {{ item.date }}
                    </td>
                    <td class="py-3.5">
                      <div class="flex items-center gap-2.5">
                        <div
                          :class="[
                            'flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold',
                            avatarClassMap[item.accent],
                          ]"
                        >
                          {{ item.customer.slice(0, 2).toUpperCase() }}
                        </div>
                        <div class="min-w-0">
                          <p class="truncate text-xs font-bold text-slate-900">
                            {{ item.customer }}
                          </p>
                          <p class="text-[10px] text-slate-400">
                            {{ item.customerCode }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 text-center">
                      <span
                        :class="[
                          'rounded px-1.5 py-0.5 text-[10px] font-bold',
                          statusPillClassMap[item.statusTone],
                        ]"
                      >
                        {{ item.statusLabel }}
                      </span>
                    </td>
                    <td class="py-3.5 text-right text-sm font-bold text-slate-900 tabular-nums">
                      {{ item.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </DashboardSectionCard>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <DashboardSectionCard
          :action-label="t('page.dashboardView.viewAll')"
          icon="lucide:users"
          icon-class="bg-primary/10 text-primary"
          :title="t('page.dashboardView.topCustomers')"
        >
          <div class="divide-y divide-slate-50">
            <div
              v-for="item in dashboard.topCustomers"
              :key="item.id"
              class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'h-10 w-10 flex items-center justify-center rounded text-[10px] font-bold',
                    avatarClassMap[item.accent],
                  ]"
                >
                  {{ item.initials }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-900">{{ item.title }}</p>
                  <p class="text-[10px] font-medium text-slate-400">{{ item.location }}</p>
                </div>
              </div>
              <p class="text-lg font-bold text-slate-900 tabular-nums">{{ item.spend }}</p>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          icon="lucide:layout-grid"
          icon-class="bg-primary/10 text-primary"
          :title="t('page.dashboardView.topCategories')"
        >
          <template #extra>
            <button :class="sectionDropdownClass" type="button">
              <CalendarDaysIcon class="text-sm text-slate-400" />
              <span>{{ t('page.dashboardView.weekly') }}</span>
              <ChevronDownIcon class="text-sm text-slate-400" />
            </button>
          </template>

          <div class="space-y-6">
            <DashboardChart :option="dashboard.categoryChart" height="180px" />
            <div class="space-y-3">
              <div
                v-for="item in dashboard.categoryStats"
                :key="item.id"
                class="flex items-center justify-between gap-4"
              >
                <div>
                  <p class="text-sm font-medium text-slate-700">
                    {{ item.label }}
                  </p>
                </div>
                <div class="text-right leading-none">
                  <div class="inline-flex items-center gap-1">
                    <p class="text-2xl font-bold text-slate-900">
                      {{ item.sales.split(' ')[0] }}
                    </p>
                    <span class="text-xs font-medium text-slate-400">
                      {{ t('page.dashboardView.salesVolume') }}
                    </span>
                  </div>
                  <p class="mt-1 text-[10px] font-medium text-slate-300">
                    {{ item.share }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h6 class="text-sm font-bold text-slate-900">
                {{ t('page.dashboardView.categoryStatistics') }}
              </h6>
              <div class="mt-4 space-y-3 text-sm text-slate-500">
                <div class="flex items-center justify-between">
                  <span>{{ t('page.dashboardView.categoryCount') }}</span>
                  <span class="font-bold text-slate-900">698</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>{{ t('page.dashboardView.productCount') }}</span>
                  <span class="font-bold text-slate-900">7899</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          icon="lucide:calendar-days"
          icon-class="bg-violet-100 text-violet-500"
          :title="t('page.dashboardView.orderHeatmap')"
        >
          <template #extra>
            <button :class="sectionDropdownClass" type="button">
              <CalendarDaysIcon class="text-sm text-slate-400" />
              <span>{{ t('page.dashboardView.weekly') }}</span>
              <ChevronDownIcon class="text-sm text-slate-400" />
            </button>
          </template>

          <div class="space-y-4">
            <div class="grid grid-cols-[36px_repeat(7,minmax(0,1fr))] gap-2">
              <span class="text-[10px] font-bold text-slate-300">
                {{ t('page.dashboardView.timeSlot') }}
              </span>
              <span
                v-for="day in dashboard.heatmapDays"
                :key="day"
                class="text-center text-[10px] font-bold text-slate-400"
              >
                {{ day }}
              </span>

              <template v-for="row in dashboard.heatmapRows" :key="row.id">
                <span class="flex items-center text-[9px] font-bold text-slate-400">
                  {{ row.time }}
                </span>
                <div
                  v-for="(value, index) in row.values"
                  :key="`${row.id}-${dashboard.heatmapDays[index]}`"
                  class="h-7 cursor-pointer rounded-md transition-all hover:ring-2 hover:ring-primary/40"
                  :style="heatCellStyle(value)"
                ></div>
              </template>
            </div>
            <div class="flex items-center justify-between border-t border-slate-50 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                {{ t('page.dashboardView.activityLevel') }}
              </span>
              <div class="flex items-center gap-1">
                <div class="h-2 w-6 rounded bg-primary/10"></div>
                <div class="h-2 w-6 rounded bg-primary/40"></div>
                <div class="h-2 w-6 rounded bg-primary"></div>
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </section>
    </div>
  </Page>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
