/**
 * 组件库管理组件
 * 显示和管理所有保存的组件，支持搜索、筛选和复制到编辑器功能，使用配置化的文本和图标
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopConfirm } from 'tea-component';
import { Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { StoredComponent, ComponentType } from '@/types';
import { generateId } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/common/TeaSelect';
import { COMPONENT_TYPES, COMPONENT_DISPLAY_CONFIG, UI_TEXT, COMPONENT_CARD_COLORS } from '@/config/appConfig';
import { ROUTES } from '@/config/constants';
import { BUTTON_TEXTS, PLACEHOLDERS, NOTIFICATIONS, EMPTY_STATES } from '@/config/text';
import { getIcon } from '@/utils/iconMap';

const ComponentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const {
    storedComponents,
    deleteComponentFromStorage,
    updateEditorComponents,
    editor,
    showNotification
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

  // 过滤组件
  const filteredComponents = storedComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || component.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // 获取所有分类
  const categories = Array.from(new Set(storedComponents.map(c => c.category)));

  // 获取组件类型选项
  const typeOptions = [
    { value: 'all', text: '全部类型' },
    ...COMPONENT_TYPES.map(type => ({
      value: type.type,
      text: type.label
    }))
  ];

  // 获取分类选项
  const categoryOptions = [
    { value: 'all', text: '全部分类' },
    ...categories.map(category => ({
      value: category,
      text: category
    }))
  ];

  // 选择/取消选择组件
  const handleToggleComponent = (componentId: string) => {
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(componentId)) {
      newSelected.delete(componentId);
    } else {
      newSelected.add(componentId);
    }
    setSelectedComponents(newSelected);
  };

  // 批量添加选中的组件到编辑器并跳转
  const handleAddSelectedComponentsAndNavigate = () => {
    const componentsToAdd = storedComponents.filter(comp => selectedComponents.has(comp.id));

    const newComponents = componentsToAdd.map((component, index) => ({
      id: generateId(),
      type: component.type,
      content: component.content,
      position: editor.components.length + index,
      isRequired: component.isRequired,
      placeholder: component.placeholder,
      validation: component.validation,
    }));

    updateEditorComponents([...editor.components, ...newComponents]);

    showNotification({
      type: 'success',
      title: '组件已添加',
      message: `已添加 ${componentsToAdd.length} 个组件到编辑器，正在跳转到工作台`,
      duration: 2000,
    });

    // 清空选择
    setSelectedComponents(new Set());

    // 跳转到模板工作台
    navigate('/editor?mode=create');
  };



  // 删除组件
  const handleDeleteComponent = async (component: StoredComponent) => {
    try {
      await deleteComponentFromStorage(component.id);
      showNotification({
        type: 'success',
        title: '删除成功',
        message: `组件"${component.name}"已删除`,
        duration: 2000,
      });
    } catch (error) {
      console.error('删除失败:', error);
      showNotification({
        type: 'error',
        title: '删除失败',
        message: '无法删除组件',
        duration: 2000,
      });
    }
  };

  // 获取组件类型信息
  const getComponentTypeInfo = (type: ComponentType) => {
    return COMPONENT_DISPLAY_CONFIG[type] || { label: type, variant: 'default' as const };
  };

  // 获取组件卡片背景颜色
  const getComponentCardColor = (type: ComponentType) => {
    return COMPONENT_CARD_COLORS[type] || 'bg-white';
  };

  // 获取已选组件的统计信息
  const getSelectedComponentsStats = () => {
    const selectedComps = storedComponents.filter(comp => selectedComponents.has(comp.id));
    const stats = selectedComps.reduce((acc, comp) => {
      const typeInfo = getComponentTypeInfo(comp.type);
      const typeName = typeInfo.label;
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: selectedComps.length,
      byType: stats
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          {UI_TEXT.titles.componentLibrary}
        </motion.h2>
        <div className="text-sm text-gray-600">
          共 {filteredComponents.length} 个组件
        </div>
      </div>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder={PLACEHOLDERS.SEARCH_COMPONENTS}
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                size="m"
              />
            </div>

            {/* 已选组件显示区域 */}
            {selectedComponents.size > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    已选 {getSelectedComponentsStats().total} 个组件
                  </span>
                </div>

                {/* 组件类型统计 */}
                <div className="flex gap-1">
                  {Object.entries(getSelectedComponentsStats().byType).map(([type, count]) => (
                    <Badge key={type} variant="outline" size="sm" className="text-xs">
                      {type} {count}
                    </Badge>
                  ))}
                </div>

                {/* 跳转按钮 */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSelectedComponentsAndNavigate}
                  icon={<ArrowRight className="w-3 h-3" />}
                  className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                >
                  添加到工作台
                </Button>
              </div>
            )}

            <div>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                size="m"
                placeholder="选择类型"
              />
            </div>
            <div>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                size="m"
                placeholder="选择分类"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredComponents.map((component) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="default" padding="md" hover className={getComponentCardColor(component.type)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium truncate">
                      {component.name}
                    </CardTitle>
                    <Badge 
                      variant={getComponentTypeInfo(component.type).variant} 
                      size="sm"
                    >
                      {getComponentTypeInfo(component.type).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Content Preview */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {component.content}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>使用 {component.usageCount} 次</span>
                      <span>{component.category}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant={selectedComponents.has(component.id) ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleToggleComponent(component.id)}
                        icon={<Plus className="w-3 h-3" />}
                        className={selectedComponents.has(component.id)
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          : "text-blue-600 hover:bg-blue-50 border-blue-600"
                        }
                      >
                        {selectedComponents.has(component.id) ? '已选' : '选择'}
                      </Button>
                      <PopConfirm
                        title={`确定要删除组件"${component.name}"吗？`}
                        message="删除后无法恢复，请谨慎操作。"
                        footer={(close) => (
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={close}>取消</Button>
                            <Button
                              variant="primary"
                              onClick={() => { handleDeleteComponent(component); close(); }}
                              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                            >
                              确认删除
                            </Button>
                          </div>
                        )}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Trash2 className="w-3 h-3" />}
                          className="text-red-600 hover:bg-red-50"
                          title="删除组件"
                        />
                      </PopConfirm>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm || selectedType !== 'all' || selectedCategory !== 'all' 
              ? '没有找到匹配的组件' 
              : '组件库为空'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
              ? '尝试调整搜索条件或筛选器'
              : '创建模板时会自动保存组件到组件库'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ComponentLibrary;
