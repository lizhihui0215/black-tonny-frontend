import type {
  DashboardSummaryMetric,
  DashboardSummaryMetricKey,
  DashboardSummaryPreset,
  DashboardSummaryResponse,
} from '#/types/black-tonny';
import type {
  DashboardAccent,
  DashboardStatusTone,
} from './dashboard-presentation';

import {
  addDays,
  formatDateToken,
  startOfDay,
} from '#/utils/date-range';
import { formatMoney, formatQuantity } from '#/utils/black-tonny';

type DashboardSummaryTranslate = (key: string) => string;

type DashboardSummaryVariant = 'primary' | 'secondary';

interface DashboardSummaryCardConfigItem {
  accent: DashboardAccent;
  icon: string;
  improvementDirection: 'down' | 'up';
  labelKey: string;
  variant: DashboardSummaryVariant;
}

export interface DashboardSummaryCardItem {
  accent: DashboardAccent;
  compareText: string;
  compareTone: DashboardStatusTone;
  icon: string;
  key: DashboardSummaryMetricKey;
  label: string;
  subText: string;
  value: string;
  variant: DashboardSummaryVariant;
}

export interface DashboardSummaryFilterState {
  compareEndDate: string;
  compareStartDate: string;
  endDate: string;
  preset: DashboardSummaryPreset;
  startDate: string;
}

const DASHBOARD_SUMMARY_CARD_ORDER: DashboardSummaryMetricKey[] = [
  'salesAmount',
  'orderCount',
  'avgOrderValue',
  'salesQuantity',
  'attachRate',
  'lowStockSkuCount',
  'sizeBreakStyleCount',
  'outOfSeasonStockQty',
];

const DASHBOARD_SUMMARY_CARD_CONFIG: Record<
  DashboardSummaryMetricKey,
  DashboardSummaryCardConfigItem
> = {
  attachRate: {
    accent: 'emerald',
    icon: 'lucide:shopping-cart',
    improvementDirection: 'up',
    labelKey: 'page.dashboardSummary.cards.attachRate',
    variant: 'secondary',
  },
  avgOrderValue: {
    accent: 'teal',
    icon: 'lucide:badge-dollar-sign',
    improvementDirection: 'up',
    labelKey: 'page.dashboardSummary.cards.avgOrderValue',
    variant: 'primary',
  },
  lowStockSkuCount: {
    accent: 'amber',
    icon: 'lucide:triangle-alert',
    improvementDirection: 'down',
    labelKey: 'page.dashboardSummary.cards.lowStockSkuCount',
    variant: 'secondary',
  },
  orderCount: {
    accent: 'navy',
    icon: 'lucide:receipt-text',
    improvementDirection: 'up',
    labelKey: 'page.dashboardSummary.cards.orderCount',
    variant: 'primary',
  },
  outOfSeasonStockQty: {
    accent: 'rose',
    icon: 'lucide:archive',
    improvementDirection: 'down',
    labelKey: 'page.dashboardSummary.cards.outOfSeasonStockQty',
    variant: 'secondary',
  },
  salesAmount: {
    accent: 'amber',
    icon: 'lucide:wallet-cards',
    improvementDirection: 'up',
    labelKey: 'page.dashboardSummary.cards.salesAmount',
    variant: 'primary',
  },
  salesQuantity: {
    accent: 'blue',
    icon: 'lucide:package-2',
    improvementDirection: 'up',
    labelKey: 'page.dashboardSummary.cards.salesQuantity',
    variant: 'primary',
  },
  sizeBreakStyleCount: {
    accent: 'violet',
    icon: 'lucide:ruler',
    improvementDirection: 'down',
    labelKey: 'page.dashboardSummary.cards.sizeBreakStyleCount',
    variant: 'secondary',
  },
};

function formatSummaryMetricValue(metric?: DashboardSummaryMetric) {
  if (!metric) {
    return '--';
  }

  if (metric.unit === 'CNY') {
    return formatMoney(metric.value);
  }

  return formatQuantity(metric.value, metric.unit || undefined);
}

function formatCompareValue(metric?: DashboardSummaryMetric, t?: DashboardSummaryTranslate) {
  if (!metric) {
    return '--';
  }

  if (metric.compareValue === null) {
    return '--';
  }

  if (metric.compareDirection === 'flat' || metric.compareValue === 0) {
    return t
      ? t('page.dashboardSummary.compare.noChange')
      : '较上期无变化';
  }

  const absoluteValue = Math.abs(metric.compareValue);
  const sign = metric.compareDirection === 'down' ? '-' : '+';

  if (metric.compareType === 'rate') {
    return `${sign}${absoluteValue.toLocaleString('zh-CN', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    })}%`;
  }

  return `${sign}${formatQuantity(absoluteValue, metric.unit || undefined)}`;
}

function resolveCompareTone(
  key: DashboardSummaryMetricKey,
  metric?: DashboardSummaryMetric,
): DashboardStatusTone {
  if (
    !metric ||
    metric.compareValue === null ||
    metric.compareDirection === 'flat' ||
    metric.compareValue === 0
  ) {
    return 'neutral';
  }

  return metric.compareDirection ===
    DASHBOARD_SUMMARY_CARD_CONFIG[key].improvementDirection
    ? 'positive'
    : 'negative';
}

function createDateTokenRange(anchor: Date) {
  const today = startOfDay(anchor);
  const yesterday = addDays(today, -1);
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    last30days: [formatDateToken(addDays(today, -29)), formatDateToken(today)],
    last7days: [formatDateToken(addDays(today, -6)), formatDateToken(today)],
    lastMonth: [formatDateToken(lastMonthStart), formatDateToken(lastMonthEnd)],
    thisMonth: [formatDateToken(thisMonthStart), formatDateToken(today)],
    today: [formatDateToken(today), formatDateToken(today)],
    yesterday: [formatDateToken(yesterday), formatDateToken(yesterday)],
  } satisfies Record<
    Exclude<DashboardSummaryPreset, 'custom'>,
    [string, string]
  >;
}

export function resolveDashboardSummaryPreset(
  range: [string, string],
  anchor: Date = new Date(),
): DashboardSummaryPreset {
  const [startDate, endDate] = range;
  const tokens = createDateTokenRange(anchor);

  const matchedEntry = Object.entries(tokens).find(([, candidate]) => {
    return candidate[0] === startDate && candidate[1] === endDate;
  });

  return (matchedEntry?.[0] as DashboardSummaryPreset | undefined) ?? 'custom';
}

export function createDashboardSummaryFilterState(
  range: [string, string],
  anchor: Date = new Date(),
): DashboardSummaryFilterState {
  return {
    compareEndDate: '',
    compareStartDate: '',
    endDate: range[1],
    preset: resolveDashboardSummaryPreset(range, anchor),
    startDate: range[0],
  };
}

export function buildDashboardSummaryRequestFromRange(
  range: [string, string],
  anchor: Date = new Date(),
) {
  const preset = resolveDashboardSummaryPreset(range, anchor);
  return {
    endDate: range[1],
    preset,
    startDate: range[0],
  };
}

export function applyDashboardSummaryResponse(
  response: DashboardSummaryResponse,
): DashboardSummaryFilterState {
  return {
    compareEndDate: response.dateRange.compareEndDate,
    compareStartDate: response.dateRange.compareStartDate,
    endDate: response.dateRange.endDate,
    preset: response.dateRange.preset,
    startDate: response.dateRange.startDate,
  };
}

export function buildDashboardSummaryCards(
  response: DashboardSummaryResponse | null | undefined,
  t: DashboardSummaryTranslate,
  fallbackSubText: string,
) {
  const cards = DASHBOARD_SUMMARY_CARD_ORDER.map<DashboardSummaryCardItem>(
    (key) => {
      const config = DASHBOARD_SUMMARY_CARD_CONFIG[key];
      const metric = response?.summary[key];

      return {
        accent: config.accent,
        compareText: formatCompareValue(metric, t),
        compareTone: resolveCompareTone(key, metric),
        icon: config.icon,
        key,
        label: t(config.labelKey),
        subText: metric?.subText || fallbackSubText,
        value: formatSummaryMetricValue(metric),
        variant: config.variant,
      };
    },
  );

  return {
    primary: cards.filter((card) => card.variant === 'primary'),
    secondary: cards.filter((card) => card.variant === 'secondary'),
  };
}
