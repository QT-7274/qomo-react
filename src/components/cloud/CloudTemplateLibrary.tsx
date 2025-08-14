/**
 * 云端模板库组件
 * 集成到现有模板库中，提供云端模板的获取和管理功能
 */

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/hooks';
import { Card } from 'tea-component';
import TeaButton from '@/components/common/TeaButton';
import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';
import { Cloud, Download, Users, Wifi, WifiOff } from 'lucide-react';

interface CloudTemplateLibraryProps {
  onTemplateSelect?: (template: Template) => void;
  showPublicTemplates?: boolean;
}

export const CloudTemplateLibrary: React.FC<CloudTemplateLibraryProps> = ({
  onTemplateSelect,
  showPublicTemplates = true
}) => {
  const { addTemplate, showNotification } = useAppStore();
  const {
    getTemplatesFromCloud,
    getPublicTemplates,
    isOnline,
    isSyncing,
  } = useEdgeCloudSync();

  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const { t } = useI18n();
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'user' | 'public'>('user');

  // 页面加载时获取模板
  useEffect(() => {
    if (isOnline) {
      loadUserTemplates();
      if (showPublicTemplates) {
        loadPublicTemplates();
      }
    }
  }, [isOnline, showPublicTemplates]);

  /**
   * 加载用户模板
   */
  const loadUserTemplates = async () => {
    const templates = await getTemplatesFromCloud('user');
    setUserTemplates(templates);
  };

  /**
   * 加载公开模板
   */
  const loadPublicTemplates = async () => {
    const templates = await getPublicTemplates();
    setPublicTemplates(templates);
  };

  /**
   * 使用模板
   */
  const handleUseTemplate = (template: Template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    } else {
      // 默认行为：添加到本地
      addTemplate(template);
      showNotification({
        type: 'success',
        title: t('模板已添加'),
        message: `${t('模板')} "${template.name}" ${t('已添加到本地')}`,
      });
    }
  };

  /**
   * 渲染模板卡片
   */
  const renderTemplateCard = (template: Template, isPublic = false) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow">
      <Card.Body>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              {isPublic && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <Users className="w-3 h-3" />
                  {t('公开')}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span>{t('分类')}：{template.category}</span>
              <span>{t('组件')}：{template.components?.length || 0} {t('个')}</span>
              {template.usageCount !== undefined && (
                <span>{t('使用')}：{template.usageCount} {t('次')}</span>
              )}
            </div>
            
            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <TeaButton
            variant="primary"
            size="sm"
            onClick={() => handleUseTemplate(template)}
            loading={isSyncing}
            disabled={!isOnline}
            className="ml-4"
          >
            <Download className="w-4 h-4 mr-1" />
            {t('使用模板')}
          </TeaButton>
        </div>
      </Card.Body>
    </Card>
  );

  if (!isOnline) {
    return (
      <Card>
        <Card.Body className="text-center py-8">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('网络连接不可用')}</h3>
          <p className="text-gray-600 mb-4">
            {t('云端模板库需要网络连接才能使用')}
          </p>
          <TeaButton
            variant="weak"
            onClick={() => window.location.reload()}
          >
            {t('重新连接')}
          </TeaButton>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 状态栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{t('云端模板库')}</span>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Wifi className="w-4 h-4" />
            {t('在线')}
          </div>
        </div>
        
        <TeaButton
          variant="weak"
          size="sm"
          onClick={() => {
            loadUserTemplates();
            if (showPublicTemplates) loadPublicTemplates();
          }}
          loading={isSyncing}
        >
          {t('刷新')}
        </TeaButton>
      </div>

      {/* 标签页 */}
      {showPublicTemplates && (
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'user'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('user')}
          >
            {t('我的模板')} ({userTemplates.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'public'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('public')}
          >
            {t('公开模板')} ({publicTemplates.length})
          </button>
        </div>
      )}

      {/* 模板列表 */}
      <div className="space-y-4">
        {activeTab === 'user' && (
          <>
            {userTemplates.length > 0 ? (
              userTemplates.map(template => renderTemplateCard(template, false))
            ) : (
              <Card>
                <Card.Body className="text-center py-8">
                  <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('暂无云端模板')}</h3>
                  <p className="text-gray-600">
                    {t('在模板编辑器中创建模板后可以保存到云端')}
                  </p>
                </Card.Body>
              </Card>
            )}
          </>
        )}

        {activeTab === 'public' && showPublicTemplates && (
          <>
            {publicTemplates.length > 0 ? (
              publicTemplates.map(template => renderTemplateCard(template, true))
            ) : (
              <Card>
                <Card.Body className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('暂无公开模板')}</h3>
                  <p className="text-gray-600">
                    {t('还没有用户分享公开模板')}
                  </p>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};
