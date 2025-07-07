/**
 * 应用程序配置文件 v2.0
 * 重构后的配置，使用常量和主题系统
 * 这是推荐的配置架构，展示了如何解耦和模块化配置
 */

import {
  COMPONENT_TYPES as COMPONENT_TYPE_CONSTANTS,
  TEMPLATE_CATEGORIES as TEMPLATE_CATEGORY_CONSTANTS,
  ICON_NAMES,
  COLOR_THEMES,
  DEFAULTS,
  EDITOR_MODES,
  NOTIFICATION_TYPES,
  TEST_IDS,
} from './constants';

import {
  COMPONENT_TYPE_LABELS,
  CATEGORY_LABELS,
  PLACEHOLDERS,
  TIPS,
  BUTTON_TEXTS,
  TITLES,
  NOTIFICATIONS,
} from './text';

import { COMPONENT_COLORS, BUTTON_VARIANTS, ANIMATIONS } from './theme';

// ==================== 类型定义 ====================
export interface ComponentTypeConfig {
  type: string;
  label: string;
  icon: string;
  defaultContent: string;
  placeholder: string;
  advice: string;
  tips: string;
  color: string;
}

export interface CategoryConfig {
  key: string;
  label: string;
  color: string;
  description: string;
}

export interface UITextConfig {
  buttons: Record<string, string>;
  labels: Record<string, string>;
  titles: Record<string, string>;
  placeholders: Record<string, string>;
}

// ==================== 组件类型配置 ====================
export const COMPONENT_TYPES: ComponentTypeConfig[] = [
  {
    type: COMPONENT_TYPE_CONSTANTS.PREFIX,
    label: COMPONENT_TYPE_LABELS.prefix,
    icon: ICON_NAMES.FILE_TEXT,
    defaultContent: '在解析问题内容之前，你需要扮演以下角色：',
    placeholder: PLACEHOLDERS.COMPONENT_CONTENT,
    advice: '你是一位RESTful API设计专家。',
    tips: '定义AI在对话中的角色身份，让回答更专业和聚焦',
    color: COLOR_THEMES.PRIMARY,
  },
  {
    type: COMPONENT_TYPE_CONSTANTS.CONTEXT,
    label: COMPONENT_TYPE_LABELS.context,
    icon: ICON_NAMES.BOOK_OPEN,
    defaultContent: '该问题背景信息如下：',
    placeholder: PLACEHOLDERS.COMPONENT_CONTENT,
    advice: '我需要为电商平台设计订单相关的API。',
    tips: '提供背景信息，帮助AI理解问题的语境',
    color: COLOR_THEMES.INFO,
  },
  {
    type: COMPONENT_TYPE_CONSTANTS.QUESTION_SLOT,
    label: COMPONENT_TYPE_LABELS.question_slot,
    icon: ICON_NAMES.MESSAGE_SQUARE,
    defaultContent: '[用户问题]',
    placeholder: '用户的问题将在这里插入',
    advice: '这里会自动插入用户输入的具体问题',
    tips: TIPS.QUESTION_SLOT,
    color: COLOR_THEMES.WARNING,
  },
  {
    type: COMPONENT_TYPE_CONSTANTS.CONSTRAINT,
    label: COMPONENT_TYPE_LABELS.constraint,
    icon: ICON_NAMES.TARGET,
    defaultContent: '请按照以下要求回答：',
    placeholder: PLACEHOLDERS.COMPONENT_CONTENT,
    advice: '1. 使用JSON格式输出\n2. 包含详细的字段说明\n3. 提供示例代码',
    tips: '设置输出格式、长度限制、风格要求等约束条件',
    color: COLOR_THEMES.DANGER,
  },
  {
    type: COMPONENT_TYPE_CONSTANTS.EXAMPLE,
    label: COMPONENT_TYPE_LABELS.example,
    icon: ICON_NAMES.LIGHTBULB,
    defaultContent: '参考示例：',
    placeholder: PLACEHOLDERS.COMPONENT_CONTENT,
    advice: '例如：GET /api/orders/{id} 用于获取订单详情',
    tips: '提供具体的示例来帮助AI理解期望的输出格式',
    color: COLOR_THEMES.SUCCESS,
  },
  {
    type: COMPONENT_TYPE_CONSTANTS.SUFFIX,
    label: COMPONENT_TYPE_LABELS.suffix,
    icon: ICON_NAMES.FILE_TEXT,
    defaultContent: '请确保回答准确、完整且易于理解。',
    placeholder: PLACEHOLDERS.COMPONENT_CONTENT,
    advice: '如有疑问，请说明需要更多信息的具体方面。',
    tips: '用于设置提示词的结尾，比如输出格式说明、注意事项等',
    color: COLOR_THEMES.SECONDARY,
  },
];

// ==================== 模板类别配置 ====================
export const TEMPLATE_CATEGORIES: CategoryConfig[] = [
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.PRODUCTIVITY,
    label: CATEGORY_LABELS.productivity,
    color: COLOR_THEMES.PRIMARY,
    description: '提高工作效率的模板',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.CREATIVE,
    label: CATEGORY_LABELS.creative,
    color: COLOR_THEMES.SUCCESS,
    description: '创意写作和内容创作',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.ANALYSIS,
    label: CATEGORY_LABELS.analysis,
    color: COLOR_THEMES.INFO,
    description: '数据分析和总结',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.EDUCATION,
    label: CATEGORY_LABELS.education,
    color: COLOR_THEMES.WARNING,
    description: '教育和学习相关',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.BUSINESS,
    label: CATEGORY_LABELS.business,
    color: COLOR_THEMES.DANGER,
    description: '商务和办公场景',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.TECHNICAL,
    label: CATEGORY_LABELS.technical,
    color: COLOR_THEMES.SECONDARY,
    description: '技术开发和编程',
  },
  {
    key: TEMPLATE_CATEGORY_CONSTANTS.PERSONAL,
    label: CATEGORY_LABELS.personal,
    color: COLOR_THEMES.PRIMARY,
    description: '个人助手和生活',
  },
];

// ==================== UI 文本配置 ====================
export const UI_TEXT: UITextConfig = {
  buttons: {
    save: BUTTON_TEXTS.SAVE,
    cancel: BUTTON_TEXTS.CANCEL,
    delete: BUTTON_TEXTS.DELETE,
    edit: BUTTON_TEXTS.EDIT,
    create: BUTTON_TEXTS.CREATE,
    reset: BUTTON_TEXTS.RESET,
    copy: BUTTON_TEXTS.COPY,
    copied: BUTTON_TEXTS.COPIED,
    preview: BUTTON_TEXTS.PREVIEW,
    hidePreview: BUTTON_TEXTS.HIDE_PREVIEW,
  },
  labels: {
    templateName: PLACEHOLDERS.TEMPLATE_NAME,
    templateDescription: PLACEHOLDERS.TEMPLATE_DESCRIPTION,
    templateCategory: PLACEHOLDERS.SEARCH_TEMPLATES,
    templateTags: PLACEHOLDERS.ADD_TAG,
  },
  titles: {
    basicInfo: TITLES.BASIC_INFO,
    templateComponents: TITLES.TEMPLATE_COMPONENTS,
    questionInput: TITLES.QUESTION_INPUT,
    generatedPrompt: TITLES.GENERATED_PROMPT,
  },
  placeholders: {
    templateName: PLACEHOLDERS.TEMPLATE_NAME,
    templateDescription: PLACEHOLDERS.TEMPLATE_DESCRIPTION,
    searchTemplates: PLACEHOLDERS.SEARCH_TEMPLATES,
    questionInput: PLACEHOLDERS.QUESTION_INPUT,
  },
};

// ==================== 组件按钮颜色配置 ====================
export const COMPONENT_BUTTON_COLORS = {
  [COMPONENT_TYPE_CONSTANTS.PREFIX]: COMPONENT_COLORS[COLOR_THEMES.PRIMARY],
  [COMPONENT_TYPE_CONSTANTS.CONTEXT]: COMPONENT_COLORS[COLOR_THEMES.INFO],
  [COMPONENT_TYPE_CONSTANTS.QUESTION_SLOT]: COMPONENT_COLORS[COLOR_THEMES.WARNING],
  [COMPONENT_TYPE_CONSTANTS.CONSTRAINT]: COMPONENT_COLORS[COLOR_THEMES.DANGER],
  [COMPONENT_TYPE_CONSTANTS.EXAMPLE]: COMPONENT_COLORS[COLOR_THEMES.SUCCESS],
  [COMPONENT_TYPE_CONSTANTS.SUFFIX]: COMPONENT_COLORS[COLOR_THEMES.SECONDARY],
};

// ==================== 常用标签配置 ====================
export const COMMON_TAGS = [
  '写作助手', '代码生成', '数据分析', '翻译', '总结',
  '创意', '教育', '商务', '技术', '个人助手',
  'API设计', '文档编写', '邮件模板', '报告生成',
];

// ==================== 动画配置 ====================
export const ANIMATION_CONFIG = {
  duration: ANIMATIONS.duration.normal,
  easing: ANIMATIONS.easing.easeInOut,
  scrollBehavior: { behavior: 'smooth' as const, block: 'center' as const },
};

// ==================== 默认模板配置 ====================
export const DEFAULT_TEMPLATE_CONFIG = {
  defaultCategory: TEMPLATE_CATEGORY_CONSTANTS.PRODUCTIVITY,
  defaultIsPublic: false,
  defaultComponentTypes: [
    COMPONENT_TYPE_CONSTANTS.PREFIX,
    COMPONENT_TYPE_CONSTANTS.QUESTION_SLOT,
    COMPONENT_TYPE_CONSTANTS.CONSTRAINT,
  ],
  requiredComponentTypes: [COMPONENT_TYPE_CONSTANTS.QUESTION_SLOT],
};

// ==================== 应用元数据 ====================
export const APP_METADATA = {
  name: 'Qomo',
  description: 'AI模板系统',
  version: '2.0.0',
  author: 'Qomo Team',
};

// ==================== 导出类型 ====================
export type ComponentType = typeof COMPONENT_TYPE_CONSTANTS[keyof typeof COMPONENT_TYPE_CONSTANTS];
export type TemplateCategory = typeof TEMPLATE_CATEGORY_CONSTANTS[keyof typeof TEMPLATE_CATEGORY_CONSTANTS];
export type EditorMode = typeof EDITOR_MODES[keyof typeof EDITOR_MODES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
