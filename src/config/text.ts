/**
 * 文本内容配置文件
 * 包含所有用户界面显示的文本内容，便于国际化和统一管理
 */

// ==================== 页面标题 ====================
export const PAGE_TITLES = {
  EDITOR: '模板工作台',
  LIBRARY: '模板库',
  COMPONENTS: '组件库', 
  SESSIONS: '会话记录',
  UNKNOWN: '未知页面',
} as const;

// ==================== 页面描述 ====================
export const PAGE_DESCRIPTIONS = {
  EDITOR: '创建和编辑AI提示模板',
  LIBRARY: '管理您的模板库',
  COMPONENTS: '管理您的组件库',
  SESSIONS: '查看历史会话记录',
} as const;

// ==================== 按钮文本 ====================
export const BUTTON_TEXTS = {
  SAVE: '保存',
  CANCEL: '取消',
  DELETE: '删除',
  EDIT: '编辑',
  CREATE: '创建',
  RESET: '重置',
  COPY: '复制',
  COPIED: '已复制',
  PREVIEW: '预览',
  HIDE_PREVIEW: '隐藏预览',
  NEW_TEMPLATE: '新建模板',
  CREATE_TEMPLATE: '创建模板',
  USE_TEMPLATE: '使用模板',
  CREATE_MODE: '创建模板',
  APPLY: '应用',
  CLOSE: '关闭',
  CONFIRM: '确认',
  SETTINGS: '设置',
} as const;

// ==================== 标签文本 ====================
export const LABELS = {
  TEMPLATE_NAME: '模板名称',
  TEMPLATE_DESCRIPTION: '模板描述',
  TEMPLATE_CATEGORY: '模板类别',
  TEMPLATE_TAGS: '模板标签',
  IS_PUBLIC: '公开模板',
  QUESTION_INPUT: '问题输入',
  COMPONENT_CONTENT: '组件内容',
  SEARCH: '搜索',
  FILTER: '筛选',
  SORT: '排序',
} as const;

// ==================== 占位符文本 ====================
export const PLACEHOLDERS = {
  TEMPLATE_NAME: '请输入模板名称...',
  TEMPLATE_DESCRIPTION: '请输入模板描述...',
  SEARCH_TEMPLATES: '搜索模板...',
  SEARCH_COMPONENTS: '搜索组件...',
  QUESTION_INPUT: '请输入您的问题...',
  COMPONENT_CONTENT: '请输入组件内容...',
  ADD_TAG: '添加标签...',
} as const;

// ==================== 标题文本 ====================
export const TITLES = {
  BASIC_INFO: '基本信息',
  TEMPLATE_COMPONENTS: '模板组件',
  QUESTION_INPUT: '问题输入',
  GENERATED_PROMPT: '生成的提示词',
  TEMPLATE_PREVIEW: '模板预览',
  QUICK_STATS: '快速统计',
  NAVIGATION: '导航',
} as const;

// ==================== 组件类型标签 ====================
export const COMPONENT_TYPE_LABELS = {
  prefix: '前缀',
  context: '上下文',
  constraint: '约束条件',
  example: '示例',
  question_slot: '问题插槽',
  suffix: '后缀',
} as const;

// ==================== 模板类别标签 ====================
export const CATEGORY_LABELS = {
  productivity: '效率工具',
  creative: '创意写作',
  analysis: '分析总结',
  education: '教育学习',
  business: '商务办公',
  technical: '技术开发',
  personal: '个人助手',
} as const;

// ==================== 通知消息 ====================
export const NOTIFICATIONS = {
  SUCCESS: {
    TEMPLATE_SAVED: '模板已保存',
    TEMPLATE_CREATED: '模板已创建',
    TEMPLATE_UPDATED: '模板已更新',
    TEMPLATE_DELETED: '模板已删除',
    TEMPLATE_LOADED: '模板已加载',
    TEMPLATE_APPLIED: '模板已应用',
    COPY_SUCCESS: '复制成功',
    COMPONENT_SAVED: '组件已保存',
    COMPONENT_DELETED: '组件已删除',
  },
  ERROR: {
    SAVE_FAILED: '保存失败',
    LOAD_FAILED: '加载失败',
    DELETE_FAILED: '删除失败',
    COPY_FAILED: '复制失败',
    NETWORK_ERROR: '网络错误',
    VALIDATION_ERROR: '验证失败',
    UNKNOWN_ERROR: '未知错误',
  },
  WARNING: {
    UNSAVED_CHANGES: '有未保存的更改',
    CONFIRM_DELETE: '确认删除',
    CONFIRM_RESET: '确认重置',
  },
  INFO: {
    LOADING: '加载中...',
    PROCESSING: '处理中...',
    NO_DATA: '暂无数据',
  },
} as const;

// ==================== 错误消息 ====================
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: '此字段为必填项',
  INVALID_FORMAT: '格式不正确',
  TOO_LONG: '内容过长',
  TOO_SHORT: '内容过短',
  DUPLICATE_NAME: '名称已存在',
  NETWORK_TIMEOUT: '网络超时',
  SERVER_ERROR: '服务器错误',
  PERMISSION_DENIED: '权限不足',
} as const;

// ==================== 确认对话框文本 ====================
export const CONFIRM_DIALOGS = {
  DELETE_TEMPLATE: {
    TITLE: '删除模板',
    MESSAGE: '确定要删除这个模板吗？此操作无法撤销。',
  },
  DELETE_COMPONENT: {
    TITLE: '删除组件',
    MESSAGE: '确定要删除这个组件吗？此操作无法撤销。',
  },
  RESET_EDITOR: {
    TITLE: '重置编辑器',
    MESSAGE: '确定要重置编辑器吗？所有未保存的更改将丢失。',
  },
  DISCARD_CHANGES: {
    TITLE: '放弃更改',
    MESSAGE: '确定要放弃当前的更改吗？',
  },
} as const;

// ==================== 空状态文本 ====================
export const EMPTY_STATES = {
  NO_TEMPLATES: '暂无模板',
  NO_COMPONENTS: '暂无组件',
  NO_SESSIONS: '暂无会话记录',
  NO_SEARCH_RESULTS: '未找到匹配的结果',
  START_CREATING: '开始创建您的第一个模板',
  TRY_DIFFERENT_SEARCH: '尝试调整搜索条件',
} as const;

// ==================== 提示文本 ====================
export const TIPS = {
  TEMPLATE_NAME: '给您的模板起一个有意义的名称',
  TEMPLATE_DESCRIPTION: '简要描述模板的用途和特点',
  COMPONENT_ORDER: '拖拽组件可以调整顺序',
  QUESTION_SLOT: '问题插槽用于插入用户的具体问题',
  PUBLIC_TEMPLATE: '公开模板将对所有用户可见',
  TAG_USAGE: '标签有助于分类和搜索模板',
} as const;

// ==================== 统计文本 ====================
export const STATS = {
  TEMPLATES_COUNT: '已创建模板',
  COMPONENTS_COUNT: '组件库',
  USAGE_COUNT: '使用次数',
  RATING: '评分',
  CREATED_AT: '创建时间',
  UPDATED_AT: '更新时间',
} as const;

// ==================== 导航文本 ====================
export const NAVIGATION = {
  TEMPLATE_WORKSPACE: '模板工作台',
  TEMPLATE_LIBRARY: '模板库',
  COMPONENT_LIBRARY: '组件库',
  SESSION_HISTORY: '会话记录',
  USER_SETTINGS: '用户设置',
  HELP: '帮助',
  ABOUT: '关于',
} as const;

// ==================== 应用信息 ====================
export const APP_INFO = {
  NAME: 'Qomo',
  DESCRIPTION: 'AI模板系统',
  VERSION: '2.0.0',
} as const;
