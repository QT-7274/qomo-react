/**
 * 侧边栏组件
 * 负责显示应用导航、用户信息和快速统计
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import QomoLogo from '@/assets/QomoLogo';
import { cn } from '@/utils'; // 自定义类名合并工具函数
import { useAppStore } from '@/store/useAppStore';
import {
  MAIN_NAVIGATION,
  APP_METADATA,
  QUICK_STATS_CONFIG,
  // isActiveRoute,
} from '@/config/navigation';
import { STATS } from '@/config/text';
import { useI18n } from '@/i18n/hooks';
import { getIcon } from '@/utils/iconMap';
import TeaButton from '@/components/common/TeaButton';
import NavLink from '@/components/common/NavLink';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className }) => {
  const location = useLocation();
  const { t } = useI18n();
  const { user, templates, setCurrentTemplate } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className={cn('w-80 bg-gray-50 border-r border-gray-200', className)}>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* <div className='rounded-xl flex items-center justify-center'> */}
              <QomoLogo className='w-12 h-12 text-white' />
            {/* </div> */}
            <div>
              <h1 className='text-xl font-bold text-gray-800'>
                {t(APP_METADATA.name)}
              </h1>
              <p className='text-xs text-gray-600'>
                {t(APP_METADATA.description)}
              </p>
            </div>
          </div>
          <TeaButton
            variant='text'
            size='sm'
            onClick={onClose}
            icon='close'
            className='lg:hidden'
          />
        </div>

        {/* Navigation */}
        <nav className='space-y-2'>
          {MAIN_NAVIGATION.map((item) => {
            const IconComponent = getIcon(item.icon);

            return (
              <NavLink
                key={item.id}
                path={item.path}
                label={t(item.label)}
                icon={IconComponent}
                color={item.color as any}
              />
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h4 className='text-gray-800 font-medium mb-3'>
            {t(STATS.TEMPLATES_COUNT)}
          </h4>
          <div className='space-y-2 text-sm'>
            {QUICK_STATS_CONFIG.map((stat) => (
              <div
                key={stat.key}
                className='flex justify-between text-gray-600'
              >
                <span>{t(stat.label)}</span>
                <span>
                  {stat.key === 'templates'
                    ? templates.length
                    : stat.defaultValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
