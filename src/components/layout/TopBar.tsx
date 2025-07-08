/**
 * 顶部导航栏组件
 * 负责显示页面标题、描述和设置按钮
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils'; // 自定义类名合并工具函数
import { getPageInfo } from '@/config/navigation';
import { BUTTON_TEXTS } from '@/config/text';
import TeaButton from '@/components/common/TeaButton';

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
              aria-label="打开侧边栏"
            />
          )}
          <div>
            <h2 className='text-xl font-semibold text-gray-800'>
              {pageInfo.title}
            </h2>
            <p className='text-gray-600 text-sm'>
              {pageInfo.description}
            </p>
          </div>
        </div>
        <TeaButton
          variant='text'
          size='sm'
          icon='setting'
          aria-label={BUTTON_TEXTS.SETTINGS}
        >
          {BUTTON_TEXTS.SETTINGS}
        </TeaButton>
      </div>
    </div>
  );
};

export default TopBar;
