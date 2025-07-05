import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, SortAsc, Download, Upload } from 'lucide-react';
import { Template, TemplateCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import TemplateCard from './TemplateCard';

interface TemplateLibraryProps {
  className?: string;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ className }) => {
  const {
    templates,
    deleteTemplate,
    showNotification,
    setActiveTab,
    updateEditorFormData,
    updateEditorComponents
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating' | 'usage'>('date');

  // Filter and sort templates
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [templates, searchTerm, selectedCategory, sortBy]);

  const handleEditTemplate = (template: Template) => {
    // Load template into editor
    updateEditorFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      isPublic: template.isPublic
    });
    updateEditorComponents(template.components);
    setActiveTab('editor');
    
    showNotification({
      type: 'success',
      title: '模板已加载',
      message: '模板已加载到编辑器中',
      duration: 2000,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    showNotification({
      type: 'success',
      title: '模板已删除',
      message: '模板已成功删除',
      duration: 2000,
    });
  };

  const handleApplyTemplate = (template: Template) => {
    // Apply template components to current editor
    updateEditorComponents([...template.components]);
    setActiveTab('editor');
    
    showNotification({
      type: 'success',
      title: '模板已应用',
      message: '模板组件已添加到编辑器中',
      duration: 2000,
    });
  };

  const templateCategories: { value: TemplateCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '📋' },
    { value: 'general', label: '通用', icon: '💬' },
    { value: 'creative', label: '创意', icon: '🎨' },
    { value: 'technical', label: '技术', icon: '⚙️' },
    { value: 'business', label: '商务', icon: '💼' },
    { value: 'educational', label: '教育', icon: '📚' },
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
          模板库
        </motion.h2>
        <Button
          variant="primary"
          onClick={() => setActiveTab('editor')}
          icon={<Plus className="w-4 h-4" />}
        >
          新建模板
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="搜索模板或标签..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">分类:</span>
          {templateCategories.map(category => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? 'primary' : 'outline'}
              className={cn(
                'cursor-pointer transition-all',
                selectedCategory === category.value ? 'ring-2 ring-blue-300' : 'hover:bg-gray-50'
              )}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">更新时间</option>
            <option value="name">名称</option>
            <option value="rating">评分</option>
            <option value="usage">使用次数</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600"
      >
        共 {filteredTemplates.length} 个模板
        {searchTerm && ` (搜索: "${searchTerm}")`}
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onApply={handleApplyTemplate}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm ? '未找到匹配的模板' : '暂无模板'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? '尝试调整搜索条件' : '开始创建您的第一个模板'}
            </p>
          </div>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => setActiveTab('editor')}
              icon={<Plus className="w-4 h-4" />}
            >
              创建模板
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TemplateLibrary;
