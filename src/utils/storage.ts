// IndexedDB 存储工具类
// 用于持久化存储模板和组件数据

import { Template, StoredComponent } from '../types';

const DB_NAME = 'QomoTemplateDB';
const DB_VERSION = 1;
const TEMPLATES_STORE = 'templates';
const COMPONENTS_STORE = 'components';

class StorageManager {
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库连接
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB 打开失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB 连接成功');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建模板存储
        if (!db.objectStoreNames.contains(TEMPLATES_STORE)) {
          const templateStore = db.createObjectStore(TEMPLATES_STORE, { keyPath: 'id' });
          templateStore.createIndex('category', 'category', { unique: false });
          templateStore.createIndex('createdAt', 'createdAt', { unique: false });
          templateStore.createIndex('usageCount', 'usageCount', { unique: false });
        }

        // 创建组件存储
        if (!db.objectStoreNames.contains(COMPONENTS_STORE)) {
          const componentStore = db.createObjectStore(COMPONENTS_STORE, { keyPath: 'id' });
          componentStore.createIndex('type', 'type', { unique: false });
          componentStore.createIndex('category', 'category', { unique: false });
          componentStore.createIndex('createdAt', 'createdAt', { unique: false });
          componentStore.createIndex('usageCount', 'usageCount', { unique: false });
        }

        console.log('IndexedDB 数据库结构创建完成');
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('数据库初始化失败');
    }
    return this.db;
  }

  // ==================== 模板相关操作 ====================

  /**
   * 保存模板
   */
  async saveTemplate(template: Template): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TEMPLATES_STORE], 'readwrite');
      const store = transaction.objectStore(TEMPLATES_STORE);
      
      const request = store.put({
        ...template,
        updatedAt: new Date()
      });

      request.onsuccess = () => {
        console.log('模板保存成功:', template.name);
        resolve();
      };

      request.onerror = () => {
        console.error('模板保存失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取所有模板
   */
  async getAllTemplates(): Promise<Template[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TEMPLATES_STORE], 'readonly');
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const templates = request.result.map(template => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt)
        }));
        resolve(templates);
      };

      request.onerror = () => {
        console.error('获取模板失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 根据ID获取模板
   */
  async getTemplate(id: string): Promise<Template | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TEMPLATES_STORE], 'readonly');
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const template = request.result;
        if (template) {
          resolve({
            ...template,
            createdAt: new Date(template.createdAt),
            updatedAt: new Date(template.updatedAt)
          });
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('获取模板失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 删除模板
   */
  async deleteTemplate(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TEMPLATES_STORE], 'readwrite');
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('模板删除成功:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('模板删除失败:', request.error);
        reject(request.error);
      };
    });
  }

  // ==================== 组件相关操作 ====================

  /**
   * 保存组件
   */
  async saveComponent(component: StoredComponent): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPONENTS_STORE], 'readwrite');
      const store = transaction.objectStore(COMPONENTS_STORE);
      
      const request = store.put({
        ...component,
        updatedAt: new Date()
      });

      request.onsuccess = () => {
        console.log('组件保存成功:', component.name);
        resolve();
      };

      request.onerror = () => {
        console.error('组件保存失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取所有组件
   */
  async getAllComponents(): Promise<StoredComponent[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPONENTS_STORE], 'readonly');
      const store = transaction.objectStore(COMPONENTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const components = request.result.map(component => ({
          ...component,
          createdAt: new Date(component.createdAt),
          updatedAt: new Date(component.updatedAt)
        }));
        resolve(components);
      };

      request.onerror = () => {
        console.error('获取组件失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 根据类型获取组件
   */
  async getComponentsByType(type: string): Promise<StoredComponent[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPONENTS_STORE], 'readonly');
      const store = transaction.objectStore(COMPONENTS_STORE);
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => {
        const components = request.result.map(component => ({
          ...component,
          createdAt: new Date(component.createdAt),
          updatedAt: new Date(component.updatedAt)
        }));
        resolve(components);
      };

      request.onerror = () => {
        console.error('获取组件失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 删除组件
   */
  async deleteComponent(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPONENTS_STORE], 'readwrite');
      const store = transaction.objectStore(COMPONENTS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('组件删除成功:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('组件删除失败:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 增加组件使用次数
   */
  async incrementComponentUsage(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPONENTS_STORE], 'readwrite');
      const store = transaction.objectStore(COMPONENTS_STORE);
      
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const component = getRequest.result;
        if (component) {
          component.usageCount = (component.usageCount || 0) + 1;
          component.updatedAt = new Date();
          
          const putRequest = store.put(component);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(); // 组件不存在，忽略
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * 清空所有数据（用于重置）
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TEMPLATES_STORE, COMPONENTS_STORE], 'readwrite');
      
      const templateStore = transaction.objectStore(TEMPLATES_STORE);
      const componentStore = transaction.objectStore(COMPONENTS_STORE);
      
      const clearTemplates = templateStore.clear();
      const clearComponents = componentStore.clear();
      
      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          console.log('所有数据已清空');
          resolve();
        }
      };

      clearTemplates.onsuccess = checkComplete;
      clearComponents.onsuccess = checkComplete;
      
      clearTemplates.onerror = () => reject(clearTemplates.error);
      clearComponents.onerror = () => reject(clearComponents.error);
    });
  }
}

// 创建单例实例
export const storageManager = new StorageManager();
