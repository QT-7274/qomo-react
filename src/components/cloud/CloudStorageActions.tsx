/**
 * 云端存储操作组件
 * 提供保存、加载、删除等云端存储操作
 * 可以集成到模板工作台和模板库中
 */

import React, { useState } from 'react';
import TeaButton from '@/components/common/TeaButton';
import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';
import { Cloud, CloudOff, Upload, Download, Trash2 } from 'lucide-react';

interface CloudStorageActionsProps {
  template?: Template;
  onTemplateUpdate?: (template: Template) => void;
  onTemplateDelete?: (templateId: string) => void;
  showLoadButton?: boolean;
  showSaveButton?: boolean;
  showDeleteButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'vertical';
}

export const CloudStorageActions: React.FC<CloudStorageActionsProps> = ({
  template,
  onTemplateUpdate,
  onTemplateDelete,
  showLoadButton = true,
  showSaveButton = true,
  showDeleteButton = false,
  size = 'sm',
  variant = 'horizontal'
}) => {
  const { showNotification, addTemplate } = useAppStore();
  const {
    saveTemplateToCloud,
    getTemplatesFromCloud,
    deleteTemplateFromCloud,
    isOnline,
    isSyncing,
  } = useEdgeCloudSync();

  const [isLoading, setIsLoading] = useState(false);

  /**
   * 保存当前模板到云端
   */
  const handleSaveToCloud = async () => {
    if (!template) {
      showNotification({
        type: 'warning',
        title: '没有模板',
        message: '请先创建或选择一个模板',
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await saveTemplateToCloud(template);
      
      if (success) {
        showNotification({
          type: 'success',
          title: '保存成功',
          message: `模板 "${template.name}" 已保存到云端`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 从云端加载模板
   */
  const handleLoadFromCloud = async () => {
    setIsLoading(true);
    try {
      const templates = await getTemplatesFromCloud('user');
      
      if (templates.length === 0) {
        showNotification({
          type: 'info',
          title: '没有云端模板',
          message: '您还没有保存任何模板到云端',
        });
        return;
      }

      // 如果只有一个模板，直接加载
      if (templates.length === 1) {
        const cloudTemplate = templates[0];
        addTemplate(cloudTemplate);
        
        if (onTemplateUpdate) {
          onTemplateUpdate(cloudTemplate);
        }
        
        showNotification({
          type: 'success',
          title: '加载成功',
          message: `模板 "${cloudTemplate.name}" 已从云端加载`,
        });
      } else {
        // 多个模板时，显示选择列表（这里简化处理，加载最新的）
        const latestTemplate = templates.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        
        addTemplate(latestTemplate);
        
        if (onTemplateUpdate) {
          onTemplateUpdate(latestTemplate);
        }
        
        showNotification({
          type: 'success',
          title: '加载成功',
          message: `已加载最新模板 "${latestTemplate.name}"，共有 ${templates.length} 个云端模板`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 从云端删除模板
   */
  const handleDeleteFromCloud = async () => {
    if (!template) {
      showNotification({
        type: 'warning',
        title: '没有模板',
        message: '请先选择要删除的模板',
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await deleteTemplateFromCloud(template.id);
      
      if (success) {
        if (onTemplateDelete) {
          onTemplateDelete(template.id);
        }
        
        showNotification({
          type: 'success',
          title: '删除成功',
          message: `模板 "${template.name}" 已从云端删除`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 如果离线，显示离线状态
  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <CloudOff className="w-4 h-4" />
        <span className="text-sm">离线</span>
      </div>
    );
  }

  const buttonClass = variant === 'vertical' ? 'w-full' : '';
  const containerClass = variant === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-2';

  return (
    <div className={containerClass}>
      {showSaveButton && (
        <TeaButton
          variant="primary"
          size={size}
          onClick={handleSaveToCloud}
          loading={isLoading || isSyncing}
          disabled={!template}
          className={buttonClass}
        >
          <Upload className="w-4 h-4 mr-1" />
          保存到云端
        </TeaButton>
      )}

      {showLoadButton && (
        <TeaButton
          variant="weak"
          size={size}
          onClick={handleLoadFromCloud}
          loading={isLoading || isSyncing}
          className={buttonClass}
        >
          <Download className="w-4 h-4 mr-1" />
          从云端加载
        </TeaButton>
      )}

      {showDeleteButton && template && (
        <TeaButton
          variant="error"
          size={size}
          onClick={handleDeleteFromCloud}
          loading={isLoading || isSyncing}
          className={buttonClass}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          从云端删除
        </TeaButton>
      )}

      {/* 在线状态指示器 */}
      <div className="flex items-center gap-1 text-green-600">
        <Cloud className="w-4 h-4" />
        {size !== 'sm' && <span className="text-sm">在线</span>}
      </div>
    </div>
  );
};

/**
 * 简化版云端存储按钮
 * 只显示保存按钮，适合在工具栏中使用
 */
export const CloudSaveButton: React.FC<{
  template?: Template;
  size?: 'sm' | 'md' | 'lg';
}> = ({ template, size = 'sm' }) => {
  return (
    <CloudStorageActions
      template={template}
      showLoadButton={false}
      showDeleteButton={false}
      size={size}
    />
  );
};

/**
 * 云端模板加载器
 * 只显示加载按钮，适合在模板库中使用
 */
export const CloudTemplateLoader: React.FC<{
  onTemplateLoad?: (template: Template) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ onTemplateLoad, size = 'sm' }) => {
  return (
    <CloudStorageActions
      onTemplateUpdate={onTemplateLoad}
      showSaveButton={false}
      showDeleteButton={false}
      size={size}
    />
  );
};
