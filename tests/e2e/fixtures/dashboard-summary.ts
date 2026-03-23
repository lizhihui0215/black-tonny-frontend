type DashboardSummaryPreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

type DashboardSummaryMetricKey =
  | 'attachRate'
  | 'avgOrderValue'
  | 'lowStockSkuCount'
  | 'orderCount'
  | 'outOfSeasonStockQty'
  | 'salesAmount'
  | 'salesQuantity'
  | 'sizeBreakStyleCount';

interface DashboardSummaryMetric {
  compareDirection: 'down' | 'flat' | 'up';
  compareType: 'rate' | 'value';
  compareValue: null | number;
  subText: string;
  unit: string;
  value: number;
}

interface DashboardSummaryResponse {
  dateRange: {
    compareEndDate: string;
    compareStartDate: string;
    endDate: string;
    preset: DashboardSummaryPreset;
    startDate: string;
  };
  summary: Record<DashboardSummaryMetricKey, DashboardSummaryMetric>;
}

const FIXTURE_ANCHOR = new Date(2026, 2, 22);

const SUMMARY_BY_PRESET: Record<
  Exclude<DashboardSummaryPreset, 'custom'>,
  Record<DashboardSummaryMetricKey, DashboardSummaryMetric>
> = {
  last30days: {
    attachRate: createMetric(2.4, '件/单', 'up', 0.2, 'value', '加购件数维持稳定'),
    avgOrderValue: createMetric(226, 'CNY', 'up', 16, 'value', '客单价回升'),
    lowStockSkuCount: createMetric(16, 'SKU', 'down', 3, 'value', '缺货压力略降'),
    orderCount: createMetric(182, '单', 'up', 24, 'value', '成交单数高于上期'),
    outOfSeasonStockQty: createMetric(62, '件', 'down', 8, 'value', '过季存货在回收'),
    salesAmount: createMetric(72_480, 'CNY', 'up', 14.6, 'rate', '销售额保持增长'),
    salesQuantity: createMetric(458, '件', 'up', 11.8, 'rate', '销量延续正增长'),
    sizeBreakStyleCount: createMetric(11, '款', 'down', 1, 'value', '断码款略有改善'),
  },
  last7days: {
    attachRate: createMetric(2.6, '件/单', 'up', 0.3, 'value', '连带率比上期更好'),
    avgOrderValue: createMetric(238, 'CNY', 'up', 12, 'value', '客单价高于上期'),
    lowStockSkuCount: createMetric(12, 'SKU', 'down', 4, 'value', '低库存 SKU 较上期减少'),
    orderCount: createMetric(96, '单', 'up', 9, 'value', '订单数较上期增加'),
    outOfSeasonStockQty: createMetric(48, '件', 'down', 6, 'value', '过季库存继续回落'),
    salesAmount: createMetric(32_680, 'CNY', 'up', 18.2, 'rate', '销售额较上期提升'),
    salesQuantity: createMetric(212, '件', 'up', 14.5, 'rate', '销量保持上升'),
    sizeBreakStyleCount: createMetric(7, '款', 'down', 2, 'value', '断码风险下降'),
  },
  lastMonth: {
    attachRate: createMetric(2.3, '件/单', 'flat', 0, 'value', '连带率与上月基本持平'),
    avgOrderValue: createMetric(214, 'CNY', 'up', 8, 'value', '客单价略有提升'),
    lowStockSkuCount: createMetric(18, 'SKU', 'down', 2, 'value', '低库存 SKU 稍有下降'),
    orderCount: createMetric(168, '单', 'up', 12, 'value', '订单数小幅增长'),
    outOfSeasonStockQty: createMetric(73, '件', 'down', 5, 'value', '过季库存较前月回落'),
    salesAmount: createMetric(61_200, 'CNY', 'up', 9.5, 'rate', '销售额高于前月'),
    salesQuantity: createMetric(402, '件', 'up', 6.2, 'rate', '销量稳步提升'),
    sizeBreakStyleCount: createMetric(13, '款', 'down', 1, 'value', '断码款下降'),
  },
  thisMonth: {
    attachRate: createMetric(2.5, '件/单', 'up', 0.2, 'value', '连带率高于月初'),
    avgOrderValue: createMetric(232, 'CNY', 'up', 11, 'value', '客单价表现稳定'),
    lowStockSkuCount: createMetric(14, 'SKU', 'down', 3, 'value', '低库存 SKU 正在下降'),
    orderCount: createMetric(118, '单', 'up', 15, 'value', '订单数保持增长'),
    outOfSeasonStockQty: createMetric(54, '件', 'down', 4, 'value', '过季库存逐步出清'),
    salesAmount: createMetric(38_560, 'CNY', 'up', 12.1, 'rate', '本月销售额高于同期'),
    salesQuantity: createMetric(246, '件', 'up', 10.7, 'rate', '销量高于同期'),
    sizeBreakStyleCount: createMetric(8, '款', 'down', 2, 'value', '断码风险下降'),
  },
  today: {
    attachRate: createMetric(2.8, '件/单', 'up', 0.4, 'value', '今天连带率不错'),
    avgOrderValue: createMetric(252, 'CNY', 'up', 24, 'value', '今天客单价更高'),
    lowStockSkuCount: createMetric(9, 'SKU', 'down', 2, 'value', '今日低库存 SKU 更少'),
    orderCount: createMetric(18, '单', 'up', 4, 'value', '今日订单数高于昨日'),
    outOfSeasonStockQty: createMetric(42, '件', 'down', 3, 'value', '过季库存继续回落'),
    salesAmount: createMetric(4_560, 'CNY', 'up', 22.4, 'rate', '今日销售额表现较好'),
    salesQuantity: createMetric(29, '件', 'up', 16.3, 'rate', '今日销量高于昨日'),
    sizeBreakStyleCount: createMetric(6, '款', 'down', 1, 'value', '断码款继续下降'),
  },
  yesterday: {
    attachRate: createMetric(2.2, '件/单', 'down', 0.2, 'value', '昨日连带率低于前一日'),
    avgOrderValue: createMetric(204, 'CNY', 'down', 14, 'value', '昨日客单价偏低'),
    lowStockSkuCount: createMetric(11, 'SKU', 'flat', 0, 'value', '低库存 SKU 无明显变化'),
    orderCount: createMetric(14, '单', 'down', 2, 'value', '昨日订单略少'),
    outOfSeasonStockQty: createMetric(45, '件', 'down', 1, 'value', '过季库存小幅下降'),
    salesAmount: createMetric(3_720, 'CNY', 'down', 8.5, 'rate', '昨日销售额低于前一日'),
    salesQuantity: createMetric(23, '件', 'down', 4.3, 'rate', '昨日销量回落'),
    sizeBreakStyleCount: createMetric(7, '款', 'flat', 0, 'value', '断码款无变化'),
  },
};

function createMetric(
  value: number,
  unit: string,
  compareDirection: 'down' | 'flat' | 'up',
  compareValue: null | number,
  compareType: 'rate' | 'value',
  subText: string,
): DashboardSummaryMetric {
  return {
    compareDirection,
    compareType,
    compareValue,
    subText,
    unit,
    value,
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateToken(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateToken(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function resolvePresetRange(
  preset: Exclude<DashboardSummaryPreset, 'custom'>,
): [string, string] {
  const anchor = new Date(FIXTURE_ANCHOR);
  const today = formatDateToken(anchor);
  const yesterday = formatDateToken(addDays(anchor, -1));

  switch (preset) {
    case 'today': {
      return [today, today];
    }
    case 'yesterday': {
      return [yesterday, yesterday];
    }
    case 'last7days': {
      return [formatDateToken(addDays(anchor, -6)), today];
    }
    case 'last30days': {
      return [formatDateToken(addDays(anchor, -29)), today];
    }
    case 'thisMonth': {
      return [formatDateToken(new Date(anchor.getFullYear(), anchor.getMonth(), 1)), today];
    }
    case 'lastMonth': {
      return [
        formatDateToken(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1)),
        formatDateToken(new Date(anchor.getFullYear(), anchor.getMonth(), 0)),
      ];
    }
  }
}

function inferPresetFromRange(
  startDate: string,
  endDate: string,
): Exclude<DashboardSummaryPreset, 'custom'> {
  const presetOrder: Exclude<DashboardSummaryPreset, 'custom'>[] = [
    'today',
    'yesterday',
    'last7days',
    'last30days',
    'thisMonth',
    'lastMonth',
  ];

  const matchedPreset = presetOrder.find((preset) => {
    const [candidateStartDate, candidateEndDate] = resolvePresetRange(preset);
    return candidateStartDate === startDate && candidateEndDate === endDate;
  });

  return matchedPreset ?? 'last7days';
}

function buildCompareRange(startDate: string, endDate: string) {
  const start = parseDateToken(startDate);
  const end = parseDateToken(endDate);
  const daySpan = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const compareEnd = addDays(start, -1);
  const compareStart = addDays(compareEnd, 1 - daySpan);

  return {
    compareEndDate: formatDateToken(compareEnd),
    compareStartDate: formatDateToken(compareStart),
  };
}

export function createDashboardSummaryFixture(
  query: URLSearchParams,
): DashboardSummaryResponse {
  const requestedPreset = (query.get('preset') as DashboardSummaryPreset | null) ?? 'last7days';
  const preset = requestedPreset === 'custom' ? 'custom' : requestedPreset;
  const [startDate, endDate] =
    preset === 'custom'
      ? [query.get('start_date') ?? '2026-03-10', query.get('end_date') ?? '2026-03-16']
      : resolvePresetRange(preset);
  const compareRange = buildCompareRange(startDate, endDate);
  const effectivePreset =
    preset === 'custom'
      ? inferPresetFromRange(startDate, endDate)
      : preset;

  return {
    dateRange: {
      ...compareRange,
      endDate,
      preset,
      startDate,
    },
    summary: SUMMARY_BY_PRESET[effectivePreset],
  };
}
