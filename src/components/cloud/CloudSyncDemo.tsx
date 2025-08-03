/**
 * 云端模板管理组件
 * 实际的模板云端存储、获取、删除功能
 * 替代原有的 IndexedDB 存储
 */

import React, { useState, useEffect } from 'react';
import { Card } from 'tea-component';
import TeaButton from '@/components/common/TeaButton';
import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';
import { generateId } from '@/utils';

export const CloudSyncDemo: React.FC = () => {
  const { templates, addTemplate, showNotification } = useAppStore();
  const {
    saveTemplateToCloud,
    getTemplatesFromCloud,
    deleteTemplateFromCloud,
    getPublicTemplates,
    syncStatus,
    isOnline,
    isSyncing,
    hasError
  } = useEdgeCloudSync();

  const [cloudTemplates, setCloudTemplates] = useState<Template[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);

  // 页面加载时自动获取云端模板
  useEffect(() => {
    if (isOnline) {
      handleGetFromCloud();
    }
  }, [isOnline]);

  /**
   * 保存本地模板到云端
   */
  const handleSaveLocalTemplatesToCloud = async () => {
    if (templates.length === 0) {
      showNotification({
        type: 'warning',
        title: '没有模板',
        message: '当前没有本地模板可以保存到云端',
      });
      return;
    }

    let successCount = 0;
    for (const template of templates) {
      const success = await saveTemplateToCloud(template);
      if (success) successCount++;
    }

    showNotification({
      type: successCount > 0 ? 'success' : 'error',
      title: '批量保存完成',
      message: `成功保存 ${successCount}/${templates.length} 个模板到云端`,
    });

    // 刷新云端模板列表
    if (successCount > 0) {
      handleGetFromCloud();
    }
  };

  /**
   * 从云端下载模板到本地
   */
  const handleDownloadFromCloud = async (template: Template) => {
    addTemplate(template);
    showNotification({
      type: 'success',
      title: '下载成功',
      message: `模板 "${template.name}" 已添加到本地`,
    });
  };

  /**
   * 从云端获取用户模板
   */
  const handleGetFromCloud = async () => {
    const templates = await getTemplatesFromCloud('user');
    setCloudTemplates(templates);
    
    showNotification({
      type: 'info',
      title: '获取完成',
      message: `从云端获取到 ${templates.length} 个模板`,
    });
  };

  /**
   * 获取公开模板
   */
  const handleGetPublicTemplates = async () => {
    const templates = await getPublicTemplates();
    setPublicTemplates(templates);
    
    showNotification({
      type: 'info',
      title: '获取完成',
      message: `获取到 ${templates.length} 个公开模板`,
    });
  };

  /**
   * 删除云端模板
   */
  const handleDeleteFromCloud = async (templateId: string) => {
    const success = await deleteTemplateFromCloud(templateId);
    
    if (success) {
      // 更新本地列表
      setCloudTemplates(prev => prev.filter(t => t.id !== templateId));
      
      showNotification({
        type: 'success',
        title: '删除成功',
        message: '模板已从云端删除',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 同步状态 */}
      <Card>
        <Card.Body>
          <h3 className="text-lg font-semibold mb-4">云端同步状态</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                {isOnline ? '🟢' : '🔴'}
              </div>
              <div className="text-sm text-gray-600">
                {isOnline ? '在线' : '离线'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl ${isSyncing ? 'text-blue-500' : 'text-gray-400'}`}>
                {isSyncing ? '🔄' : '⏸️'}
              </div>
              <div className="text-sm text-gray-600">
                {isSyncing ? '同步中' : '空闲'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl ${hasError ? 'text-red-500' : 'text-green-500'}`}>
                {hasError ? '❌' : '✅'}
              </div>
              <div className="text-sm text-gray-600">
                {hasError ? '有错误' : '正常'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl">📅</div>
              <div className="text-sm text-gray-600">
                {syncStatus.lastSyncTime 
                  ? syncStatus.lastSyncTime.toLocaleTimeString()
                  : '未同步'
                }
              </div>
            </div>
          </div>
          
          {hasError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                错误信息：{syncStatus.syncError}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 操作按钮 */}
      <Card>
        <Card.Body>
          <h3 className="text-lg font-semibold mb-4">云端操作</h3>
          <div className="flex flex-wrap gap-3">
            <TeaButton
              variant="primary"
              onClick={handleSaveLocalTemplatesToCloud}
              loading={isSyncing}
              disabled={!isOnline || templates.length === 0}
            >
              保存本地模板到云端 ({templates.length})
            </TeaButton>
            
            <TeaButton
              variant="weak"
              onClick={handleGetFromCloud}
              loading={isSyncing}
              disabled={!isOnline}
            >
              获取我的云端模板
            </TeaButton>
            
            <TeaButton
              variant="weak"
              onClick={handleGetPublicTemplates}
              loading={isSyncing}
              disabled={!isOnline}
            >
              获取公开模板
            </TeaButton>
          </div>
        </Card.Body>
      </Card>

      {/* 云端模板列表 */}
      {cloudTemplates.length > 0 && (
        <Card>
          <Card.Body>
            <h3 className="text-lg font-semibold mb-4">我的云端模板 ({cloudTemplates.length})</h3>
            <div className="space-y-3">
              {cloudTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      创建时间：{template.createdAt.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TeaButton
                      variant="weak"
                      size="sm"
                      onClick={() => handleDownloadFromCloud(template)}
                      loading={isSyncing}
                    >
                      下载到本地
                    </TeaButton>
                    <TeaButton
                      variant="error"
                      size="sm"
                      onClick={() => handleDeleteFromCloud(template.id)}
                      loading={isSyncing}
                    >
                      删除
                    </TeaButton>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 公开模板列表 */}
      {publicTemplates.length > 0 && (
        <Card>
          <Card.Body>
            <h3 className="text-lg font-semibold mb-4">公开模板 ({publicTemplates.length})</h3>
            <div className="space-y-3">
              {publicTemplates.map((template) => (
                <div key={template.id} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    分类：{template.category} | 使用次数：{template.usageCount || 0}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <Card.Body>
          <h3 className="text-lg font-semibold mb-4">云端模板管理说明</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>保存到云端</strong>：将本地创建的模板保存到 EdgeOne KV 存储</p>
            <p>• <strong>从云端获取</strong>：查看和下载云端保存的模板</p>
            <p>• <strong>地理位置优化</strong>：模板会根据用户地理位置进行存储优化</p>
            <p>• <strong>多设备同步</strong>：在不同设备间同步你的模板</p>
            <p>• <strong>公开模板</strong>：浏览其他用户分享的公开模板</p>
            <p>• <strong>离线提示</strong>：网络状态监控，离线时会有相应提示</p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 使用建议</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. 先在模板编辑器中创建模板</p>
              <p>2. 回到这里点击"保存本地模板到云端"</p>
              <p>3. 在其他设备上点击"获取我的云端模板"来同步</p>
              <p>4. 点击"下载到本地"将云端模板添加到当前设备</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
