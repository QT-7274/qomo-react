// Core types for the AI Template System

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
  showTips: boolean;
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: QuestionMetadata;
}

export type QuestionType = 
  | 'general' 
  | 'technical' 
  | 'creative' 
  | 'analytical' 
  | 'research' 
  | 'brainstorm';

export interface QuestionMetadata {
  complexity: 'simple' | 'medium' | 'complex';
  expectedLength: 'short' | 'medium' | 'long';
  domain?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  components: TemplateComponent[];
  rating: number;
  usageCount: number;
  isPublic: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  version: string;
}

export type TemplateCategory = 
  | 'productivity' 
  | 'creative' 
  | 'technical' 
  | 'research' 
  | 'education' 
  | 'business';

export interface TemplateComponent {
  id: string;
  type: ComponentType;
  content: string;
  position: number;
  isRequired: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
}

export type ComponentType = 
  | 'prefix' 
  | 'question_slot' 
  | 'suffix' 
  | 'context' 
  | 'constraint' 
  | 'example';

export interface ValidationRule {
  type: 'minLength' | 'maxLength' | 'pattern' | 'required';
  value: string | number;
  message: string;
}



export interface Session {
  id: string;
  templateId: string;
  questions: Question[];
  responses: AIResponse[];
  createdAt: Date;
  status: 'active' | 'completed' | 'archived';
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  totalTokens: number;
  averageResponseTime: number;
  satisfactionRating?: number;
  notes?: string;
}

export interface AIResponse {
  id: string;
  questionId: string;
  content: string;
  timestamp: Date;
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  model: string;
  tokens: number;
  responseTime: number;
  confidence?: number;
  qualityScore?: number;
}

export interface DragItem {
  id: string;
  type: 'question' | 'component';
  content: string;
  index: number;
}

export interface DropResult {
  dragIndex: number;
  hoverIndex: number;
  targetType: 'template' | 'question_list';
}

// UI State types
export interface UIState {
  activeTab: 'editor' | 'library' | 'sessions';
  sidebarOpen: boolean;
  modalOpen: boolean;
  loading: boolean;
  notifications: Notification[];
}

// Editor State types
export interface EditorState {
  currentTemplate: Partial<Template> | null;
  formData: {
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    isPublic: boolean;
  };
  components: TemplateComponent[];
  showPreview: boolean;
  newTag: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Store types
export interface AppStore {
  user: User | null;
  templates: Template[];
  questions: Question[];
  sessions: Session[];
  ui: UIState;
  editor: EditorState;
  
  // Actions
  setUser: (user: User) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  unlockTalent: (talentId: string) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;

  // Editor actions
  updateEditorFormData: (updates: Partial<EditorState['formData']>) => void;
  updateEditorComponents: (components: TemplateComponent[]) => void;
  setShowPreview: (show: boolean) => void;
  setNewTag: (tag: string) => void;
  resetEditor: () => void;
}

// API types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
