import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { PopConfirm, Tooltip } from 'tea-component';
import {
  Save,
  Eye,
  Settings,
  Wand2,
  FileText,
  MessageSquare,
  Target,
  BookOpen,
  Lightbulb,
  RotateCcw,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { Template, TemplateComponent, ComponentType } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { generateId, cn } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/common/TeaSelect';
import { TagSelect } from '@/components/common/TeaTagSelect';

import TemplateComponentCard from '@/components/template/TemplateComponentCard';
import TemplatePreview from '@/components/template/TemplatePreview';
import { useI18n } from '@/i18n/hooks';
import { COMPONENT_TYPES, UI_TEXT, ANIMATION_CONFIG, TEMPLATE_CATEGORIES, COMMON_TAGS, DEFAULT_TEMPLATE_CONFIG, COMPONENT_BUTTON_COLORS } from '@/config/appConfig';
import { TEST_IDS } from '@/config/constants';
import { NOTIFICATIONS, ERROR_MESSAGES } from '@/config/text';
import { DEFAULTS } from '@/config/constants';

interface TemplateEditorProps {
  template?: Template | null;
  className?: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, className }) => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    addTemplate,
    updateTemplate,
    showNotification,
    editor,
    updateEditorFormData,
    updateEditorComponents,
    setShowPreview,
    setCurrentTemplate,
    resetEditor,
  } = useAppStore();

  const { formData, components, showPreview, currentTemplate } = editor;

  // 直接从URL参数读取模式，作为唯一状态源
  const mode = (searchParams.get('mode') as 'create' | 'use') || 'create';

  // 使用模板模式的状态
  const [userQuestion, setUserQuestion] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // 生成最终提示词的函数
  const generateFinalPrompt = () => {
    if (mode !== 'use' || !userQuestion.trim()) {
      return '';
    }

    let prompt = '';
    let hasQuestionSlot = false;

    // 按位置排序处理组件
    components
      .sort((a, b) => a.position - b.position)
      .forEach(component => {
        switch (component.type) {
          case 'prefix':
          case 'context':
          case 'constraint':
          case 'example':
          case 'suffix':
            if (component.content.trim()) {
              prompt += component.content + '\n\n';
            }
            break;
          case 'question_slot':
            hasQuestionSlot = true;
            if (userQuestion.trim()) {
              prompt += userQuestion + '\n\n';
            }
            break;
        }
      });

    // 如果没有question_slot组件，将用户问题添加到末尾
    if (!hasQuestionSlot && userQuestion.trim()) {
      prompt += userQuestion + '\n\n';
    }

    return prompt.trim();
  };

  // 复制提示词的函数
  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      showNotification({
        type: 'success',
        title: t('复制成功'),
        message: t('提示词已复制到剪贴板'),
        duration: 2000,
      });
      // 移除自动重置，只在内容变化时重置
    } catch (error) {
      console.error('复制失败:', error);
      showNotification({
        type: 'error',
        title: t('复制失败'),
        message: t('无法复制到剪贴板'),
        duration: 2000,
      });
    }
  };

  // 当问题或组件改变时重新生成提示词
  useEffect(() => {
    if (mode === 'use') {
      const newPrompt = generateFinalPrompt();

      // 如果生成的提示词发生变化，重置复制状态
      if (newPrompt !== generatedPrompt && copySuccess) {
        setCopySuccess(false);
      }

      setGeneratedPrompt(newPrompt);
    }
  }, [userQuestion, components, mode]);

  // 处理模式切换
  const handleModeSwitch = (newMode: 'create' | 'use') => {
    // 切换到使用模式时清除当前编辑的模板
    if (newMode === 'use') {
      setCurrentTemplate(null);
    }
    // 只更新URL参数，让URL成为唯一状态源
    setSearchParams({ mode: newMode });
    // 不再自动移除question_slot组件，让用户手动控制问题在提示词中的位置
  };

  // Initialize form data
  useEffect(() => {
    if (template) {
      updateEditorFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        tags: [...template.tags],
        isPublic: template.isPublic,
      });
      updateEditorComponents([...template.components]);
    }
  }, [template, updateEditorFormData, updateEditorComponents]);

  // Temporarily disable drop functionality
  const isOver = false;

  const addComponent = (type: ComponentType) => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    const newComponent: TemplateComponent = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
      position: components.length,
      isRequired: DEFAULT_TEMPLATE_CONFIG.requiredComponentTypes.includes(type),
      placeholder: config?.placeholder,
      isDefault: false, // 用户添加的组件标记为非默认
    };

    updateEditorComponents([...components, newComponent]);

    // 滚动到新添加的组件位置
    setTimeout(() => {
      const dropZone = document.querySelector(`[data-testid="${TEST_IDS.DROP_ZONE}"]`);
      if (dropZone) {
        const lastComponent = dropZone.lastElementChild;
        if (lastComponent) {
          lastComponent.scrollIntoView(ANIMATION_CONFIG.scrollBehavior);
        }
      }
    }, 100); // 等待DOM更新后再滚动
  };

  const getDefaultContent = (_type: ComponentType): string => {
    // 不再使用defaultContent，所有组件默认为空内容
    return '';
  };

  const updateComponent = (id: string, updates: Partial<TemplateComponent>) => {
    updateEditorComponents(components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const removeComponent = (id: string) => {
    updateEditorComponents(components.filter(comp => comp.id !== id));
  };

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const draggedComponent = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedComponent);

    // Update positions
    newComponents.forEach((comp, index) => {
      comp.position = index;
    });

    updateEditorComponents(newComponents);
  };

  const handleSave = () => {
    // 在使用模板模式下，如果没有模板名称，自动生成一个
    let templateName = formData.name.trim();
    let templateDescription = formData.description;

    if (mode === 'use' && !templateName) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      templateName = `${dateStr}-${t('创建的模板')}`;
      templateDescription = templateDescription || t('基于问题输入创建的模板');
    } else if (mode === 'create' && !templateName) {
      showNotification({
        type: 'error',
        title: NOTIFICATIONS.ERROR.SAVE_FAILED,
        message: ERROR_MESSAGES.REQUIRED_FIELD,
        duration: 3000,
      });
      return;
    }

    const templateData: Template = {
      id: currentTemplate?.id || generateId(),
      name: templateName,
      description: templateDescription,
      category: formData.category,
      components: components.map((comp, index) => ({ ...comp, position: index })),
      rating: currentTemplate?.rating || 0,
      usageCount: currentTemplate?.usageCount || 0,
      isPublic: formData.isPublic,
      authorId: 'current-user', // TODO: Get from auth
      createdAt: currentTemplate?.createdAt || new Date(),
      updatedAt: new Date(),
      tags: formData.tags,
      version: currentTemplate?.version || '1.0.0',
    };

    if (currentTemplate && currentTemplate.id) {
      updateTemplate(currentTemplate.id, templateData);
      // 更新当前编辑的模板引用
      setCurrentTemplate(templateData);
      showNotification({
        type: 'success',
        title: NOTIFICATIONS.SUCCESS.TEMPLATE_UPDATED,
        message: mode === 'use' ? `${t('模板')}"${templateName}"${t('已成功保存')}` : NOTIFICATIONS.SUCCESS.TEMPLATE_SAVED,
        duration: 2000,
      });
    } else {
      addTemplate(templateData);
      showNotification({
        type: 'success',
        title: NOTIFICATIONS.SUCCESS.TEMPLATE_CREATED,
        message: mode === 'use' ? `${t('模板')}"${templateName}"${t('已成功创建')}` : NOTIFICATIONS.SUCCESS.TEMPLATE_CREATED,
        duration: 2000,
      });
    }
  };

  const handleReset = () => {
    setCurrentTemplate(null);
    resetEditor();
  };



  // 图标映射
  const iconMap = {
    FileText,
    BookOpen,
    MessageSquare,
    Target,
    Lightbulb,
  };

  // 从配置文件获取组件类型，并映射图标
  const componentTypes = COMPONENT_TYPES.map(config => ({
    type: config.type as ComponentType,
    label: config.label,
    icon: iconMap[config.icon as keyof typeof iconMap] || FileText,
  }));

  return (
    <div className={cn('space-y-6 p-3', className)}>
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={mode === 'use' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleModeSwitch('use')}
                icon={<Play className="w-4 h-4" />}
                className={cn(
                  'transition-all duration-200',
                  mode === 'use'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                )}
              >
                {t('使用模板')}
              </Button>
              <Button
                variant={mode === 'create' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleModeSwitch('create')}
                icon={<Wand2 className="w-4 h-4" />}
                className={cn(
                  'transition-all duration-200',
                  mode === 'create'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                )}
              >
                {t('创建模板')}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mode === 'create' && (
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                icon={<Eye className="w-4 h-4" />}
                htmlType="button"
                className="active:scale-95 transition-all duration-150"
              >
{t(showPreview ? UI_TEXT.buttons.hidePreview : UI_TEXT.buttons.preview)}
              </Button>
            )}
            <PopConfirm
              title={t('确定要重置模板到默认状态吗')}
              message={t('这将清除所有当前的修改')}
              footer={(close) => (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={close}>{t('取消')}</Button>
                  <Button
                    variant="primary"
                    onClick={() => { handleReset(); close(); }}
                    className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  >
                    {t('确认')}
                  </Button>
                </div>
              )}
            >
              <Button
                variant="outline"
                icon={<RotateCcw className="w-4 h-4" />}
                htmlType="button"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition-all duration-150"
                title={t('重置到默认状态')}
              >
                {t('重置')}
              </Button>
            </PopConfirm>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              htmlType="button"
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 active:scale-95 transition-all duration-150"
            >
{t(UI_TEXT.buttons.save)}
            </Button>
          </div>
        </div>

        {/* 创建模板模式 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Info / Question Input */}
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {mode === 'create' ? (
                      <>
                        <Settings className="w-5 h-5" />
                        {t(UI_TEXT.titles.basicInfo)}
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        {t('问题输入区域')}
                      </>
                    )}
                  </div>
                  {mode === 'use' && (
                    <div className="text-sm text-gray-500">
                      {t('没有自己喜欢的模板')}？
                      <button
                        onClick={() => handleModeSwitch('create')}
                        className="text-blue-600 hover:text-blue-700 underline ml-1"
                      >
                        {t('去创建一个')}！
                      </button>
                    </div>
                  )}
                </CardTitle>
                {mode === 'use' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('输入你的具体问题')}{t('系统将基于模板组件生成提示词')}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {mode === 'create' ? (
                  // 创建模板模式 - 显示基本信息表单
                  <>
                    <Input
                      label={t(UI_TEXT.labels.templateName)}
                      placeholder={t(UI_TEXT.placeholders.templateName)}
                      value={formData.name}
                      onChange={(value) => updateEditorFormData({ name: value })}
                    />

                    <Textarea
                      label={t(UI_TEXT.labels.templateDescription)}
                      placeholder={t(UI_TEXT.placeholders.templateDescription)}
                      value={formData.description}
                      onChange={(value) => updateEditorFormData({ description: value })}
                      rows={4}
                      className="w-full min-h-[100px]"
                    />

                    {/* Category and Tags in one row */}
                    <div className="flex gap-6 items-start">
                      {/* Category */}
                      <div className="space-y-2 w-[140px] flex-shrink-0">
                        <Select
                          label={t(UI_TEXT.labels.category)}
                          value={formData.category}
                          onChange={(value) => updateEditorFormData({
                            category: value as Template['category']
                          })}
                          options={TEMPLATE_CATEGORIES.map(cat => ({
                            value: cat.key,
                            text: t(cat.label)
                          }))}
                          placeholder={t('请选择分类')}
                          size="s"
                          className="w-full"
                        />
                      </div>

                      {/* Tags */}
                      <div className="flex-1 space-y-3">
                        <TagSelect
                          label={t(UI_TEXT.labels.tags)}
                          value={formData.tags}
                          onChange={(tags) => updateEditorFormData({ tags })}
                          placeholder={t(UI_TEXT.placeholders.addTag)}
                          options={COMMON_TAGS.map(tag => ({
                            value: tag,
                            text: t(tag)
                          }))}
                          optionsOnly={false} // 允许用户输入自定义标签
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // 使用模板模式 - 显示问题输入
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('你的问题')}
                    </label>
                    <Textarea
                      placeholder={t('请输入你想要解决的问题')}
                      value={userQuestion}
                      onChange={(value) => setUserQuestion(value)}
                      rows={6}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {t('输入问题后')}{t('系统会根据模板组件自动生成提示词')}<br/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Components */}
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
{t(UI_TEXT.titles.templateComponents)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Component Buttons */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {componentTypes.map(({ type, label, icon: Icon }) => {
                      const colors = COMPONENT_BUTTON_COLORS[type] || COMPONENT_BUTTON_COLORS.example;
                      const config = COMPONENT_TYPES.find(c => c.type === type);
                      const tips = config?.tips || '';

                      return (
                        <Tooltip key={type} title={t(tips)}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addComponent(type)}
                            icon={<Icon className="w-3 h-3" />}
                            htmlType="button"
                            className={`${colors.bg} ${colors.hover} ${colors.border} ${colors.text} active:scale-95 transition-all duration-150 text-xs px-2 py-1`}
                          >
                            {t(label)}
                          </Button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  data-testid={TEST_IDS.DROP_ZONE}
                  className={cn(
                    'min-h-[200px] border-2 border-dashed rounded-lg p-4 transition-all',
                    'border-gray-300 space-y-3'
                  )}
                >
                  {isOver && (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-primary-400"
                      >
                        <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">{t('释放以插入问题')}</p>
                      </motion.div>
                    </div>
                  )}

                  <AnimatePresence>
                    {components.map((component, index) => (
                      <TemplateComponentCard
                        key={component.id}
                        component={component}
                        index={index}
                        onUpdate={updateComponent}
                        onRemove={removeComponent}
                        onMove={moveComponent}
                        allComponents={components}
                        mode={mode}
                      />
                    ))}
                  </AnimatePresence>

                  {components.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">{t('开始构建您的模板')}</p>
                      <p className="text-sm">{t('添加组件或拖拽问题到此处')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel / Generated Prompt Panel */}
          {mode === 'create' ? (
            // 创建模式显示预览面板
            showPreview && (
              <div className="xl:col-span-1">
                <TemplatePreview
                  template={{
                    id: 'preview',
                    name: formData.name || t('未命名模板'),
                    description: formData.description,
                    category: formData.category,
                    components,
                    rating: 0,
                    usageCount: 0,
                    isPublic: formData.isPublic,
                    authorId: 'current-user',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    tags: formData.tags,
                    version: '1.0.0',
                  }}
                />
              </div>
            )
          ) : (
            // 使用模式显示生成的提示词面板
            <div className="xl:col-span-1 space-y-6">
              {/* Generated Prompt Card */}
              <Card variant="default" padding="md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800 flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      {t('生成的提示词')}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPrompt}
                      icon={copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      disabled={!generatedPrompt}
                      htmlType="button"
                      className={cn(
                        "transition-all duration-300",
                        copySuccess && "!border-green-500 !text-green-600 !bg-green-50"
                      )}
                    >
                      {copySuccess ? t('已复制') : t('复制')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    'p-4 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto',
                    'bg-gray-50 border-gray-300',
                    'font-mono text-sm leading-relaxed'
                  )}>
                    {generatedPrompt ? (
                      <pre className="text-gray-800 whitespace-pre-wrap">
                        {generatedPrompt}
                      </pre>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                          <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>
                            {userQuestion ? t('请添加模板组件以生成提示词') : t('请先输入问题')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Component Structure Card */}
              <Card variant="default" padding="md">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-sm">
                    {t('组件结构')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {components.length > 0 ? (
                      components
                        .sort((a, b) => a.position - b.position)
                        .map((component, index) => {
                          const config = COMPONENT_TYPES.find(c => c.type === component.type);
                          const colors = COMPONENT_BUTTON_COLORS[component.type] || COMPONENT_BUTTON_COLORS.example;

                          return (
                            <div
                              key={component.id}
                              className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                            >
                              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                {index + 1}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text} ${colors.border} border`}>
                                    {config?.label || component.type}
                                  </span>
                                  <span className="text-xs text-gray-500 truncate">
                                    {mode === 'use' && component.type === 'question_slot' ? (
                                      <span className="text-blue-600 italic">
                                        {t(UI_TEXT.placeholders.questionSlotInUseMode)}
                                      </span>
                                    ) : (
                                      component.content ?
                                        (component.content.length > 30 ?
                                          component.content.substring(0, 30) + '...' :
                                          component.content
                                        ) :
                                        t('空内容')
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        {t('还没有添加任何组件')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    </div>
  );
};

export default TemplateEditor;
