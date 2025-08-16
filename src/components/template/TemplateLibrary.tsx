/**
 * 模板库组件
 * 显示和管理所有模板，支持搜索、筛选和排序功能，使用配置化的文本和路由
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';
import { Template, TemplateCategory } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import TemplateCard from './TemplateCard';
import { ROUTES, EDITOR_MODES } from '@/config/constants';
import { NOTIFICATIONS, BUTTON_TEXTS, PLACEHOLDERS, EMPTY_STATES } from '@/config/text';
import { useI18n } from '@/i18n/hooks';

interface TemplateLibraryProps {
  className?: string;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ className }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const {
    templates,
    deleteTemplate,
    showNotification,
    updateEditorFormData,
    updateEditorComponents,
    setCurrentTemplate,
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating' | 'usage'>('date');

  // 动态加载（懒加载）设置
  const pageSize = 12;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filter and sort templates
  const filteredTemplates = React.useMemo(() => {
    const filtered = templates.filter(template => {
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

  // 条件变化时重置
  useEffect(() => { setVisibleCount(pageSize); }, [templates, searchTerm, selectedCategory, sortBy]);

  // 观察哨兵，进入视口时加载更多
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + pageSize, filteredTemplates.length));
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [filteredTemplates.length]);

  const handleEditTemplate = (template: Template) => {
    // 设置当前编辑的模板
    setCurrentTemplate(template);

    // Load template into editor
    updateEditorFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      isPublic: template.isPublic
    });
    updateEditorComponents(template.components);

    // 跳转到模板工作台（编辑模式）
    navigate(`${ROUTES.EDITOR}?mode=${EDITOR_MODES.CREATE}`);

    showNotification({
      type: 'success',
      title: t(NOTIFICATIONS.SUCCESS.TEMPLATE_LOADED),
      message: `${t('模板已加载到编辑器中')}，${t('已跳转到模板工作台')}`,
      duration: 2000,
    });
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      showNotification({
        type: 'success',
        title: t(NOTIFICATIONS.SUCCESS.TEMPLATE_DELETED),
        message: t(NOTIFICATIONS.SUCCESS.TEMPLATE_DELETED),
        duration: 2000,
      });
    } catch (error) {
      console.error('删除模板失败:', error);
      showNotification({
        type: 'error',
        title: t('删除失败'),
        message: t('无法删除模板'),
        duration: 2000,
      });
    }
  };

  const handleApplyTemplate = (template: Template) => {
    // 清除当前编辑的模板，因为这是应用模板而不是编辑
    setCurrentTemplate(null);

    // Apply template components to current editor and switch to use mode
    updateEditorComponents([...template.components]);

    // 清空表单数据，因为我们要进入使用模板模式
    updateEditorFormData({
      name: '',
      description: '',
      category: 'productivity',
      tags: [],
      isPublic: false
    });

    // 跳转到模板工作台（使用模式）
    navigate('/editor?mode=use');

    showNotification({
      type: 'success',
      title: t('模板已应用'),
      message: `${t('模板')}"${template.name}"${t('已应用')}，${t('已跳转到模板工作台使用模式')}`,
      duration: 3000,
    });
  };

  const templateCategories: { value: TemplateCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: t('全部'), icon: '📋' },
    { value: 'productivity', label: t('效率'), icon: '💬' },
    { value: 'creative', label: t('创意'), icon: '🎨' },
    { value: 'technical', label: t('技术'), icon: '⚙️' },
    { value: 'research', label: t('研究'), icon: '💼' },
    { value: 'education', label: t('教育'), icon: '📚' },
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
          {t('模板库')}
        </motion.h2>
        <Button
          variant="primary"
          onClick={() => {
            setCurrentTemplate(null);
            navigate(`${ROUTES.EDITOR}?mode=${EDITOR_MODES.CREATE}`);
          }}
          icon={<Plus className="w-4 h-4" />}
          className='bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm'
        >
          {t('新建模板')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder={t(PLACEHOLDERS.SEARCH_TEMPLATES)}
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">{t('分类')}:</span>
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
          <span className="text-sm text-gray-600">{t('排序')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">{t('更新时间')}</option>
            <option value="name">{t('名称')}</option>
            <option value="usage">{t('使用次数')}</option>
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
        {t('共')} {filteredTemplates.length} {t('个模板')}
        {searchTerm && ` (${t('搜索')}: "${searchTerm}")`}
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.slice(0, visibleCount).map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onApply={handleApplyTemplate}
            />
          ))}
        </AnimatePresence>
        {/* 哨兵：用于触发加载更多 */}
        {visibleCount < filteredTemplates.length && (
          <div ref={sentinelRef} className="h-8" />
        )}
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
              {searchTerm ? t('未找到匹配的模板') : t('暂无模板')}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? t('尝试调整搜索条件') : t('开始创建您的第一个模板')}
            </p>
          </div>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                setCurrentTemplate(null);
                navigate('/editor?mode=create');
              }}
              icon={<Plus className="w-4 h-4" />}
              className='bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm'
            >
              {t('创建模板')}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TemplateLibrary;
