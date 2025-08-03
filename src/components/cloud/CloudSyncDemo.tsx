/**
 * 开发模式模板管理页面
 * 专门用于开发环境下管理所有模板（本地 + 云端）
 * 提供完整的 CRUD 操作和调试功能
 */

import React, { useState, useEffect } from 'react';
import { Card } from 'tea-component';
import TeaButton from '@/components/common/TeaButton';
import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';
import { generateId } from '@/utils';
import { Trash2, Download, Upload, RefreshCw, Database, Cloud, HardDrive, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { DebugNavigation } from '@/components/debug/DebugNavigation';

export const CloudSyncDemo: React.FC = () => {
  const { templates, addTemplate, deleteTemplate, showNotification } = useAppStore();
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
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'local' | 'cloud' | 'public' | 'debug'>('local');

  // 检查是否为本地开发环境
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // 页面加载时的初始化
  useEffect(() => {
    // 在本地开发环境下，默认使用本地模式避免网络错误
    if (isDevelopment) {
      setIsLocalMode(true);
    } else {
      // 在云端部署环境下，默认使用云端模式并尝试获取数据
      setIsLocalMode(false);
      if (isOnline) {
        handleGetFromCloud();
        handleGetPublicTemplates();
      }
    }
  }, [isOnline, isDevelopment]);

  /**
   * 创建测试模板（开发模式）
   */
  const createTestTemplate = (): Template => {
    return {
      id: generateId(),
      name: `测试模板 ${new Date().toLocaleTimeString()}`,
      description: '这是一个开发模式下创建的测试模板',
      category: 'productivity',
      tags: ['开发', '测试'],
      isPublic: false,
      components: [
        {
          id: generateId(),
          type: 'prefix',
          content: '这是前缀组件的测试内容',
          position: 0,
          isRequired: false,
          placeholder: '请输入前缀内容'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      version: '1.0.0',
      rating: 0,
      authorId: 'dev-user'
    };
  };

  /**
   * 安全的云端操作包装器
   */
  const safeCloudOperation = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      if (isLocalMode) {
        showNotification({
          type: 'info',
          title: '本地模式',
          message: `${operationName} - 当前为本地模式，未执行云端操作`,
        });
        return fallbackValue;
      }

      return await operation();
    } catch (error) {
      console.error(`${operationName} 失败:`, error);

      // 检查是否为 JSON 解析错误
      if (error instanceof Error && error.message.includes('Unexpected end of JSON input')) {
        showNotification({
          type: 'error',
          title: '网络错误',
          message: `${operationName} 失败：服务器响应格式错误，请检查函数部署状态`,
        });
      } else {
        showNotification({
          type: 'error',
          title: '操作失败',
          message: `${operationName} 失败：${error instanceof Error ? error.message : '未知错误'}`,
        });
      }

      return fallbackValue;
    }
  };

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
      const success = await safeCloudOperation(
        () => saveTemplateToCloud(template),
        `保存模板 "${template.name}"`
      );
      if (success) successCount++;
    }

    if (!isLocalMode) {
      showNotification({
        type: successCount > 0 ? 'success' : 'error',
        title: '批量保存完成',
        message: `成功保存 ${successCount}/${templates.length} 个模板到云端`,
      });

      // 刷新云端模板列表
      if (successCount > 0) {
        handleGetFromCloud();
      }
    }
  };

  /**
   * 创建并保存测试模板
   */
  const handleCreateTestTemplate = async () => {
    const testTemplate = createTestTemplate();

    // 添加到本地
    addTemplate(testTemplate);

    // 尝试保存到云端
    await safeCloudOperation(
      () => saveTemplateToCloud(testTemplate),
      `保存测试模板 "${testTemplate.name}"`
    );

    showNotification({
      type: 'success',
      title: '测试模板已创建',
      message: `测试模板 "${testTemplate.name}" 已添加到本地${!isLocalMode ? '并保存到云端' : ''}`,
    });
  };

  /**
   * 从云端获取模板列表
   */
  const handleGetFromCloud = async () => {
    const templates = await safeCloudOperation(
      () => getTemplatesFromCloud('user'),
      '获取云端模板',
      []
    );

    if (templates) {
      setCloudTemplates(templates);
      if (!isLocalMode) {
        showNotification({
          type: 'info',
          title: '获取完成',
          message: `从云端获取到 ${templates.length} 个模板`,
        });
      }
    }
  };

  /**
   * 获取公开模板
   */
  const handleGetPublicTemplates = async () => {
    const templates = await safeCloudOperation(
      () => getPublicTemplates(),
      '获取公开模板',
      []
    );

    if (templates) {
      setPublicTemplates(templates);
      if (!isLocalMode) {
        showNotification({
          type: 'info',
          title: '获取完成',
          message: `获取到 ${templates.length} 个公开模板`,
        });
      }
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
   * 删除本地模板
   */
  const handleDeleteLocal = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      deleteTemplate(templateId);
      showNotification({
        type: 'success',
        title: '删除成功',
        message: `本地模板 "${template.name}" 已删除`,
      });
    }
  };

  /**
   * 删除云端模板
   */
  const handleDeleteFromCloud = async (templateId: string) => {
    const success = await safeCloudOperation(
      () => deleteTemplateFromCloud(templateId),
      '删除云端模板'
    );

    if (success) {
      // 更新本地列表
      setCloudTemplates(prev => prev.filter(t => t.id !== templateId));

      if (!isLocalMode) {
        showNotification({
          type: 'success',
          title: '删除成功',
          message: '模板已从云端删除',
        });
      }
    }
  };

  /**
   * 切换本地/云端模式
   */
  const toggleMode = () => {
    setIsLocalMode(!isLocalMode);
    showNotification({
      type: 'info',
      title: '模式切换',
      message: `已切换到${!isLocalMode ? '本地' : '云端'}模式`,
    });
  };

  /**
   * 获取调试信息
   */
  const handleGetDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug/env');
      const data = await response.json();
      setDebugInfo(data);

      showNotification({
        type: 'success',
        title: '调试信息已获取',
        message: '查看调试标签页了解详细信息',
      });
    } catch (error) {
      setDebugInfo({
        success: false,
        error: '获取调试信息失败',
        details: error instanceof Error ? error.message : '未知错误'
      });

      showNotification({
        type: 'error',
        title: '获取失败',
        message: '无法获取调试信息，可能是函数未部署',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 调试导航 */}
      <DebugNavigation />

      {/* 开发模式标题和状态 */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">开发模式 - 模板管理</h2>
            <div className="flex items-center gap-3">
              {/* 环境指示器 */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isDevelopment ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isDevelopment ? '本地开发' : '生产环境'}
                </span>
              </div>

              {/* 模式切换 */}
              <TeaButton
                variant={isLocalMode ? 'weak' : 'primary'}
                size="sm"
                onClick={toggleMode}
              >
                {isLocalMode ? <HardDrive className="w-4 h-4 mr-1" /> : <Cloud className="w-4 h-4 mr-1" />}
                {isLocalMode ? '本地模式' : '云端模式'}
              </TeaButton>
            </div>
          </div>

          {/* 状态网格 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <HardDrive className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-semibold">{templates.length}</div>
              <div className="text-sm text-gray-600">本地模板</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Cloud className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-semibold">{cloudTemplates.length}</div>
              <div className="text-sm text-gray-600">云端模板</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-semibold">{publicTemplates.length}</div>
              <div className="text-sm text-gray-600">公开模板</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              {isOnline ? (
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
              )}
              <div className="text-sm font-semibold">{isOnline ? '在线' : '离线'}</div>
              <div className="text-sm text-gray-600">网络状态</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              {isSyncing ? (
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-500 animate-spin" />
              ) : (
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              )}
              <div className="text-sm font-semibold">{isSyncing ? '同步中' : '空闲'}</div>
              <div className="text-sm text-gray-600">同步状态</div>
            </div>
          </div>

          {/* 错误提示 */}
          {hasError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">同步错误</p>
                <p className="text-red-600 text-sm">{syncStatus.syncError}</p>
              </div>
            </div>
          )}

          {/* 本地模式提示 */}
          {isLocalMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-700 font-medium">本地模式</p>
                <p className="text-yellow-600 text-sm">当前为本地模式，云端操作将被模拟或跳过</p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'local', label: '本地模板', icon: HardDrive, count: templates.length },
          { key: 'cloud', label: '云端模板', icon: Cloud, count: cloudTemplates.length },
          { key: 'public', label: '公开模板', icon: Database, count: publicTemplates.length },
          { key: 'debug', label: '调试信息', icon: AlertCircle, count: 0 },
        ].map(tab => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 操作按钮区域 */}
      <Card>
        <Card.Body>
          <div className="flex flex-wrap gap-3">
            <TeaButton
              variant="primary"
              onClick={handleCreateTestTemplate}
              loading={isSyncing}
            >
              <Upload className="w-4 h-4 mr-1" />
              创建测试模板
            </TeaButton>

            <TeaButton
              variant="weak"
              onClick={handleSaveLocalTemplatesToCloud}
              loading={isSyncing}
              disabled={templates.length === 0}
            >
              <Upload className="w-4 h-4 mr-1" />
              保存本地到云端 ({templates.length})
            </TeaButton>

            <TeaButton
              variant="weak"
              onClick={handleGetFromCloud}
              loading={isSyncing}
            >
              <Download className="w-4 h-4 mr-1" />
              获取云端模板
            </TeaButton>

            <TeaButton
              variant="weak"
              onClick={handleGetPublicTemplates}
              loading={isSyncing}
            >
              <Database className="w-4 h-4 mr-1" />
              获取公开模板
            </TeaButton>

            <TeaButton
              variant="weak"
              onClick={handleGetDebugInfo}
              loading={isSyncing}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              获取调试信息
            </TeaButton>
          </div>
        </Card.Body>
      </Card>

      {/* 内容区域 */}
      <Card>
        <Card.Body>
          {activeTab === 'local' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">本地模板 ({templates.length})</h3>
              {templates.length > 0 ? (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          分类：{template.category} | 组件：{template.components?.length || 0} 个
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TeaButton
                          variant="weak"
                          size="sm"
                          onClick={() => safeCloudOperation(
                            () => saveTemplateToCloud(template),
                            `保存模板 "${template.name}"`
                          )}
                          loading={isSyncing}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          保存到云端
                        </TeaButton>
                        <TeaButton
                          variant="error"
                          size="sm"
                          onClick={() => handleDeleteLocal(template.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
                        </TeaButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无本地模板</p>
                  <p className="text-sm">点击"创建测试模板"来创建一个</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cloud' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">云端模板 ({cloudTemplates.length})</h3>
              {cloudTemplates.length > 0 ? (
                <div className="space-y-3">
                  {cloudTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          创建时间：{new Date(template.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TeaButton
                          variant="weak"
                          size="sm"
                          onClick={() => handleDownloadFromCloud(template)}
                          loading={isSyncing}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          下载到本地
                        </TeaButton>
                        <TeaButton
                          variant="error"
                          size="sm"
                          onClick={() => handleDeleteFromCloud(template.id)}
                          loading={isSyncing}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
                        </TeaButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无云端模板</p>
                  <p className="text-sm">点击"获取云端模板"来加载</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'public' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">公开模板 ({publicTemplates.length})</h3>
              {publicTemplates.length > 0 ? (
                <div className="space-y-3">
                  {publicTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          分类：{template.category} | 使用次数：{template.usageCount || 0}
                        </div>
                      </div>
                      <TeaButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownloadFromCloud(template)}
                        loading={isSyncing}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        使用模板
                      </TeaButton>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无公开模板</p>
                  <p className="text-sm">点击"获取公开模板"来加载</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'debug' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">调试信息</h3>
              {debugInfo ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无调试信息</p>
                  <p className="text-sm">点击"获取调试信息"来加载</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 开发说明 */}
      <Card>
        <Card.Body>
          <h3 className="text-lg font-semibold mb-4">开发模式说明</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>本地模式</strong>：所有云端操作将被模拟或跳过，适合离线开发</p>
            <p>• <strong>云端模式</strong>：连接真实的 EdgeOne Pages 函数进行操作</p>
            <p>• <strong>测试模板</strong>：快速创建测试数据进行功能验证</p>
            <p>• <strong>调试信息</strong>：查看 EdgeOne Pages 环境和 KV 存储状态</p>
            <p>• <strong>错误处理</strong>：完善的错误提示，包括 JSON 解析错误等</p>
          </div>

          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">⚠️ 开发注意事项</h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p>1. 本页面仅在开发环境可见，生产环境用户无法访问</p>
              <p>2. 本地开发时建议使用"本地模式"避免网络错误</p>
              <p>3. 部署函数后可切换到"云端模式"测试真实功能</p>
              <p>4. 调试信息可以帮助排查 KV 存储配置问题</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🚀 快速测试流程</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>1. 点击"创建测试模板"生成测试数据</p>
              <p>2. 在"本地模板"标签查看创建的模板</p>
              <p>3. 点击"保存到云端"测试云端存储</p>
              <p>4. 点击"获取云端模板"验证同步功能</p>
              <p>5. 使用"调试信息"排查任何问题</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
