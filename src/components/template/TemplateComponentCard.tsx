import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'tea-component';
import {
  GripVertical,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Target,
  BookOpen,
  Lightbulb,
  Check,
  X,
} from 'lucide-react';
import { TemplateComponent, ComponentType, DragItem } from '@/types';
import { cn } from '@/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  COMPONENT_DISPLAY_CONFIG,
  COMPONENT_COLOR_CONFIG,
  DEFAULT_TEMPLATE_CONFIG,
  COMPONENT_TYPES,
  COMPONENT_ICON_COLORS,
  UI_TEXT,
} from '@/config/appConfig';

interface TemplateComponentCardProps {
  component: TemplateComponent;
  index: number;
  onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
  onRemove: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  allComponents: TemplateComponent[]; // 添加所有组件的引用，用于判断删除逻辑
  mode?: 'create' | 'use'; // 添加模式参数
}

const TemplateComponentCard: React.FC<TemplateComponentCardProps> = ({
  component,
  index,
  onUpdate,
  onRemove,
  onMove,
  allComponents,
  mode = 'create',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(component.content);
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 拖拽源配置
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: (): DragItem => ({
      id: component.id,
      type: 'component',
      content: component.content,
      index,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放置目标配置
  const [, drop] = useDrop({
    accept: 'component',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // 如果拖拽的是同一个元素，不做任何操作
      if (dragIndex === hoverIndex) {
        return;
      }

      // 获取悬停区域的边界矩形
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // 获取悬停区域的中点
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 获取鼠标位置
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // 获取鼠标相对于悬停区域顶部的位置
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 只有当鼠标越过悬停区域的一半时才执行移动
      // 向下拖拽时，只有当鼠标越过下半部分时才移动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 向上拖拽时，只有当鼠标越过上半部分时才移动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行移动
      onMove(dragIndex, hoverIndex);

      // 更新拖拽项的索引，避免重复触发
      item.index = hoverIndex;
    },
  });

  // 连接拖拽和放置的引用
  // 只有拖动手柄可以拖拽，整个卡片可以作为放置目标
  drag(dragHandleRef);
  drop(ref);

  const getComponentIcon = (type: ComponentType) => {
    const icons = {
      prefix: FileText,
      question_slot: MessageSquare,
      suffix: MessageSquare,
      context: BookOpen,
      constraint: Target,
      example: Lightbulb,
    };
    return icons[type] || FileText;
  };

  const getComponentColor = (
    type: ComponentType
  ):
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'default' => {
    return COMPONENT_COLOR_CONFIG[type] || 'default';
  };

  const getComponentLabel = (type: ComponentType) => {
    return COMPONENT_DISPLAY_CONFIG[type]?.label || type;
  };

  // 获取组件的advice提示
  const getComponentAdvice = (type: ComponentType) => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    return config?.advice || '';
  };

  // 获取组件的tips提示
  const getComponentTips = (type: ComponentType) => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    return config?.tips || '';
  };

  // 获取组件图标颜色
  const getComponentIconColors = (type: ComponentType) => {
    return COMPONENT_ICON_COLORS[type] || { from: 'from-gray-500', to: 'to-gray-600' };
  };

  // 判断组件是否可以删除
  const canDelete = () => {
    // 如果是question_slot类型，需要检查是否是最后一个
    if (component.type === 'question_slot') {
      const questionSlotCount = allComponents.filter(c => c.type === 'question_slot').length;
      return questionSlotCount > 1; // 只有当question_slot组件超过1个时才能删除
    }
    // 其他类型的组件都可以删除
    return true;
  };

  const handleSaveEdit = () => {
    onUpdate(component.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(component.content);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    // 使用setTimeout确保DOM更新后再聚焦，并将光标移动到内容末尾
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        // 将光标移动到内容末尾
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    }, 0);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handleToggleRequired = () => {
    onUpdate(component.id, { isRequired: !component.isRequired });
  };

  const Icon = getComponentIcon(component.type);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          variant='default'
          padding='none'
          className={cn(
            'transition-all duration-200 p-0',
            isDragging && 'opacity-50 rotate-1 scale-105 shadow-xl',
            'hover:shadow-lg'
          )}
        >
          <CardContent className='p-4'>
            <div className='flex items-start gap-3'>
              {/* Drag Handle */}
              <div
                ref={dragHandleRef}
                className={cn(
                  'mt-1 p-1 rounded transition-colors',
                  isDragging
                    ? 'cursor-grabbing bg-blue-100'
                    : 'cursor-grab hover:bg-gray-100'
                )}
              >
                <GripVertical
                  className={cn(
                    'w-4 h-4',
                    isDragging ? 'text-blue-500' : 'text-gray-400'
                  )}
                />
              </div>

              {/* Component Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center mt-1',
                  'bg-gradient-to-br shadow-sm',
                  getComponentIconColors(component.type).from,
                  getComponentIconColors(component.type).to
                )}
              >
                <Icon className='w-4 h-4 text-white' />
              </div>

              {/* Content */}
              <div className='flex-1 space-y-3'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Tooltip title={getComponentTips(component.type)}>
                      <Badge
                        variant={getComponentColor(component.type)}
                        size='sm'
                      >
                        {getComponentLabel(component.type)}
                      </Badge>
                    </Tooltip>
                    {component.isRequired && (
                      <Badge variant='danger' size='sm'>
                        必需
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-1'>
                    {/* 在使用模式下，question_slot组件不显示编辑按钮 */}
                    {!(mode === 'use' && component.type === 'question_slot') && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleStartEdit}
                        icon={<Edit className='w-4 h-4' />}
                        className='p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                        title='编辑组件'
                      />
                    )}
                    {/* 根据删除逻辑显示删除按钮 */}
                    {canDelete() && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onRemove(component.id)}
                        icon={<Trash2 className='w-4 h-4' />}
                        className='p-2 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300'
                        title='删除组件'
                      />
                    )}
                  </div>
                </div>

                {/* Content Display/Edit */}
                {isEditing ? (
                  <div className='space-y-2 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium text-blue-800'>
                        ✏️ 编辑组件内容
                      </h4>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleSaveEdit}
                          icon={<Check className='w-4 h-4' />}
                          className='text-green-600 hover:bg-green-100 p-1.5'
                          title='保存更改'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleCancelEdit}
                          icon={<X className='w-4 h-4' />}
                          className='text-gray-600 hover:bg-gray-100 p-1.5'
                          title='取消编辑'
                        />
                      </div>
                    </div>

                    <Textarea
                      ref={textareaRef}
                      value={editContent}
                      onChange={(value) => setEditContent(value)}
                      placeholder={component.placeholder || '输入内容...'}
                      rows={3}
                      className='resize-none border-blue-200 focus:border-blue-400'
                      onKeyDown={handleKeyDown}
                    />

                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        id={`required-${component.id}`}
                        checked={component.isRequired}
                        onChange={handleToggleRequired}
                        className='rounded border-blue-300 text-blue-600 focus:ring-blue-500'
                      />
                      <label
                        htmlFor={`required-${component.id}`}
                        className='text-sm text-blue-700 font-medium'
                      >
                        必需组件
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <div
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        component.type === 'question_slot'
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      )}
                    >
                      <p className='text-gray-800 text-sm leading-relaxed whitespace-pre-wrap'>
                        {/* 在使用模式下，question_slot组件显示特殊的placeholder */}
                        {mode === 'use' && component.type === 'question_slot' ? (
                          <span className='text-blue-600 italic font-medium'>
                            {UI_TEXT.placeholders.questionSlotInUseMode}
                          </span>
                        ) : (
                          component.content || (
                            <span className='text-gray-400 italic'>
                              {component.placeholder || '点击编辑添加内容...'}
                            </span>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Component Info */}
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <div className='flex items-center gap-2'>
                    <span>位置: {index + 1}</span>
                    {getComponentAdvice(component.type) && (
                      <Tooltip title={`"${getComponentAdvice(component.type)}"`}>
                        <span className='text-blue-600 cursor-help'>💡 填写示例</span>
                      </Tooltip>
                    )}
                  </div>
                  {component.validation && <span>包含验证规则</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TemplateComponentCard;
