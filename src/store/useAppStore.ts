// 导入需要的库和类型
import { create } from 'zustand'; // Zustand 是一种状态管理库
import { AppStore, User, Template, Question, Notification, UIState, EditorState, StoredComponent } from '@/types'; // 导入应用程序的类型定义
import { mockQuestions } from '@/data/mockData'; // 导入模拟问题数据
import { generateId } from '@/utils'; // 导入生成唯一 ID 的工具函数
import { COMPONENT_TYPES, TEMPLATE_CATEGORIES, DEFAULT_TEMPLATE_CONFIG } from '@/config/appConfig'; // 导入组件类型和模板类别的配置
import { storageManager } from '@/utils/storage'; // 导入用于管理存储的工具

// 初始 UI 状态设定
const initialUIState: UIState = {
  activeTab: 'editor', // 默认活动标签为 'editor'
  sidebarOpen: true, // 默认侧边栏打开
  modalOpen: false, // 默认模态框关闭
  loading: false, // 默认不处于加载状态
  notifications: [], // 默认没有通知
};

// 从配置文件生成初始组件
const generateInitialComponents = () => {
  return DEFAULT_TEMPLATE_CONFIG.defaultComponentTypes.map((type, index) => {
    const config = COMPONENT_TYPES.find(c => c.type === type); // 查找组件配置
    return {
      id: generateId(), // 生成唯一 ID
      type: type as any, // 组件类型
      content: config?.defaultContent || '', // 组件内容
      position: index, // 组件在数组中的位置
      isRequired: DEFAULT_TEMPLATE_CONFIG.requiredComponentTypes.includes(type), // 是否为必需组件
      placeholder: config?.placeholder, // 组件的占位符
      isDefault: true, // 标记为默认组件
    };
  });
};

// 初始编辑器状态设定
const initialEditorState: EditorState = {
  currentTemplate: null, // 当前模板为空
  formData: {
    name: '', // 模板名称
    description: '', // 模板描述
    category: TEMPLATE_CATEGORIES[0]?.key as any || DEFAULT_TEMPLATE_CONFIG.defaultCategory, // 模板类别
    tags: [], // 模板标签
    isPublic: DEFAULT_TEMPLATE_CONFIG.defaultIsPublic, // 默认是否公开
  },
  components: generateInitialComponents(), // 生成初始组件
  showPreview: true, // 默认显示预览
  newTag: '', // 新标签为空
};

// 创建 Zustand 状态管理的应用商店
export const useAppStore = create<AppStore>((set, get) => ({
  user: {
    id: '1', // 用户 ID
    name: 'AI Template Creator', // 用户名
    email: 'creator@example.com', // 用户邮箱
    preferences: {
      theme: 'auto', // 用户主题偏好
      language: 'zh-CN', // 默认语言
      autoSave: true, // 是否自动保存
      showTips: true, // 是否显示提示
    },
  },
  templates: [], // 存储模板的数组
  questions: mockQuestions, // 存储问题的数组
  sessions: [], // 存储会话的数组
  ui: initialUIState, // 存储 UI 状态
  editor: initialEditorState, // 存储编辑器状态
  storedComponents: [], // 存储组件的数组

  // 用户操作
  setUser: (user: User) => set({ user }), // 设置用户信息

  // 问题操作
  addQuestion: (question: Question) => // 添加问题
    set((state) => ({
      questions: [...state.questions, question], // 将新问题添加到问题数组
    })),

  updateQuestion: (id: string, updates: Partial<Question>) => // 更新问题
    set((state) => ({
      questions: state.questions.map((question) => // 使用 ID 查找问题并更新
        question.id === id ? { ...question, ...updates } : question
      ),
    })),

  deleteQuestion: (id: string) => // 删除问题
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== id), // 过滤掉被删除的问题
    })),

  // 模板操作
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: generateId(), // 生成唯一 ID
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
    };
    set((state) => ({
      templates: [...state.templates, newTemplate], // 将新模板添加到模板数组
    }));

    // 异步保存到 IndexedDB
    storageManager.saveTemplate(newTemplate).catch(console.error);

    // 同时保存模板中的组件到组件库
    newTemplate.components.forEach(async (component) => {
      const storedComponent: StoredComponent = {
        id: generateId(), // 生成唯一 ID
        name: `${newTemplate.name} - ${component.type}`, // 组件名称
        description: `来自模板"${newTemplate.name}"的${component.type}组件`, // 组件描述
        category: newTemplate.category, // 组件类别
        type: component.type, // 组件类型
        content: component.content, // 组件内容
        isRequired: component.isRequired, // 是否为必需组件
        placeholder: component.placeholder, // 组件占位符
        validation: component.validation, // 组件验证规则
        usageCount: 0, // 使用次数
        createdAt: new Date(), // 创建时间
        updatedAt: new Date(), // 更新时间
        tags: newTemplate.tags, // 模板标签
      };
      try {
        await storageManager.saveComponent(storedComponent); // 保存组件
        // 更新本地状态
        set((state) => ({
          storedComponents: [...state.storedComponents, storedComponent], // 将新组件添加到存储组件数组
        }));
      } catch (error) {
        console.error('保存组件失败:', error); // 处理保存失败的错误
      }
    });
  },

  // 更新模板
  updateTemplate: (id: string, updates: Partial<Template>) => {
    const updatedTemplate = { ...updates, updatedAt: new Date() };
    set((state) => ({
      templates: state.templates.map((template) => // 查找模板并更新
        template.id === id
          ? { ...template, ...updatedTemplate } // 更新模板并更新时间
          : template
      ),
    }));

    // 异步保存到 IndexedDB
    const state = get();
    const template = state.templates.find(t => t.id === id);
    if (template) {
      storageManager.saveTemplate(template).catch(console.error);
    }
  },

  deleteTemplate: async (id: string) => { // 删除模板
    // 从内存状态中删除
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id), // 过滤掉被删除的模板
    }));

    // 从 IndexedDB 中删除
    try {
      await storageManager.deleteTemplate(id); // 删除模板
      console.log('模板已从数据库中删除:', id);
    } catch (error) {
      console.error('从数据库删除模板失败:', error); // 处理删除失败的错误
    }
  },

  // 将当前编辑器状态保存为模板
  saveEditorAsTemplate: () => {
    const state = get();
    const { editor } = state;

    if (!editor.formData.name.trim()) { // 检查模板名称是否为空
      state.showNotification({
        type: 'error',
        title: '保存失败',
        message: '请输入模板名称', // 提示用户输入模板名称
        duration: 3000,
      });
      return;
    }

    const newTemplate: Template = {
      id: generateId(), // 生成唯一 ID
      name: editor.formData.name, // 模板名称
      description: editor.formData.description, // 模板描述
      category: editor.formData.category, // 模板类别
      components: editor.components, // 模板组件
      rating: 0, // 初始评分
      usageCount: 0, // 使用次数
      isPublic: editor.formData.isPublic, // 是否公开
      authorId: state.user?.id || 'anonymous', // 作者 ID
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
      tags: editor.formData.tags, // 模板标签
      version: '1.0.0', // 模板版本
    };

    set((state) => ({
      templates: [...state.templates, newTemplate], // 将新模板添加到模板数组
    }));

    state.showNotification({
      type: 'success', // 显示成功通知
      title: '模板已保存',
      message: `模板 "${newTemplate.name}" 已保存到模板库`,
      duration: 3000,
    });
  },

  // UI 操作
  setActiveTab: (tab: UIState['activeTab']) => // 设置活动标签
    set((state) => ({
      ui: { ...state.ui, activeTab: tab }, // 更新活动标签
    })),

  showNotification: (notification: Omit<Notification, 'id'>) => // 显示通知
    set((state) => ({
      ui: {
        ...state.ui,
        notifications: [
          ...state.ui.notifications,
          { ...notification, id: Date.now().toString() }, // 添加唯一通知 ID
        ],
      },
    })),

  dismissNotification: (id: string) => // 关闭通知
    set((state) => ({
      ui: {
        ...state.ui,
        notifications: state.ui.notifications.filter((n) => n.id !== id), // 过滤掉被关闭的通知
      },
    })),

  // 编辑器操作
  updateEditorFormData: (updates) => // 更新编辑器表单数据
    set((state) => ({
      editor: {
        ...state.editor,
        formData: { ...state.editor.formData, ...updates }, // 更新表单数据
      },
    })),

  updateEditorComponents: (components) => // 更新编辑器组件
    set((state) => ({
      editor: { ...state.editor, components }, // 更新组件数组
    })),

  setShowPreview: (show) => // 设置是否显示预览
    set((state) => ({
      editor: { ...state.editor, showPreview: show }, // 更新预览状态
    })),

  setNewTag: (tag) => // 设置新标签
    set((state) => ({
      editor: { ...state.editor, newTag: tag }, // 更新新标签
    })),

  // 设置当前编辑的模板
  setCurrentTemplate: (template: Template | null) =>
    set((state) => ({
      editor: { ...state.editor, currentTemplate: template },
    })),

  resetEditor: () => // 重置编辑器状态
    set(() => ({
      editor: initialEditorState, // 重置为初始状态
    })),

  // 存储操作
  initStorage: async () => { // 初始化存储
    try {
      await storageManager.init(); // 初始化存储管理
      console.log('存储初始化成功');
    } catch (error) {
      console.error('存储初始化失败:', error); // 处理初始化失败的错误
    }
  },

  loadTemplatesFromStorage: async () => { // 从存储加载模板
    try {
      const templates = await storageManager.getAllTemplates(); // 获取所有模板
      set({ templates }); // 更新状态
      console.log('模板加载成功:', templates.length);
    } catch (error) {
      console.error('模板加载失败:', error); // 处理加载失败的错误
    }
  },

  loadComponentsFromStorage: async () => { // 从存储加载组件
    try {
      const storedComponents = await storageManager.getAllComponents(); // 获取所有组件
      set({ storedComponents }); // 更新状态
      console.log('组件加载成功:', storedComponents.length);
    } catch (error) {
      console.error('组件加载失败:', error); // 处理加载失败的错误
    }
  },

  saveComponentToStorage: async (component: StoredComponent) => { // 保存组件到存储
    try {
      await storageManager.saveComponent(component); // 保存组件
      set((state) => ({
        storedComponents: [...state.storedComponents, component], // 更新状态
      }));
      console.log('组件保存成功:', component.name);
    } catch (error) {
      console.error('组件保存失败:', error); // 处理保存失败的错误
    }
  },

  deleteComponentFromStorage: async (id: string) => { // 从存储删除组件
    try {
      await storageManager.deleteComponent(id); // 删除组件
      set((state) => ({
        storedComponents: state.storedComponents.filter(c => c.id !== id), // 更新状态
      }));
      console.log('组件删除成功:', id);
    } catch (error) {
      console.error('组件删除失败:', error); // 处理删除失败的错误
    }
  },
}));
