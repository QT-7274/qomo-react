/**
 * EdgeOne KV 存储管理器
 * 提供云端模板和组件存储功能，支持多设备同步
 */

import { Template, StoredComponent } from '@/types';

// EdgeOne KV API 配置
const KV_API_BASE = '/api/kv'; // 通过边缘函数代理
const KV_NAMESPACE = 'qomo-templates';

interface KVResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class EdgeKVStorage {
  private userId: string;

  constructor(userId: string = 'default-user') {
    this.userId = userId;
  }

  /**
   * 生成用户专属的 KV 键名
   */
  private getUserKey(type: 'templates' | 'components' | 'settings', id?: string): string {
    const baseKey = `user:${this.userId}:${type}`;
    return id ? `${baseKey}:${id}` : baseKey;
  }

  /**
   * 保存模板到云端
   */
  async saveTemplate(template: Template): Promise<boolean> {
    try {
      const key = this.getUserKey('templates', template.id);
      const response = await fetch(`${KV_API_BASE}/put`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value: JSON.stringify({
            ...template,
            updatedAt: new Date().toISOString(),
            syncVersion: Date.now(),
          }),
          metadata: {
            userId: this.userId,
            type: 'template',
            category: template.category,
            isPublic: template.isPublic,
          }
        }),
      });

      const result: KVResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('保存模板到云端失败:', error);
      return false;
    }
  }

  /**
   * 从云端获取用户的所有模板
   */
  async getUserTemplates(): Promise<Template[]> {
    try {
      const response = await fetch(`${KV_API_BASE}/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix: this.getUserKey('templates'),
          limit: 100,
        }),
      });

      const result: KVResponse<{ keys: Array<{ name: string; metadata?: any }> }> = await response.json();
      
      if (!result.success || !result.data?.keys) {
        return [];
      }

      // 批量获取模板数据
      const templates: Template[] = [];
      for (const keyInfo of result.data.keys) {
        const templateData = await this.getTemplate(keyInfo.name.split(':').pop()!);
        if (templateData) {
          templates.push(templateData);
        }
      }

      return templates;
    } catch (error) {
      console.error('获取云端模板失败:', error);
      return [];
    }
  }

  /**
   * 获取单个模板
   */
  async getTemplate(templateId: string): Promise<Template | null> {
    try {
      const key = this.getUserKey('templates', templateId);
      const response = await fetch(`${KV_API_BASE}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const result: KVResponse<string> = await response.json();
      
      if (result.success && result.data) {
        return JSON.parse(result.data);
      }
      return null;
    } catch (error) {
      console.error('获取模板失败:', error);
      return null;
    }
  }

  /**
   * 删除模板
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const key = this.getUserKey('templates', templateId);
      const response = await fetch(`${KV_API_BASE}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const result: KVResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('删除模板失败:', error);
      return false;
    }
  }

  /**
   * 获取公开模板（社区功能）
   */
  async getPublicTemplates(category?: string, limit: number = 50): Promise<Template[]> {
    try {
      const response = await fetch(`${KV_API_BASE}/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix: 'public:templates',
          limit,
        }),
      });

      const result: KVResponse<{ keys: Array<{ name: string; metadata?: any }> }> = await response.json();
      
      if (!result.success || !result.data?.keys) {
        return [];
      }

      // 根据分类过滤
      const filteredKeys = category 
        ? result.data.keys.filter(key => key.metadata?.category === category)
        : result.data.keys;

      // 批量获取模板数据
      const templates: Template[] = [];
      for (const keyInfo of filteredKeys) {
        const templateData = await this.getPublicTemplate(keyInfo.name.split(':').pop()!);
        if (templateData) {
          templates.push(templateData);
        }
      }

      return templates;
    } catch (error) {
      console.error('获取公开模板失败:', error);
      return [];
    }
  }

  /**
   * 获取单个公开模板
   */
  async getPublicTemplate(templateId: string): Promise<Template | null> {
    try {
      const key = `public:templates:${templateId}`;
      const response = await fetch(`${KV_API_BASE}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const result: KVResponse<string> = await response.json();
      
      if (result.success && result.data) {
        return JSON.parse(result.data);
      }
      return null;
    } catch (error) {
      console.error('获取公开模板失败:', error);
      return null;
    }
  }

  /**
   * 发布模板到公开库
   */
  async publishTemplate(template: Template): Promise<boolean> {
    try {
      const publicKey = `public:templates:${template.id}`;
      const response = await fetch(`${KV_API_BASE}/put`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: publicKey,
          value: JSON.stringify({
            ...template,
            publishedAt: new Date().toISOString(),
            publishedBy: this.userId,
          }),
          metadata: {
            category: template.category,
            author: this.userId,
            publishedAt: new Date().toISOString(),
          }
        }),
      });

      const result: KVResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('发布模板失败:', error);
      return false;
    }
  }

  /**
   * 同步本地和云端数据
   */
  async syncWithLocal(localTemplates: Template[]): Promise<{
    updated: Template[];
    conflicts: Template[];
  }> {
    const cloudTemplates = await this.getUserTemplates();
    const updated: Template[] = [];
    const conflicts: Template[] = [];

    // 简单的同步策略：云端优先
    for (const cloudTemplate of cloudTemplates) {
      const localTemplate = localTemplates.find(t => t.id === cloudTemplate.id);
      
      if (!localTemplate) {
        // 云端有，本地没有 -> 下载到本地
        updated.push(cloudTemplate);
      } else {
        // 检查版本冲突
        const cloudTime = new Date(cloudTemplate.updatedAt).getTime();
        const localTime = new Date(localTemplate.updatedAt).getTime();
        
        if (cloudTime > localTime) {
          updated.push(cloudTemplate);
        } else if (localTime > cloudTime) {
          conflicts.push(localTemplate);
        }
      }
    }

    return { updated, conflicts };
  }
}

export default EdgeKVStorage;
