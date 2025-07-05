import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Eye,
  Settings,
  Wand2,
  FileText,
  MessageSquare,
  Target,
  BookOpen,
  Lightbulb
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
    const newComponent: TemplateComponent = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
      position: components.length,
      isRequired: type === 'question_slot',
      placeholder: type === 'question_slot' ? '在此输入您的问题...' : undefined,
    };

    updateEditorComponents([...components, newComponent]);
  };

  const getDefaultContent = (type: ComponentType): string => {
    const defaults = {
      prefix: '请注意以下要求：',
      question_slot: '[用户问题将插入此处]',
      suffix: '请提供详细的回答。',
      context: '背景信息：',
      constraint: '约束条件：',
      example: '示例：',
    };
    return defaults[type] || '';
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



  const componentTypes = [
    { type: 'prefix' as ComponentType, label: '前置说明', icon: FileText, color: 'primary' },
    { type: 'context' as ComponentType, label: '上下文', icon: BookOpen, color: 'secondary' },
    { type: 'constraint' as ComponentType, label: '约束条件', icon: Target, color: 'warning' },
    { type: 'example' as ComponentType, label: '示例', icon: Lightbulb, color: 'success' },
    { type: 'suffix' as ComponentType, label: '后置要求', icon: MessageSquare, color: 'danger' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            {template ? '编辑模板' : '创建模板'}
          </motion.h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              icon={<Eye className="w-4 h-4" />}
            >
              {showPreview ? '隐藏预览' : '预览'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            >
              保存模板
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
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="模板名称"
                  placeholder="输入模板名称..."
                  value={formData.name}
                  onChange={(value) => updateEditorFormData({ name: value })}
                />

                <Textarea
                  label="模板描述"
                  placeholder="描述这个模板的用途和特点..."
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
                      label="分类"
                      value={formData.category}
                      onChange={(value) => updateEditorFormData({
                        category: value as Template['category']
                      })}
                      options={[
                        { value: 'productivity', text: '生产力' },
                        { value: 'creative', text: '创意' },
                        { value: 'technical', text: '技术' },
                        { value: 'research', text: '研究' },
                        { value: 'education', text: '教育' },
                        { value: 'business', text: '商业' },
                      ]}
                      placeholder="请选择分类"
                      size="s"
                      className="w-full"
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex-1 space-y-3">
                    <TagSelect
                      label="标签"
                      value={formData.tags}
                      onChange={(tags) => updateEditorFormData({ tags })}
                      placeholder="添加标签..."
                      options={[
                        // 预设一些常用标签选项
                        { value: 'AI', text: 'AI' },
                        { value: '写作', text: '写作' },
                        { value: '编程', text: '编程' },
                        { value: '设计', text: '设计' },
                        { value: '营销', text: '营销' },
                        { value: '教育', text: '教育' },
                        { value: '商业', text: '商业' },
                        { value: '创意', text: '创意' },
                      ]}
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
                  模板组件
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Component Buttons */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {componentTypes.map(({ type, label, icon: Icon }) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => addComponent(type)}
                        icon={<Icon className="w-4 h-4" />}
                        className="hover:bg-gray-50"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Drop Zone */}
                <div
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
