import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  RotateCcw
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
import { COMPONENT_TYPES, UI_TEXT, ANIMATION_CONFIG, TEMPLATE_CATEGORIES, COMMON_TAGS, DEFAULT_TEMPLATE_CONFIG, COMPONENT_BUTTON_COLORS } from '@/config/appConfig';

interface TemplateEditorProps {
  template?: Template | null;
  className?: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, className }) => {
  const {
    addTemplate,
    updateTemplate,
    questions,
    showNotification,
    editor,
    updateEditorFormData,
    updateEditorComponents,
    setShowPreview,
    resetEditor,
  } = useAppStore();

  const { formData, components, showPreview } = editor;

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

  const handleDropQuestion = (questionItem: { id: string; content: string }) => {
    const question = questions.find(q => q.id === questionItem.id);
    if (!question) return;

    // Find question slot and insert question
    const questionSlotIndex = components.findIndex(c => c.type === 'question_slot');
    if (questionSlotIndex !== -1) {
      const newComponents = [...components];
      newComponents[questionSlotIndex] = {
        ...newComponents[questionSlotIndex],
        content: question.content,
      };
      updateEditorComponents(newComponents);

      showNotification({
        type: 'success',
        title: '问题已插入',
        message: '问题已成功插入到模板中',
        duration: 2000,
      });
    }
  };

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
      const dropZone = document.querySelector('[data-testid="drop-zone"]');
      if (dropZone) {
        const lastComponent = dropZone.lastElementChild;
        if (lastComponent) {
          lastComponent.scrollIntoView(ANIMATION_CONFIG.scrollBehavior);
        }
      }
    }, 100); // 等待DOM更新后再滚动
  };

  const getDefaultContent = (type: ComponentType): string => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    return config?.defaultContent || '';
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
    if (!formData.name.trim()) {
      showNotification({
        type: 'error',
        title: '保存失败',
        message: '请输入模板名称',
        duration: 3000,
      });
      return;
    }

    const templateData: Template = {
      id: template?.id || generateId(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      components: components.map((comp, index) => ({ ...comp, position: index })),
      rating: template?.rating || 0,
      usageCount: template?.usageCount || 0,
      isPublic: formData.isPublic,
      authorId: 'current-user', // TODO: Get from auth
      createdAt: template?.createdAt || new Date(),
      updatedAt: new Date(),
      tags: formData.tags,
      version: template?.version || '1.0.0',
    };

    if (template) {
      updateTemplate(template.id, templateData);
      showNotification({
        type: 'success',
        title: '模板已更新',
        message: '模板已成功保存',
        duration: 2000,
      });
    } else {
      addTemplate(templateData);
      showNotification({
        type: 'success',
        title: '模板已创建',
        message: '新模板已成功创建',
        duration: 2000,
      });
    }
  };

  const handleReset = () => {
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
    <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
{template ? UI_TEXT.titles.editTemplate : UI_TEXT.titles.createTemplate}
          </motion.h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              icon={<Eye className="w-4 h-4" />}
              htmlType="button"
              className="active:scale-95 transition-all duration-150"
            >
{showPreview ? UI_TEXT.buttons.hidePreview : UI_TEXT.buttons.preview}
            </Button>
            <PopConfirm
              title="确定要重置模板到默认状态吗？"
              message="这将清除所有当前的修改。"
              footer={(close) => (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={close}>取消</Button>
                  <Button
                    variant="primary"
                    onClick={() => { handleReset(); close(); }}
                    className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  >
                    确认
                  </Button>
                </div>
              )}
            >
              <Button
                variant="outline"
                icon={<RotateCcw className="w-4 h-4" />}
                htmlType="button"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition-all duration-150"
                title="重置到默认状态"
              >
                重置
              </Button>
            </PopConfirm>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              htmlType="button"
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 active:scale-95 transition-all duration-150"
            >
{UI_TEXT.buttons.save}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
{UI_TEXT.titles.basicInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label={UI_TEXT.labels.templateName}
                  placeholder={UI_TEXT.placeholders.templateName}
                  value={formData.name}
                  onChange={(value) => updateEditorFormData({ name: value })}
                />

                <Textarea
                  label={UI_TEXT.labels.templateDescription}
                  placeholder={UI_TEXT.placeholders.templateDescription}
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
                      label={UI_TEXT.labels.category}
                      value={formData.category}
                      onChange={(value) => updateEditorFormData({
                        category: value as Template['category']
                      })}
                      options={TEMPLATE_CATEGORIES.map(cat => ({
                        value: cat.key,
                        text: cat.label
                      }))}
                      placeholder="请选择分类"
                      size="s"
                      className="w-full"
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex-1 space-y-3">
                    <TagSelect
                      label={UI_TEXT.labels.tags}
                      value={formData.tags}
                      onChange={(tags) => updateEditorFormData({ tags })}
                      placeholder={UI_TEXT.placeholders.addTag}
                      options={COMMON_TAGS.map(tag => ({
                        value: tag,
                        text: tag
                      }))}
                      optionsOnly={false} // 允许用户输入自定义标签
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Components */}
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
{UI_TEXT.titles.templateComponents}
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
                        <Tooltip key={type} title={tips}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addComponent(type)}
                            icon={<Icon className="w-4 h-4" />}
                            htmlType="button"
                            className={`${colors.bg} ${colors.hover} ${colors.border} ${colors.text} active:scale-95 transition-all duration-150`}
                          >
                            {label}
                          </Button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  data-testid="drop-zone"
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
                        <p className="text-lg font-medium">释放以插入问题</p>
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
                      />
                    ))}
                  </AnimatePresence>

                  {components.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">开始构建您的模板</p>
                      <p className="text-sm">添加组件或拖拽问题到此处</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="xl:col-span-1">
              <TemplatePreview
                template={{
                  id: 'preview',
                  name: formData.name || '未命名模板',
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
          )}
        </div>
    </div>
  );
};

export default TemplateEditor;
