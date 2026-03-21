import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { accessRoutes, coreRouteNames } from '#/router/routes';

import { generateAccess } from './access';

const LOCAL_ACCESS_TOKEN = 'black-tonny-local-sample-token';
const LOCAL_USER_INFO = {
  avatar:
    'https://avatar.vercel.sh/black-tonny.svg?text=BT',
  homePath: '/dashboard',
  realName: '老板',
  roles: ['owner'],
  userId: 'black-tonny-owner',
  username: 'black-tonny-owner',
};

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH) {
        return preferences.app.defaultHomePath;
      }
      return true;
    }

    if (!accessStore.accessToken) {
      accessStore.setAccessToken(LOCAL_ACCESS_TOKEN);
    }

    if (!userStore.userInfo) {
      userStore.setUserInfo(LOCAL_USER_INFO);
    }

    if (to.meta.ignoreAccess) {
      return true;
    }

    if (accessStore.isAccessChecked) {
      return true;
    }

    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: LOCAL_USER_INFO.roles,
      router,
      routes: accessRoutes,
    });

    accessStore.setAccessCodes(['black-tonny']);
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    const redirectPath = (from.query.redirect ??
      (to.path === preferences.app.defaultHomePath
        ? LOCAL_USER_INFO.homePath
        : to.fullPath)) as string;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
