import { create } from 'zustand';
import { AppStore, User, Template, Question, Session, Notification, UIState, EditorState } from '../types';
import { mockTemplates, mockQuestions } from '../data/mockData';
import { generateId } from '../utils';

const initialUIState: UIState = {
  activeTab: 'editor',
  sidebarOpen: true,
  modalOpen: false,
  loading: false,
  notifications: [],
};

const initialEditorState: EditorState = {
  currentTemplate: null,
  formData: {
    name: '',
    description: '',
    category: 'productivity',
    tags: [],
    isPublic: true,
  },
  components: [
    {
      id: generateId(),
      type: 'prefix',
      content: '请以专业、准确的方式回答以下问题：',
      position: 0,
      isRequired: true,
    },
    {
      id: generateId(),
      type: 'question_slot',
      content: '[用户问题将插入此处]',
      position: 1,
      isRequired: true,
      placeholder: '在此输入您的问题...',
    },
    {
      id: generateId(),
      type: 'suffix',
      content: '请提供详细的解释和实用的建议。',
      position: 2,
      isRequired: false,
    },
  ],
  showPreview: false,
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
      templates: mockTemplates,
      questions: mockQuestions,
      sessions: [],
      ui: initialUIState,
      editor: initialEditorState,

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
      },

      updateTemplate: (id: string, updates: Partial<Template>) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date() }
              : template
          ),
        })),

      deleteTemplate: (id: string) =>
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        })),

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
          authorId: state.user.id,
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
        set((state) => ({
          editor: initialEditorState,
        })),
    }));
