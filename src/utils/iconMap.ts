/**
 * 图标映射工具
 * 将字符串图标名称映射到实际的图标组件
 */

import React from 'react';
import QomoLogo from '@/assets/QomoLogo';
import IconFont from '@/components/ui/IconFont';

// IconFont 名称映射（用你的 iconfont.json font_class 值）
const ICON_NAMES = {
  // 操作
  Save: 'baocun',
  Copy: 'fuzhi',
  Play: 'shiyongmoban1',
  Eye: 'yincang',
  RotateCcw: 'zhongzhi',

  // 导航/分类
  MessageSquare: 'a-yiwenwenti',
  Lightbulb: 'a-tishi2',
  FileText: 'moban',
  Package: 'zujian1',
  BookOpen: 'mobanku',
  Settings: 'wangguigongzuotai',
  Target: 'guanliyuan_jiaoseguanli',
} as const;
// 兼容旧变量名，避免 HMR 残留引用
// @ts-ignore
const ICONTFONT_NAME_MAP = ICON_NAMES;

type IconComponent = React.ComponentType<any>;

// 图标映射表
export const ICON_MAP: Record<string, IconComponent> = {
  QomoLogo,
  ...Object.fromEntries(
    Object.entries(ICON_NAMES).map(([key, name]) => [
      key,
      (props: any) => React.createElement(IconFont as any, { ...props, name: name as string }),
    ])
  ),
};

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件或默认图标
 */
export const getIcon = (iconName: string): IconComponent => {
  return ICON_MAP[iconName] || ((props: any) => React.createElement(IconFont as any, { ...props, name: ICON_NAMES.FileText }));
};

/**
 * 检查图标是否存在
 * @param iconName 图标名称
 * @returns 是否存在
 */
export const hasIcon = (iconName: string): boolean => {
  return iconName in ICON_MAP;
};

// 导出所有可用的图标名称
export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

// 导出类型
export type IconName = keyof typeof ICON_MAP;
