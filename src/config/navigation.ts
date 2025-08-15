/**
 * 导航配置文件
 * 统一管理所有导航相关的配置，包括路由、标签、图标、颜色等
 */

import { ROUTES, NAV_ICONS, COLOR_THEMES } from './constants';
import { NAVIGATION, PAGE_TITLES, PAGE_DESCRIPTIONS } from './text';

// ==================== 导航项配置类型 ====================
export interface NavigationItem {
  id: string;
  path: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
  badge?: string | number;
  isExternal?: boolean;
  children?: NavigationItem[];
}

// ==================== 页面信息配置类型 ====================
export interface PageInfo {
  title: string;
  description: string;
  breadcrumb?: string[];
}

// ==================== 主导航配置 ====================
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'editor',
    path: ROUTES.EDITOR,
    label: NAVIGATION.TEMPLATE_WORKSPACE,
    icon: NAV_ICONS.EDITOR,
    color: COLOR_THEMES.PRIMARY,
    description: PAGE_DESCRIPTIONS.EDITOR,
  },
  {
    id: 'library',
    path: ROUTES.LIBRARY,
    label: NAVIGATION.TEMPLATE_LIBRARY,
    icon: NAV_ICONS.LIBRARY,
    color: COLOR_THEMES.SUCCESS,
    description: PAGE_DESCRIPTIONS.LIBRARY,
  },
  {
    id: 'components',
    path: ROUTES.COMPONENTS,
    label: NAVIGATION.COMPONENT_LIBRARY,
    icon: NAV_ICONS.COMPONENTS,
    color: COLOR_THEMES.PRIMARY,
    description: PAGE_DESCRIPTIONS.COMPONENTS,
  },
];

// ==================== 页面信息映射 ====================
export const PAGE_INFO_MAP: Record<string, PageInfo> = {
  [ROUTES.HOME]: {
    title: PAGE_TITLES.EDITOR,
    description: PAGE_DESCRIPTIONS.EDITOR,
  },
  [ROUTES.EDITOR]: {
    title: PAGE_TITLES.EDITOR,
    description: PAGE_DESCRIPTIONS.EDITOR,
  },
  [ROUTES.LIBRARY]: {
    title: PAGE_TITLES.LIBRARY,
    description: PAGE_DESCRIPTIONS.LIBRARY,
  },
  [ROUTES.COMPONENTS]: {
    title: PAGE_TITLES.COMPONENTS,
    description: PAGE_DESCRIPTIONS.COMPONENTS,
  },
};

// ==================== 默认页面信息 ====================
export const DEFAULT_PAGE_INFO: PageInfo = {
  title: PAGE_TITLES.UNKNOWN,
  description: '',
};

// ==================== 工具函数 ====================

/**
 * 根据路径获取页面信息
 */
export const getPageInfo = (pathname: string): PageInfo => {
  return PAGE_INFO_MAP[pathname] || DEFAULT_PAGE_INFO;
};

/**
 * 根据路径获取导航项
 */
export const getNavigationItem = (pathname: string): NavigationItem | undefined => {
  return MAIN_NAVIGATION.find(item => item.path === pathname);
};

/**
 * 检查路径是否为活动状态
 */
export const isActiveRoute = (currentPath: string, targetPath: string): boolean => {
  if (targetPath === ROUTES.EDITOR) {
    return currentPath === targetPath || currentPath === ROUTES.HOME;
  }
  return currentPath === targetPath;
};

// ==================== 应用元信息 ====================
export const APP_METADATA = {
  name: 'Qomo',
  description: 'AI提示词模板平台',
  version: '2.0.0',
  author: 'Qomo Team',
};

// ==================== 快速统计配置 ====================
export const QUICK_STATS_CONFIG = [
  {
    key: 'templates',
    label: '已创建模板',
    defaultValue: 0,
  },
  {
    key: 'library',
    label: '模板库',
    defaultValue: 0,
  },
  {
    key: 'components',
    label: '组件库',
    defaultValue: 0,
  },
];

// ==================== 导出类型 ====================
export type NavigationId = typeof MAIN_NAVIGATION[number]['id'];
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
