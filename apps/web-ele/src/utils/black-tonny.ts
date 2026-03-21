import type {
  BlackTonnyConsultingAnalysis,
  BlackTonnyDecision,
  BlackTonnyDecisionFactViewModel,
  BlackTonnyNarrativeSectionViewModel,
  BlackTonnyPageChartSpec,
  BlackTonnyPayload,
  BlackTonnySummaryCardViewModel,
  BlackTonnyTableRow,
  DisplayFormatters,
} from '#/types/black-tonny';

import { BLACK_TONNY_SUMMARY_CARD_CONFIG } from '#/views/shared/page-specs';

const EMPTY_VALUE_TEXT = '暂无数据';

const decisionLabels: Record<string, string> = {
  mode: '经营打法',
  phase: '阶段位置',
  season: '当前季节',
  stage: '经营阶段',
  top_clearance: '优先去化',
  top_replenish: '优先补货',
  top_seasonal: '季节重点',
};

const consultingLabels: Record<string, string> = {
  category_advice: '品类动作',
  category_analysis: '品类分析',
  clearance_advice: '去化建议',
  focus_issues: '当前重点问题',
  if_ignore: '如果不处理',
  inventory_analysis: '库存分析',
  member_analysis: '会员分析',
  priority_matrix: '优先矩阵',
  replenish_advice: '补货建议',
  rhythm_analysis: '节奏分析',
  risk_alerts: '风险提醒',
  role_guidance: '角色协同',
  sales_analysis: '销售分析',
  sku_analysis: 'SKU 分析',
  weekly_actions: '一周动作',
};

function toNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function formatEmptyValue(value: unknown) {
  return value === null || value === undefined || value === ''
    ? EMPTY_VALUE_TEXT
    : String(value);
}

export function formatQuantity(value: unknown, unit?: string) {
  const numeric = toNumber(value);
  if (numeric === null) {
    return formatEmptyValue(value);
  }

  const formatted = numeric.toLocaleString('zh-CN', {
    maximumFractionDigits: Number.isInteger(numeric) ? 0 : 1,
    minimumFractionDigits: 0,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatDateTime(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return EMPTY_VALUE_TEXT;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

export function formatMoney(value: unknown) {
  const numeric = toNumber(value);
  if (numeric === null) {
    return formatEmptyValue(value);
  }
  return `¥${numeric.toLocaleString('zh-CN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
}

export function formatPercent(value: unknown) {
  const numeric = toNumber(value);
  if (numeric === null) {
    return formatEmptyValue(value);
  }
  const percentValue = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
  return `${percentValue.toLocaleString('zh-CN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`;
}

export const displayFormatters: DisplayFormatters = {
  date: formatDateTime,
  emptyValue: formatEmptyValue,
  money: formatMoney,
  percent: formatPercent,
  quantity: formatQuantity,
};

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE_TEXT;
  }
  if (typeof value === 'number') {
    return formatQuantity(value);
  }
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(' / ') : EMPTY_VALUE_TEXT;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export function formatTableCell(column: string, value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    if (
      value.includes('元') ||
      value.includes('%') ||
      value.includes('天') ||
      value.includes('折')
    ) {
      return value;
    }
  }

  if (/日期|时间/.test(column)) {
    return formatDateTime(value);
  }
  if (/毛利率|占比|率|折扣|through|ratio/i.test(column)) {
    return formatPercent(value);
  }
  if (/金额|销售额|零售额|成本|毛利|单价|价/.test(column)) {
    return formatMoney(value);
  }
  if (/天数|库存|销量|数量|订单|件|SKU|周数|补量|补货量|库龄/.test(column)) {
    return formatQuantity(value);
  }
  return formatValue(value);
}

export function getToneColor(tone?: string) {
  if (tone === 'red') return '#b42318';
  if (tone === 'green') return '#027a48';
  if (tone === 'yellow' || tone === 'orange') return '#b54708';
  return '#475467';
}

export function normalizeExportHref(href?: string) {
  if (!href) {
    return '';
  }
  const fileName = href.split('/').pop()?.replace(/^\.\//, '') ?? '';
  return fileName ? `/exports/${fileName}` : '';
}

export function pickChartRows(
  rows: BlackTonnyTableRow[] | undefined,
  limit: number = 8,
  rowTake: 'first' | 'last' = 'first',
) {
  if (!rows?.length) {
    return [];
  }
  if (rows.length <= limit) {
    return rows;
  }
  return rowTake === 'last' ? rows.slice(-limit) : rows.slice(0, limit);
}

export function extractTableColumns(rows: BlackTonnyTableRow[]) {
  return rows.length ? Object.keys(rows[0] ?? {}) : [];
}

export function toSentenceList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item ?? '').trim()).filter(Boolean);
}

export function toObjectEntries(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }
  return Object.entries(value as Record<string, unknown>);
}

export function getNestedValue(source: unknown, path: string[]) {
  return path.reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, source);
}

function formatSummaryCardValue(key: string, value: unknown) {
  const definition = BLACK_TONNY_SUMMARY_CARD_CONFIG[key];
  if (!definition) {
    return formatValue(value);
  }

  if (definition.format === 'money') {
    return formatMoney(value);
  }
  if (definition.format === 'percent') {
    return formatPercent(value);
  }
  if (definition.format === 'quantity') {
    return formatQuantity(value, definition.unit);
  }
  if (definition.format === 'date') {
    return formatDateTime(value);
  }
  return formatValue(value);
}

export function buildSummaryCardItems(
  summaryCards: Record<string, unknown> | undefined,
  priorityKeys: string[],
) {
  return priorityKeys
    .map<BlackTonnySummaryCardViewModel | null>((key) => {
      const definition = BLACK_TONNY_SUMMARY_CARD_CONFIG[key];
      if (!definition) {
        return null;
      }

      return {
        description: definition.description,
        key,
        label: definition.label,
        tag: definition.tag,
        tone: definition.tone,
        value: formatSummaryCardValue(key, summaryCards?.[key]),
      };
    })
    .filter((item): item is BlackTonnySummaryCardViewModel => Boolean(item));
}

function formatDecisionValue(key: string, value: unknown) {
  if (key === 'sales_trend' && value && typeof value === 'object') {
    const detail = (value as Record<string, unknown>).detail;
    return {
      note: detail ? String(detail) : undefined,
      value: String((value as Record<string, unknown>).label ?? EMPTY_VALUE_TEXT),
    };
  }

  return {
    value: formatValue(value),
  };
}

export function buildDecisionFacts(decision: BlackTonnyDecision | undefined) {
  if (!decision) {
    return [];
  }

  return [
    'mode',
    'stage',
    'phase',
    'season',
    'sales_trend',
    'top_replenish',
    'top_clearance',
    'top_seasonal',
  ]
    .map<BlackTonnyDecisionFactViewModel | null>((key) => {
      const value = decision[key];
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length)
      ) {
        return null;
      }

      const formatted = formatDecisionValue(key, value);
      return {
        label: decisionLabels[key] ?? key,
        note: formatted.note,
        tag:
          key === 'sales_trend'
            ? '实际'
            : key === 'top_replenish' || key === 'top_clearance' || key === 'top_seasonal'
              ? '参考'
              : undefined,
        tone:
          key === 'top_clearance'
            ? 'critical'
            : key === 'top_replenish'
              ? 'positive'
              : 'neutral',
        value: formatted.value,
      };
    })
    .filter((item): item is BlackTonnyDecisionFactViewModel => Boolean(item));
}

export function buildConsultingSections(
  analysis: BlackTonnyConsultingAnalysis | undefined,
  preferredKeys?: string[],
) {
  if (!analysis) {
    return [];
  }

  const orderedKeys = preferredKeys?.length
    ? preferredKeys
    : Object.keys(analysis).filter(
        (key) =>
          !['basis_notes', 'diagnosis_summary', 'focus_title', 'period_label'].includes(
            key,
          ),
      );

  return orderedKeys
    .map<BlackTonnyNarrativeSectionViewModel | null>((key) => {
      const value = analysis[key];
      const items = Array.isArray(value)
        ? toSentenceList(value)
        : typeof value === 'string' && value.trim()
          ? [value.trim()]
          : [];

      if (!items.length) {
        return null;
      }

      return {
        items,
        key,
        label: consultingLabels[key] ?? key,
      };
    })
    .filter((item): item is BlackTonnyNarrativeSectionViewModel => Boolean(item));
}

export function resolveChartRows(
  payload: BlackTonnyPayload | undefined,
  chartSpec: BlackTonnyPageChartSpec,
) {
  const rawRows =
    chartSpec.source.kind === 'table'
      ? payload?.tables?.[chartSpec.source.key]
      : getNestedValue(payload, chartSpec.source.path);

  return pickChartRows(
    Array.isArray(rawRows) ? (rawRows as BlackTonnyTableRow[]) : [],
    chartSpec.rowLimit ?? 8,
    chartSpec.rowTake ?? 'first',
  );
}
