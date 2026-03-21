export type BlackTonnyPageKey =
  | 'dashboard'
  | 'details'
  | 'monthly'
  | 'quarterly'
  | 'relationship';

export type BlackTonnyPageHeroMode =
  | 'analysis'
  | 'execution'
  | 'overview'
  | 'relationship'
  | 'strategy';

export type BlackTonnyPageBlockKey =
  | 'consulting'
  | 'decision'
  | 'executionBoard'
  | 'healthLights'
  | 'insights'
  | 'relationship'
  | 'todayFocus';

export type BlackTonnyValueFormat =
  | 'date'
  | 'default'
  | 'money'
  | 'percent'
  | 'quantity';

export type BlackTonnyValueTag = '估算' | '实际' | '预测' | '参考';

export type BlackTonnyCardTone =
  | 'critical'
  | 'focus'
  | 'neutral'
  | 'positive'
  | 'warning';

export interface BlackTonnyManifest {
  analysis_batch_id?: string;
  available_exports?: Record<string, string>;
  available_pages?: Record<string, string>;
  generated_at?: string;
  pipeline?: string[];
  store_name?: string;
}

export interface BlackTonnyTableRow {
  [key: string]: unknown;
}

export interface BlackTonnySummaryCardConfig {
  description: string;
  format: BlackTonnyValueFormat;
  key: string;
  label: string;
  tag?: BlackTonnyValueTag;
  tone?: BlackTonnyCardTone;
  unit?: string;
}

export interface BlackTonnySummaryCardViewModel {
  description?: string;
  key: string;
  label: string;
  tag?: BlackTonnyValueTag;
  tone?: BlackTonnyCardTone;
  value: string;
}

export interface BlackTonnyDecision {
  headline?: string;
  mode?: string;
  phase?: string;
  sales_trend?: Record<string, unknown>;
  season?: string;
  stage?: string;
  summary?: string;
  top_clearance?: string;
  top_replenish?: string;
  top_seasonal?: string;
  [key: string]: unknown;
}

export interface BlackTonnyDecisionFactViewModel {
  label: string;
  note?: string;
  tag?: BlackTonnyValueTag;
  tone?: BlackTonnyCardTone;
  value: string;
}

export interface BlackTonnyConsultingAnalysis extends Record<string, unknown> {
  basis_notes?: string[];
  diagnosis_summary?: string;
  focus_title?: string;
  period_label?: string;
}

export interface BlackTonnyNarrativeSectionViewModel {
  items: string[];
  key: string;
  label: string;
}

export interface BlackTonnyHealthLight {
  level?: string;
  note?: string;
  title?: string;
  value?: string | number;
}

export interface BlackTonnyTodayFocus {
  conclusions?: string[];
  tasks?: string[];
}

export interface BlackTonnyExecutionButton {
  href?: string;
  label?: string;
  note?: string;
  status?: string;
}

export interface BlackTonnyExecutionBoard {
  execution_buttons?: BlackTonnyExecutionButton[];
  role_actions?: Record<string, string[]>;
  risk_alerts?: string[];
  today_must_do?: string[];
  weekly_strategy?: string[];
}

export interface BlackTonnyInsight {
  summary?: string;
}

export interface BlackTonnyDashboardTip {
  meaning?: string;
  term?: string;
  watch?: string;
}

export interface BlackTonnyRelationshipMetricCard {
  note?: string;
  title?: string;
  tone?: string;
  value?: string | number;
  value_type?: string;
}

export interface BlackTonnyRelationshipFinding {
  action?: string;
  conclusion?: string;
  evidence?: string;
  title?: string;
  tone?: string;
  value_type?: string;
}

export interface BlackTonnyRelationshipRecommendation {
  items?: string[];
  title?: string;
}

export interface BlackTonnyInventorySalesRelationship
  extends Record<string, unknown> {
  data_basis?: string[];
  findings?: BlackTonnyRelationshipFinding[];
  headline?: string;
  metric_cards?: BlackTonnyRelationshipMetricCard[];
  recommendations?: BlackTonnyRelationshipRecommendation[];
  summary?: string;
  tone?: string;
}

export interface BlackTonnyPageChartSourceTable {
  key: string;
  kind: 'table';
}

export interface BlackTonnyPageChartSourcePath {
  kind: 'path';
  path: string[];
}

export type BlackTonnyPageChartSource =
  | BlackTonnyPageChartSourcePath
  | BlackTonnyPageChartSourceTable;

export interface BlackTonnyPageChartSpec {
  chartType: 'bar' | 'line';
  description: string;
  dimensionKey: string;
  rowLimit?: number;
  rowTake?: 'first' | 'last';
  source: BlackTonnyPageChartSource;
  title: string;
  valueKeys: string[];
}

export interface BlackTonnyPageTableSpec {
  description: string;
  key: string;
  maxRows?: number;
  title: string;
}

export interface BlackTonnyPageSpec {
  businessGoal: string;
  collapsedBlocks: BlackTonnyPageBlockKey[];
  expandedBlocks: BlackTonnyPageBlockKey[];
  heroMode: BlackTonnyPageHeroMode;
  keyQuestions: string[];
  pageKey: BlackTonnyPageKey;
  pageSummary: string;
  pageTitle: string;
  primaryChart: BlackTonnyPageChartSpec;
  summaryPriority: string[];
  tableOrder: BlackTonnyPageTableSpec[];
}

export interface DisplayFormatters {
  date: (value: unknown) => string;
  emptyValue: (value: unknown) => string;
  money: (value: unknown) => string;
  percent: (value: unknown) => string;
  quantity: (value: unknown, unit?: string) => string;
}

export interface BlackTonnyPayload {
  ai_analysis?: Record<string, unknown>;
  consulting_analysis?: BlackTonnyConsultingAnalysis;
  dashboard_tips?: BlackTonnyDashboardTip[];
  decision?: BlackTonnyDecision;
  execution_board?: BlackTonnyExecutionBoard;
  health_lights?: BlackTonnyHealthLight[];
  insights?: BlackTonnyInsight[];
  inventory_sales_relationship?: BlackTonnyInventorySalesRelationship;
  meta?: Record<string, unknown>;
  summary_cards?: Record<string, unknown>;
  tables?: Record<string, BlackTonnyTableRow[]>;
  time_strategy?: Record<string, unknown>;
  today_focus?: BlackTonnyTodayFocus;
}
