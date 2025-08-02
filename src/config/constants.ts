/**
 * 应用程序常量定义
 * 这个文件包含所有硬编码的字符串常量，便于统一管理和维护
 */

// ==================== 组件类型常量 ====================
export const COMPONENT_TYPES = {
  PREFIX: 'prefix',
  CONTEXT: 'context', 
  CONSTRAINT: 'constraint',
  EXAMPLE: 'example',
  QUESTION_SLOT: 'question_slot',
  SUFFIX: 'suffix',
} as const;

// ==================== 模板类别常量 ====================
export const TEMPLATE_CATEGORIES = {
  PRODUCTIVITY: 'productivity',
  CREATIVE: 'creative',
  ANALYSIS: 'analysis',
  EDUCATION: 'education',
  BUSINESS: 'business',
  TECHNICAL: 'technical',
  PERSONAL: 'personal',
} as const;

// ==================== UI 变体常量 ====================
export const UI_VARIANTS = {
  BUTTON: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary', 
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    OUTLINE: 'outline',
    DEFAULT: 'default',
    GHOST: 'ghost',
  },
  CARD: {
    DEFAULT: 'default',
    ELEVATED: 'elevated',
    OUTLINED: 'outlined',
  },
  SIZE: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
} as const;

// ==================== 颜色主题常量 ====================
export const COLOR_THEMES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success', 
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
} as const;

// ==================== 图标名称常量 ====================
export const ICON_NAMES = {
  FILE_TEXT: 'FileText',
  BOOK_OPEN: 'BookOpen',
  MESSAGE_SQUARE: 'MessageSquare',
  TARGET: 'Target',
  LIGHTBULB: 'Lightbulb',
  WAND2: 'Wand2',
  SAVE: 'Save',
  EYE: 'Eye',
  SETTINGS: 'Settings',
  PLAY: 'Play',
  COPY: 'Copy',
  CHECK: 'Check',
  ROTATE_CCW: 'RotateCcw',
  PLUS: 'Plus',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT_ASC: 'SortAsc',
} as const;

// ==================== 路由路径常量 ====================
export const ROUTES = {
  HOME: '/',
  EDITOR: '/editor',
  LIBRARY: '/library',
  COMPONENTS: '/components',
  I18N_DEMO: '/i18n-demo', // 国际化演示页面
} as const;

// ==================== 导航图标常量 ====================
export const NAV_ICONS = {
  EDITOR: 'Wand2',
  LIBRARY: 'BookOpen',
  COMPONENTS: 'Package',
  SPARKLES: 'Sparkles',
} as const;

// ==================== 查询参数常量 ====================
export const QUERY_PARAMS = {
  MODE: 'mode',
} as const;

// ==================== 模式常量 ====================
export const EDITOR_MODES = {
  CREATE: 'create',
  USE: 'use',
} as const;

// ==================== 通知类型常量 ====================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// ==================== 任务状态常量 ====================
export const TASK_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS', 
  CANCELLED: 'CANCELLED',
  COMPLETE: 'COMPLETE',
} as const;

// ==================== 存储键名常量 ====================
export const STORAGE_KEYS = {
  TEMPLATES: 'templates',
  COMPONENTS: 'components',
  USER_PREFERENCES: 'userPreferences',
} as const;

// ==================== 默认值常量 ====================
export const DEFAULTS = {
  TEMPLATE_NAME: '未命名模板',
  TEMPLATE_VERSION: '1.0.0',
  USER_ID: 'current-user',
  AUTHOR_ID: 'anonymous',
  NOTIFICATION_DURATION: 3000,
  SHORT_NOTIFICATION_DURATION: 2000,
  ANIMATION_DURATION: 200,
  SCROLL_DELAY: 100,
} as const;

// ==================== 限制常量 ====================
export const LIMITS = {
  MAX_TEMPLATE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_COMPONENT_CONTENT_LENGTH: 2000,
  MAX_TAGS_COUNT: 10,
  MIN_COMPONENTS_COUNT: 1,
  MAX_COMPONENTS_COUNT: 20,
} as const;

// ==================== CSS 类名常量 ====================
export const CSS_CLASSES = {
  CONTAINER: 'container',
  FLEX: 'flex',
  GRID: 'grid',
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

// ==================== 数据测试 ID 常量 ====================
export const TEST_IDS = {
  DROP_ZONE: 'drop-zone',
  TEMPLATE_CARD: 'template-card',
  COMPONENT_CARD: 'component-card',
  SAVE_BUTTON: 'save-button',
  RESET_BUTTON: 'reset-button',
} as const;

// ==================== 类型导出 ====================
export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[keyof typeof TEMPLATE_CATEGORIES];
export type UIVariant = typeof UI_VARIANTS.BUTTON[keyof typeof UI_VARIANTS.BUTTON];
export type ColorTheme = typeof COLOR_THEMES[keyof typeof COLOR_THEMES];
export type EditorMode = typeof EDITOR_MODES[keyof typeof EDITOR_MODES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
export type TaskState = typeof TASK_STATES[keyof typeof TASK_STATES];
