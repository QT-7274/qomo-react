import { create } from 'zustand';
import { AppStore, User, Template, Question, Notification, UIState, EditorState, StoredComponent } from '../types';
import { mockQuestions } from '../data/mockData';
import { generateId } from '../utils';
import { COMPONENT_TYPES, TEMPLATE_CATEGORIES, DEFAULT_TEMPLATE_CONFIG } from '../config/appConfig';
import { storageManager } from '../utils/storage';

const initialUIState: UIState = {
  activeTab: 'editor',
  sidebarOpen: true,
  modalOpen: false,
  loading: false,
  notifications: [],
};

// 从配置文件生成初始组件
const generateInitialComponents = () => {
  return DEFAULT_TEMPLATE_CONFIG.defaultComponentTypes.map((type, index) => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    return {
      id: generateId(),
      type: type as any,
      content: config?.defaultContent || '',
      position: index,
      isRequired: DEFAULT_TEMPLATE_CONFIG.requiredComponentTypes.includes(type),
      placeholder: config?.placeholder,
      isDefault: true, // 标记为默认组件
    };
  });
};

const initialEditorState: EditorState = {
  currentTemplate: null,
  formData: {
    name: '',
    description: '',
    category: TEMPLATE_CATEGORIES[0]?.key as any || DEFAULT_TEMPLATE_CONFIG.defaultCategory,
    tags: [],
    isPublic: DEFAULT_TEMPLATE_CONFIG.defaultIsPublic,
  },
  components: generateInitialComponents(),
  showPreview: true,
  newTag: '',
};

export const useAppStore = create<AppStore>((set, get) => ({
      user: {
        id: '1',
        name: 'AI Template Creator',
        email: 'creator@example.com',
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          autoSave: true,
          showTips: true,
        },
      },
      templates: [],
      questions: mockQuestions,
      sessions: [],
      ui: initialUIState,
      editor: initialEditorState,
      storedComponents: [],

      // User actions
      setUser: (user: User) => set({ user }),



      // Question actions
      addQuestion: (question: Question) =>
        set((state) => ({
          questions: [...state.questions, question],
        })),

      updateQuestion: (id: string, updates: Partial<Question>) =>
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === id ? { ...question, ...updates } : question
          ),
        })),

      deleteQuestion: (id: string) =>
        set((state) => ({
          questions: state.questions.filter((question) => question.id !== id),
        })),

      // Template actions
      addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTemplate: Template = {
          ...template,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));

        // 异步保存到IndexedDB
        storageManager.saveTemplate(newTemplate).catch(console.error);

        // 同时保存模板中的组件到组件库
        newTemplate.components.forEach(async (component) => {
          const storedComponent: StoredComponent = {
            id: generateId(),
            name: `${newTemplate.name} - ${component.type}`,
            description: `来自模板"${newTemplate.name}"的${component.type}组件`,
            category: newTemplate.category,
            type: component.type,
            content: component.content,
            isRequired: component.isRequired,
            placeholder: component.placeholder,
            validation: component.validation,
            usageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: newTemplate.tags,
          };
          try {
            await storageManager.saveComponent(storedComponent);
            // 更新本地状态
            set((state) => ({
              storedComponents: [...state.storedComponents, storedComponent],
            }));
          } catch (error) {
            console.error('保存组件失败:', error);
          }
        });
      },

      updateTemplate: (id: string, updates: Partial<Template>) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date() }
              : template
          ),
        })),

      deleteTemplate: async (id: string) => {
        // 从内存状态中删除
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));

        // 从IndexedDB中删除
        try {
          await storageManager.deleteTemplate(id);
          console.log('模板已从数据库中删除:', id);
        } catch (error) {
          console.error('从数据库删除模板失败:', error);
        }
      },

      // Save current editor state as template
      saveEditorAsTemplate: () => {
        const state = get();
        const { editor } = state;

        if (!editor.formData.name.trim()) {
          state.showNotification({
            type: 'error',
            title: '保存失败',
            message: '请输入模板名称',
            duration: 3000,
          });
          return;
        }

        const newTemplate: Template = {
          id: generateId(),
          name: editor.formData.name,
          description: editor.formData.description,
          category: editor.formData.category,
          components: editor.components,
          rating: 0,
          usageCount: 0,
          isPublic: editor.formData.isPublic,
          authorId: state.user?.id || 'anonymous',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: editor.formData.tags,
          version: '1.0.0',
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));

        state.showNotification({
          type: 'success',
          title: '模板已保存',
          message: `模板 "${newTemplate.name}" 已保存到模板库`,
          duration: 3000,
        });
      },

      // UI actions
      setActiveTab: (tab: UIState['activeTab']) =>
        set((state) => ({
          ui: { ...state.ui, activeTab: tab },
        })),

      showNotification: (notification: Omit<Notification, 'id'>) =>
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: [
              ...state.ui.notifications,
              { ...notification, id: Date.now().toString() },
            ],
          },
        })),

      dismissNotification: (id: string) =>
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter((n) => n.id !== id),
          },
        })),

      // Editor actions
      updateEditorFormData: (updates) =>
        set((state) => ({
          editor: {
            ...state.editor,
            formData: { ...state.editor.formData, ...updates },
          },
        })),

      updateEditorComponents: (components) =>
        set((state) => ({
          editor: { ...state.editor, components },
        })),

      setShowPreview: (show) =>
        set((state) => ({
          editor: { ...state.editor, showPreview: show },
        })),

      setNewTag: (tag) =>
        set((state) => ({
          editor: { ...state.editor, newTag: tag },
        })),

      resetEditor: () =>
        set(() => ({
          editor: initialEditorState,
        })),

      // Storage actions
      initStorage: async () => {
        try {
          await storageManager.init();
          console.log('存储初始化成功');
        } catch (error) {
          console.error('存储初始化失败:', error);
        }
      },

      loadTemplatesFromStorage: async () => {
        try {
          const templates = await storageManager.getAllTemplates();
          set({ templates });
          console.log('模板加载成功:', templates.length);
        } catch (error) {
          console.error('模板加载失败:', error);
        }
      },

      loadComponentsFromStorage: async () => {
        try {
          const storedComponents = await storageManager.getAllComponents();
          set({ storedComponents });
          console.log('组件加载成功:', storedComponents.length);
        } catch (error) {
          console.error('组件加载失败:', error);
        }
      },

      saveComponentToStorage: async (component: StoredComponent) => {
        try {
          await storageManager.saveComponent(component);
          set((state) => ({
            storedComponents: [...state.storedComponents, component],
          }));
          console.log('组件保存成功:', component.name);
        } catch (error) {
          console.error('组件保存失败:', error);
        }
      },

      deleteComponentFromStorage: async (id: string) => {
        try {
          await storageManager.deleteComponent(id);
          set((state) => ({
            storedComponents: state.storedComponents.filter(c => c.id !== id),
          }));
          console.log('组件删除成功:', id);
        } catch (error) {
          console.error('组件删除失败:', error);
        }
      },

      unlockTalent: (talentId: string) => {
        console.log('解锁天赋:', talentId);
        // 这里可以添加天赋解锁逻辑
      },
    }));
