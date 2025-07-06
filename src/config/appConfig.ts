// 应用配置文件 - 集中管理所有可配置的文字和选项
// 使用说明：
// 1. 修改模板组件按钮：编辑 COMPONENT_TYPES 数组
// 2. 修改分类选项：编辑 TEMPLATE_CATEGORIES 数组
// 3. 修改UI文字：编辑 UI_TEXT 对象
// 4. 修改标签选项：编辑 COMMON_TAGS 数组
// 5. 修改动画配置：编辑 ANIMATION_CONFIG 对象

export interface ComponentTypeConfig {
  type: string;
  label: string;
  icon: string;
  defaultContent: string;
  placeholder?: string;
  advice?: string;
  tips?: string;
}

export interface CategoryConfig {
  key: string;
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default';
}

export interface ComponentDisplayConfig {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default';
}

// 模板组件类型配置
export const COMPONENT_TYPES: ComponentTypeConfig[] = [
  {
    type: 'prefix',
    label: '角色设定',
    icon: 'FileText',
    defaultContent: '在解析问题内容之前，你需要扮演以下角色：',
    advice: '你是一位RESTful API设计专家。',
    tips: '定义AI在对话中的角色身份，让回答更专业和聚焦',
  },
  {
    type: 'context',
    label: '上下文',
    icon: 'BookOpen',
    defaultContent: '该问题背景信息如下：',
    advice: '我需要为电商平台设计订单相关的API。',
    tips: '提供背景信息，帮助AI理解问题的语境',
  },
  {
    type: 'question_slot',
    label: '具体问题',
    icon: 'MessageSquare',
    defaultContent: '我的问题是：',
    advice: '如何设计订单查询和状态更新的API？',
    tips: '描述你希望AI解决的具体问题',
  },
  {
    type: 'constraint',
    label: '约束条件',
    icon: 'Target',
    defaultContent: '该问题的约束条件如下：',
    advice: '你生成的内容必须符合RESTful规范。',
    tips: '提供约束条件，帮助AI生成更精确的回答',
  },
  {
    type: 'example',
    label: '示例',
    icon: 'Lightbulb',
    defaultContent: '该问题的示例如下：',
    advice: 'GET /orders?status=pending&page=1 应返回 {orders: [...], total: 100, page: 1}',
    tips: '提供示例，帮助AI理解问题的语境',
  },
  {
    type: 'suffix',
    label: '后置要求',
    icon: 'MessageSquare',
    defaultContent: '在生成回答之前，请记住以下要求：',
    advice: '你需要提供完整的API端点设计和请求/响应示例。',
    tips: '指定期望的回答格式，确保输出符合预期',
  },
];

// 模板分类配置
export const TEMPLATE_CATEGORIES: CategoryConfig[] = [
  { key: 'productivity', label: '生产力', color: 'primary' },
  { key: 'creative', label: '创意', color: 'secondary' },
  { key: 'technical', label: '技术', color: 'success' },
  { key: 'research', label: '研究', color: 'warning' },
  { key: 'education', label: '教育', color: 'danger' },
  { key: 'business', label: '商业', color: 'outline' },
];

// 组件显示配置（用于预览中的组件结构显示）
export const COMPONENT_DISPLAY_CONFIG: Record<string, ComponentDisplayConfig> = {
  prefix: { label: '角色设定', variant: 'primary' },
  question_slot: { label: '具体问题', variant: 'secondary' },
  suffix: { label: '后置要求', variant: 'success' },
  context: { label: '上下文', variant: 'warning' },
  constraint: { label: '约束条件', variant: 'danger' },
  example: { label: '示例', variant: 'outline' },
};

// 常用标签选项
export const COMMON_TAGS = [
  '通用', '问答', '基础', '创意写作', '代码生成', '数据分析',
  '学术研究', '商业分析', '技术文档', '教学辅助', '头脑风暴',
  '翻译', '总结', '解释', '比较', '评估', '规划', '设计',
];

// 问题类型配置
export const QUESTION_TYPES = [
  { key: 'general', label: '通用' },
  { key: 'technical', label: '技术' },
  { key: 'creative', label: '创意' },
  { key: 'analytical', label: '分析' },
  { key: 'research', label: '研究' },
  { key: 'brainstorm', label: '头脑风暴' },
];

// UI文本配置
export const UI_TEXT = {
  // 按钮文本
  buttons: {
    save: '保存模板',
    preview: '预览',
    hidePreview: '隐藏预览',
    copy: '复制',
    copied: '已复制',
    edit: '编辑',
    delete: '删除',
    cancel: '取消',
    confirm: '确认',
    add: '添加',
    remove: '移除',
  },
  
  // 标题文本
  titles: {
    createTemplate: '创建模板',
    editTemplate: '编辑模板',
    useTemplate: '使用模板',
    templatePreview: '模板预览',
    componentStructure: '组件结构',
    templateComponents: '模板组件',
    generatedPrompt: '生成的提示词',
    templateLibrary: '模板库',
    componentLibrary: '组件库',
    basicInfo: '基本信息',
    questionInput: '问题输入',
  },
  
  // 表单标签
  labels: {
    templateName: '模板名称',
    templateDescription: '模板描述',
    category: '分类',
    tags: '标签',
    isPublic: '公开模板',
    sampleQuestion: '示例问题 (用于预览)',
    required: '必需',
  },
  
  // 占位符文本
  placeholders: {
    templateName: '请输入模板名称...',
    templateDescription: '请输入模板描述...',
    sampleQuestion: '输入一个示例问题来预览最终效果...',
    searchTemplates: '搜索模板...',
    addTag: '添加标签...',
    questionSlotInUseMode: '[你的问题在这个位置]',
  },
  
  // 提示信息
  messages: {
    noTemplates: '暂无模板',
    noQuestions: '暂无问题',
    copySuccess: '复制成功',
    saveSuccess: '保存成功',
    deleteSuccess: '删除成功',
    inputSampleQuestion: '输入示例问题以查看生成的提示词',
    dragToReorder: '拖拽以重新排序',
    dropToInsert: '释放以插入问题',
  },
  
  // 统计信息
  stats: {
    templates: '个模板',
    components: '组件',
    characters: '字符',
    usage: '次使用',
    rating: '评分',
  },
};

// 动画配置
export const ANIMATION_CONFIG = {
  // 页面切换动画时长
  pageTransition: 0.3,
  
  // 组件动画时长
  componentAnimation: 0.2,
  
  // 烟花特效时长
  fireworksDuration: 1000,
  
  // 复制成功提示时长
  copySuccessDelay: 100,
  
  // 滚动动画配置
  scrollBehavior: {
    behavior: 'smooth' as ScrollBehavior,
    block: 'center' as ScrollLogicalPosition,
    inline: 'nearest' as ScrollLogicalPosition,
  },
};

// 默认模板配置
export const DEFAULT_TEMPLATE_CONFIG = {
  // 默认组件类型（按顺序）
  defaultComponentTypes: ['prefix', 'context', 'question_slot', 'constraint', 'suffix'],

  // 必需组件类型
  requiredComponentTypes: ['question_slot'],

  // 可删除的组件类型（用户后添加的组件）
  deletableComponentTypes: ['context', 'constraint', 'example'],

  // 默认模板分类
  defaultCategory: 'productivity',

  // 默认公开状态
  defaultIsPublic: true,
};

// 组件颜色配置（用于Badge显示）
export const COMPONENT_COLOR_CONFIG: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default'> = {
  prefix: 'primary',
  question_slot: 'secondary',
  suffix: 'success',
  context: 'warning',
  constraint: 'danger',
  example: 'outline',
};

// 组件按钮颜色配置（用于添加组件按钮的背景色）
export const COMPONENT_BUTTON_COLORS: Record<string, { bg: string; hover: string; border: string; text: string }> = {
  prefix: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700'
  },
  question_slot: {
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-700'
  },
  suffix: {
    bg: 'bg-green-50',
    hover: 'hover:bg-green-100',
    border: 'border-green-200',
    text: 'text-green-700'
  },
  context: {
    bg: 'bg-yellow-50',
    hover: 'hover:bg-yellow-100',
    border: 'border-yellow-200',
    text: 'text-yellow-700'
  },
  constraint: {
    bg: 'bg-red-50',
    hover: 'hover:bg-red-100',
    border: 'border-red-200',
    text: 'text-red-700'
  },
  example: {
    bg: 'bg-gray-50',
    hover: 'hover:bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-700'
  },
};

// 组件图标颜色配置（用于统一组件图标的渐变背景色）
export const COMPONENT_ICON_COLORS: Record<string, { from: string; to: string }> = {
  prefix: {
    from: 'from-blue-500',
    to: 'to-blue-600'
  },
  question_slot: {
    from: 'from-purple-500',
    to: 'to-purple-600'
  },
  suffix: {
    from: 'from-green-500',
    to: 'to-green-600'
  },
  context: {
    from: 'from-yellow-500',
    to: 'to-yellow-600'
  },
  constraint: {
    from: 'from-red-500',
    to: 'to-red-600'
  },
  example: {
    from: 'from-gray-500',
    to: 'to-gray-600'
  },
};
