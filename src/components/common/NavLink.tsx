import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

interface NavLinkProps {
  path: string;
  label: string;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  path,
  label,
  icon: Icon,
  color = 'primary',
  className
}) => {
  const location = useLocation();
  const isActive = location.pathname === path || (location.pathname === '/' && path === '/editor');

  // 根据颜色主题设置激活状态的样式
  const getActiveStyles = (color: string) => {
    const colorMap = {
      primary: 'bg-blue-50 text-blue-600',
      success: 'bg-green-50 text-green-600',
      warning: 'bg-yellow-50 text-yellow-600',
      danger: 'bg-red-50 text-red-600',
      info: 'bg-gray-50 text-gray-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const getIndicatorStyles = (color: string) => {
    const colorMap = {
      primary: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
      info: 'bg-gray-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
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
      <span className='font-medium'>{label}</span>
      {isActive && (
        <div className={cn('ml-auto w-2 h-2 rounded-full', getIndicatorStyles(color))} />
      )}
    </Link>
  );
};

export default NavLink;
