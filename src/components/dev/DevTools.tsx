import React from 'react';
import { Database, Download, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { mockTemplates } from '@/data/mockData';
import Button from '@/components/ui/Button';
import { cn } from '@/utils';
import { useI18n } from '@/i18n/hooks';

interface DevToolsProps {
  className?: string;
}

const DevTools: React.FC<DevToolsProps> = ({ className }) => {
  const { t } = useI18n();
  const { addTemplate, showNotification } = useAppStore();

  // 检查是否为开发环境
  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
  const showMockDataImport = import.meta.env.VITE_SHOW_MOCK_DATA_IMPORT === 'true';

  // 如果不是开发环境或未启用开发工具，不渲染组件
  if (!isDevelopment || !showMockDataImport) {
    return null;
  }

  // 导入Mock模板数据
  const handleImportMockTemplates = async () => {
    try {
      let importedCount = 0;
      
      for (const template of mockTemplates) {
        // 检查模板是否已存在（通过ID或名称）
        addTemplate(template);
        importedCount++;
      }

      showNotification({
        type: 'success',
        title: t('导入成功'),
        message: `${t('已成功导入')} ${importedCount} ${t('个')}Mock${t('模板')}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('导入Mock数据失败:', error);
      showNotification({
        type: 'error',
        title: t('导入失败'),
        message: `${t('无法导入')}Mock${t('数据')}${t('请检查控制台错误信息')}`,
        duration: 3000,
      });
    }
  };

  // 清空所有数据（危险操作）
  const handleClearAllData = async () => {
    if (confirm(`⚠️ ${t('危险操作')}：${t('这将清空所有模板和组件数据')}${t('确定要继续吗')}？`)) {
      try {
        // 这里需要添加清空数据的逻辑
        // 由于当前store没有清空所有数据的方法，我们先显示提示
        showNotification({
          type: 'warning',
          title: t('功能待实现'),
          message: `${t('清空数据功能需要在')}store${t('中添加相应方法')}`,
          duration: 3000,
        });
      } catch (error) {
        console.error('清空数据失败:', error);
        showNotification({
          type: 'error',
          title: t('操作失败'),
          message: t('无法清空数据'),
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50',
      'bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 shadow-lg',
      'max-w-sm',
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-yellow-600" />
        <h3 className="text-sm font-semibold text-yellow-800">{t('开发工具')}</h3>
        <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded">
          DEV ONLY
        </span>
      </div>
      
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportMockTemplates}
          icon={<Download className="w-4 h-4" />}
          className="w-full text-left justify-start bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          {t('导入')}Mock{t('模板数据')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAllData}
          icon={<AlertTriangle className="w-4 h-4" />}
          className="w-full text-left justify-start bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          {t('清空所有数据')}
        </Button>

        {/* 移除云端同步演示按钮，改为在调试分支中通过路由访问 */}
      </div>
      
      <div className="mt-3 pt-2 border-t border-yellow-200">
        <p className="text-xs text-yellow-600">
          {t('环境')}: {import.meta.env.VITE_APP_ENV}<br/>
          {t('模式')}: {import.meta.env.MODE}
        </p>
      </div>
    </div>
  );
};

export default DevTools;
