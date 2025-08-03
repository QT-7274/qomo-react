/**
 * EdgeOne 云端同步 Hook
 * 直接使用 EdgeOne Pages 函数进行模板的云端同步
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
}

export const useEdgeCloudSync = () => {
  const { user, showNotification } = useAppStore();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  });

  /**
   * 保存模板到云端
   */
  const saveTemplateToCloud = useCallback(async (template: Template): Promise<boolean> => {
    if (!syncStatus.isOnline) {
      showNotification({
        type: 'warning',
        title: '网络离线',
        message: '无法保存到云端，将保存到本地',
      });
      return false;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      const response = await fetch('/api/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template,
          userId: user?.id || 'anonymous',
        }),
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!doctype') || text.includes('<html')) {
          throw new Error('API 端点不存在 - 请确保已部署 EdgeOne Pages 函数');
        }
        throw new Error(`响应不是 JSON 格式: ${contentType}`);
      }

      const result = await response.json();

      if (result.success) {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: new Date(),
        }));

        showNotification({
          type: 'success',
          title: '保存成功',
          message: '模板已保存到云端',
        });
        return true;
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存失败';
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));

      showNotification({
        type: 'error',
        title: '保存失败',
        message: errorMessage,
      });
      return false;
    }
  }, [syncStatus.isOnline, user?.id, showNotification]);

  /**
   * 从云端获取模板列表
   */
  const getTemplatesFromCloud = useCallback(async (type: 'user' | 'public' = 'user', category?: string): Promise<Template[]> => {
    if (!syncStatus.isOnline) {
      showNotification({
        type: 'warning',
        title: '网络离线',
        message: '无法获取云端模板',
      });
      return [];
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      const params = new URLSearchParams({
        userId: user?.id || 'anonymous',
        type,
        limit: '50',
      });

      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`/api/templates/list?${params.toString()}`);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!doctype') || text.includes('<html')) {
          throw new Error('API 端点不存在 - 请确保已部署 EdgeOne Pages 函数');
        }
        throw new Error(`响应不是 JSON 格式: ${contentType}`);
      }

      const result = await response.json();

      if (result.success) {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: new Date(),
        }));

        return result.data.templates || [];
      } else {
        throw new Error(result.error || '获取模板失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取模板失败';
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));

      showNotification({
        type: 'error',
        title: '获取失败',
        message: errorMessage,
      });
      return [];
    }
  }, [syncStatus.isOnline, user?.id, showNotification]);

  /**
   * 从云端删除模板
   */
  const deleteTemplateFromCloud = useCallback(async (templateId: string): Promise<boolean> => {
    if (!syncStatus.isOnline) {
      showNotification({
        type: 'warning',
        title: '网络离线',
        message: '无法从云端删除',
      });
      return false;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      const response = await fetch('/api/templates/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          userId: user?.id || 'anonymous',
        }),
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!doctype') || text.includes('<html')) {
          throw new Error('API 端点不存在 - 请确保已部署 EdgeOne Pages 函数');
        }
        throw new Error(`响应不是 JSON 格式: ${contentType}`);
      }

      const result = await response.json();

      if (result.success) {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: new Date(),
        }));

        showNotification({
          type: 'success',
          title: '删除成功',
          message: '模板已从云端删除',
        });
        return true;
      } else {
        throw new Error(result.error || '删除失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除失败';
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));

      showNotification({
        type: 'error',
        title: '删除失败',
        message: errorMessage,
      });
      return false;
    }
  }, [syncStatus.isOnline, user?.id, showNotification]);

  /**
   * 获取公开模板
   */
  const getPublicTemplates = useCallback(async (category?: string): Promise<Template[]> => {
    return getTemplatesFromCloud('public', category);
  }, [getTemplatesFromCloud]);

  return {
    // 状态
    syncStatus,
    
    // 操作方法
    saveTemplateToCloud,
    getTemplatesFromCloud,
    deleteTemplateFromCloud,
    getPublicTemplates,
    
    // 工具方法
    isOnline: syncStatus.isOnline,
    isSyncing: syncStatus.isSyncing,
    hasError: !!syncStatus.syncError,
  };
};
