import { defineOverridesPreferences } from '@vben/preferences';

const logoMark = new URL('./assets/logo-mark.svg', import.meta.url).href;

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    contentCompact: 'wide',
    contentCompactWidth: 1600,
    defaultHomePath: '/dashboard',
    enablePreferences: false,
    name: import.meta.env.VITE_APP_TITLE,
    watermark: false,
  },
  breadcrumb: {
    enable: false,
  },
  logo: {
    source: logoMark,
    sourceDark: logoMark,
  },
  sidebar: {
    collapsedButton: false,
    collapsed: false,
    collapsedShowTitle: false,
    collapseWidth: 86,
    draggable: false,
    expandOnHover: true,
    fixedButton: false,
    width: 252,
  },
  header: {
    height: 65,
  },
  tabbar: {
    enable: false,
  },
  theme: {
    colorPrimary: 'hsl(30 99% 63%)',
    mode: 'light',
    semiDarkHeader: false,
    semiDarkSidebar: false,
  },
  widget: {
    fullscreen: false,
    globalSearch: false,
    languageToggle: false,
    notification: false,
    refresh: false,
    sidebarToggle: false,
    themeToggle: false,
    timezone: false,
  },
});
