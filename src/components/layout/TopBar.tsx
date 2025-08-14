/**
 * 顶部导航栏组件
 * 负责显示页面标题、描述、语言切换和设置按钮
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils'; // 自定义类名合并工具函数
import { getPageInfo } from '@/config/navigation';

import TeaButton from '@/components/common/TeaButton';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useI18n } from '@/i18n/hooks';

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  className
}) => {
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const { t } = useI18n();

  return (
    <div className={cn('bg-white border-b border-gray-200 px-6 py-4', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {!sidebarOpen && (
            <TeaButton
              variant='text'
              size='sm'
              onClick={onToggleSidebar}
              icon='more'
              aria-label={t('打开侧边栏')}
            />
          )}
          <div>
            <h2 className='text-xl font-semibold text-gray-800'>
              {t(pageInfo.title)}
            </h2>
            <p className='text-gray-600 text-sm'>
              {t(pageInfo.description)}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <LanguageSwitcher size='s' />
          <TeaButton
            variant='text'
            size='sm'
            icon='setting'
            aria-label={t('设置')}
          >
            {t('设置')}
          </TeaButton>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
