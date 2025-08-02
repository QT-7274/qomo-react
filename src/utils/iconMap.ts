/**
 * 图标映射工具
 * 将字符串图标名称映射到实际的图标组件
 */

import {
  Wand2,
  BookOpen,
  MessageSquare,
  Package,
  FileText,
  Target,
  Lightbulb,
  Save,
  Eye,
  Settings,
  Play,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Search,
  Filter,
  SortAsc,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import QomoLogo from '@/assets/QomoLogo';

// 定义图标组件类型，支持 Lucide 图标和自定义组件
type IconComponent = LucideIcon | React.ComponentType<any>;

// 图标映射表
export const ICON_MAP: Record<string, IconComponent> = {
  // 导航图标
  Wand2,
  BookOpen,
  MessageSquare,
  Package,
  QomoLogo, // 替换 Sparkles 为自定义的 QomoLogo

  // 组件图标
  FileText,
  Target,
  Lightbulb,

  // 操作图标
  Save,
  Eye,
  Settings,
  Play,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Search,
  Filter,
  SortAsc,
};

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件或默认图标
 */
export const getIcon = (iconName: string): IconComponent => {
  return ICON_MAP[iconName] || FileText; // 默认使用 FileText 图标
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
