/**
 * 主题配置文件
 * 包含颜色、间距、字体等视觉设计相关的配置
 */

import { COLOR_THEMES, UI_VARIANTS } from './constants';

// ==================== 颜色配置 ====================
export const COLORS = {
  // 主色调
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // 成功色
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // 警告色
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d', 
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // 危险色
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // 灰色
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// ==================== 组件颜色映射 ====================
export const COMPONENT_COLORS = {
  [COLOR_THEMES.PRIMARY]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  [COLOR_THEMES.SECONDARY]: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    button: 'bg-slate-600 hover:bg-slate-700',
  },
  [COLOR_THEMES.SUCCESS]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
  },
  [COLOR_THEMES.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    button: 'bg-yellow-600 hover:bg-yellow-700',
  },
  [COLOR_THEMES.DANGER]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    button: 'bg-red-600 hover:bg-red-700',
  },
  [COLOR_THEMES.INFO]: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    button: 'bg-gray-600 hover:bg-gray-700',
  },
} as const;

// ==================== 按钮变体样式 ====================
export const BUTTON_VARIANTS = {
  [UI_VARIANTS.BUTTON.PRIMARY]: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
  [UI_VARIANTS.BUTTON.SECONDARY]: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
  [UI_VARIANTS.BUTTON.SUCCESS]: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  [UI_VARIANTS.BUTTON.WARNING]: 'bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600',
  [UI_VARIANTS.BUTTON.DANGER]: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  [UI_VARIANTS.BUTTON.OUTLINE]: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
  [UI_VARIANTS.BUTTON.DEFAULT]: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  [UI_VARIANTS.BUTTON.GHOST]: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
} as const;

// ==================== 间距配置 ====================
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// ==================== 字体配置 ====================
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// ==================== 阴影配置 ====================
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// ==================== 圆角配置 ====================
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// ==================== 动画配置 ====================
export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ==================== 断点配置 ====================
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
