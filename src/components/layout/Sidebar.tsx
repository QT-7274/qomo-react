import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Wand2,
  BookOpen,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { cn } from '@/utils';
import { useAppStore } from '@/store/useAppStore';
import TeaButton from '@/components/common/TeaButton';
import NavLink from '@/components/common/NavLink';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const location = useLocation();
  const { user } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className={cn('w-80 bg-gray-50 border-r border-gray-200', className)}>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-800'>
                Qomo
              </h1>
              <p className='text-xs text-gray-600'>AI模板系统</p>
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

        {/* User Info 暂时挂起*/}
        {user && (
          <div className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-semibold'>
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className='flex-1'>
                <h3 className='text-gray-800 font-medium'>
                  {user.name}
                </h3>
                <p className='text-gray-600 text-sm'>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className='space-y-2'>
          <NavLink
            path='/editor'
            label='模板编辑器'
            icon={Wand2}
            color='primary'
          />
          <NavLink
            path='/library'
            label='模板库'
            icon={BookOpen}
            color='success'
          />
          <NavLink
            path='/sessions'
            label='会话记录'
            icon={MessageSquare}
            color='warning'
          />
        </nav>

        {/* Quick Stats 暂时挂起*/}
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h4 className='text-gray-800 font-medium mb-3'>快速统计</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between text-gray-600'>
              <span>已创建模板</span>
              <span>3</span>
            </div>
            <div className='flex justify-between text-gray-600'>
              <span>模板库</span>
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

// TopBar Component
interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  className
}) => {
  const location = useLocation();

  const getPageInfo = (pathname: string) => {
    const pageMap = {
      '/': { title: '模板编辑器', description: '创建和编辑AI提示模板' },
      '/editor': { title: '模板编辑器', description: '创建和编辑AI提示模板' },
      '/library': { title: '模板库', description: '管理您的模板库' },
      '/sessions': { title: '会话记录', description: '查看历史会话记录' }
    };
    return pageMap[pathname as keyof typeof pageMap] || { title: '未知页面', description: '' };
  };

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
        >
          设置
        </TeaButton>
      </div>
    </div>
  );
};
