import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '小黑托昵',
    },
    name: 'BlackTonny',
    path: '/black-tonny',
    children: [
      {
        name: 'BlackTonnyDashboard',
        path: '/dashboard',
        component: () => import('#/views/dashboard/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: '经营总览',
        },
      },
      {
        name: 'BlackTonnyDetails',
        path: '/details',
        component: () => import('#/views/details/index.vue'),
        meta: {
          icon: 'lucide:file-search',
          title: '经营明细',
        },
      },
      {
        name: 'BlackTonnyMonthly',
        path: '/monthly',
        component: () => import('#/views/monthly/index.vue'),
        meta: {
          icon: 'lucide:calendar-range',
          title: '月度执行',
        },
      },
      {
        name: 'BlackTonnyQuarterly',
        path: '/quarterly',
        component: () => import('#/views/quarterly/index.vue'),
        meta: {
          icon: 'lucide:calendar-clock',
          title: '季度复盘',
        },
      },
      {
        name: 'BlackTonnyRelationship',
        path: '/relationship',
        component: () => import('#/views/relationship/index.vue'),
        meta: {
          icon: 'lucide:chart-no-axes-combined',
          title: '库销关系',
        },
      },
    ],
  },
];

export default routes;
