import type { EChartsOption } from 'echarts';

export type DashboardAccent =
  | 'amber'
  | 'blue'
  | 'emerald'
  | 'navy'
  | 'rose'
  | 'slate'
  | 'teal'
  | 'violet';

export type DashboardStatusTone =
  | 'negative'
  | 'neutral'
  | 'positive'
  | 'warning';

export interface DashboardQuickAction {
  icon: string;
  id: string;
  label: string;
  tone: 'dark' | 'default' | 'primary';
}

export interface DashboardAlertItem {
  icon: string;
  id: string;
  linkLabel?: string;
  text: string;
}

export interface DashboardMetricCard {
  accent: DashboardAccent;
  actionLabel?: string;
  delta: string;
  deltaTone: DashboardStatusTone;
  icon: string;
  id: string;
  note: string;
  subtitle: string;
  title: string;
  value: string;
}

export interface DashboardOverviewStat {
  accent: DashboardAccent;
  icon: string;
  id: string;
  note: string;
  title: string;
  value: string;
}

export interface DashboardMiniHighlight {
  id: string;
  label: string;
  value: string;
}

export interface DashboardMixHighlight {
  id: string;
  label: string;
  note: string;
  tone: DashboardStatusTone;
  value: string;
}

export interface DashboardListItem {
  accent: DashboardAccent;
  badge: string;
  delta?: string;
  deltaTone?: DashboardStatusTone;
  id: string;
  meta: string;
  subtitle: string;
  title: string;
  value: string;
}

export interface DashboardStockItem {
  accent: DashboardAccent;
  badge: string;
  id: string;
  sku: string;
  statusLabel: string;
  statusTone: DashboardStatusTone;
  stock: string;
  title: string;
  warehouse: string;
}

export interface DashboardSaleItem {
  accent: DashboardAccent;
  amount: string;
  badge: string;
  category: string;
  id: string;
  statusLabel: string;
  statusTone: DashboardStatusTone;
  title: string;
  when: string;
}

export interface DashboardTransactionItem {
  accent: DashboardAccent;
  customer: string;
  customerCode: string;
  date: string;
  id: string;
  reference: string;
  statusLabel: string;
  statusTone: DashboardStatusTone;
  total: string;
}

export interface DashboardCustomerItem {
  accent: DashboardAccent;
  id: string;
  initials: string;
  location: string;
  orders: string;
  spend: string;
  title: string;
}

export interface DashboardCategoryStat {
  accent: DashboardAccent;
  id: string;
  label: string;
  sales: string;
  share: string;
}

export interface DashboardHeatmapRow {
  id: string;
  time: string;
  values: number[];
}

export interface DashboardPageMock {
  activeAnalyticsRange: string;
  activeTransactionTab: string;
  alerts: DashboardAlertItem[];
  analyticsChart: EChartsOption;
  analyticsHighlights: DashboardMiniHighlight[];
  analyticsRanges: string[];
  categoryChart: EChartsOption;
  categoryStats: DashboardCategoryStat[];
  customerChart: EChartsOption;
  customerHighlights: DashboardMixHighlight[];
  dateRange: [string, string];
  greetingSubtitle: string;
  greetingTitle: string;
  heatmapDays: string[];
  heatmapRows: DashboardHeatmapRow[];
  heroMetrics: DashboardMetricCard[];
  lowStockItems: DashboardStockItem[];
  overviewStats: DashboardOverviewStat[];
  quickActions: DashboardQuickAction[];
  recentSalesItems: DashboardSaleItem[];
  salesRanges: string[];
  salesStatisticsChart: EChartsOption;
  salesStatisticsHighlights: DashboardMiniHighlight[];
  secondaryMetrics: DashboardMetricCard[];
  topCategorySummary: string;
  topCustomerSummary: string;
  topCustomers: DashboardCustomerItem[];
  topProducts: DashboardListItem[];
  transactionTabs: string[];
  transactions: DashboardTransactionItem[];
}

const chartPalette = {
  amber: '#ff9f43',
  blue: '#3d7ff6',
  coral: '#ff7a59',
  grid: '#e7eef7',
  label: '#64748b',
  muted: '#e2e8f0',
  navy: '#1f2a52',
  orange: '#ff7a3d',
  softAmber: '#ffe3c4',
  teal: '#1db7a6',
  tooltip: '#111827',
  tooltipText: '#f8fafc',
  violet: '#7c5cff',
  white: '#ffffff',
};

const axisLabelStyle = {
  color: chartPalette.label,
  fontSize: 12,
};

const splitLineStyle = {
  lineStyle: {
    color: chartPalette.grid,
    type: 'dashed' as const,
  },
};

type DashboardTranslate = (
  key: string,
  params?: Record<string, number | string>,
) => string;

function formatHourLabel(t: DashboardTranslate, hour: number) {
  return t('page.dashboardData.time.hourLabel', { hour });
}

function formatMonthLabel(t: DashboardTranslate, month: number) {
  return t('page.dashboardData.time.monthLabel', { month });
}

function formatMonthDayLabel(
  t: DashboardTranslate,
  month: number,
  day: number,
) {
  return t('page.dashboardData.time.monthDayLabel', { day, month });
}

export function createDashboardPageMock(
  t: DashboardTranslate,
): DashboardPageMock {
  const analyticsRanges = [
    t('page.dashboardData.analytics.rangeDay'),
    t('page.dashboardData.analytics.rangeWeek'),
    t('page.dashboardData.analytics.rangeMonth'),
    t('page.dashboardData.analytics.rangeQuarter'),
    t('page.dashboardData.analytics.rangeHalfYear'),
    t('page.dashboardData.analytics.rangeYear'),
  ];
  const transactionTabs = [
    t('page.dashboardData.tabs.sales'),
    t('page.dashboardData.tabs.purchase'),
    t('page.dashboardData.tabs.quote'),
    t('page.dashboardData.tabs.expense'),
    t('page.dashboardData.tabs.invoice'),
  ];
  const inventoryLabel = t('page.dashboardData.status.inventory');
  const completedLabel = t('page.dashboardData.status.completed');
  const processingLabel = t('page.dashboardData.status.processing');
  const cancelledLabel = t('page.dashboardData.status.cancelled');
  const pendingLabel = t('page.dashboardData.status.pending');
  const draftLabel = t('page.dashboardData.status.draft');
  const viewAllLabel = t('page.dashboardView.viewAll');
  const salesVolumeLabel = t('page.dashboardView.salesVolume');
  const monthOverMonthLabel = t('page.dashboardData.metrics.vsLastMonth');
  const todayLabel = t('page.dashboardView.today');

  return {
    activeAnalyticsRange: analyticsRanges[5]!,
    activeTransactionTab: transactionTabs[0]!,
    alerts: [
      {
        icon: 'lucide:circle-alert',
        id: 'layout',
        linkLabel: t('page.dashboardData.alerts.restockAction'),
        text: t('page.dashboardData.alerts.restockText'),
      },
      {
        icon: 'lucide:circle-alert',
        id: 'next-step',
        linkLabel: t('page.dashboardData.alerts.followUpAction'),
        text: t('page.dashboardData.alerts.followUpText'),
      },
    ],
    analyticsChart: {
      color: [chartPalette.amber, chartPalette.softAmber],
      grid: {
        bottom: 18,
        containLabel: true,
        left: 4,
        right: 4,
        top: 18,
      },
      legend: {
        show: false,
      },
      series: [
        {
          barWidth: 24,
          data: [18, 20, 10, 18, 25, 16, 9, 20, 42, 10, 30, 18],
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: chartPalette.amber,
          },
          name: t('page.dashboardData.analytics.salesSeries'),
          stack: 'volume',
          type: 'bar',
        },
        {
          barWidth: 24,
          data: [40, 30, 28, 48, 38, 52, 30, 28, 42, 28, 40, 32],
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: chartPalette.softAmber,
          },
          name: t('page.dashboardData.analytics.purchaseSeries'),
          stack: 'volume',
          type: 'bar',
        },
      ],
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: chartPalette.tooltip,
        borderWidth: 0,
        textStyle: {
          color: chartPalette.tooltipText,
        },
        trigger: 'axis',
      },
      xAxis: {
        axisLabel: axisLabelStyle,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((hour) =>
          formatHourLabel(t, hour),
        ),
        type: 'category',
      },
      yAxis: {
        axisLabel: {
          ...axisLabelStyle,
          formatter: (value: number) => `${value}K`,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: splitLineStyle,
        type: 'value',
      },
    },
    analyticsHighlights: [
      {
        id: 'purchase',
        label: t('page.dashboardData.analytics.purchaseVolume'),
        value: '3K',
      },
      {
        id: 'sales',
        label: t('page.dashboardData.analytics.salesVolume'),
        value: '1K',
      },
    ],
    analyticsRanges,
    categoryChart: {
      color: [
        chartPalette.amber,
        chartPalette.orange,
        chartPalette.navy,
        chartPalette.violet,
      ],
      legend: {
        show: false,
      },
      series: [
        {
          avoidLabelOverlap: true,
          center: ['42%', '48%'],
          data: [
            { name: t('page.dashboardData.categories.electronics'), value: 698 },
            { name: t('page.dashboardData.categories.outdoor'), value: 545 },
            { name: t('page.dashboardData.categories.lifestyle'), value: 456 },
            { name: t('page.dashboardData.categories.seasonal'), value: 232 },
          ],
          itemStyle: {
            borderColor: chartPalette.white,
            borderWidth: 6,
          },
          label: {
            show: false,
          },
          radius: ['52%', '78%'],
          type: 'pie',
        },
      ],
      tooltip: {
        backgroundColor: chartPalette.tooltip,
        borderWidth: 0,
        textStyle: {
          color: chartPalette.tooltipText,
        },
        trigger: 'item',
      },
    },
    categoryStats: [
      {
        accent: 'amber',
        id: 'electronics',
        label: t('page.dashboardData.categories.electronics'),
        sales: `698 ${salesVolumeLabel}`,
        share: '36%',
      },
      {
        accent: 'teal',
        id: 'sports',
        label: t('page.dashboardData.categories.outdoor'),
        sales: `545 ${salesVolumeLabel}`,
        share: '28%',
      },
      {
        accent: 'navy',
        id: 'lifestyle',
        label: t('page.dashboardData.categories.lifestyle'),
        sales: `456 ${salesVolumeLabel}`,
        share: '22%',
      },
    ],
    customerChart: {
      color: [chartPalette.teal, chartPalette.coral, chartPalette.muted],
      legend: {
        show: false,
      },
      series: [
        {
          avoidLabelOverlap: false,
          center: ['50%', '50%'],
          data: [
            { name: t('page.dashboardData.customerSegments.repeat'), value: 3500 },
            {
              name: t('page.dashboardData.customerSegments.firstTime'),
              value: 5500,
            },
            {
              name: t('page.dashboardData.customerSegments.inactive'),
              value: 1200,
            },
          ],
          itemStyle: {
            borderColor: chartPalette.white,
            borderWidth: 4,
          },
          label: {
            show: false,
          },
          radius: ['58%', '82%'],
          type: 'pie',
        },
      ],
      tooltip: {
        backgroundColor: chartPalette.tooltip,
        borderWidth: 0,
        textStyle: {
          color: chartPalette.tooltipText,
        },
        trigger: 'item',
      },
    },
    customerHighlights: [
      {
        id: 'first-time',
        label: t('page.dashboardData.customerSegments.firstTime'),
        note: t('page.dashboardData.customerSegments.newCustomer'),
        tone: 'warning',
        value: '5.5K',
      },
      {
        id: 'repeat',
        label: t('page.dashboardData.customerSegments.repeat'),
        note: t('page.dashboardData.customerSegments.repurchase'),
        tone: 'positive',
        value: '3.5K',
      },
    ],
    dateRange: ['2026-03-15', '2026-03-21'],
    greetingSubtitle: t('page.dashboardData.greeting.subtitle', {
      count: '200+',
    }),
    greetingTitle: t('page.dashboardData.greeting.title'),
    heatmapDays: [
      t('page.dashboardData.time.monday'),
      t('page.dashboardData.time.tuesday'),
      t('page.dashboardData.time.wednesday'),
      t('page.dashboardData.time.thursday'),
      t('page.dashboardData.time.friday'),
      t('page.dashboardData.time.saturday'),
      t('page.dashboardData.time.sunday'),
    ],
    heatmapRows: [
      {
        id: '18',
        time: formatHourLabel(t, 18),
        values: [1, 2, 2, 1, 2, 1, 1],
      },
      {
        id: '16',
        time: formatHourLabel(t, 16),
        values: [2, 2, 3, 2, 3, 2, 1],
      },
      {
        id: '14',
        time: formatHourLabel(t, 14),
        values: [1, 2, 2, 2, 3, 2, 2],
      },
      {
        id: '12',
        time: formatHourLabel(t, 12),
        values: [1, 1, 2, 2, 2, 1, 1],
      },
      {
        id: '10',
        time: formatHourLabel(t, 10),
        values: [1, 2, 2, 1, 2, 2, 1],
      },
      {
        id: '08',
        time: formatHourLabel(t, 8),
        values: [1, 1, 2, 1, 1, 1, 1],
      },
      {
        id: '06',
        time: formatHourLabel(t, 6),
        values: [0, 1, 1, 1, 1, 1, 0],
      },
      {
        id: '04',
        time: formatHourLabel(t, 4),
        values: [0, 1, 1, 0, 1, 0, 0],
      },
      {
        id: '02',
        time: formatHourLabel(t, 2),
        values: [0, 0, 1, 0, 0, 0, 0],
      },
    ],
    heroMetrics: [
      {
        accent: 'amber',
        delta: '+22%',
        deltaTone: 'positive',
        icon: 'lucide:file-text',
        id: 'gross-sales',
        note: '',
        subtitle: '',
        title: t('page.dashboardData.metrics.grossSales'),
        value: '$48,988,078',
      },
      {
        accent: 'navy',
        delta: '-22%',
        deltaTone: 'negative',
        icon: 'lucide:rotate-ccw',
        id: 'refunds',
        note: '',
        subtitle: '',
        title: t('page.dashboardData.metrics.salesReturn'),
        value: '$16,478,145',
      },
      {
        accent: 'teal',
        delta: '+22%',
        deltaTone: 'positive',
        icon: 'lucide:gift',
        id: 'purchase',
        note: '',
        subtitle: '',
        title: t('page.dashboardData.metrics.purchaseTotal'),
        value: '$24,145,789',
      },
      {
        accent: 'blue',
        delta: '+22%',
        deltaTone: 'positive',
        icon: 'lucide:pocket',
        id: 'orders',
        note: '',
        subtitle: '',
        title: t('page.dashboardData.metrics.purchaseReturn'),
        value: '$18,458,747',
      },
    ],
    lowStockItems: [
      {
        accent: 'amber',
        badge: 'CB',
        id: 'cable',
        sku: '#665814',
        statusLabel: inventoryLabel,
        statusTone: 'warning',
        stock: '08',
        title: t('page.dashboardData.lowStockItems.laptopTitle'),
        warehouse: t('page.dashboardData.lowStockItems.laptopWarehouse'),
      },
      {
        accent: 'navy',
        badge: 'CM',
        id: 'camera',
        sku: '#940004',
        statusLabel: inventoryLabel,
        statusTone: 'warning',
        stock: '14',
        title: t('page.dashboardData.lowStockItems.robotTitle'),
        warehouse: t('page.dashboardData.lowStockItems.robotWarehouse'),
      },
      {
        accent: 'teal',
        badge: 'VK',
        id: 'vacuum',
        sku: '#325569',
        statusLabel: inventoryLabel,
        statusTone: 'negative',
        stock: '21',
        title: t('page.dashboardData.lowStockItems.mixerTitle'),
        warehouse: t('page.dashboardData.lowStockItems.mixerWarehouse'),
      },
      {
        accent: 'blue',
        badge: 'JR',
        id: 'jacket',
        sku: '#124588',
        statusLabel: inventoryLabel,
        statusTone: 'negative',
        stock: '12',
        title: t('page.dashboardData.lowStockItems.jacketTitle'),
        warehouse: t('page.dashboardData.lowStockItems.jacketWarehouse'),
      },
      {
        accent: 'violet',
        badge: 'SC',
        id: 'snack',
        sku: '#365586',
        statusLabel: inventoryLabel,
        statusTone: 'warning',
        stock: '10',
        title: t('page.dashboardData.lowStockItems.chipsTitle'),
        warehouse: t('page.dashboardData.lowStockItems.chipsWarehouse'),
      },
    ],
    overviewStats: [
      {
        accent: 'amber',
        icon: 'lucide:truck',
        id: 'suppliers',
        note: t('page.dashboardData.overview.suppliers'),
        title: t('page.dashboardData.overview.suppliers'),
        value: '6987',
      },
      {
        accent: 'rose',
        icon: 'lucide:users',
        id: 'customers',
        note: t('page.dashboardData.overview.customers'),
        title: t('page.dashboardData.overview.customers'),
        value: '4896',
      },
      {
        accent: 'teal',
        icon: 'lucide:shopping-bag',
        id: 'orders',
        note: t('page.dashboardData.overview.orders'),
        title: t('page.dashboardData.overview.orders'),
        value: '487',
      },
    ],
    quickActions: [
      {
        icon: 'lucide:layout-grid',
        id: 'layout',
        label: t('page.dashboardData.quickActions.layoutDraft'),
        tone: 'dark',
      },
      {
        icon: 'lucide:download',
        id: 'export',
        label: t('page.dashboardData.quickActions.exportPreview'),
        tone: 'default',
      },
      {
        icon: 'lucide:sliders-horizontal',
        id: 'filter',
        label: t('page.dashboardData.quickActions.filters'),
        tone: 'default',
      },
      {
        icon: 'lucide:plus',
        id: 'create',
        label: t('page.dashboardData.quickActions.createAction'),
        tone: 'primary',
      },
    ],
    recentSalesItems: [
      {
        accent: 'emerald',
        amount: '$640',
        badge: 'AW',
        category: t('page.dashboardData.categories.electronics'),
        id: 'watch',
        statusLabel: processingLabel,
        statusTone: 'neutral',
        title: t('page.dashboardData.recentSales.watchTitle'),
        when: todayLabel,
      },
      {
        accent: 'amber',
        amount: '$126',
        badge: 'GB',
        category: t('page.dashboardData.categories.fashionAccessories'),
        id: 'bracelet',
        statusLabel: cancelledLabel,
        statusTone: 'negative',
        title: t('page.dashboardData.recentSales.braceletTitle'),
        when: todayLabel,
      },
      {
        accent: 'blue',
        amount: '$69',
        badge: 'DV',
        category: t('page.dashboardData.categories.bedding'),
        id: 'duvet',
        statusLabel: pendingLabel,
        statusTone: 'warning',
        title: t('page.dashboardData.recentSales.duvetTitle'),
        when: formatMonthDayLabel(t, 1, 15),
      },
      {
        accent: 'rose',
        amount: '$65',
        badge: 'TB',
        category: t('page.dashboardData.categories.outdoor'),
        id: 'tumbler',
        statusLabel: processingLabel,
        statusTone: 'neutral',
        title: t('page.dashboardData.recentSales.tumblerTitle'),
        when: formatMonthDayLabel(t, 1, 12),
      },
      {
        accent: 'teal',
        amount: '$87.56',
        badge: 'GK',
        category: t('page.dashboardData.categories.toys'),
        id: 'kit',
        statusLabel: completedLabel,
        statusTone: 'positive',
        title: t('page.dashboardData.recentSales.kitTitle'),
        when: formatMonthDayLabel(t, 1, 11),
      },
    ],
    salesRanges: ['2024', '2025', '2026'],
    salesStatisticsChart: {
      color: [chartPalette.teal, chartPalette.coral],
      grid: {
        bottom: 12,
        containLabel: true,
        left: 6,
        right: 6,
        top: 18,
      },
      legend: {
        show: false,
      },
      series: [
        {
          barWidth: 12,
          data: [10, 26, 27, 21, 20, 18, 26, 15, 20, 12, 9, 19],
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: chartPalette.teal,
          },
          name: t('page.dashboardData.metrics.revenue'),
          type: 'bar',
        },
        {
          barWidth: 12,
          data: [-8, -20, -10, -23, -22, -12, -21, -20, -9, -17, -19, -21],
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: chartPalette.coral,
          },
          name: t('page.dashboardData.metrics.expense'),
          type: 'bar',
        },
      ],
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: chartPalette.tooltip,
        borderWidth: 0,
        textStyle: {
          color: chartPalette.tooltipText,
        },
        trigger: 'axis',
      },
      xAxis: {
        axisLabel: axisLabelStyle,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: Array.from({ length: 12 }, (_, index) =>
          formatMonthLabel(t, index + 1),
        ),
        type: 'category',
      },
      yAxis: {
        axisLabel: axisLabelStyle,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: splitLineStyle,
        type: 'value',
      },
    },
    salesStatisticsHighlights: [
      {
        id: 'revenue',
        label: t('page.dashboardData.metrics.revenue'),
        value: '$12,189',
      },
      {
        id: 'expense',
        label: t('page.dashboardData.metrics.expense'),
        value: '$48,988,078',
      },
    ],
    secondaryMetrics: [
      {
        accent: 'emerald',
        actionLabel: viewAllLabel,
        delta: '+35%',
        deltaTone: 'positive',
        icon: 'lucide:chart-column',
        id: 'profit',
        note: monthOverMonthLabel,
        subtitle: '',
        title: t('page.dashboardData.metrics.profit'),
        value: '$8,458,798',
      },
      {
        accent: 'blue',
        actionLabel: viewAllLabel,
        delta: '+35%',
        deltaTone: 'positive',
        icon: 'lucide:file-text',
        id: 'invoice',
        note: monthOverMonthLabel,
        subtitle: '',
        title: t('page.dashboardData.metrics.receivable'),
        value: '$48,988,78',
      },
      {
        accent: 'amber',
        actionLabel: viewAllLabel,
        delta: '+41%',
        deltaTone: 'positive',
        icon: 'lucide:receipt-text',
        id: 'expense',
        note: monthOverMonthLabel,
        subtitle: '',
        title: t('page.dashboardData.metrics.totalExpense'),
        value: '$8,980,097',
      },
      {
        accent: 'violet',
        actionLabel: viewAllLabel,
        delta: '-20%',
        deltaTone: 'negative',
        icon: 'lucide:wallet-cards',
        id: 'repayment',
        note: monthOverMonthLabel,
        subtitle: '',
        title: t('page.dashboardData.metrics.paymentReturn'),
        value: '$78,458,798',
      },
    ],
    topCategorySummary: t('page.dashboardData.summaries.topCategory'),
    topCustomerSummary: t('page.dashboardData.summaries.topCustomer'),
    topCustomers: [
      {
        accent: 'amber',
        id: 'carlos',
        initials: 'CC',
        location: t('page.dashboardData.topCustomers.carlosLocation'),
        orders: '24单',
        spend: '$8,9645',
        title: t('page.dashboardData.topCustomers.carlosName'),
      },
      {
        accent: 'rose',
        id: 'stan',
        initials: 'SG',
        location: t('page.dashboardData.topCustomers.stanLocation'),
        orders: '22单',
        spend: '$16,985',
        title: t('page.dashboardData.topCustomers.stanName'),
      },
      {
        accent: 'navy',
        id: 'richard',
        initials: 'RW',
        location: t('page.dashboardData.topCustomers.richardLocation'),
        orders: '14单',
        spend: '$5,366',
        title: t('page.dashboardData.topCustomers.richardName'),
      },
      {
        accent: 'teal',
        id: 'mary',
        initials: 'MB',
        location: t('page.dashboardData.topCustomers.maryLocation'),
        orders: '08单',
        spend: '$4,569',
        title: t('page.dashboardData.topCustomers.maryName'),
      },
      {
        accent: 'violet',
        id: 'annie',
        initials: 'AT',
        location: t('page.dashboardData.topCustomers.annieLocation'),
        orders: '14单',
        spend: '$3,5698',
        title: t('page.dashboardData.topCustomers.annieName'),
      },
    ],
    topProducts: [
      {
        accent: 'amber',
        badge: 'LC',
        delta: '+25%',
        deltaTone: 'positive',
        id: 'charger',
        meta: `247+ ${salesVolumeLabel}`,
        subtitle: t('page.dashboardData.topProducts.chargerSubtitle'),
        title: t('page.dashboardData.topProducts.chargerTitle'),
        value: '$187',
      },
      {
        accent: 'rose',
        badge: 'YP',
        delta: '+25%',
        deltaTone: 'positive',
        id: 'perfume',
        meta: `289+ ${salesVolumeLabel}`,
        subtitle: t('page.dashboardData.topProducts.perfumeSubtitle'),
        title: t('page.dashboardData.topProducts.perfumeTitle'),
        value: '$145',
      },
      {
        accent: 'emerald',
        badge: 'AP',
        delta: '+25%',
        deltaTone: 'positive',
        id: 'airpods',
        meta: `300+ ${salesVolumeLabel}`,
        subtitle: t('page.dashboardData.topProducts.airpodsSubtitle'),
        title: t('page.dashboardData.topProducts.airpodsTitle'),
        value: '$458',
      },
      {
        accent: 'navy',
        badge: 'VC',
        delta: '-21%',
        deltaTone: 'negative',
        id: 'vacuum',
        meta: `225+ ${salesVolumeLabel}`,
        subtitle: t('page.dashboardData.topProducts.vacuumSubtitle'),
        title: t('page.dashboardData.topProducts.vacuumTitle'),
        value: '$139',
      },
      {
        accent: 'blue',
        badge: 'S2',
        delta: '+25%',
        deltaTone: 'positive',
        id: 'phone',
        meta: `365+ ${salesVolumeLabel}`,
        subtitle: t('page.dashboardData.topProducts.phoneSubtitle'),
        title: t('page.dashboardData.topProducts.phoneTitle'),
        value: '$898',
      },
    ],
    transactionTabs,
    transactions: [
      {
        accent: 'amber',
        customer: t('page.dashboardData.transactions.andreaCustomer'),
        customerCode: '#114589',
        date: '2026/05/24',
        id: 'txn-1',
        reference: 'SALE-2049',
        statusLabel: completedLabel,
        statusTone: 'positive',
        total: '$4,560',
      },
      {
        accent: 'navy',
        customer: t('page.dashboardData.transactions.timothyCustomer'),
        customerCode: '#114589',
        date: '2026/05/23',
        id: 'txn-2',
        reference: 'SALE-2048',
        statusLabel: completedLabel,
        statusTone: 'positive',
        total: '$3,569',
      },
      {
        accent: 'rose',
        customer: t('page.dashboardData.transactions.bonnieCustomer'),
        customerCode: '#114589',
        date: '2026/05/22',
        id: 'txn-3',
        reference: 'SALE-2047',
        statusLabel: draftLabel,
        statusTone: 'neutral',
        total: '$4,560',
      },
      {
        accent: 'teal',
        customer: t('page.dashboardData.transactions.randyCustomer'),
        customerCode: '#114589',
        date: '2026/05/21',
        id: 'txn-4',
        reference: 'SALE-2046',
        statusLabel: completedLabel,
        statusTone: 'positive',
        total: '$2,155',
      },
      {
        accent: 'violet',
        customer: t('page.dashboardData.transactions.dennisCustomer'),
        customerCode: '#114589',
        date: '2026/05/21',
        id: 'txn-5',
        reference: 'SALE-2045',
        statusLabel: completedLabel,
        statusTone: 'positive',
        total: '$5,123',
      },
    ],
  };
}
