/**
 * 导航链接组件
 * 支持配置化的颜色主题和活动状态指示
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';
import { COLOR_THEMES, ROUTES } from '@/config/constants';
import { useI18n } from '@/i18n/hooks';
import { COMPONENT_COLORS } from '@/config/theme';

// 定义图标组件类型，支持 Lucide 图标和自定义组件
type IconComponent = LucideIcon | React.ComponentType<any>;

interface NavLinkProps {
  path: string;
  label: string;
  icon: IconComponent;
  color?: keyof typeof COLOR_THEMES;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  path,
  label,
  icon: Icon,
  color = COLOR_THEMES.PRIMARY,
  className
}) => {
  const location = useLocation();
  const { t } = useI18n();
  // 检查当前路径是否为活动状态，特殊处理编辑器路径
  const isActive = location.pathname === path || (location.pathname === ROUTES.HOME && path === ROUTES.EDITOR);

  // 根据颜色主题设置激活状态的样式 - 使用配置化的颜色映射
  const getActiveStyles = (colorTheme: string) => {
    const colorMap = {
      [COLOR_THEMES.PRIMARY]: 'bg-blue-50 text-blue-600',
      [COLOR_THEMES.SECONDARY]: 'bg-slate-50 text-slate-600',
      [COLOR_THEMES.SUCCESS]: 'bg-green-50 text-green-600',
      [COLOR_THEMES.WARNING]: 'bg-yellow-50 text-yellow-600',
      [COLOR_THEMES.DANGER]: 'bg-red-50 text-red-600',
      [COLOR_THEMES.INFO]: 'bg-gray-50 text-gray-600'
    };
    return colorMap[colorTheme as keyof typeof colorMap] || colorMap[COLOR_THEMES.PRIMARY];
  };

  // 获取活动状态指示器的样式
  const getIndicatorStyles = (colorTheme: string) => {
    const colorMap = {
      [COLOR_THEMES.PRIMARY]: 'bg-blue-600',
      [COLOR_THEMES.SECONDARY]: 'bg-slate-600',
      [COLOR_THEMES.SUCCESS]: 'bg-green-600',
      [COLOR_THEMES.WARNING]: 'bg-yellow-600',
      [COLOR_THEMES.DANGER]: 'bg-red-600',
      [COLOR_THEMES.INFO]: 'bg-gray-600'
    };
    return colorMap[colorTheme as keyof typeof colorMap] || colorMap[COLOR_THEMES.PRIMARY];
  };

  return (
    <Link
      to={path}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
        'no-underline hover:no-underline', // 移除下划线
        isActive
          ? `${getActiveStyles(color)} shadow-sm`
          : 'text-gray-700 hover:text-gray-900',
        className
      )}
    >
      <Icon className='w-5 h-5' />
      <span className='font-medium'>{t(label)}</span>
      {isActive && (
        <div className={cn('ml-auto w-2 h-2 rounded-full', getIndicatorStyles(color))} />
      )}
    </Link>
  );
};

export default NavLink;
