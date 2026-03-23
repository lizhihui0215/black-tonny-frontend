import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { getAccessCodesApi, getUserInfoApi } from '#/api';
import { accessRoutes, coreRouteNames } from '#/router/routes';

import { generateAccess } from './access';

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
  async function bootstrapAccess() {
    const accessStore = useAccessStore();
    const userStore = useUserStore();

    const [userInfo, accessCodes] = await Promise.all([
      getUserInfoApi(),
      getAccessCodesApi(),
    ]);

    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userInfo.roles ?? [],
      router,
      routes: accessRoutes,
    });

    userStore.setUserInfo(userInfo);
    accessStore.setAccessCodes(accessCodes);
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    return userInfo;
  }

  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const hasAccessToken = Boolean(accessStore.accessToken);

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH) {
        return hasAccessToken
          ? userStore.userInfo?.homePath || preferences.app.defaultHomePath
          : true;
      }
      return true;
    }

    if (!hasAccessToken) {
      return {
        path: LOGIN_PATH,
        query: {
          redirect: encodeURIComponent(to.fullPath),
        },
        replace: true,
      };
    }

    if (accessStore.isAccessChecked) {
      return true;
    }

    try {
      const userInfo = await bootstrapAccess();
      const redirectPath = (from.query.redirect ??
        (to.path === preferences.app.defaultHomePath
          ? userInfo.homePath
          : to.fullPath)) as string;

      return {
        ...router.resolve(decodeURIComponent(redirectPath)),
        replace: true,
      };
    } catch {
      accessStore.setAccessToken(null);
      accessStore.setAccessCodes([]);
      accessStore.setAccessMenus([]);
      accessStore.setAccessRoutes([]);
      accessStore.setIsAccessChecked(false);
      accessStore.setLoginExpired(false);
      userStore.setUserInfo(null);

      return {
        path: LOGIN_PATH,
        query: {
          redirect: encodeURIComponent(to.fullPath),
        },
        replace: true,
      };
    }
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
